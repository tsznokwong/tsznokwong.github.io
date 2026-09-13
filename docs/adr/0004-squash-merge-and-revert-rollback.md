# 0004. Squash merge and revert on development as rollback

Status: accepted
Date: 2026-09-12
Provenance: autonomous

## Context

Production is the `main` branch written by `gh-pages` from builds of
`development`. A bad dependency bump needs a fast, non-destructive rollback.

## Decision

Auto-merge with `--squash` and roll back with `git revert <sha>` on
`development` over merge commits and over resetting `main` to a previous
deploy commit, because a squash commit has one parent (plain revert, no `-m`),
and resetting `main` is a force-push that leaves `development` broken so the
next deploy reintroduces the bug.

## Consequences

- Dependabot PR history lands as one commit per update.
- Merge commits stay allowed for other PRs (user-directed, 2026-09-13):
  keeping the merge-commit option over enforcing squash-only in the
  `development-gate` ruleset, at the owner's request. Those commits need
  `git revert -m 1 <sha>`, so the alert issue checks the parent count and
  prints the matching command, and the runbook lists both.
- A reverted version must also be added to `ignore` in `dependabot.yml`, or
  Dependabot reproposes it.
