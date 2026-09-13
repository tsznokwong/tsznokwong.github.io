# 0008. Auto-merge npm updates only

Status: accepted
Date: 2026-09-13
Provenance: user-directed

## Context

Dependabot now also watches `github-actions`. The eligibility script
(ADR 0001) did not check the ecosystem, so a minor bump of a SHA-pinned action
such as `dependabot/fetch-metadata` or `actions/create-github-app-token` would
auto-merge. Those actions run in the job holding `AUTOMERGE_APP_PRIVATE_KEY`,
and `deploy.yaml` holds `DEPLOY_KEY`: a compromised action release (the
tj-actions pattern) would reach both secrets without review.

## Decision

Auto-merge only dependencies whose `packageEcosystem` is `npm_and_yarn` over
also auto-merging action patch/minor updates, because action updates are
infrequent and a single compromised one exposes the credentials that gate
merging and deploying.

`fetch-metadata` derives `packageEcosystem` from the Dependabot branch name
(`dependabot/npm_and_yarn/...`), so the value is the internal ecosystem name,
not the `dependabot.yml` spelling `npm`.

## Consequences

- `github-actions` PRs always wait for a human merge.
- A missing or unknown ecosystem is ineligible (never merge on doubt).
- Adding another ecosystem to `dependabot.yml` does not enable auto-merge for
  it until this script allows it.
