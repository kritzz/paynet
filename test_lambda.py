from lambda_function import search_products
import json
import pandas as pd

# Create a mock event with rating filter
event = {
    'httpMethod': 'POST',
    'path': 'product',
    'body': json.dumps({
        'rating': 4.5,  # Filter for products with rating >= 4.5
        'min_price': 100,
        'max_price': 300,
        'sort_by': 'rating',
        'sort_order': 'desc',
        'limit': 10
    })
}

df = pd.read_csv('shopee_data.csv')

# Call the lambda function
response = search_products(df, event)

# Print the response
print("Response Status Code:", response['statusCode'])
print("\nResponse Body:")
print(json.dumps(json.loads(response['body']), indent=2))