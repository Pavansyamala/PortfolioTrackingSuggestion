from fastapi import FastAPI
from database import Base, engine, SessionLocal
from models import Holding
from schemas import StockCreate
from services.price_services import get_current_price
from services.portfolio_service import compute_portfolio
from fastapi.middleware.cors import CORSMiddleware
from models import PortfolioHistory , Alert
from datetime import datetime, timedelta


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/add_stock/")
def add_stock(stock: StockCreate):
    db = SessionLocal()

    stock_db = Holding(
        ticker=stock.ticker,
        quantity=stock.quantity,
        buy_price=stock.buy_price
        )

    db.add(stock_db)
    db.commit()
    db.refresh(stock_db)
    db.close()

    return stock_db

@app.delete("/delete_stock/{stock_id}")
def delete_stock(stock_id: int):
    db = SessionLocal()

    stock = db.query(Holding).filter(Holding.id == stock_id).first()

    if stock:
        db.delete(stock)
        db.commit()

    db.close()

    return {"message": "Deleted"}


@app.get("/portfolio/")
def get_portfolio():
    db = SessionLocal()
    holdings = db.query(Holding).all()

    result = compute_portfolio(holdings)

    last_entry = db.query(PortfolioHistory).order_by(PortfolioHistory.id.desc()).first()
    now = datetime.now()
    today = datetime.now().strftime("%Y-%m-%d")

    if not last_entry or last_entry.timestamp != today:
        history = PortfolioHistory(
            total_value=result["total_value"],
            timestamp = today
        )
        db.add(history)
        db.commit()

    db.close()
    return result

@app.get("/portfolio_history/")
def get_history():
    db = SessionLocal()
    history = db.query(PortfolioHistory).all()

    data = [
        {
            "timestamp": h.timestamp,
            "total_value": h.total_value
        }
        for h in history
    ]

    db.close()
    return data

@app.post("/add_alert/")
def add_alert(ticker: str, target_price: float):
    db = SessionLocal()

    alert = Alert(ticker=ticker, target_price=target_price)

    db.add(alert)
    db.commit()
    db.close()

    return {"message": "alert added"}

@app.get("/check_alerts/")
def check_alerts():
    db = SessionLocal()

    alerts = db.query(Alert).all()
    triggered = []

    for a in alerts:
        price = get_current_price(a.ticker)

        if price and price >= a.target_price:
            triggered.append({
                "id": a.id,  # ADD THIS LINE - include the alert ID
                "ticker": a.ticker,
                "current_price": round(price, 2),
                "target_price": a.target_price
            })

    db.close()
    return triggered

@app.delete("/clear_alert/{alert_id}")
def clear_alert(alert_id: int):
    db = SessionLocal()
    
    # Find the alert by ID
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    
    if alert:
        db.delete(alert)
        db.commit()
        db.close()
        return {"message": f"Alert {alert_id} cleared successfully"}
    else:
        db.close()
        return {"message": f"Alert {alert_id} not found"}, 404