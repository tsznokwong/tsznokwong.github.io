# 0006. Dependabot cooldown and groups for coupled packages only

Status: accepted
Date: 2026-09-12
Provenance: autonomous

## Context

Auto-merging releases on the day they are published is the path by which a
compromised package reaches production. Some packages must move together
(`react`/`react-dom`, `vitest`/`@vitest/coverage-v8`) and fail CI when bumped
separately (#273, #275).

## Decision

Cooldown of 3 days (patch), 7 days (minor), 14 days (major) over no cooldown,
because malicious or broken releases are typically yanked within days and the
delay also removes superseded-patch churn.

Group only coupled packages over grouping all updates weekly, because
ungrouped PRs give one package per merge and a precise revert, and one bad
package cannot block unrelated updates.

## Consequences

- Updates arrive up to a week later than today.
- A group containing a major is treated as ineligible as a whole.
