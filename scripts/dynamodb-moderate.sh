#!/bin/bash
#
# Moderate the comments that /api/comments stores in DynamoDB: list the pending
# ones, approve or reject one, or reply to one as the author.
#
# Every new comment is stored as "pending" and only this script changes that,
# so nothing reaches readers without passing through here. CloudFront caches a
# post's comments for 60 seconds, so a change shows within a minute.

set -o errexit

readonly BLUE="\033[0;34m"
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly NONE="\033[0m"

readonly TABLE="siegesailor-website-production-comments"
readonly PATTERN_POST="^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
readonly PATTERN_ID="^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9:.]+Z#[0-9a-f]{4}$"

#######################################
# Quote text as a JSON string.
# Arguments:
#   $1 - Any text
# Outputs:
#   The JSON string, quotes included
#######################################
to_json_string() {
  local value="${1//\\/\\\\}"
  value="${value//\"/\\\"}"
  value="${value//$'\r'/}"
  value="${value//$'\n'/\\n}"
  value="${value//$'\t'/\\t}"
  printf '"%s"' "${value}"
}

#######################################
# Exit unless a post and a comment ID have the shape the API writes, since both
# are spliced into the key.
# Arguments:
#   $1 - Post date
#   $2 - Comment ID
#######################################
require_key() {
  if [[ ! "$1" =~ ${PATTERN_POST} ]] || [[ ! "$2" =~ ${PATTERN_ID} ]]; then
    echo -e "${YELLOW}[ERROR] Expected a YYYY-MM-DD post and a comment ID from \"list\", got \"$1\" and \"$2\"${NONE}" >&2
    exit 1
  fi
}

#######################################
# Print every pending comment.
# Globals:
#   TABLE
# Outputs:
#   One comment per line: post, ID, name, parent ID, body
#######################################
list_pending() {
  aws dynamodb scan --no-cli-pager \
    --table-name "${TABLE}" \
    --filter-expression "#status = :pending" \
    --expression-attribute-names '{"#status":"status"}' \
    --expression-attribute-values '{":pending":{"S":"pending"}}' \
    --query "Items[].[post.S, id.S, name.S, parentId.S, body.S]" \
    --output text
}

#######################################
# Set the status of an existing comment.
# Globals:
#   TABLE
# Arguments:
#   $1 - Post date
#   $2 - Comment ID
#   $3 - Status: approved or rejected
#######################################
set_status() {
  require_key "$1" "$2"
  aws dynamodb update-item --no-cli-pager \
    --table-name "${TABLE}" \
    --key "{\"post\":{\"S\":\"$1\"},\"id\":{\"S\":\"$2\"}}" \
    --update-expression "SET #status = :status" \
    --condition-expression "attribute_exists(id)" \
    --expression-attribute-names '{"#status":"status"}' \
    --expression-attribute-values "{\":status\":{\"S\":\"$3\"}}"
}

#######################################
# Approve a top-level comment and publish an author reply under it.
# Globals:
#   TABLE
# Arguments:
#   $1 - Post date
#   $2 - ID of the top-level comment being answered
#   $3 - Reply text
#   $4 - Author name
#######################################
reply() {
  require_key "$1" "$2"
  if [ -z "$3" ]; then
    echo -e "${YELLOW}[ERROR] Write the reply as the third argument${NONE}" >&2
    exit 1
  fi

  # The site shows one reply level, so an answer to a reply would never render.
  local parent
  parent="$(aws dynamodb get-item --no-cli-pager \
    --table-name "${TABLE}" \
    --key "{\"post\":{\"S\":\"$1\"},\"id\":{\"S\":\"$2\"}}" \
    --query "Item.parentId.S" \
    --output text)"
  if [ "${parent}" != "None" ]; then
    echo -e "${YELLOW}[ERROR] $2 is itself a reply; answer ${parent} instead${NONE}" >&2
    exit 1
  fi

  set_status "$1" "$2" "approved"

  local -r created_at="$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")"
  local suffix
  printf -v suffix "%04x" "${RANDOM}"
  aws dynamodb put-item --no-cli-pager \
    --table-name "${TABLE}" \
    --condition-expression "attribute_not_exists(id)" \
    --item "{
      \"post\": {\"S\": \"$1\"},
      \"id\": {\"S\": \"${created_at}#${suffix}\"},
      \"parentId\": {\"S\": \"$2\"},
      \"name\": {\"S\": $(to_json_string "$4")},
      \"body\": {\"S\": $(to_json_string "$3")},
      \"status\": {\"S\": \"approved\"},
      \"isAuthor\": {\"BOOL\": true},
      \"createdAt\": {\"S\": \"${created_at}\"}
    }"
}

#######################################
# Main function.
# Globals:
#   TABLE
# Arguments:
#   $1 - Action: list, approve, reject, or reply (default: list)
#   $2 - Post date, for every action but list
#   $3 - Comment ID, for every action but list
#   $4 - Reply text, for reply
#   $5 - Author name, for reply (default: Jin Yu Zhang)
# Outputs:
#   The pending comments for list; a confirmation otherwise
#######################################
main() {
  # Only the root has a lockfile; source/ has a package.json of its own.
  if [ ! -f "package-lock.json" ]; then
    echo -e "${YELLOW}[ERROR] This script must be run from the root directory${NONE}" >&2
    exit 1
  fi

  local -r action="${1:-list}"

  case "${action}" in
    list)
      echo -e "${GREEN}[INFO] Pending comments in ${TABLE}${NONE}"
      list_pending
      ;;
    approve)
      set_status "$2" "$3" "approved"
      echo -e "${BLUE}[DONE] Approved $3 on $2${NONE}"
      ;;
    reject)
      set_status "$2" "$3" "rejected"
      echo -e "${BLUE}[DONE] Rejected $3 on $2${NONE}"
      ;;
    reply)
      reply "$2" "$3" "$4" "${5:-Jin Yu Zhang}"
      echo -e "${BLUE}[DONE] Approved $3 and replied to it on $2${NONE}"
      ;;
    *)
      echo -e "${YELLOW}[ERROR] Unknown action \"${action}\"; use list, approve, reject, or reply${NONE}" >&2
      exit 1
      ;;
  esac
}

main "$@"
