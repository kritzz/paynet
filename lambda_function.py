from shopee_utils import load_dataset, respond
import pandas as pd
from datetime import datetime, timedelta
import json

# Helper function to apply filters to the dataframe
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
    query=event.get("queryStringParameters") or {}
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
    print("Available columns:", filtered_df.columns.tolist())
    
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

    # Prepare aggregation dictionary
    agg_dict = {
        price_column: ["sum", "count"],
        "title": "nunique"
    }
    
    # Add rating aggregations if columns exist
    if "item_rating" in filtered_df.columns:
        # Convert item_rating to numeric, replacing non-numeric values with NaN
        filtered_df['item_rating'] = pd.to_numeric(filtered_df['item_rating'], errors='coerce')
        agg_dict["item_rating"] = "mean"
    
    if "total_rating" in filtered_df.columns:
        # Convert total_rating to numeric, replacing non-numeric values with 0
        filtered_df['total_rating'] = pd.to_numeric(filtered_df['total_rating'], errors='coerce').fillna(0)
        agg_dict["total_rating"] = "sum"

    seller_stats = filtered_df.groupby("seller_name").agg(agg_dict).reset_index()
    
    # Set column names
    column_names = ["seller_name", "total_sales", "total_orders", "unique_products"]
    if "item_rating" in filtered_df.columns:
        column_names.append("average_rating")
    if "total_rating" in filtered_df.columns:
        column_names.append("total_ratings")
    seller_stats.columns = column_names
    
    # Round numeric columns
    seller_stats["total_sales"] = seller_stats["total_sales"].round(2)
    if "average_rating" in seller_stats.columns:
        seller_stats["average_rating"] = seller_stats["average_rating"].round(2)
        # Replace NaN with 0 for average_rating
        seller_stats["average_rating"] = seller_stats["average_rating"].fillna(0)
    
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
    query event.get("queryStringParameters") or {}
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

def search_products(df, event):
    try:
        # Get the request body
        body = event.get('body', '{}')
        if isinstance(body, str):
            body = json.loads(body)
        
        filtered_df = df.copy()
        
        # Search term filter (case-insensitive)
        if 'searchterm' in body:
            search_term = body['searchterm'].lower()
            # Search in title, specification, and description
            title_mask = filtered_df['title'].str.lower().str.contains(search_term, na=False)
            spec_mask = filtered_df['specification'].str.lower().str.contains(search_term, na=False) if 'specification' in filtered_df.columns else pd.Series(False, index=filtered_df.index)
            desc_mask = filtered_df['description'].str.lower().str.contains(search_term, na=False) if 'description' in filtered_df.columns else pd.Series(False, index=filtered_df.index)
            filtered_df = filtered_df[title_mask | spec_mask | desc_mask]
        
        # Rating filter
        if 'rating' in body:
            rating = float(body['rating'])
            if 'rating' in filtered_df.columns:
                filtered_df = filtered_df[filtered_df['rating'] >= rating]
        
        # Price range filter
        price_column = next((col for col in filtered_df.columns if 'price_actual' in col.lower()), None)
        if price_column:
            if 'min_price' in body:
                filtered_df = filtered_df[filtered_df[price_column] >= float(body['min_price'])]
            if 'max_price' in body:
                filtered_df = filtered_df[filtered_df[price_column] <= float(body['max_price'])]
        
        # Sales filter
        if 'min_sales' in body:
            filtered_df = filtered_df[filtered_df['total_sold'] >= int(body['min_sales'])]
        if 'max_sales' in body:
            filtered_df = filtered_df[filtered_df['total_sold'] <= int(body['max_sales'])]
        
        # Orders filter
        if 'min_orders' in body:
            filtered_df = filtered_df[filtered_df['total_orders'] >= int(body['min_orders'])]
        if 'max_orders' in body:
            filtered_df = filtered_df[filtered_df['total_orders'] <= int(body['max_orders'])]
        
        # Get sorting parameters
        sort_by = body.get('sort_by', 'total_sold')
        sort_order = body.get('sort_order', 'desc')
        limit = int(body.get('limit', 50))
        
        # Sort the results
        ascending = sort_order.lower() == 'asc'
        if sort_by in filtered_df.columns:
            filtered_df = filtered_df.sort_values(by=sort_by, ascending=ascending)
        
        # Apply limit
        filtered_df = filtered_df.head(limit)
        
        # Select and rename columns for response
        response_columns = {
            'title': 'title',
            'price_actual': 'price',
            'total_sold': 'sales',
            'rating': 'rating',
            'specification': 'specification',
            'description': 'description',
            'seller_name': 'seller',
            'item_category_detail': 'category'
        }
        
        # Only include columns that exist in the dataframe
        available_columns = {k: v for k, v in response_columns.items() if k in filtered_df.columns}
        result_df = filtered_df[available_columns.keys()].rename(columns=available_columns)
        
        return respond({
            'total_results': len(filtered_df),
            'products': result_df.to_dict(orient='records')
        })
        
    except Exception as e:
        return respond({
            'error': str(e),
            'message': 'Error processing product search request'
        }, status=400)

def lambda_handler(event, context):
    path = event.get("path", "").strip("/")
    method = event.get("httpMethod", "").upper()

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
    elif path == "product" and method == "POST":
        return search_products(df, event)
    else:
        return respond({
            "error": "Invalid path or method",
            "available_paths": [
                "summary", "seller", "sales-trend", "top-products", "top-category", "product"
            ]
        }, status=400)
