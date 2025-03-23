from flask import Flask, render_template, jsonify
from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import os 
from pymongo.server_api import ServerApi
from scrape import replace_tickers_with_titles, scrape_forbes, scrape_robinhoodpennystocksr, scrape_stockspicksr, scrape_stocksr, scrape_wsb, scrape_yahoo

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
def login(username, password):
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

@app.route("/refresh_data")
def refresh_data():
    titles = []
    titles.append(scrape_forbes())
    titles.append(scrape_robinhoodpennystocksr())
    titles.append(scrape_stockspicksr())
    titles.append(scrape_stocksr())
    titles.append(scrape_yahoo())
    titles.append(scrape_wsb())
    for title in titles:
        replace_tickers_with_titles(title)
    return jsonify({"titles" : titles})


app.run(port = 9284)   