# 0003. GitHub App token for enabling auto-merge

Status: accepted
Date: 2026-09-12
Provenance: autonomous

## Context

Events caused by `GITHUB_TOKEN` do not start new workflow runs. The only
exceptions are `workflow_dispatch` and `repository_dispatch`, plus
`pull_request` (`opened`/`synchronize`/`reopened`) runs, which are created in
an approval-required state ([GITHUB_TOKEN docs][token-docs]). A push made with
the token is the documented example of this.

Auto-merge performs the merge as the actor who enabled it. When a workflow
enables it with `GITHUB_TOKEN`, the merge push to `development` belongs to
`github-actions[bot]`, so `deploy.yaml` (`on: push`) does not run. No trigger
setting in `deploy.yaml` can opt back in: the event is dropped before triggers
are matched. GitHub's [Dependabot auto-merge example][dependabot-docs] uses
`GITHUB_TOKEN` and does not mention this; the consequence is established by
community reports ([fetch-metadata #111][fetch-metadata-111],
[Black Marble][black-marble], [community #25812][community-25812]) rather than
GitHub documentation, and has not been reproduced in this repository.

Workflows triggered by Dependabot can read only Dependabot secrets, so the
existing `DEPLOY_KEY` PAT is not visible to them anyway.

[token-docs]: https://docs.github.com/en/actions/concepts/security/github_token
[dependabot-docs]: https://docs.github.com/en/code-security/dependabot/working-with-dependabot/automating-dependabot-with-github-actions
[fetch-metadata-111]: https://github.com/dependabot/fetch-metadata/issues/111
[black-marble]: https://blogs.blackmarble.co.uk/rfennell/github-events-not-being-triggered-for-auto-merged-dependabot-prs/
[community-25812]: https://github.com/orgs/community/discussions/25812

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
