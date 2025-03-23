from flask import Flask, render_template, jsonify, session, request
from pymongo.mongo_client import MongoClient
from flask_cors import CORS

from dotenv import load_dotenv
import os 
import requests
import pandas as pd
import time

from pymongo.server_api import ServerApi
from openai import OpenAI
from scrape import replace_tickers_with_titles, scrape_forbes, scrape_robinhoodpennystocksr, scrape_stockspicksr, scrape_stocksr, scrape_wsb, scrape_yahoo

load_dotenv()
mongoUri = os.getenv("MONGODB_URI_STRING")
openAIKey = os.getenv("OPENAI_API_KEY")
openAIClient = OpenAI(api_key = openAIKey)
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY", "")  # Get Finnhub API key from environment, default to empty string

mongoClient = MongoClient(mongoUri, server_api=ServerApi('1'))
db = mongoClient["Login"]
passwordsDB = db["Passwords"]
userProfilesDB = db["UserProfiles"]  # Create a new collection for user profiles

# Stock market data
sectors = {
    "Tech": ["AAPL", "MSFT", "NVDA", "GOOGL", "META"],
    "Healthcare": ["JNJ", "PFE", "MRK", "LLY"],
    "Energy": ["XOM", "CVX", "BP"],
    "Finance": ["JPM", "BAC", "C", "GS"]
}

# Default user profile
default_user_profile = {
    "starting_fund": 50000,
    "risk_tolerance": "Medium",
    "investment_sector": "Tech",
    "asset_type": "Stocks",
    "trade_frequency": "Weekly",
    "stop_loss": 0.05,
    "take_profit": 0.1
}

def refresh_titles():
    titles = []
    titles.append(scrape_forbes())
    titles.append(scrape_robinhoodpennystocksr())
    titles.append(scrape_stockspicksr())
    titles.append(scrape_stocksr())
    titles.append(scrape_yahoo())
    titles.append(scrape_wsb())
    for title in titles:
        replace_tickers_with_titles(title)
    return titles

def fetch_finnhub_candles(ticker, resolution="D", count=30):
    """
    Fetch stock candle data from Finnhub API
    
    Parameters:
    ticker (str): Stock ticker symbol
    resolution (str): Candle timeframe (D for daily)
    count (int): Number of candles to fetch
    
    Returns:
    pandas.DataFrame or None: DataFrame with time and close price data
    """
    if not FINNHUB_API_KEY:
        return None
        
    url = f"https://finnhub.io/api/v1/stock/candle"
    params = {
        "symbol": ticker,
        "resolution": resolution,
        "from": int(time.time()) - count * 24 * 60 * 60,
        "to": int(time.time()),
        "token": FINNHUB_API_KEY
    }
    try:
        response = requests.get(url, params=params)
        data = response.json()

        if data.get('s') != 'ok':
            print(f"Failed to fetch data for {ticker}")
            return None

        df = pd.DataFrame({
            't': data['t'],
            'c': data['c']
        })
        return df
    except Exception as e:
        print(f"Error fetching data for {ticker}: {str(e)}")
        return None

def analyze_stocks(tickers, stop_loss, take_profit):
    """
    Analyze stocks based on stop-loss and take-profit thresholds
    
    Parameters:
    tickers (list): List of stock ticker symbols
    stop_loss (float): Stop loss threshold as decimal (e.g., 0.05 for 5%)
    take_profit (float): Take profit threshold as decimal (e.g., 0.1 for 10%)
    
    Returns:
    list: List of selected ticker symbols
    dict: Analysis results for all tickers
    """
    selected_stocks = []
    analysis_results = {}
    
    for ticker in tickers:
        df = fetch_finnhub_candles(ticker)
        if df is None or df.empty:
            analysis_results[ticker] = {
                "status": "error",
                "message": "Failed to fetch data"
            }
            continue

        start_price = df['c'].iloc[0]
        end_price = df['c'].iloc[-1]
        pct_change = (end_price - start_price) / start_price

        if pct_change >= take_profit:
            status = "take_profit"
            selected_stocks.append(ticker)
        elif pct_change <= -stop_loss:
            status = "stop_loss"
        else:
            status = "hold"
            selected_stocks.append(ticker)
            
        analysis_results[ticker] = {
            "status": status,
            "percent_change": pct_change * 100,
            "start_price": start_price,
            "end_price": end_price
        }
        
        time.sleep(0.5)  # Rate limiting to avoid API issues
        
    return selected_stocks, analysis_results

# Flask application
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

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("email")
    password = data.get("password")
    entry = passwordsDB.find_one({"username": username})
    if not entry:
        return jsonify({"message": "user_not_found"}), 404
    if entry:
        if entry["password"] == password:
            session["username"] = username
            return jsonify({"message": "success", "username": username}), 200
        else:
            return jsonify({"message": "invalid_password"}), 401

@app.route("/signup", methods=["POST", "GET"])
def signup():
    data = request.get_json()
    username = data.get("email")
    password = data.get("password")
    
    print(username + " " + password)
    if not username or not password:
        return jsonify({"message": "missing_fields"}), 400

    entry = passwordsDB.find_one({"username": username})
    if entry:
        return jsonify({"message": "username_taken"}), 409

    passwordsDB.insert_one({"username": username, "password": password})
    
    # Create default user profile
    user_profile = default_user_profile.copy()
    user_profile["username"] = username
    userProfilesDB.insert_one(user_profile)
    
    return jsonify({"message": "success"}), 201

@app.route("/verify_auth", methods=["GET"])
def verify_auth():
    # Check if user is logged in via session
    if "username" in session:
        return jsonify({
            "authenticated": True,
            "username": session["username"]
        }), 200
    else:
        return jsonify({
            "authenticated": False,
            "message": "not_authenticated"
        }), 401

@app.route("/refresh_data")
def refresh_data():
    session["titles"] = refresh_titles()
    return jsonify({"message": "success"})

@app.route("/answer_question/<string:question>")
def answer_question(question):
    if not session.get("titles"):
        session["titles"] = refresh_titles()
    contextString = ""
    for title in session["titles"]:
        for titlex in title:
            contextString += titlex
    completion = openAIClient.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Here are the titles of various stock news articles and reddit posts. Based on these titles, answer the questions asked to the best of your ability. Here are the titles: " + contextString},
            {
                "role": "user",
                "content": question
            }
        ]
    )
    return completion.choices[0].message.content

# User profile endpoints
@app.route("/get_user_profile", methods=["GET"])
def get_user_profile():
    if "username" not in session:
        return jsonify({"message": "not_authenticated"}), 401
        
    username = session["username"]
    user_profile = userProfilesDB.find_one({"username": username})
    
    if not user_profile:
        # Create default profile if not exists
        user_profile = default_user_profile.copy()
        user_profile["username"] = username
        userProfilesDB.insert_one(user_profile)
    
    # Remove MongoDB ID for JSON response
    if "_id" in user_profile:
        user_profile.pop("_id")
        
    return jsonify(user_profile), 200

@app.route("/update_user_profile", methods=["POST"])
def update_user_profile():
    if "username" not in session:
        return jsonify({"message": "not_authenticated"}), 401
        
    username = session["username"]
    data = request.get_json()
    
    # Validate data
    required_fields = ["starting_fund", "risk_tolerance", "investment_sector", 
                       "asset_type", "trade_frequency", "stop_loss", "take_profit"]
    
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"missing_field: {field}"}), 400
    
    # Update user profile
    data["username"] = username
    userProfilesDB.update_one(
        {"username": username},
        {"$set": data},
        upsert=True
    )
    
    return jsonify({"message": "success"}), 200

# Stock analysis endpoint
@app.route("/analyze_stocks", methods=["GET"])
def analyze_stocks_endpoint():
    if "username" not in session:
        return jsonify({"message": "not_authenticated"}), 401
        
    username = session["username"]
    user_profile = userProfilesDB.find_one({"username": username})
    
    if not user_profile:
        return jsonify({"message": "user_profile_not_found"}), 404
    
    # Get tickers for selected sector
    sector = user_profile.get("investment_sector", "Tech")
    sector_tickers = sectors.get(sector, [])
    
    if not sector_tickers:
        return jsonify({
            "message": "no_tickers_for_sector",
            "sector": sector
        }), 400
    
    # Get risk parameters
    stop_loss = user_profile.get("stop_loss", 0.05)
    take_profit = user_profile.get("take_profit", 0.1)
    
    # Analyze stocks
    selected_stocks, analysis_results = analyze_stocks(
        sector_tickers,
        stop_loss,
        take_profit
    )
    
    return jsonify({
        "sector": sector,
        "selected_stocks": selected_stocks,
        "analysis_results": analysis_results
    }), 200

@app.route("/get_sectors", methods=["GET"])
def get_sectors():
    return jsonify({
        "sectors": list(sectors.keys())
    }), 200

if __name__ == "__main__":
    app.run(port=9284)