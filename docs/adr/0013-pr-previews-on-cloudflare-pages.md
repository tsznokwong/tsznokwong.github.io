# 0013. PR previews on Cloudflare Pages via direct upload

Status: accepted
Date: 2026-09-22
Provenance: user-directed

## Context

Changes could only be seen live after merging, because production deploys
straight from `development`. GitHub Pages serves one site per repository;
its PR-preview support in `actions/deploy-pages` is not publicly available.

Previews in a subfolder of the `main` branch (`/pr-preview/pr-N/`) would be
wiped by `gh-pages` on every production deploy, and would need a per-PR base
path threaded through `vite.config.ts`, the router, and the per-route
link-preview URLs (ADR 0010).

## Decision

A separate preview host over subfolders on GitHub Pages, because each PR gets
its own hostname served from `/`, so the app needs no change. Production stays
on GitHub Pages.

Cloudflare Pages over Netlify or Vercel, because the site already uses
Cloudflare (ADR 0012). Autonomous.

Direct upload from GitHub Actions over Cloudflare's Git integration, because
the build stays in CI with the same Node version and build SHA as the other
workflows. Chosen by the user.

Build and deploy as two jobs over one, because `npm ci` runs the PR's
dependency code, and `dependabot-automerge.yml` already follows the rule
that dependency code never runs alongside a secret. The deploy job gets the Cloudflare token on a fresh
runner and only uploads the built files. Chosen by the user.

Dependabot secrets over `pull_request_target`, because Dependabot-triggered
runs read the Dependabot secret store, so the same workflow previews
Dependabot PRs. `pull_request_target` would hand secrets to a run that checks
out untrusted code.

Deleting every deployment of a closed PR's branch over only its latest,
because each push leaves its own deployment reachable by its hash URL. All
pages are listed before any delete, so deletion cannot shift unread
deployments onto pages already read. Chosen by the user.

One shared `preview` GitHub environment, with deployments created through
the API with `auto_inactive: false`, over the workflow `environment:` key.
With the key, each PR's deploy marks every other PR's deployment inactive,
so only the latest PR keeps a live button. One environment per PR would avoid
that, but environments pile up in Settings, and deleting them needs a token
with Administration: write. Instead the script retires a PR's own older
deployments on each push, and all of them on close. Chosen by the user.

`wrangler-action` v4.0.0 and wrangler 4.132.0, over their newest releases,
because the newest were hours old; this follows ADR 0006's cooldown.
Autonomous.

## Consequences

- Needs a Cloudflare Pages project `tsznokwong-preview`, plus
  `CLOUDFLARE_API_TOKEN` (Cloudflare Pages: Edit) and `CLOUDFLARE_ACCOUNT_ID`
  in both the Actions and Dependabot secret stores. Without them the deploy
  job fails, but the build job still runs.
- Each PR comments `https://pr-N.tsznokwong-preview.pages.dev`, updated on
  every push.
- Fork PRs build but skip the deploy, because they get no secrets.
- Previews use the production link-preview URLs and Cloudflare analytics
  token, so previews count as visits unless the analytics site is restricted
  to the production hostname.
- Dependabot bumps the action's SHA, but not `wranglerVersion`; that needs a
  manual bump.
- Closing a PR (merged or not) deletes every deployment of its `pr-N`
  branch, one per push, via `scripts/cleanup-preview.ts`, and marks its GitHub
  deployments inactive. A reopened PR deploys again.
- Each PR shows a "View deployment" button, alongside the comment.
- The deploy and cleanup jobs check out the PR head's `scripts/`, which run
  with the tokens. That adds no exposure: on `pull_request` the workflow file
  itself comes from the PR. They must stay dependency-free.
