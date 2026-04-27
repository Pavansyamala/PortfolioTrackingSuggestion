from sqlalchemy import Column, Integer, Float, String
from database import Base

class Holding(Base):
    __tablename__ = "holdings"

    user_id = Column(Integer)
    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String)
    quantity = Column(Float)
    buy_price = Column(Float)



# 🔥 NEW TABLE
class PortfolioHistory(Base):
    __tablename__ = "portfolio_history"

    id = Column(Integer, primary_key=True, index=True)
    total_value = Column(Float)
    timestamp = Column(String)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String)
    target_price = Column(Float)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)