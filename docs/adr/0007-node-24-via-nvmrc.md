# 0007. Node 24 pinned via .nvmrc for all workflows

Status: accepted
Date: 2026-09-12
Provenance: autonomous

## Context

`test.yml` ran Node 25 while `deploy.yaml` ran Node 24, so CI verified a
different runtime than the one that built production. Node 25 is a non-LTS
line that reached end-of-life in June 2026.

## Decision

A single `.nvmrc` containing `24`, consumed via `node-version-file` in every
workflow, over per-workflow versions, because the pre-merge smoke test is only
meaningful if it exercises the same runtime that deploys, and 24 is LTS.

## Consequences

- Moving to Node 26 LTS later is a one-line change.
- `scripts/automerge-eligible.ts` relies on Node's native type stripping
  (default since 23.6 / 22.18).
