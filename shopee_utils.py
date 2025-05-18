import boto3
import pandas as pd
import tempfile
import os

S3_BUCKET = "pnet-shopee-data"
S3_KEY = "shopee-data/shopee_data.csv"

def load_dataset():
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

def respond(data, status=200):
    import json
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(data)
    }
