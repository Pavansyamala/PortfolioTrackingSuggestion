import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// const API_BASE = "http://127.0.0.1:8000";  // will change later
const API_BASE = "https://portfolio-backend-5h6w.onrender.com";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [history, setHistory] = useState([]);
  const [sortBy, setSortBy] = useState("allocation_percent"); // default sort
  const [sortOrder, setSortOrder] = useState("desc"); // desc or asc

  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  // ALERT STATE
  const [alerts, setAlerts] = useState([]);
  const [alertTicker, setAlertTicker] = useState("");
  const [targetPrice, setTargetPrice] = useState("");

  useEffect(() => {
    fetchPortfolio();
    fetchHistory();
    fetchAlerts();
  }, []);

  const fetchPortfolio = async () => {
    const res = await axios.get(`${API_BASE}/portfolio/`);
    setPortfolio(res.data);
  };

  const fetchHistory = async () => {
    const res = await axios.get(`${API_BASE}/portfolio_history/`);
    setHistory(res.data);
  };

  // ALERT API CALLS
  const fetchAlerts = async () => {
    const res = await axios.get(`${API_BASE}/check_alerts/`);
    setAlerts(res.data);
  };

  const addAlert = async () => {
    await axios.post(`${API_BASE}/add_alert/`, null, {
      params: {
        ticker: alertTicker,
        target_price: Number(targetPrice),
      },
    });

    fetchAlerts();
    setAlertTicker("");
    setTargetPrice("");
  };

  // NEW FUNCTION: Clear/delete an alert after it's been acknowledged
  const clearAlert = async (alertId) => {
    await axios.delete(`${API_BASE}/clear_alert/${alertId}`);
    fetchAlerts(); // Refresh the alerts list
  };

  const addStock = async () => {
    await axios.post(`${API_BASE}/add_stock/`, {
      ticker,
      quantity: Number(quantity),
      buy_price: Number(buyPrice),
    });

    fetchPortfolio();
    fetchHistory();

    setTicker("");
    setQuantity("");
    setBuyPrice("");
  };

  const deleteStock = async (id) => {
    await axios.delete(`${API_BASE}/delete_stock/${id}`);
    fetchPortfolio();
    fetchHistory();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle order if same field
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      // New field, default to descending
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getSortedStocks = () => {
    if (!portfolio?.stocks) return [];
    
    return [...portfolio.stocks].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortOrder === "desc") {
        return bVal - aVal;
      } else {
        return aVal - bVal;
      }
    });
  };

  const pieData =
    portfolio?.stocks.map((s) => ({
      name: s.ticker,
      value: s.allocation_percent,
    })) || [];

  const sortedStocks = getSortedStocks();

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: "20px" }}>Portfolio Tracker</h1>

      {/* FORM */}
      <div style={{ marginBottom: "30px" }}>
        <input style={inputStyle} placeholder="Ticker" value={ticker} onChange={(e) => setTicker(e.target.value)} />
        <input style={inputStyle} placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input style={inputStyle} placeholder="Buy Price" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
        <button style={buttonStyle} onClick={addStock}>Add</button>
      </div>

      {/* ALERT FORM */}
      <div style={{ marginTop: "20px" }}>
        <h3>Set Alert</h3>
        <input
          style={inputStyle}
          placeholder="Ticker"
          value={alertTicker}
          onChange={(e) => setAlertTicker(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Target Price"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
        />
        <button style={buttonStyle} onClick={addAlert}>Add Alert</button>
      </div>

      {/* TRIGGERED ALERTS DISPLAY */}
      {alerts.length > 0 && (
        <div style={{ marginTop: "20px", backgroundColor: "#fff3f3", padding: "15px", borderRadius: "5px", border: "1px solid #ffcccc" }}>
          <h3 style={{ color: "red", marginTop: 0 }}>⚠️ Triggered Alerts</h3>
          {alerts.map((a, i) => (
            <div key={a.id || i} style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              padding: "8px",
              borderBottom: "1px solid #ffcccc"
            }}>
              <p style={{ margin: 0, color: "#d32f2f" }}>
                <strong>{a.ticker}</strong> hit ₹{a.target_price} (Current: ₹{a.current_price})
              </p>
              <button 
                onClick={() => clearAlert(a.id)}
                style={{
                  padding: "4px 12px",
                  backgroundColor: "#d32f2f",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {!portfolio ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* SUMMARY */}
          <h2>Total Value: ₹{portfolio.total_value}</h2>
          <h3 style={{ color: portfolio.total_pnl >= 0 ? "green" : "red" }}>
            Total P&L: ₹{portfolio.total_pnl}
          </h3>

          {/* SORT BUTTONS */}
          <div style={{ marginBottom: "15px", marginTop: "10px" }}>
            <span style={{ marginRight: "10px", fontWeight: "bold" }}>Sort by:</span>
            <button 
              onClick={() => handleSort("pnl")}
              style={{ 
                ...sortButtonStyle, 
                backgroundColor: sortBy === "pnl" ? "#0088FE" : "#f0f0f0",
                color: sortBy === "pnl" ? "white" : "black"
              }}
            >
              P&L {sortBy === "pnl" && (sortOrder === "desc" ? "↓" : "↑")}
            </button>
            <button 
              onClick={() => handleSort("return_percent")}
              style={{ 
                ...sortButtonStyle, 
                backgroundColor: sortBy === "return_percent" ? "#0088FE" : "#f0f0f0",
                color: sortBy === "return_percent" ? "white" : "black"
              }}
            >
              Return % {sortBy === "return_percent" && (sortOrder === "desc" ? "↓" : "↑")}
            </button>
            <button 
              onClick={() => handleSort("allocation_percent")}
              style={{ 
                ...sortButtonStyle, 
                backgroundColor: sortBy === "allocation_percent" ? "#0088FE" : "#f0f0f0",
                color: sortBy === "allocation_percent" ? "white" : "black"
              }}
            >
              Allocation % {sortBy === "allocation_percent" && (sortOrder === "desc" ? "↓" : "↑")}
            </button>
          </div>

          {/* TABLE */}
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={thStyle}>Ticker</th>
                <th style={thStyle}>Qty</th>
                <th style={thStyle}>Buy Price</th>
                <th style={thStyle}>Current Price</th>
                <th style={thStyle}>P&L</th>
                <th style={thStyle}>Return %</th>
                <th style={thStyle}>Allocation %</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedStocks.map((stock) => (
                <tr key={stock.id}>
                  <td style={tdStyle}>{stock.ticker}</td>
                  <td style={tdStyle}>{stock.quantity}</td>
                  <td style={tdStyle}>{stock.buy_price}</td>
                  <td style={tdStyle}>{stock.current_price}</td>
                  <td style={{ ...tdStyle, color: stock.pnl >= 0 ? "green" : "red" }}>
                    {stock.pnl}
                  </td>
                  <td style={tdStyle}>{stock.return_percent}%</td>
                  <td style={tdStyle}>{stock.allocation_percent}%</td>
                  <td style={tdStyle}>
                    <button onClick={() => deleteStock(stock.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PIE CHART */}
          <div style={sectionStyle}>
            <h3>Portfolio Allocation</h3>
            <PieChart width={500} height={300}>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* LINE CHART */}
          <div style={sectionStyle}>
            <h3>Portfolio Value Over Time</h3>
            <LineChart width={700} height={300} data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total_value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </div>
        </>
      )}
    </div>
  );
}

/* STYLES */

const inputStyle = {
  marginRight: "10px",
  padding: "8px",
};

const buttonStyle = {
  padding: "8px 16px",
};

const sortButtonStyle = {
  marginRight: "10px",
  padding: "6px 12px",
  cursor: "pointer",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "14px",
  transition: "all 0.2s",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const thStyle = {
  padding: "10px",
  border: "1px solid #ddd",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  textAlign: "center",
};

const sectionStyle = {
  marginTop: "50px",
};

export default App;