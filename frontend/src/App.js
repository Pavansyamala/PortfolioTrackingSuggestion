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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [history, setHistory] = useState([]);

  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  useEffect(() => {
    fetchPortfolio();
    fetchHistory();
  }, []);

  const fetchPortfolio = async () => {
    const res = await axios.get("http://127.0.0.1:8000/portfolio/");
    setPortfolio(res.data);
  };

  const fetchHistory = async () => {
    const res = await axios.get("http://127.0.0.1:8000/portfolio_history/");
    setHistory(res.data);
  };

  const addStock = async () => {
    await axios.post("http://127.0.0.1:8000/add_stock/", {
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
    await axios.delete(`http://127.0.0.1:8000/delete_stock/${id}`);
    fetchPortfolio();
    fetchHistory();
  };

  const pieData =
    portfolio?.stocks.map((s) => ({
      name: s.ticker,
      value: s.allocation_percent,
    })) || [];

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

      {!portfolio ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* SUMMARY */}
          <h2>Total Value: ₹{portfolio.total_value}</h2>
          <h3 style={{ color: portfolio.total_pnl >= 0 ? "green" : "red" }}>
            Total P&L: ₹{portfolio.total_pnl}
          </h3>

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
              {portfolio.stocks.map((stock) => (
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