from sales_trend.lambda_function import lambda_handler

# Create a mock event and context
event = {}
context = None

# Call the lambda function
response = lambda_handler(event, context)

# Print the response
print(response)