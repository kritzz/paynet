# API Gateway
resource "aws_api_gateway_rest_api" "api" {
  name        = "${local.name_prefix}-api"
  description = "Shopee API Gateway"
}

# API Gateway resources
resource "aws_api_gateway_resource" "summary" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "summary"
}

resource "aws_api_gateway_resource" "seller" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "seller"
}

resource "aws_api_gateway_resource" "sales_trend" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "sales-trend"
}

resource "aws_api_gateway_resource" "top_products" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "top-products"
}

resource "aws_api_gateway_resource" "top_category" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "top-category"
}

resource "aws_api_gateway_method" "top_category_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.top_category.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "top_category_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.top_category.id
  http_method             = aws_api_gateway_method.top_category_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.summary.invoke_arn
}

# API Gateway methods
resource "aws_api_gateway_method" "summary_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.summary.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "seller_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.seller.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "sales_trend_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.sales_trend.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "top_products_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.top_products.id
  http_method   = "GET"
  authorization = "NONE"
}

# API Gateway integrations
resource "aws_api_gateway_integration" "summary_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.summary.id
  http_method             = aws_api_gateway_method.summary_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.summary.invoke_arn
}

resource "aws_api_gateway_integration" "seller_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.seller.id
  http_method             = aws_api_gateway_method.seller_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.summary.invoke_arn
}

resource "aws_api_gateway_integration" "sales_trend_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.sales_trend.id
  http_method             = aws_api_gateway_method.sales_trend_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.summary.invoke_arn
}

resource "aws_api_gateway_integration" "top_products_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.top_products.id
  http_method             = aws_api_gateway_method.top_products_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.summary.invoke_arn
}

# Enable CORS
resource "aws_api_gateway_method" "options_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_rest_api.api.root_resource_id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "options_200" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_rest_api.api.root_resource_id
  http_method   = aws_api_gateway_method.options_method.http_method
  status_code   = "200"
  
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_rest_api.api.root_resource_id
  http_method   = aws_api_gateway_method.options_method.http_method
  type          = "MOCK"
  
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_integration_response" "options_integration_response" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_rest_api.api.root_resource_id
  http_method   = aws_api_gateway_method.options_method.http_method
  status_code   = aws_api_gateway_method_response.options_200.status_code
  
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

# API Gateway deployment
resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  depends_on = [
    aws_api_gateway_integration.summary_integration,
    aws_api_gateway_integration.seller_integration,
    aws_api_gateway_integration.sales_trend_integration,
    aws_api_gateway_integration.top_products_integration,
    aws_api_gateway_integration.options_integration
  ]

  # Force new deployment when API changes
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.summary.id,
      aws_api_gateway_resource.seller.id,
      aws_api_gateway_resource.sales_trend.id,
      aws_api_gateway_resource.top_products.id,
      aws_api_gateway_resource.top_category.id,
      aws_api_gateway_method.summary_method.id,
      aws_api_gateway_method.seller_method.id,
      aws_api_gateway_method.sales_trend_method.id,
      aws_api_gateway_method.top_products_method.id,
      aws_api_gateway_method.top_category_method.id
    ]))
  }
}

# API Gateway stage
resource "aws_api_gateway_stage" "stage" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = var.environment
}

# Output the API Gateway URLs
output "api_urls" {
  value = {
    summary      = "${aws_api_gateway_deployment.deployment.invoke_url}${aws_api_gateway_stage.stage.stage_name}/summary"
    seller       = "${aws_api_gateway_deployment.deployment.invoke_url}${aws_api_gateway_stage.stage.stage_name}/seller"
    sales_trend  = "${aws_api_gateway_deployment.deployment.invoke_url}${aws_api_gateway_stage.stage.stage_name}/sales-trend"
    top_products = "${aws_api_gateway_deployment.deployment.invoke_url}${aws_api_gateway_stage.stage.stage_name}/top-products"
    top_category = "${aws_api_gateway_deployment.deployment.invoke_url}${aws_api_gateway_stage.stage.stage_name}/top-category"
  }
  description = "The URLs of the API Gateway endpoints"
} 