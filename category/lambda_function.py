from common.shopee_utils import load_dataset, respond

def lambda_handler(event, context):
    # Load the dataset
    df = load_dataset()
    
    # Get query parameters with defaults
    query = event.get("queryStringParameters") or {}
    limit = int(query.get("limit", 10))
    sort_by = query.get("sort_by", "revenue")
    sort_order = query.get("sort_order", "desc")
    
    # Group by category and calculate aggregations
    grouped = df.groupby("item_category_detail").agg({
        "total_sold": "sum",
        "price_actual": "sum"
    }).rename(columns={
        "total_sold": "units_sold",
        "price_actual": "revenue"
    }).reset_index()
    
    # Sort the results
    ascending = sort_order.lower() == "asc"
    result = grouped.sort_values(
        by=sort_by if sort_by in grouped.columns else "revenue",
        ascending=ascending
    ).head(limit)
    
    return respond(result.to_dict(orient="records"))