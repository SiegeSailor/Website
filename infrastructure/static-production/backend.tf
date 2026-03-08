terraform {
  backend "s3" {
    region       = "us-east-1"
    bucket       = "siegesailor-website-static-production-tf-state"
    key          = "static-production/terraform.tfstate"
    use_lockfile = true
  }
}
