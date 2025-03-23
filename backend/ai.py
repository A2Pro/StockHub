from openai import OpenAI
import scrape
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def gather_scraped_data():
    wsb_data = list(scrape.scrape_wsb() or [])
    stocks_data = list(scrape.scrape_stocksr() or [])
    picks_data = list(scrape.scrape_stockspicksr() or [])
    penny_data = list(scrape.scrape_robinhoodpennystocksr() or [])
    forbes_data = list(scrape.scrape_forbes() or [])
    yahoo_data = list(scrape.scrape_yahoo() or [])
    combined_data = "\n".join(wsb_data + stocks_data + picks_data + penny_data + forbes_data + yahoo_data)
    print(combined_data)
    return combined_data

def get_investment_recommendations(scraped_text):
    prompt = f"""
You are an expert financial analysis AI.

Based on the following Reddit and news scraped data, generate an actionable list of tickers:
1. Buy
2. Short

TAKE INTO ACCOUNT THE RELEVANCE OF TITLES MENTIONING TICKERS.

DATA:
{scraped_text}

ONLY respond in this format:
Buy: TICKER1, TICKER2, AND SO ON
Short: TICKER3, TICKER4, AND SO ON

If there are no tickers for a section, write "None".
"""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You analyze financial data and make clear stock action recommendations."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )
    return response.choices[0].message.content.strip()

if __name__ == "__main__":
    scraped_data = gather_scraped_data()
    if not scraped_data:
        print("No data scraped. Check scrape.py or the source websites.")
    else:
        recommendations = get_investment_recommendations(scraped_data)
        print("\n=== AI Investment Recommendations ===")
        print(recommendations)
