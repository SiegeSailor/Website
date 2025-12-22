terraform {
  required_version = ">= 1.0.0"

  #######################################
  # Backend State
  #######################################
  backend "s3" {
    region  = "us-east-2"
    bucket  = "siegesailor-website-development-client-state"
    key     = "terraform.tfstate"
    profile = ""
    encrypt = "true"

    dynamodb_table = "siegesailor-website-development-client-state-lock"
  }
}
