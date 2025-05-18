import boto3
import pandas as pd
import tempfile
import os
import json
from datetime import datetime, timedelta

S3_BUCKET = "pnet-shopee-data"
S3_KEY = "shopee-data/shopee_data.csv"

def load_dataset():
    if os.getenv('AWS_SAM_LOCAL'):
        # Return mock data for local testing
        return pd.DataFrame({
            'title': ['Test Product 1', 'Test Product 2', 'Test Product 3'],
            'price_actual': [100, 200, 300],
            'w_date': ['2024-01-01', '2024-01-02', '2024-01-03'],
            'seller_name': ['Seller 1', 'Seller 2', 'Seller 1'],
            'item_category_detail': ['Category 1', 'Category 2', 'Category 1'],
            'total_sold': [10, 20, 30],
            'item_rating': [4.5, 4.0, 4.8],
            'total_rating': [100, 200, 150]
        })
    else:
        s3 = boto3.client("s3")
        # Create a temporary file
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, "shopee_data.csv")
        
        try:
            # Download the file
            s3.download_file(S3_BUCKET, S3_KEY, temp_path)
            # Read the file
            df = pd.read_csv(temp_path)
            return df
        finally:
            # Clean up the temporary file
            if os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except:
                    pass  # Ignore cleanup errors

def respond(body, status=200):
    return {
        'statusCode': status,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body)
    }
