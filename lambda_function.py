from shopee_utils import load_dataset, respond
import pandas as pd
from datetime import datetime, timedelta

def apply_filters(df, filters):
    if not filters:
        return df
    
    filtered_df = df.copy()
    
    # Convert w_date to datetime if it exists
    if 'w_date' in filtered_df.columns:
        filtered_df['w_date'] = pd.to_datetime(filtered_df['w_date'])
    
    # Date range filter
    if 'start_date' in filters:
        start_date = pd.to_datetime(filters['start_date'])
        filtered_df = filtered_df[filtered_df['w_date'] >= start_date]
    if 'end_date' in filters:
        end_date = pd.to_datetime(filters['end_date'])
        filtered_df = filtered_df[filtered_df['w_date'] <= end_date]
    
    # Seller filter
    if 'seller_name' in filters:
        filtered_df = filtered_df[filtered_df['seller_name'] == filters['seller_name']]
    
    # Category filter
    if 'category' in filters:
        filtered_df = filtered_df[filtered_df['item_category_detail'] == filters['category']]
    
    # Price range filter
    price_column = next((col for col in filtered_df.columns if 'price_actual' in col.lower()), None)
    if price_column:
        if 'min_price' in filters:
            filtered_df = filtered_df[filtered_df[price_column] >= float(filters['min_price'])]
        if 'max_price' in filters:
            filtered_df = filtered_df[filtered_df[price_column] <= float(filters['max_price'])]
    
    return filtered_df

def get_summary(df, event):
    query = event.get("queryStringParameters") or {}
    filtered_df = apply_filters(df, query)
    
    price_column = next((col for col in filtered_df.columns if 'price_actual' in col.lower()), None)
    if not price_column:
        return respond({
            "error": "No price column found in dataset",
            "available_columns": filtered_df.columns.tolist()
        }, status=400)
    
    total_sales = filtered_df[price_column].sum()
    total_orders = len(filtered_df)
    unique_products = filtered_df["title"].nunique() if "title" in filtered_df.columns else 0
    
    return respond({
        "total_sales": round(total_sales, 2),
        "total_orders": total_orders,
        "unique_products": unique_products,
    })

def get_seller_stats(df, event):
    query = event.get("queryStringParameters") or {}
    filtered_df = apply_filters(df, query)
    
    if "seller_name" not in filtered_df.columns:
        return respond({
            "error": "No seller_name column found in dataset",
            "available_columns": filtered_df.columns.tolist()
        }, status=400)
    
    price_column = next((col for col in filtered_df.columns if 'price_actual' in col.lower()), None)
    if not price_column:
        return respond({
            "error": "No price column found in dataset",
            "available_columns": filtered_df.columns.tolist()
        }, status=400)

    # Get sorting parameters with defaults
    sort_by = query.get("sort_by", "total_sales")
    sort_order = query.get("sort_order", "desc")
    limit = int(query.get("limit", 0))  # 0 means no limit

    seller_stats = filtered_df.groupby("seller_name").agg({
        price_column: ["sum", "count"],
        "title": "nunique"
    }).reset_index()
    
    seller_stats.columns = ["seller_name", "total_sales", "total_orders", "unique_products"]
    seller_stats["total_sales"] = seller_stats["total_sales"].round(2)
    
    # Sort the results
    ascending = sort_order.lower() == "asc"
    if sort_by not in seller_stats.columns:
        sort_by = "total_sales"  # Default to total_sales if invalid sort column
    
    seller_stats = seller_stats.sort_values(by=sort_by, ascending=ascending)
    
    # Apply limit if specified
    if limit > 0:
        seller_stats = seller_stats.head(limit)
    
    return respond(seller_stats.to_dict(orient="records"))

def get_sales_trend(df, event):
    query = event.get("queryStringParameters") or {}
    filtered_df = apply_filters(df, query)
    
    if "w_date" not in filtered_df.columns:
        return respond({
            "error": "No w_date column found in dataset",
            "available_columns": filtered_df.columns.tolist()
        }, status=400)
    
    price_column = next((col for col in filtered_df.columns if 'price_actual' in col.lower()), None)
    if not price_column:
        return respond({
            "error": "No price column found in dataset",
            "available_columns": filtered_df.columns.tolist()
        }, status=400)

    filtered_df["w_date"] = pd.to_datetime(filtered_df["w_date"])
    filtered_df["date"] = filtered_df["w_date"].dt.date
    
    daily_sales = filtered_df.groupby("date").agg({
        price_column: ["sum", "count"],
        "title": "nunique"
    }).reset_index()
    
    daily_sales.columns = ["date", "total_sales", "total_orders", "unique_products"]
    daily_sales["total_sales"] = daily_sales["total_sales"].round(2)
    daily_sales["date"] = daily_sales["date"].astype(str)
    
    return respond(daily_sales.to_dict(orient="records"))

def get_top_products(df, event):
    query = event.get("queryStringParameters") or {}
    filtered_df = apply_filters(df, query)
    
    price_column = next((col for col in filtered_df.columns if 'price_actual' in col.lower()), None)
    if not price_column:
        return respond({
            "error": "No price column found in dataset",
            "available_columns": filtered_df.columns.tolist()
        }, status=400)

    product_stats = filtered_df.groupby("title").agg({
        price_column: ["sum", "count"]
    }).reset_index()
    
    product_stats.columns = ["title", "total_sales", "total_orders"]
    product_stats["total_sales"] = product_stats["total_sales"].round(2)
    
    # Get limit from query parameters
    limit = int(query.get("limit", 10))
    
    # Sort by total sales and get top N products
    top_products = product_stats.sort_values("total_sales", ascending=False).head(limit)
    
    return respond(top_products.to_dict(orient="records"))

def get_top_category(df, event):
    query = event.get("queryStringParameters") or {}
    filtered_df = apply_filters(df, query)
    
    # Get query parameters with defaults
    limit = int(query.get("limit", 10))
    sort_by = query.get("sort_by", "revenue")
    sort_order = query.get("sort_order", "desc")

    # Group by category and calculate aggregations
    grouped = filtered_df.groupby("item_category_detail").agg({
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
        return get_summary(df, event)
    elif path == "seller":
        return get_seller_stats(df, event)
    elif path == "sales-trend":
        return get_sales_trend(df, event)
    elif path == "top-products":
        return get_top_products(df, event)
    elif path == "top-category":
        return get_top_category(df, event)
    else:
        return respond({
            "error": "Invalid path",
            "available_paths": [
                "summary", "seller", "sales-trend", "top-products", "top-category"
            ]
        }, status=400)
