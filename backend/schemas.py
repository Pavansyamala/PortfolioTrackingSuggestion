from pydantic import BaseModel

class StockCreate(BaseModel):
    ticker: str
    quantity: float
    buy_price: float