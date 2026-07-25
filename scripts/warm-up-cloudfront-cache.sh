#!/bin/bash
#
# Warm up CloudFront cache by making requests to all static pages and articles.

set -o errexit

readonly BLUE="\033[0;34m"
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly NONE="\033[0m"

readonly MAX_CONCURRENT=10

#######################################
# Make async HTTP request.
# Arguments:
#   $1 - URL to request
# Outputs:
#   HTTP status code or error message
#######################################
request_url() {
  local -r url="$1"
  local status
  
  echo -e "${BLUE}[INFO] Requesting ${url}${NONE}"
  status=$(curl -s -o /dev/null -w "%{http_code}" "${url}" 2>&1)

  if [ "$status" != "200" ]; then
    echo -e "${YELLOW}[WARNING] Failed to request ${url} with status ${status}${NONE}" >&2
    return 1
  fi
}

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
  local -r path_to_articles="content/articles"
  
  if [ ! -d "${path_to_articles}" ]; then
    echo -e "${YELLOW}[ERROR] This script must be run from the root directory${NONE}" >&2
    exit 1
  fi

  echo -e "${GREEN}[INFO] Warming up CloudFront cache for ${base_url}${NONE}"

  local -a urls=()
  
  local -ra static_pages=("/" "/about")
  for page in "${static_pages[@]}"; do
    urls+=("${base_url}${page}")
  done

  for article_file in "${path_to_articles}"/*.md; do
    if [ -f "${article_file}" ]; then
      local slug
      slug=$(basename "${article_file}" .md)
      
      if [[ "${slug}" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
        urls+=("${base_url}/blog/${slug}")
      else
        echo -e "${YELLOW}[WARNING] Skipping invalid slug ${slug}${NONE}"
      fi
    fi
  done

  local count=0
  local -a pids=()
  
  for url in "${urls[@]}"; do
    request_url "${url}" &
    pids+=($!)
    ((count++))
    
    if (( count >= MAX_CONCURRENT )); then
      for pid in "${pids[@]}"; do
        wait "${pid}" 2>/dev/null || true
      done
      pids=()
      count=0
    fi
  done
  
  for pid in "${pids[@]}"; do
    wait "${pid}" 2>/dev/null || true
  done

  echo -e "${GREEN}[DONE] Completed CloudFront cache warming up${NONE}"
}

main "$@"
