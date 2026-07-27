#!/bin/bash
#
# Run several root npm scripts at once, so an aggregate script such as
# `npm run watch` can drive every `watch:*` target from one terminal.
#
# Job control is enabled so each child leads its own process group, which is
# what makes the cleanup reliable: killing the group reaches the `npm run`
# wrapper and the long-lived process underneath it, instead of orphaning a dev
# server or a `node --watch` when this script goes away.
#
# That also means a signal aimed at this script's own process group no longer
# reaches the children, so the trap is the only path that stops them — it has to
# cover every signal that ends this script, SIGHUP included.

set -o errexit
set -o monitor

readonly BLUE="\033[0;34m"
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly NONE="\033[0m"

declare -a PIDS=()

#######################################
# Terminate every started script.
# Globals:
#   PIDS
#######################################
terminate() {
  trap - EXIT HUP INT TERM
  local pid
  for pid in "${PIDS[@]}"; do
    kill -- "-${pid}" 2>/dev/null || true
  done
}

#######################################
# Main function.
# Arguments:
#   $@ - Root npm script names to run in parallel (at least one)
# Outputs:
#   The interleaved output of every script
#######################################
main() {
  if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}[ERROR] This script must be run from the root directory${NONE}" >&2
    exit 1
  fi

  if [ "$#" -eq 0 ]; then
    echo -e "${YELLOW}[ERROR] At least one npm script name is required${NONE}" >&2
    exit 1
  fi

  trap terminate EXIT HUP INT TERM

  local script
  for script in "$@"; do
    echo -e "${GREEN}[INFO] Starting ${script}${NONE}"
    npm run "${script}" &
    PIDS+=("$!")
  done

  echo -e "${BLUE}[INFO] Running ${#PIDS[@]} scripts; press Ctrl-C to stop all of them${NONE}"
  wait
}

main "$@"
