from common.shopee_utils import load_dataset, respond
import pandas as pd

def lambda_handler(event, context):
    df = load_dataset()
    query = event.get("queryStringParameters") or {}
    interval = query.get("interval", "D").upper()[0]
    start = query.get("start_date")
    end = query.get("end_date")

    df["w_date"] = pd.to_datetime(df["w_date"])
    if start:
        df = df[df["w_date"] >= pd.to_datetime(start)]
    if end:
        df = df[df["w_date"] <= pd.to_datetime(end)]

    grouped = df.groupby(pd.Grouper(key="w_date", freq=interval)).agg({
        "price_actual": "sum",
        "id": "count"
    }).rename(columns={"price_actual": "total_revenue", "id": "orders"}).reset_index()

    grouped["w_date"] = grouped["w_date"].dt.strftime("%Y-%m-%d")
    return respond(grouped.to_dict(orient="records"))
