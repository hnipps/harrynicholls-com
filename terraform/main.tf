terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.30"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = "personal"
  region  = "us-east-1"
}

locals {
  s3_origin_id = "HarryNicholls.com S3 Bucket"
}

data "aws_acm_certificate" "issued" {
  domain   = "www.harrynicholls.com"
  statuses = ["ISSUED"]
}

resource "aws_s3_bucket" "logging" {
  bucket = "harrynicholls.com-logging"
  acl    = "private"

  tags = {
    Client = "HarryNicholls.com"
  }
}

resource "aws_s3_bucket" "default" {
  bucket = "harrynicholls.com-website"
  acl    = "private"

  tags = {
    Client = "HarryNicholls.com"
  }
}

resource "aws_s3_bucket_ownership_controls" "default" {
  bucket = aws_s3_bucket.default.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.default.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.harrynicholls.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "example" {
  bucket = aws_s3_bucket.default.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

resource "aws_cloudfront_origin_access_identity" "harrynicholls" {
  comment = "HarryNicholls.com"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.default.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.harrynicholls.cloudfront_access_identity_path
    }
  }

  enabled         = true
  is_ipv6_enabled = true
  comment         = "HarryNicholls.com"

  aliases = ["www.harrynicholls.com", "harrynicholls.com"]

  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.logging.bucket_domain_name
    prefix          = "pc"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  default_root_object = "index.html"

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Environment = "production"
    Client      = "HarryNicholls.com"
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.issued.arn
    ssl_support_method  = "sni-only"
  }
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.s3_distribution.domain_name
}
