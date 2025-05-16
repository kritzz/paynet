from common.shopee_utils import load_dataset, respond

def lambda_handler(event, context):
    df = load_dataset()
    query = event.get("queryStringParameters") or {}
    sort_by = query.get("sort_by", "units_sold")
    limit = int(query.get("limit", 10))

    df_grouped = df.groupby("product_name").agg({
        "price": "sum",
        "product_id": "count"
    }).rename(columns={"price": "revenue", "product_id": "units_sold"})

    result = df_grouped.sort_values(sort_by, ascending=False).head(limit).reset_index()
    return respond(result.to_dict(orient="records"))
