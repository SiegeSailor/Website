module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "~> 6.2.0"

  domain_name = data.aws_route53_zone.this.name
  zone_id     = data.aws_route53_zone.this.zone_id

  # ACM for CloudFront must be created in `us-east-1`.
  region = "us-east-1"

  validation_method = "DNS"

  subject_alternative_names = [
    "*.${data.aws_route53_zone.this.name}"
  ]

  wait_for_validation = true

  tags = local.shared_tags
}

resource "aws_cloudfront_cache_policy" "web_short_ttl" {
  name        = "${local.project}-${local.environment}-${local.module}-web-short-ttl"
  comment     = "Short TTL cache policy for HTML and document responses."
  default_ttl = 300
  max_ttl     = 3600
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }

    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }

  # The policy is referenced by the distribution; the replacement must exist
  # before the old one can be detached and deleted.
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_cloudfront_cache_policy" "comments" {
  name        = "${local.comments_name}-short-ttl"
  comment     = "One minute per post for approved comments."
  default_ttl = 60
  max_ttl     = 60
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "whitelist"

      query_strings {
        items = ["post"]
      }
    }

    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Forwarding `Host` would make API Gateway reject the request, and without
# `CloudFront-Viewer-Address` the function only sees the edge's address.
resource "aws_cloudfront_origin_request_policy" "comments" {
  name    = "${local.comments_name}-viewer-address"
  comment = "The reader's address and the body type, never the host."

  cookies_config {
    cookie_behavior = "none"
  }

  headers_config {
    header_behavior = "whitelist"

    headers {
      items = ["CloudFront-Viewer-Address", "Content-Type"]
    }
  }

  query_strings_config {
    query_string_behavior = "none"
  }
}

# Rewrites extensionless routes to the exported `.html` files in S3.
resource "aws_cloudfront_function" "rewrite_static_routes" {
  name    = "${local.project}-${local.environment}-${local.module}-rewrite-static-routes"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = <<-EOT
    function handler(event) {
      var request = event.request;
      var uri = request.uri;
      if (uri.endsWith("/") && uri !== "/") {
        uri = uri.slice(0, -1);
      }
      if (uri === "/" || uri === "") {
        request.uri = "/index.html";
        return request;
      }
      if (!uri.split("/").pop().includes(".")) {
        uri = uri + ".html";
      }
      request.uri = uri;
      return request;
    }
  EOT
}

moved {
  from = module.cloudfront[0]
  to   = module.cloudfront
}

module "cloudfront" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "~> 6.0.2"

  aliases     = [data.aws_route53_zone.this.name, "*.${data.aws_route53_zone.this.name}"]
  price_class = "PriceClass_100"

  default_root_object = "index.html"

  origin_access_control = {
    s3_site = {
      description      = "Read-only access to the static site bucket."
      origin_type      = "s3"
      signing_behavior = "always"
      signing_protocol = "sigv4"
    }
  }

  origin = {
    s3_site = {
      domain_name               = module.site_s3_bucket.s3_bucket_bucket_regional_domain_name
      origin_access_control_key = "s3_site"
    }

    comments_api = {
      domain_name = replace(aws_apigatewayv2_api.comments.api_endpoint, "https://", "")

      custom_origin_config = {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "https-only"
      }

      custom_header = {
        X-Origin-Verify = random_password.comments_origin.result
      }
    }
  }

  default_cache_behavior = {
    target_origin_id       = "s3_site"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true

    # Short TTL for HTML and data responses; deploys invalidate the cache.
    cache_policy_id = aws_cloudfront_cache_policy.web_short_ttl.id

    function_association = {
      viewer-request = {
        function_arn = aws_cloudfront_function.rewrite_static_routes.arn
      }
    }
  }

  ordered_cache_behavior = [
    # No routing function here: it would rewrite `/api/comments` to a file.
    {
      path_pattern             = "/api/*"
      target_origin_id         = "comments_api"
      viewer_protocol_policy   = "redirect-to-https"
      allowed_methods          = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
      cached_methods           = ["GET", "HEAD"]
      compress                 = true
      cache_policy_id          = aws_cloudfront_cache_policy.comments.id
      origin_request_policy_id = aws_cloudfront_origin_request_policy.comments.id
    },
    {
      path_pattern           = "/_next/static/*"
      target_origin_id       = "s3_site"
      viewer_protocol_policy = "redirect-to-https"
      allowed_methods        = ["GET", "HEAD", "OPTIONS"]
      cached_methods         = ["GET", "HEAD"]
      compress               = true
      cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized
    },
    {
      path_pattern           = "/images/*"
      target_origin_id       = "s3_site"
      viewer_protocol_policy = "redirect-to-https"
      allowed_methods        = ["GET", "HEAD", "OPTIONS"]
      cached_methods         = ["GET", "HEAD"]
      compress               = true
      cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized
    }
  ]

  # Missing S3 keys surface as 403 from the REST endpoint.
  custom_error_response = [
    {
      error_code            = 403
      response_code         = 404
      response_page_path    = "/404.html"
      error_caching_min_ttl = 60
    },
    {
      error_code            = 404
      response_code         = 404
      response_page_path    = "/404.html"
      error_caching_min_ttl = 60
    }
  ]

  viewer_certificate = {
    acm_certificate_arn = module.acm.acm_certificate_arn
    ssl_support_method  = "sni-only"
  }

  tags = local.shared_tags
}
