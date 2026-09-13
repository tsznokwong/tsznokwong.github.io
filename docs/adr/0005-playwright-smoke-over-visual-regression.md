# 0005. Playwright smoke tests over visual regression

Status: accepted
Date: 2026-09-12
Provenance: autonomous

## Context

Browser-level verification can be functional (page renders, no errors) or
visual (pixel diff against baselines).

## Decision

Functional Playwright smoke tests (per route: no page errors, no console
errors, key heading visible, globe canvas present, build SHA meta present)
over screenshot-based visual regression, because the animated WebGL globe
makes screenshots flaky and baselines need maintenance on every content
change, while the failures auto-merge most plausibly introduces are crashes.

## Consequences

- MUI style drift from minor bumps is not detected automatically. Revisit if
  that happens in practice.
- The same suite runs pre-merge (against `vite preview`) and post-deploy
  (against the live site) via `SMOKE_BASE_URL`.
