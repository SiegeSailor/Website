#!/bin/bash
#
# Pre-warm CloudFront cache by making requests to all pages.

set -o errexit

readonly BLUE="\033[0;34m"
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly NONE="\033[0m"

#######################################
# Main function.
# Arguments:
#   $1 - Domain name (default: jinyu-zhang.com)
#   $2 - Protocol (default: https)
# Outputs:
#   Makes HTTP requests to all pages to warm up CloudFront cache
#######################################
main() {
  local -r domain="${1:-jinyu-zhang.com}"
  local -r protocol="${2:-https}"

  local -r base_url="${protocol}://${domain}"
  local -r path_to_articles="docker-context/files/articles"
  
  if [ ! -d "${path_to_articles}" ]; then
    echo -e "${YELLOW}[ERROR] This script must be run from the root directory${NONE}" >&2
    exit 1
  fi

  echo -e "${GREEN}[INFO] Warming up CloudFront cache for ${base_url}${NONE}"

  local -ra static_pages=(
    "/"
    "/blog"
    "/profile"
  )
  for page in "${static_pages[@]}"; do
    local url="${base_url}${page}"
    echo -e "${BLUE}[INFO] Requesting ${url}${NONE}"
    curl -s -o /dev/null -w "Status: %{http_code}\n" "${url}" || echo -e "${YELLOW}[WARNING] Failed to request ${url}${NONE}"
  done

  for article_file in "${path_to_articles}"/*.md; do
    if [ -f "${article_file}" ]; then
      local slug
      slug=$(basename "${article_file}" .md)
      
      if [[ "${slug}" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
        local url="${base_url}/blog/${slug}"
        echo -e "${BLUE}[INFO] Requesting ${url}${NONE}"
        curl -s -o /dev/null -w "Status: %{http_code}\n" "${url}" || echo -e "${YELLOW}[WARNING] Failed to request ${url}${NONE}"
      else
        echo -e "${YELLOW}[WARNING] Skipping invalid slug ${slug}${NONE}"
      fi
    fi
  done

  echo -e "${GREEN}[DONE] Completed CloudFront cache warming up${NONE}"
}

main "$@"
