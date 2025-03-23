from flask import Flask, render_template, jsonify, session, request
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
mongoUri = os.getenv("MONGODB_URI_STRING")
openAIKey = os.getenv("OPENAI_API_KEY")

openAIClient = OpenAI(api_key=openAIKey)

try:
    mongoClient = MongoClient(mongoUri, server_api=ServerApi('1'))
    mongoClient.admin.command('ping')
    print("✅ Successfully connected to MongoDB!")
except Exception as e:
    print("❌ Failed to connect to MongoDB:", e)

# Database and collection setup
db = mongoClient["Login"]
passwordsDB = db["Passwords"]

# Flask app setup
app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "super_secret_key")

# Imports from local scrape module
from scrape import (
    replace_tickers_with_titles,
    scrape_forbes,
    scrape_robinhoodpennystocksr,
    scrape_stockspicksr,
    scrape_stocksr,
    scrape_wsb,
    scrape_yahoo
)

def refresh_titles():
    titles = []
    titles.append(scrape_forbes())
    titles.append(scrape_robinhoodpennystocksr())
    titles.append(scrape_stockspicksr())
    titles.append(scrape_stocksr())
    titles.append(scrape_yahoo())
    titles.append(scrape_wsb())
    for title_list in titles:
        replace_tickers_with_titles(title_list)
    return titles

app = Flask(__name__)
CORS(app)

app.secret_key = "erfiwaoifrjoitfgjoifrjoiwrfjwoeijf"

try:
    print("Attempting MongoDB connection...")
    safe_uri = mongoUri.replace(mongoUri.split('@')[0], '***') if '@' in mongoUri else '***'
    print(f"Using URI: {safe_uri}")
    mongoClient = MongoClient(mongoUri, server_api=ServerApi('1'), 
                            serverSelectionTimeoutMS=5000)
    mongoClient.admin.command('ping')
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection error: {str(e)}")

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/login")
def login():
    data = request.get_json()
    username = data.get("email")
    password = data.get("password")
    entry = passwordsDB.find_one({"username" : username})
    if(not entry):
        return jsonify({"message" : "user_not_found"})
    if entry:
        if(entry["password"] == password):
            session["username"] = username
            return jsonify({"message" : "success"})
        else:
            return jsonify({"message" : "invalid_password"})

from flask import request, jsonify

@app.route("/signup", methods=["POST", "GET"])
def signup():
    data = request.get_json()
    username = data.get("email")
    password = data.get("password")

    print(f"📝 Signup attempt - Username: {username}")

    if not username or not password:
        return jsonify({"message": "missing_fields"}), 400

    entry = passwordsDB.find_one({"username": username})
    if entry:
        return jsonify({"message": "username_taken"})

    passwordsDB.insert_one({"username": username, "password": password})
    print(f"✅ User '{username}' signed up successfully.")
    return jsonify({"message": "success"})

@app.route("/refresh_data")
def refresh_data():
    session["titles"] = refresh_titles()
    return jsonify({"message": "success"})

@app.route("/answer_question/<string:question>")
def answer_question(question):
    if "titles" not in session or not session["titles"]:
        session["titles"] = refresh_titles()
    contextString  = ""
    for title in session["titles"]:
        for titlex in title:
            contextString += titlex
    completion = openAIClient.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "Here are the titles of various stock news articles and reddit posts. Based on these titles, answer the questions asked to the best of your ability:\n\n" + contextString
            },
            {"role": "user", "content": question}
        ]
    )

    return completion.choices[0].message.content

if __name__ == "__main__":
    app.run(port=9284)
