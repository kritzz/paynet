from shopee_utils import load_dataset, respond
import pandas as pd

def get_summary(df):
    price_column = next((col for col in df.columns if 'price_actual' in col.lower()), None)
    if not price_column:
        return respond({
            "error": "No price column found in dataset",
            "available_columns": df.columns.tolist()
        }, status=400)
    
    total_sales = df[price_column].sum()
    total_orders = len(df)
    unique_products = df["title"].nunique() if "title" in df.columns else 0
    
    return respond({
        "total_sales": round(total_sales, 2),
        "total_orders": total_orders,
        "unique_products": unique_products,
    })

def get_seller_stats(df):
    if "seller_name" not in df.columns:
        return respond({
            "error": "No seller_name column found in dataset",
            "available_columns": df.columns.tolist()
        }, status=400)
    
    price_column = next((col for col in df.columns if 'price_actual' in col.lower()), None)
    if not price_column:
        return respond({
            "error": "No price column found in dataset",
            "available_columns": df.columns.tolist()
        }, status=400)

    seller_stats = df.groupby("seller_name").agg({
        price_column: ["sum", "count"],
        "title": "nunique"
    }).reset_index()
    
    seller_stats.columns = ["seller_name", "total_sales", "total_orders", "unique_products"]
    seller_stats["total_sales"] = seller_stats["total_sales"].round(2)
    
    return respond(seller_stats.to_dict(orient="records"))

def get_sales_trend(df):
    if "w_date" not in df.columns:
        return respond({
            "error": "No w_date column found in dataset",
            "available_columns": df.columns.tolist()
        }, status=400)
    
    price_column = next((col for col in df.columns if 'price_actual' in col.lower()), None)
    if not price_column:
        return respond({
            "error": "No price column found in dataset",
            "available_columns": df.columns.tolist()
        }, status=400)

    df["w_date"] = pd.to_datetime(df["w_date"])
    df["date"] = df["w_date"].dt.date
    
    daily_sales = df.groupby("date").agg({
        price_column: ["sum", "count"],
        "title": "nunique"
    }).reset_index()
    
    daily_sales.columns = ["date", "total_sales", "total_orders", "unique_products"]
    daily_sales["total_sales"] = daily_sales["total_sales"].round(2)
    daily_sales["date"] = daily_sales["date"].astype(str)
    
    return respond(daily_sales.to_dict(orient="records"))

def get_top_products(df, limit=10):
    price_column = next((col for col in df.columns if 'price_actual' in col.lower()), None)
    if not price_column:
        return respond({
            "error": "No price column found in dataset",
            "available_columns": df.columns.tolist()
        }, status=400)

    product_stats = df.groupby("title").agg({
        price_column: ["sum", "count"]
    }).reset_index()
    
    product_stats.columns = ["title", "total_sales", "total_orders"]
    product_stats["total_sales"] = product_stats["total_sales"].round(2)
    
    # Sort by total sales and get top N products
    top_products = product_stats.sort_values("total_sales", ascending=False).head(limit)
    
    return respond(top_products.to_dict(orient="records"))

def get_top_category(df, event):
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

def lambda_handler(event, context):
    path = event.get("path", "").strip("/")

    # Load the dataset
    df = load_dataset()

    if path == "summary":
        return get_summary(df)
    elif path == "seller":
        return get_seller_stats(df)
    elif path == "sales-trend":
        return get_sales_trend(df)
    elif path == "top-products":
        return get_top_products(df)
    elif path == "top-category":
        return get_top_category(df, event)
    else:
        return respond({
            "error": "Invalid path",
            "available_paths": [
                "summary", "seller", "sales-trend", "top-products", "top-category"
            ]
        }, status=400)
