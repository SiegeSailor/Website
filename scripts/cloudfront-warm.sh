#!/bin/bash
#
# Request every page of the deployed site so CloudFront caches it again after an
# invalidation, instead of the next real visitor paying for the origin fetch.
#
# The page list comes from the deployed sitemap, not from source/content/, so it
# always matches what is actually live. One curl serves all of them, which needs
# an --output per URL: a single --output binds to the first URL only.

set -o errexit

readonly BLUE="\033[0;34m"
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly NONE="\033[0m"

readonly MAX_CONCURRENT=10

#######################################
# List the page URLs a sitemap declares.
# Arguments:
#   $1 - Sitemap XML
# Outputs:
#   One URL per line
#######################################
list_sitemap_urls() {
  # Splitting on tags puts every <loc> on its own line; cut drops the tag name.
  printf "%s" "$1" | tr "<" "\n" | grep "^loc>" | cut -c 5-
}

#######################################
# Main function.
# Globals:
#   MAX_CONCURRENT
# Arguments:
#   $1 - Domain name (default: jinyu-zhang.com)
#   $2 - Protocol (default: https)
# Outputs:
#   The status of every page requested; exits 1 unless all of them return 200
#######################################
main() {
  if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}[ERROR] This script must be run from the root directory${NONE}" >&2
    exit 1
  fi

  local -r domain="${1:-jinyu-zhang.com}"
  local -r protocol="${2:-https}"
  local -r base_url="${protocol}://${domain}"

  echo -e "${GREEN}[INFO] Reading ${base_url}/sitemap.xml${NONE}"
  local sitemap
  sitemap="$(curl --silent --show-error --fail "${base_url}/sitemap.xml")"

  local -a urls=()
  local -a requests=()
  local url
  while IFS= read -r url; do
    urls+=("${url}")
    requests+=(--output /dev/null "${url}")
  done < <(list_sitemap_urls "${sitemap}")

  if [ "${#urls[@]}" -eq 0 ]; then
    echo -e "${YELLOW}[ERROR] No page found in ${base_url}/sitemap.xml${NONE}" >&2
    exit 1
  fi

  echo -e "${GREEN}[INFO] Requesting ${#urls[@]} pages, ${MAX_CONCURRENT} at a time${NONE}"
  local warmed=0
  local status
  while read -r status url; do
    if [ "${status}" = "200" ]; then
      echo -e "${BLUE}[INFO] ${status} ${url}${NONE}"
      warmed=$((warmed + 1))
    else
      echo -e "${YELLOW}[WARNING] ${status} ${url}${NONE}" >&2
    fi
  done < <(curl --silent --parallel --parallel-max "${MAX_CONCURRENT}" \
    --write-out "%{http_code} %{url_effective}\n" "${requests[@]}")

  if [ "${warmed}" -ne "${#urls[@]}" ]; then
    echo -e "${YELLOW}[ERROR] Warmed ${warmed} of ${#urls[@]} pages${NONE}" >&2
    exit 1
  fi

  echo -e "${GREEN}[DONE] Warmed ${warmed} pages${NONE}"
}

main "$@"
