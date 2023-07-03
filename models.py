"""Application Models"""
import bson, os
from dotenv import load_dotenv
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson.json_util import dumps
from flask import jsonify

load_dotenv()

DATABASE_URL=os.environ.get('DATABASE_URL') or 'mongodb://localhost:27017/myDatabase'
print(DATABASE_URL)
client = MongoClient(DATABASE_URL)
db = client.myDatabase

class FlightLog:
    """FlightLog Model"""
    def __init__(self):
        return

    def create(self, tailNumber="", flightID="", takeoff="", landing="", Duration=""):
        """Create a new book"""
        ifexist = self.get_by_id(flightID)
        if ifexist:
            return
        new_log = db.flightLog.insert_one(
            {
                "tailNumber": tailNumber,
                "flightID": flightID,
                "takeoff": takeoff,
                "landing": landing,
                "Duration": Duration
            }
        )
        return flightID

    def get_all(self):
        """Get all flightLog"""
        flightLog = db.flightLog.find()
        return [{**logg, "_id": str(logg["_id"])} for logg in flightLog]

    def get_by_id(self, flightID):
        """Get a flightLog by id"""
        findone = db.flightLog.find_one({"flightID": flightID})
        if not findone:
            return
        findone["flightID"] = str(findone["flightID"])
        return findone
    
    def update(self, flightID, tailNumber="", takeoff="", landing="", Duration=""):
        """Update a log"""
        data={}
        if tailNumber: data["tailNumber"]=tailNumber
        if takeoff: data["takeoff"]=takeoff
        if landing: data["landing"]=landing
        if Duration: data["Duration"]=Duration

        updateone = db.flightLog.update_one(
            {"flightID": flightID},
            {
                "$set": data
            }
        )
        updateone = self.get_by_id(flightID)
        return dumps(updateone)

    def delete(self, flightID):
        """Delete a log"""
        delet = db.flightLog.delete_one({"flightID": flightID})
        return True

class User:
    """User Model"""
    def __init__(self):
        return

    def create(self, name="", email="", password=""):
        """Create a new user"""
        user = self.get_by_email(email)
        if user:
            return
        new_user = db.users.insert_one(
            {
                "name": name,
                "email": email,
                "password": self.encrypt_password(password),
                "active": True
            }
        )
        return self.get_by_id(new_user.inserted_id)

    def get_all(self):
        """Get all users"""
        users = db.users.find({"active": True})
        return [{**user, "_id": str(user["_id"])} for user in users]

    def get_by_id(self, user_id):
        """Get a user by id"""
        user = db.users.find_one({"_id": bson.ObjectId(user_id), "active": True})
        if not user:
            return
        user["_id"] = str(user["_id"])
        user.pop("password")
        return user

    def get_by_email(self, email):
        """Get a user by email"""
        user = db.users.find_one({"email": email, "active": True})
        if not user:
            return
        user["_id"] = str(user["_id"])
        return user

    def update(self, user_id, name=""):
        """Update a user"""
        data = {}
        if name:
            data["name"] = name
        user = db.users.update_one(
            {"_id": bson.ObjectId(user_id)},
            {
                "$set": data
            }
        )
        user = self.get_by_id(user_id)
        return user


    def disable_account(self, user_id):
        """Disable a user account"""
        user = db.users.update_one(
            {"_id": bson.ObjectId(user_id)},
            {"$set": {"active": False}}
        )
        user = self.get_by_id(user_id)
        return user

    def encrypt_password(self, password):
        """Encrypt password"""
        return generate_password_hash(password)

    def login(self, email, password):
        """Login a user"""
        user = self.get_by_email(email)
        if not user or not check_password_hash(user["password"], password):
            return
        user.pop("password")
        return user
