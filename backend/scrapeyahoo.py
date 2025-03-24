import finnhub
import datetime
from pprint import pprint

def fetch_yahoo_finance_news(api_key, num_articles=5):
    """
    Fetch the latest Yahoo Finance news articles using Finnhub API
    
    Parameters:
        api_key (str): Your Finnhub API key
        num_articles (int): Number of articles to fetch
        
    Returns:
        list: List of news article dictionaries
    """
    
    finnhub_client = finnhub.Client(api_key=api_key)
    
    
    end_date = datetime.datetime.now().strftime('%Y-%m-%d')
    start_date = (datetime.datetime.now() - datetime.timedelta(days=7)).strftime('%Y-%m-%d')
    
    try:
        
        news = finnhub_client.general_news('general', min_id=0)
        
        
        yahoo_news = [article for article in news]
        
        
        sorted_news = sorted(yahoo_news, key=lambda x: x.get('datetime', 0), reverse=True)
        return sorted_news[:num_articles]
        
    except Exception as e:
        print(f"Error fetching news: {e}")
        return []

def print_articles(articles):
    """
    Print article information in a formatted way
    
    Parameters:
        articles (list): List of article dictionaries
    """
    if not articles:
        print("No articles found.")
        return
        
    print(f"\n===== Latest {len(articles)} Yahoo Finance Articles =====\n")
    
    for i, article in enumerate(articles, 1):
        
        timestamp = article.get('datetime', 0)
        if timestamp:
            date_str = datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')
        else:
            date_str = "Unknown date"
            
        print(f"Article {i}:")
        print(f"Title: {article.get('headline', 'No title')}")
        print(f"Published: {date_str}")
        print(f"URL: {article.get('url', 'No URL')}")
        print(f"Source: {article.get('source', 'Unknown')}")
        
        
        if 'summary' in article:
            summary = article['summary']
            print(f"Summary: {summary}")
        
        
        if 'related' in article and article['related']:
            print(f"Related tickers: {article['related']}")
        
        print("\n" + "-" * 60 + "\n")

def main():
    
    api_key = "cvg6n9hr01qgvsqns2e0cvg6n9hr01qgvsqns2eg" 
    
    print("Fetching latest Yahoo Finance news articles...")
    articles = fetch_yahoo_finance_news(api_key, 5)
    print_articles(articles)

if __name__ == "__main__":
    main()