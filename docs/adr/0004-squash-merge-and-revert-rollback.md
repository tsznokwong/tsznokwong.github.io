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
- A reverted version must also be added to `ignore` in `dependabot.yml`, or
  Dependabot reproposes it.
