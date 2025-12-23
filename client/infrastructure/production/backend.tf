terraform {
  backend "s3" {
    region       = "us-east-1"
    bucket       = "siegesailor-website-production-tf-state"
    key          = "terraform.tfstate"
    profile      = "default"
    use_lockfile = true
  }
}
