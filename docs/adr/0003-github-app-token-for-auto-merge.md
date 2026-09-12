# 0003. GitHub App token for enabling auto-merge

Status: accepted
Date: 2026-09-12
Provenance: autonomous

## Context

Events caused by `GITHUB_TOKEN` do not start new workflow runs. A PR
auto-merged via `GITHUB_TOKEN` would therefore not trigger `deploy.yaml`.
Workflows triggered by Dependabot can read only Dependabot secrets, so the
existing `DEPLOY_KEY` PAT is not visible to them anyway.

## Decision

A repo-scoped GitHub App token minted with `actions/create-github-app-token`
over `GITHUB_TOKEN` or copying the PAT into Dependabot secrets, because
`GITHUB_TOKEN` silently skips the deploy and the PAT is long-lived with push
access to every repository the owner can reach.

## Consequences

- One-time manual setup: create the App (`contents: write`,
  `pull_requests: write`), install on this repo only, add
  `AUTOMERGE_APP_CLIENT_ID` and `AUTOMERGE_APP_PRIVATE_KEY` as Dependabot
  secrets. `create-github-app-token` v3 deprecates `app-id` in favour of
  `client-id`.
- The minted token is narrowed to `permission-contents: write` and
  `permission-pull-requests: write` even if the App is later granted more.
- Merges are attributed to the App.
