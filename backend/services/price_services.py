import yfinance as yf
import time

cache = {}
CACHE_TTL = 60  # seconds


def get_current_price(ticker: str):
    now = time.time()

    if ticker in cache:
        price, timestamp = cache[ticker]
        if now - timestamp < CACHE_TTL:
            return price

    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period="1d")

        if data.empty:
            return None

        price = float(data["Close"].iloc[-1])

        cache[ticker] = (price, now)

        return price

    except Exception:
        return None