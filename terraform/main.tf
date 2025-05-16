terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Variables for AWS configuration
variable "aws_profile" {
  description = "AWS profile to use for deployment"
  type        = string
  default     = "default"  # Change this to your desired profile name
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-southeast-1"
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

# Project Variables
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "shopee-api"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

# S3 Variables
variable "s3_bucket" {
  description = "S3 bucket containing the dataset"
  type        = string
}

variable "s3_key" {
  description = "S3 key of the dataset file"
  type        = string
}

locals {
  name_prefix = "${var.project_name}-${var.environment}"
} 