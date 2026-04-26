from services.price_services import get_current_price


def compute_portfolio(holdings):
    result = []
    temp_data = []

    total_value = 0
    total_investment = 0

    # Step 1: compute base values
    for h in holdings:
        try:
            current_price = get_current_price(h.ticker)
        except Exception:
            continue

        if current_price is None:
            continue

        current_value = current_price * h.quantity
        investment = h.buy_price * h.quantity
        pnl = current_value - investment

        return_pct = (pnl / investment) * 100 if investment > 0 else 0

        total_value += current_value
        total_investment += investment

        temp_data.append({
            "id": h.id,
            "ticker": h.ticker,
            "quantity": h.quantity,
            "buy_price": h.buy_price,
            "current_price": round(current_price, 2),
            "current_value": current_value,
            "pnl": pnl,
            "return_pct": return_pct
        })

    # Step 2: compute allocation %
    for item in temp_data:
        allocation = (item["current_value"] / total_value) * 100 if total_value > 0 else 0

        result.append({
            "id": item["id"],   # ✅ FIXED (was wrong before)
            "ticker": item["ticker"],
            "quantity": item["quantity"],
            "buy_price": item["buy_price"],
            "current_price": item["current_price"],
            "pnl": round(item["pnl"], 2),
            "return_percent": round(item["return_pct"], 2),
            "allocation_percent": round(allocation, 2)
        })

    # Step 3: return final response
    return {
        "stocks": result,   # ✅ no random "id" here
        "total_value": round(total_value, 2),
        "total_pnl": round(total_value - total_investment, 2)
    }