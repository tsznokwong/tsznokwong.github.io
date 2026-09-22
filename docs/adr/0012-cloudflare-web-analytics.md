# 0012. Cloudflare Web Analytics over Firebase Analytics

Status: accepted
Date: 2026-09-22
Provenance: user-directed

## Context

`index.html` loaded Firebase JS SDK 7.15.5 (2020) from gstatic.com as two
classic blocking scripts before the app, and `firebase.analytics()` ran
Google Analytics 4. Nothing sent custom events; only page views were used.
GA4 sets `_ga` cookies, which UK PECR allows only after opt-in consent, and
the site had no consent mechanism. The app could not start until both
Firebase scripts had downloaded.

## Decision

Cloudflare Web Analytics over GA4 with a consent banner, because it sets no
cookies, so it needs no banner, and a page-view count with top pages and
referrers is all a personal journal needs. Chosen by the user.

Cloudflare's JS snippet over its automatic setup, because the site is served
by GitHub Pages, not proxied through Cloudflare.

Keep the snippet as Cloudflare issues it, a `type="module"` script, over
rewriting it as `defer`, because module scripts are already deferred.

Commit the site token to `index.html` over injecting it at build time,
because the token is public by design: every page serves it.

Smoke tests block the beacon over letting it load, because the post-deploy
smoke run against the live site would otherwise count as visits; blocking it
also proves pages render when an ad blocker drops analytics.

## Consequences

- No cookies, no consent banner, and no third-party script on the app's
  critical path.
- GA4 history is not migrated. The Firebase project keeps it until deleted
  by hand.
- The site now depends on Cloudflare for analytics; if the beacon fails, the
  site still works and only analytics stops.
- In-app navigation is counted through the beacon's history tracking, which
  is on by default; it can only be verified on the live site, because the
  beacon sends nothing from localhost.
