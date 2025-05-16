from common.shopee_utils import load_dataset, respond
import pandas as pd

def lambda_handler(event, context):
    df = load_dataset()
    query = event.get("queryStringParameters") or {}
    interval = query.get("interval", "D").upper()[0]
    start = query.get("start_date")
    end = query.get("end_date")

    df["order_date"] = pd.to_datetime(df["order_date"])
    if start:
        df = df[df["order_date"] >= pd.to_datetime(start)]
    if end:
        df = df[df["order_date"] <= pd.to_datetime(end)]

    grouped = df.groupby(pd.Grouper(key="order_date", freq=interval)).agg({
        "price": "sum",
        "product_id": "count"
    }).rename(columns={"price": "total_revenue", "product_id": "orders"}).reset_index()

    grouped["order_date"] = grouped["order_date"].dt.strftime("%Y-%m-%d")
    return respond(grouped.to_dict(orient="records"))
