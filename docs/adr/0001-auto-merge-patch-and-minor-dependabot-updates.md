# 0001. Auto-merge patch and minor Dependabot updates for all dependencies

Status: accepted
Date: 2026-09-12
Provenance: user-directed

## Context

Dependabot opens roughly ten PRs a week against `development`, and many are
superseded before they are reviewed (#248, #249, #255, #268, #271). Every push
to `development` deploys to production via `deploy.yaml`, so "auto-merge" is
equivalent to "auto-ship".

## Decision

Auto-merge `semver-patch` and `semver-minor` updates for every dependency
(runtime and dev) over patch-only or dev-only minor scope, because the
maintenance cost of manually reviewing minor bumps outweighs the risk once a
browser smoke test gates the merge (see 0002).

Excluded regardless of update type: majors, pre-release versions on either
side, and `0.x` previous versions (minor is breaking in `0.x`). For grouped PRs
every dependency in the group must be eligible.

## Consequences

- Minor bumps of runtime deps (React, MUI, react-router) ship without human
  review; regressions invisible to tests and smoke (e.g. style drift) reach
  production and are caught by humans.
- Requires a required-checks ruleset on `development`; without one, auto-merge
  has nothing to wait for.
