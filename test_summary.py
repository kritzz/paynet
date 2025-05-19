import pytest
import pandas as pd
import json
from datetime import datetime
from lambda_function import get_summary

@pytest.fixture
def sample_dataframe():
    # Create a sample dataframe for testing
    data = {
        'w_date': ['2024-01-01', '2024-01-02', '2024-01-03'],
        'seller_name': ['Seller1', 'Seller2', 'Seller1'],
        'item_category_detail': ['Electronics', 'Clothing', 'Electronics'],
        'price_actual': [100.0, 200.0, 150.0],
        'title': ['Product1', 'Product2', 'Product3']
    }
    return pd.DataFrame(data)

def test_basic_summary(sample_dataframe):
    # Test basic summary without any filters
    event = {'queryStringParameters': None}
    response = get_summary(sample_dataframe, event)
    
    # Parse the response body
    response_body = response['body']
    if isinstance(response_body, str):
        response_body = json.loads(response_body)
    
    assert response['statusCode'] == 200
    assert response_body['total_sales'] == 450.0
    assert response_body['total_orders'] == 3
    assert response_body['unique_products'] == 3

def test_summary_with_date_filter(sample_dataframe):
    # Test summary with date filter
    event = {
        'queryStringParameters': {
            'start_date': '2024-01-02',
            'end_date': '2024-01-03'
        }
    }
    response = get_summary(sample_dataframe, event)
    
    response_body = response['body']
    if isinstance(response_body, str):
        response_body = json.loads(response_body)
    
    assert response['statusCode'] == 200
    assert response_body['total_sales'] == 350.0
    assert response_body['total_orders'] == 2
    assert response_body['unique_products'] == 2

def test_summary_with_seller_filter(sample_dataframe):
    # Test summary with seller filter
    event = {
        'queryStringParameters': {
            'seller_name': 'Seller1'
        }
    }
    response = get_summary(sample_dataframe, event)
    
    response_body = response['body']
    if isinstance(response_body, str):
        response_body = json.loads(response_body)
    
    assert response['statusCode'] == 200
    assert response_body['total_sales'] == 250.0
    assert response_body['total_orders'] == 2
    assert response_body['unique_products'] == 2

def test_summary_with_category_filter(sample_dataframe):
    # Test summary with category filter
    event = {
        'queryStringParameters': {
            'category': 'Electronics'
        }
    }
    response = get_summary(sample_dataframe, event)
    
    response_body = response['body']
    if isinstance(response_body, str):
        response_body = json.loads(response_body)
    
    assert response['statusCode'] == 200
    assert response_body['total_sales'] == 250.0
    assert response_body['total_orders'] == 2
    assert response_body['unique_products'] == 2

def test_summary_with_price_filter(sample_dataframe):
    # Test summary with price range filter
    event = {
        'queryStringParameters': {
            'min_price': 150.0,
            'max_price': 200.0
        }
    }
    response = get_summary(sample_dataframe, event)
    
    response_body = response['body']
    if isinstance(response_body, str):
        response_body = json.loads(response_body)
    
    assert response['statusCode'] == 200
    assert response_body['total_sales'] == 350.0  # Fixed assertion
    assert response_body['total_orders'] == 2     # Should have 2 products in this range
    assert response_body['unique_products'] == 2  # Should have 2 unique products

def test_summary_without_price_column():
    # Test error case when price column is missing
    data = {
        'w_date': ['2024-01-01'],
        'seller_name': ['Seller1'],
        'title': ['Product1']
    }
    df = pd.DataFrame(data)
    
    event = {'queryStringParameters': None}
    response = get_summary(df, event)
    
    response_body = response['body']
    if isinstance(response_body, str):
        response_body = json.loads(response_body)
    
    assert response['statusCode'] == 400
    assert 'error' in response_body
    assert 'No price column found in dataset' in response_body['error']