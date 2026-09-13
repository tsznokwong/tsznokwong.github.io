#!/usr/bin/env bash
# Open, or comment on, the open deploy-smoke-failure issue.
# Env: GH_REPO OWNER RUN_URL SHA TITLE SUMMARY SITE_URL ROLLBACK (+ GH_TOKEN)
set -eo pipefail

label=deploy-smoke-failure
gh label create "$label" --color B60205 --description "Deploy or post-deploy smoke test failed" --force
# gh api prints the error body to stdout on failure, so replace rather than append.
if commit=$(gh api "repos/${GH_REPO}/commits/${SHA}" --jq '"\(.parents | length) \(.commit.message | split("\n")[0])"' 2>/dev/null); then
  parents=${commit%% *}
  subject=${commit#* }
else
  parents=""
  subject="(unknown commit)"
fi
# Merge commits (two parents) revert against the first parent, i.e. development.
case "$parents" in
  1) revert="git revert ${SHA}" ;;
  "") revert="git revert ${SHA}  # add -m 1 if this is a merge commit" ;;
  *) revert="git revert -m 1 ${SHA}" ;;
esac
lines=("${SUMMARY} \`${SHA}\` — ${subject}" "")
if [ -n "$SITE_URL" ]; then
  lines+=("- Site: ${SITE_URL}")
fi
lines+=("- Run: ${RUN_URL}")
if [ "$ROLLBACK" = "true" ]; then
  lines+=("" "Roll back (see docs/runbooks/dependabot-rollback.md):" "" '```bash' "$revert" '```')
fi
body=$(printf '%s\n' "${lines[@]}")
existing=$(gh issue list --label "$label" --state open --json number --jq '.[0].number // empty')
if [ -n "$existing" ]; then
  gh issue comment "$existing" --body "$body"
else
  gh issue create --title "${TITLE} ${SHA:0:7}" --label "$label" --assignee "$OWNER" --body "$body"
fi
