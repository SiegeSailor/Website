terraform {
  backend "s3" {
    region       = "us-east-1"
    bucket       = "siegesailor-website-server-development-tf-state"
    key          = "terraform.tfstate"
    profile      = "default"
    use_lockfile = true
  }
}
