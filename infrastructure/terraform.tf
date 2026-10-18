terraform {
  required_version = "~> 1.14.1"

  required_providers {
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.7"
    }

    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.32"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.7"
    }
  }
}
