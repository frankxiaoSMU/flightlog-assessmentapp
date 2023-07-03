# Flight Log App

## Development server

### Database

- Uses MongoDB
- Import `myDatabase.flightLog.json` and `myDatabase.users.json` for data

### Install backend

- Clone repository
- Create a virtual environment, activate it and install the dependencies. For windows:
  ```
  python3 -m venv env
  env\Scripts\activate
  pip install -r requirements.txt
  ```
- Run `flask run` to start the development server.
- API is hosted at http://localhost:5000/
- Optional: Import `Flight Log REST API.postman_collection.json` to Postman

### Install frontend

- Navigate to 'frontend' folder
- For windows:
  ```
  npm install
  npm start
  ```
- App is hosted at http://localhost:3000/
- If imported data to MongoDB, default login is:

```
email: defaultuser@email.com
password: nineNINE
```
