from flask import Flask, render_template, jsonify
from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import os 
from pymongo.server_api import ServerApi


load_dotenv()
mongoUri = os.getenv("MONGO_URI_STRING")
openAIKey = os.getenv("OPENAI_API_KEY")

mongoClient = MongoClient(mongoUri, server_api=ServerApi('1'))
db = mongoClient["Login"]
passwordsDB = db["Passwords"]


app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/login/<string:username/<string:password>")
def check_password(username, password):
    entry = passwordsDB.find_one({"username" : username})
    if(not entry):
        return jsonify({"message" : "user_not_found"})
    if entry:
        if(entry["password"] == password):
            return jsonify({"message" : "success"})
        else:
            return jsonify({"message" : "invalid_password"})

@app.route("/signup/<string:username>/<string:password")
def signup(username, password):
    entry = passwordsDB.find_one({"username" : username})
    if(entry):
        return jsonify({"message" : "username_taken"})
    passwordsDB.insert_one({"username" : username, "password": password})
    return jsonify({"message" : "success"})
app.run(port = 9284)   