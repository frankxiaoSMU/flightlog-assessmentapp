import jwt, os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from validate import validate_email_and_password, validate_user, validate_flightLog

load_dotenv()

app = Flask(__name__)
SECRET_KEY = os.environ.get('SECRET_KEY') or 'this is a secret'
print(SECRET_KEY)
app.config['SECRET_KEY'] = SECRET_KEY

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

from models import User, FlightLog
from auth_middleware import token_required

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/user/register", methods=["POST"])
def add_user():
    try:
        user = request.json
        if not user:
            return {
                "message": "Please provide user details",
                "data": None,
                "error": "Bad request"
            }, 400
        is_validated = validate_user(**user)
        if is_validated is not True:
            return dict(message='Invalid data', data=None, error=is_validated), 400
        user = User().create(**user)
        if not user:
            return {
                "message": "User already exists",
                "error": "Conflict",
                "data": None
            }, 409
        return {
            "message": "Successfully created new user",
            "data": user
        }, 201
    except Exception as e:
        return {
            "message": "Something went wrong",
            "error": str(e),
            "data": None
        }, 500

@app.route("/user/authenticate", methods=["POST"])
def login():
    try:
        data = request.json
        if not data:
            return {
                "message": "Please provide user details",
                "data": None,
                "error": "Bad request"
            }, 400
        # validate input
        is_validated = validate_email_and_password(data.get('email'), data.get('password'))
        if is_validated is not True:
            return dict(message='Invalid data', data=None, error=is_validated), 400
        user = User().login(
            data["email"],
            data["password"]
        )
        if user:
            try:
                # token should expire after 24 hrs
                user["token"] = jwt.encode(
                    {"user_id": user["_id"]},
                    app.config["SECRET_KEY"],
                    algorithm="HS256"
                )
                return {
                    "message": "Successfully fetched auth token",
                    "data": user
                }
            except Exception as e:
                return {
                    "error": "Something went wrong",
                    "message": str(e)
                }, 500
        return {
            "message": "Error fetching auth token!, invalid email or password",
            "data": None,
            "error": "Unauthorized"
        }, 404
    except Exception as e:
        return {
                "message": "Something went wrong!",
                "error": str(e),
                "data": None
        }, 500

@app.route("/user", methods=["GET"])
@token_required
def get_all_user(current_user):
    try:
        getall = User().get_all()
        return jsonify({
            "message": "successfully retrieved all users",
            "data": getall
        })
    except Exception as e:
        return jsonify({
            "message": "failed to retrieve users",
            "error": str(e),
            "data": None
        }), 500

@app.route("/user/<string:userid>", methods=["DELETE"])
@token_required
def delete_use(current_user, userid):
    try:
        User().delete(userid["_id"])
        return jsonify({
            "message": "successfully deleted user",
            "data": None
        }), 204
    except Exception as e:
        return jsonify({
            "message": "failed to delete user",
            "error": str(e),
            "data": None
        }), 400


@app.route("/flightLog", methods=["POST"])
@token_required
def add_flightLog(current_user):
    try:
        flightLog = dict(request.form)
        if not flightLog:
            return {
                "message": "Invalid data, please key in all fields",
                "data": None,
                "error": "Bad Request"
            }, 400
        
        is_validated = validate_flightLog(**flightLog)
        if is_validated is not True:
            return {
                "message": "Invalid data",
                "data": None,
                "error": is_validated
            }, 400
        create = FlightLog().create(**flightLog)
        if not create:
            return {
                "message": "The flightlog is already created",
                "data": None,
                "error": "Conflict"
            }, 400
        return jsonify({
            "message": "successfully created a new flightLog",
            "data": create
        }), 201
    except Exception as e:
        return jsonify({
            "message": "failed to create a new flightLog",
            "error": str(e),
            "data": None
        }), 500

@app.route("/flightLog", methods=["GET"])
@token_required
def get_flightLog(current_user):
    try:
        logg = FlightLog().get_all()
        return jsonify({
            "message": "successfully retrieved all books",
            "data": logg
        })
    except Exception as e:
        return jsonify({
            "message": "failed to retrieve all books",
            "error": str(e),
            "data": None
        }), 500


@app.route("/flightLog/<string:flightid>", methods=["PUT"])
@token_required
def update_log(current_user, flightid):
    try:
        logg = FlightLog().get_by_id(flightid)
        if not logg:
            return {
                "message": "Flight log not found",
                "data": None,
                "error": "Not found"
            }, 404
        newlogg = request.form
        newlogg = FlightLog().update(flightid, **newlogg)
        return jsonify({
            "message": "successfully updated a flight log",
            "data": newlogg
        }), 201
    except Exception as e:
        return jsonify({
            "message": "failed to update",
            "error": str(e),
            "data": None
        }), 400

@app.route("/flightLog/<string:flightid>", methods=["DELETE"])
@token_required
def delete_log(current_user, flightid):
    try:
        logg = FlightLog().get_by_id(flightid)
        if not logg:
            return {
                "message": "Not found",
                "data": None,
                "error": "Not found"
            }, 404
        FlightLog().delete(flightid)
        return jsonify({
            "message": "successfully deleted",
            "data": None
        }), 201
    except Exception as e:
        return jsonify({
            "message": "failed to delete",
            "error": str(e),
            "data": None
        }), 400

@app.errorhandler(403)
def forbidden(e):
    return jsonify({
        "message": "Forbidden",
        "error": str(e),
        "data": None
    }), 403

@app.errorhandler(404)
def forbidden(e):
    return jsonify({
        "message": "Endpoint Not Found",
        "error": str(e),
        "data": None
    }), 404


if __name__ == "__main__":
    app.run(debug=True)
