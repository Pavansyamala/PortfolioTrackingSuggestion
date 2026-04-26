
# 📊 Portfolio Tracker App

A full-stack portfolio tracking application that allows users to monitor their stock investments, analyze performance, and visualize portfolio insights.

---

## 🚀 Features

### 📈 Portfolio Management
- Add stocks with ticker, quantity, and buy price
- Delete stocks dynamically
- Real-time portfolio value calculation

### 📊 Analytics
- Profit & Loss (P&L)
- Return percentage (%)
- Allocation percentage (%)
- Total portfolio value tracking

### 📉 Visualization
- Pie chart for portfolio allocation
- Line chart for portfolio value over time

### 🔔 Alerts System
- Set price alerts for stocks
- Trigger alerts when price crosses target

### 🔄 Sorting
- Sort portfolio by:
  - P&L
  - Return %
  - Allocation %

---

## 🧱 Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- SQLite
- Yahoo Finance API (via `yfinance`)

### Frontend
- React.js
- Axios
- Recharts

---

## 📂 Project Structure

```

Portfolio-Tracker/
│
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── database.py
│   ├── schemas.py
│   ├── services/
│   │   ├── portfolio_service.py
│   │   └── price_services.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json

````

---

## ⚙️ Setup Instructions

### 🔹 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/PortfolioTrackingSuggestion.git
cd PortfolioTrackingSuggestion
````

---

### 🔹 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

### 🔹 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🌐 API Endpoints

* `GET /portfolio/` → Get portfolio data
* `POST /add_stock/` → Add stock
* `DELETE /delete_stock/{id}` → Delete stock
* `GET /portfolio_history/` → Get portfolio history
* `POST /add_alert/` → Add alert
* `GET /check_alerts/` → Get triggered alerts

---

## 📊 Key Highlights

* Full-stack architecture with clear separation of concerns
* Modular backend design using service layer
* Efficient data handling with caching
* Time-series tracking for portfolio value
* Interactive UI with charts and real-time updates

---

## ⚠️ Limitations

* Uses Yahoo Finance (delayed data)
* SQLite database (not production-grade)
* Alerts are request-based (no background scheduler yet)

---

## 🔮 Future Work

Planned improvements and research directions:

* 🤖 Reinforcement Learning (RL) based forecasting
* 📊 Portfolio optimization strategies
* 💡 Portfolio suggestions system
* 🧠 AI-based market sentiment analysis
* 📈 Explainable insights (why stock increased/decreased)
* 🔐 User authentication system
* ☁️ Scalable deployment with production-grade database

---

## 🧠 Author

This project was built as part of exploring:

* Finance + Technology
* Full-stack development
* Data-driven systems
* Future AI/ML integration

---

## ⭐ Contribution

Feel free to fork, improve, and experiment with the project.