    
import pytest
import pandas as pd
import json
from datetime import datetime
from lambda_function import (
    apply_filters,
    get_summary,
    get_seller_stats,
    get_sales_trend,
    get_top_products,
    get_top_category,
    search_products
)

# Common test fixtures
@pytest.fixture
def sample_dataframe():
    data = {
        'w_date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04'],
        'seller_name': ['Seller1', 'Seller2', 'Seller1', 'Seller3'],
        'item_category_detail': ['Electronics', 'Clothing', 'Electronics', 'Food'],
        'price_actual': [100.0, 200.0, 150.0, 75.0],
        'title': ['Product1', 'Product2', 'Product3', 'Product4'],
        'total_sold': [10, 5, 8, 20],
        'item_rating': [4.5, 4.0, 4.8, 3.5],
        'total_rating': [100, 50, 80, 30],
        'specification': ['Spec1', 'Spec2', 'Spec3', 'Spec4'],
        'description': ['Desc1', 'Desc2', 'Desc3', 'Desc4']
    }
    return pd.DataFrame(data)

# Test apply_filters function
def test_apply_filters_no_filters(sample_dataframe):
    result = apply_filters(sample_dataframe, None)
    assert len(result) == len(sample_dataframe)
    pd.testing.assert_frame_equal(result, sample_dataframe)

def test_apply_filters_date_range(sample_dataframe):
    filters = {
        'start_date': '2024-01-02',
        'end_date': '2024-01-03'
    }
    result = apply_filters(sample_dataframe, filters)
    assert len(result) == 2
    assert all(result['w_date'].dt.date >= datetime(2024, 1, 2).date())
    assert all(result['w_date'].dt.date <= datetime(2024, 1, 3).date())

def test_apply_filters_seller(sample_dataframe):
    filters = {'seller_name': 'Seller1'}
    result = apply_filters(sample_dataframe, filters)
    assert len(result) == 2
    assert all(result['seller_name'] == 'Seller1')

def test_apply_filters_category(sample_dataframe):
    filters = {'category': 'Electronics'}
    result = apply_filters(sample_dataframe, filters)
    assert len(result) == 2
    assert all(result['item_category_detail'] == 'Electronics')

def test_apply_filters_price_range(sample_dataframe):
    filters = {
        'min_price': 150.0,
        'max_price': 200.0
    }
    result = apply_filters(sample_dataframe, filters)
    assert len(result) == 2  # Fixed: Two products in price range
    assert all(result['price_actual'] >= 150.0)
    assert all(result['price_actual'] <= 200.0)

def test_get_top_products_with_filters(sample_dataframe):
    event = {
        'queryStringParameters': {
            'seller_name': 'Seller1',
            'limit': 1
        }
    }
    response = get_top_products(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 200
    assert len(response_body) == 1
    assert response_body[0]['total_sales'] == 150.0  # Fixed: Correct total sales for one product


# Test get_summary function
def test_get_summary_basic(sample_dataframe):
    event = {'queryStringParameters': None}
    response = get_summary(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 200
    assert response_body['total_sales'] == 525.0
    assert response_body['total_orders'] == 4
    assert response_body['unique_products'] == 4

def test_get_summary_with_filters(sample_dataframe):
    event = {
        'queryStringParameters': {
            'seller_name': 'Seller1',
            'min_price': 100.0
        }
    }
    response = get_summary(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 200
    assert response_body['total_sales'] == 250.0
    assert response_body['total_orders'] == 2
    assert response_body['unique_products'] == 2

# Test get_seller_stats function
def test_get_seller_stats_basic(sample_dataframe):
    event = {'queryStringParameters': None}
    response = get_seller_stats(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 200
    assert len(response_body) == 3  # Three unique sellers
    assert any(seller['seller_name'] == 'Seller1' for seller in response_body)
    assert any(seller['total_sales'] == 250.0 for seller in response_body if seller['seller_name'] == 'Seller1')

def test_get_seller_stats_with_sorting(sample_dataframe):
    event = {
        'queryStringParameters': {
            'sort_by': 'total_sales',
            'sort_order': 'desc',
            'limit': 2
        }
    }
    response = get_seller_stats(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 200
    assert len(response_body) == 2
    assert response_body[0]['total_sales'] >= response_body[1]['total_sales']

# Test get_sales_trend function
def test_get_sales_trend_basic(sample_dataframe):
    event = {'queryStringParameters': None}
    response = get_sales_trend(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 200
    assert len(response_body) == 4  # Four days of data
    assert all('date' in record for record in response_body)
    assert all('total_sales' in record for record in response_body)
    assert all('total_orders' in record for record in response_body)

def test_get_sales_trend_with_date_filter(sample_dataframe):
    event = {
        'queryStringParameters': {
            'start_date': '2024-01-02',
            'end_date': '2024-01-03'
        }
    }
    response = get_sales_trend(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 200
    assert len(response_body) == 2

# Test get_top_products function
def test_get_top_products_basic(sample_dataframe):
    event = {'queryStringParameters': {'limit': 2}}
    response = get_top_products(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 200
    assert len(response_body) == 2
    assert response_body[0]['total_sales'] >= response_body[1]['total_sales']

def test_get_top_products_with_filters(sample_dataframe):
    event = {
        'queryStringParameters': {
            'seller_name': 'Seller1',
            'limit': 1
        }
    }
    response = get_top_products(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 200
    assert len(response_body) == 1
    assert response_body[0]['total_sales'] == 150.0

# Test get_top_category function
def test_get_top_category_basic(sample_dataframe):
    event = {'queryStringParameters': {'limit': 2}}
    response = get_top_category(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 200
    assert len(response_body) == 2
    assert response_body[0]['revenue'] >= response_body[1]['revenue']

def test_get_top_category_with_sorting(sample_dataframe):
    event = {
        'queryStringParameters': {
            'sort_by': 'units_sold',
            'sort_order': 'desc',
            'limit': 1
        }
    }
    response = get_top_category(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 200
    assert len(response_body) == 1
    assert response_body[0]['units_sold'] == 20  # Food category has highest units sold

# Test search_products function
def test_search_products_basic(sample_dataframe):
    event = {
        'body': json.dumps({
            'searchterm': 'Product',
            'limit': 2
        })
    }
    response = search_products(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 200
    assert response_body['total_results'] == 2 
    assert len(response_body['products']) == 2

def test_search_products_with_filters(sample_dataframe):
    event = {
        'body': json.dumps({
            'rating': 4.0,
            'min_price': 100.0,
            'max_price': 200.0,
            'sort_by': 'rating',
            'sort_order': 'desc',
            'limit': 2
        })
    }
    response = search_products(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 200
    assert len(response_body['products']) == 2
    assert all(product['rating'] >= 4.0 for product in response_body['products'])
    assert all(100.0 <= product['price'] <= 200.0 for product in response_body['products'])

def test_search_products_error_handling(sample_dataframe):
    event = {
        'body': 'invalid json'
    }
    response = search_products(sample_dataframe, event)
    response_body = json.loads(response['body']) if isinstance(response['body'], str) else response['body']
    
    assert response['statusCode'] == 400
    assert 'error' in response_body