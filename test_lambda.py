from lambda_function import get_seller_stats

# Create a mock event and context
event = {}
context = None

# Call the lambda function
response = get_seller_stats(event, context)

# Print the response
print(response)