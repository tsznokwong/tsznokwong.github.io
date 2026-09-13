# 0002. Browser smoke tests and post-deploy alert as the safety net

Status: accepted
Date: 2026-09-12
Provenance: user-directed

## Context

Existing checks are 12 jsdom component tests plus `tsc && vite build`. They
cannot see runtime failures that only occur in a real browser: ESM/CJS or peer
mismatches, WebGL (`react-globe.gl`), or uncaught exceptions during render.

## Decision

Pre-merge Playwright smoke test as a required check plus a post-deploy smoke
run against the live site that opens a GitHub issue on failure, over gate-only
(no browser coverage) or a closed-loop auto-revert, because it catches most
runtime breakage for little machinery, while auto-revert needs author
filtering, a push-capable token, and an unverified Dependabot ignore flow to
protect a site where brief breakage is cheap.

## Consequences

- Rollback stays manual: `git revert <sha>` on `development` (see
  `docs/runbooks/dependabot-rollback.md`).
- CI gains ~1–2 minutes and a `@playwright/test` dev dependency.
- The issue is the only notification for App-merged failures, because GitHub
  sends run-failure email to the triggering actor, which is the App.
