import json
import requests
from bs4 import BeautifulSoup

with open('tickers.json', 'r') as f:
    tickers_data = json.load(f)

ticker_to_title = {entry["ticker"]: entry["title"] for entry in tickers_data.values()}

def replace_tickers_with_titles(text, ticker_to_title):
    words = text.split()
    replaced_words = []
    for word in words:
        if word.startswith('$') and word[1:] in ticker_to_title:
            replaced_words.append(ticker_to_title[word[1:]])
        else:
            replaced_words.append(word)
    return ' '.join(replaced_words)

def scrape_wsb():
    response = requests.get("https://www.reddit.com/r/wallstreetbets/.json", headers={'User-agent': 'Mozilla/5.0'})
    rjson = response.json()
    titles = []
    for entry in (rjson["data"]["children"]):
        title = entry["data"]["title"]
        replaced_title = replace_tickers_with_titles(title, ticker_to_title)
        titles.append(replaced_title)
    return titles

def scrape_stocksr():
    response = requests.get("https://www.reddit.com/r/stocks/.json", headers={'User-agent': 'Mozilla/5.0'})
    rjson = response.json()
    titles = []
    for entry in (rjson["data"]["children"]):
        title = entry["data"]["title"]
        replaced_title = replace_tickers_with_titles(title, ticker_to_title)
        titles.append(replaced_title)
    return titles

def scrape_stockspicksr():
    response = requests.get("https://www.reddit.com/r/Stocks_Picks/.json", headers={'User-agent': 'Mozilla/5.0'})
    rjson = response.json()
    titles = []
    for entry in (rjson["data"]["children"]):
        title = entry["data"]["title"]
        replaced_title = replace_tickers_with_titles(title, ticker_to_title)
        titles.append(replaced_title)
    return titles

def scrape_robinhoodpennystocksr():
    response = requests.get("https://www.reddit.com/r/RobinHoodPennyStocks/.json", headers={'User-agent': 'Mozilla/5.0'})
    rjson = response.json()
    titles = []
    for entry in (rjson["data"]["children"]):
        title = entry["data"]["title"]
        replaced_title = replace_tickers_with_titles(title, ticker_to_title)
        titles.append(replaced_title)
    return titles

def scrape_forbes():
    response = requests.get("https://www.forbes.com/markets/")
    html_content = response.text
    soup = BeautifulSoup(html_content, 'html.parser')
    titles = []
    for title_tag in soup.find_all('h3', class_='HNChVRGc'):
        title_text = title_tag.get_text(strip=True)
        replaced_title = replace_tickers_with_titles(title_text, ticker_to_title)
        titles.append(replaced_title)
    for title in titles:
        return title

def scrape_yahoo():
    response = requests.get("https://finance.yahoo.com/topic/stock-market-news/")
    soup = BeautifulSoup(response.text, 'html.parser')
    article_titles = soup.find_all('a', class_='mega-item-header-link')
    titles = []
    for title in article_titles:
        title_text = title.get_text(strip=True)
        replaced_title = replace_tickers_with_titles(title_text, ticker_to_title)
        titles.append(replaced_title)
    for title in titles:
        return title

scrape_wsb()
scrape_stocksr()
scrape_stockspicksr()
scrape_robinhoodpennystocksr()
scrape_forbes()
scrape_yahoo()