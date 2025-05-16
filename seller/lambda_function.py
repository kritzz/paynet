from common.shopee_utils import load_dataset, respond

def lambda_handler(event, context):
    df = load_dataset()
    query = event.get("queryStringParameters") or {}
    limit = int(query.get("limit", 10))
    sort_by = query.get("sort_by", "total_sales")

    grouped = df.groupby("seller_id").agg({
        "price": "sum",
        "product_id": "count"
    }).rename(columns={"price": "total_sales", "product_id": "orders"})

    result = grouped.sort_values(
        sort_by if sort_by in grouped.columns else "total_sales", ascending=False
    ).head(limit).reset_index()

    return respond(result.to_dict(orient="records"))
