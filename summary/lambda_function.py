from common.shopee_utils import load_dataset, respond

def lambda_handler(event, context):
    df = load_dataset()
    
    # Print available columns for debugging
    print("Available columns:", df.columns.tolist())
    
    # Assuming the price column might be named differently
    # Common variations: 'Price', 'PRICE', 'product_price', etc.
    price_column = next((col for col in df.columns if 'price' in col.lower()), None)
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
        "price_column_used": price_column
    })
