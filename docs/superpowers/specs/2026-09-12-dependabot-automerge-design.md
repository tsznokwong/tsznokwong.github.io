# Dependabot auto-merge with browser smoke gate — design

Date: 2026-09-12
Status: approved in brainstorming session

## Goal

Dependabot patch and minor updates merge and deploy without human action,
gated by CI that exercises the built site in a real browser, with a visible
alert and a documented one-command rollback if a deploy breaks production.

## Constraints discovered

- Every push to `development` deploys to production (`deploy.yaml` →
  `gh-pages` → `main`). Merge == ship.
- `development` has no active branch protection; both rulesets (`Protected`,
  `default`) are `disabled`. `gh pr merge --auto` waits only on *required*
  checks.
- Events caused by `GITHUB_TOKEN` do not start workflow runs, so a
  `GITHUB_TOKEN` merge would not deploy. The rule is documented; its
  application to auto-merge rests on community reports. Sources in
  [ADR 0003](../../adr/0003-github-app-token-for-auto-merge.md).
- Dependabot-triggered workflows read only Dependabot secrets.
- `test.yml` used Node 25, `deploy.yaml` Node 24.
- Tests are jsdom-only; `react-globe.gl` is mocked in unit tests.

## Decisions

| ADR | Decision | Provenance |
|---|---|---|
| [0001](../../adr/0001-auto-merge-patch-and-minor-dependabot-updates.md) | Patch + minor, all deps | user-directed |
| [0002](../../adr/0002-browser-smoke-and-post-deploy-alert.md) | Smoke + post-deploy alert | user-directed |
| [0003](../../adr/0003-github-app-token-for-auto-merge.md) | GitHub App token | autonomous |
| [0004](../../adr/0004-squash-merge-and-revert-rollback.md) | Squash + revert rollback | autonomous |
| [0005](../../adr/0005-playwright-smoke-over-visual-regression.md) | Playwright smoke, no visual regression | autonomous |
| [0006](../../adr/0006-dependabot-cooldown-and-coupled-groups.md) | Cooldown + coupled groups | autonomous |
| [0007](../../adr/0007-node-24-via-nvmrc.md) | Node 24 via `.nvmrc` | autonomous |

Further autonomous decisions made while writing this spec:

- **Eligibility reads `updated-dependencies-json`** over the scalar
  `update-type`/`previous-version`/`new-version` outputs, because grouped PRs
  carry several dependencies and every one must pass.
- **`console.error` lines starting with `Failed to load resource` are ignored**
  by the smoke test over failing on them, because they are network fetches of
  third-party assets (unpkg globe textures, Firebase) that would make CI flaky
  without indicating a code regression. `pageerror` (uncaught exceptions)
  always fails.
- **Workflow-level `concurrency: deploy` (no cancel-in-progress)** on
  `deploy.yaml` over parallel deploys, because two fast merges would otherwise
  race and the older run's verify would never observe its SHA, raising a false
  alert.
- **Two stacked PRs** over one PR, because the auto-merge workflow must not be
  live before the ruleset and App secrets exist.

## Components

### 1. Eligibility script — `scripts/automerge-eligible.ts`

Pure function plus a thin CLI.

```ts
type UpdatedDependency = {
  dependencyName: string;
  updateType: string;      // "version-update:semver-patch" | "...-minor" | "...-major"
  prevVersion: string;
  newVersion: string;
};
export function evaluate(deps: UpdatedDependency[]): { eligible: boolean; reasons: string[] };
```

Eligible iff the list is non-empty and, for every dependency:

- `updateType` is `version-update:semver-patch` or `version-update:semver-minor`;
- `prevVersion` and `newVersion` are non-empty and contain no `-`;
- the major component of `prevVersion` is not `0`.

`reasons` lists one human-readable string per failing dependency. CLI reads
`UPDATED_DEPENDENCIES_JSON`, prints reasons, appends `eligible=true|false` to
`$GITHUB_OUTPUT`. Invalid JSON → not eligible, exit 0 (never merge on doubt,
never fail the PR's checks for it).

Run with `node scripts/automerge-eligible.ts` (native type stripping; only
erasable TS syntax). Tested by `scripts/automerge-eligible.test.ts` under
Vitest.

### 2. Smoke suite — `e2e/smoke.spec.ts`, `playwright.config.ts`

- `baseURL` = `SMOKE_BASE_URL` if set; otherwise `http://localhost:4173` with
  `webServer: npm run preview -- --port 4173 --strictPort`.
- Chromium only; launch args include `--enable-unsafe-swiftshader` if WebGL
  needs it (verify first).
- For each route `/` (h1 contains "Hello world"), `/journey` ("Journey
  Timeline"), `/travel` ("Travel"):
  - collect `pageerror` and `console` `error` events (minus the
    `Failed to load resource` exclusion);
  - navigate, assert the h1 is visible;
  - on `/travel`, assert a `canvas` is visible;
  - assert no collected errors.
- `meta[name="build-sha"]` content is non-empty and not a raw `%...%`
  placeholder; if `SMOKE_EXPECTED_SHA` is set, it equals it.
- `vite.config.ts` `test.exclude` adds `e2e/**`; Vitest default include would
  otherwise pick up `*.spec.ts`.

### 3. Build SHA

`index.html` gains `<meta name="build-sha" content="%VITE_BUILD_SHA%" />`.
`vite.config.ts` defaults `process.env.VITE_BUILD_SHA` to `dev` when unset.
CI build steps set `VITE_BUILD_SHA: ${{ github.sha }}`.

### 4. `test.yml`

- All Node setup uses `node-version-file: .nvmrc`.
- `test` job adds `npm audit signatures` and `actionlint`
  (`docker://rhysd/actionlint:1.7.12`).
- New `smoke` job: `npm ci` → `npx playwright install --with-deps chromium` →
  `npm run build` (with `VITE_BUILD_SHA`) → `npx playwright test`; uploads the
  Playwright report on failure.

### 5. `post-deploy-verify.yml` (reusable)

Triggers: `workflow_call` and `workflow_dispatch`, inputs `url` (default
`https://tsznokwong.github.io`) and `expected_sha` (required).
Permissions: `contents: read`, `issues: write`.

1. Poll `curl -fsS "$url/?cb=<random>"` every 20 s for up to 10 min until the
   HTML contains `content="<expected_sha>"`; timeout fails the job.
2. Run the smoke suite with `SMOKE_BASE_URL` and `SMOKE_EXPECTED_SHA`.
3. `if: failure()`: ensure label `deploy-smoke-failure` exists; if an open
   issue carries it, comment; else create one assigned to
   `github.repository_owner`. Body: SHA, commit subject, run URL,
   `git revert <sha>` and a link to the runbook.

### 6. `deploy.yaml`

- `node-version-file: .nvmrc`; build step sets `VITE_BUILD_SHA`.
- `concurrency: { group: deploy, cancel-in-progress: false }`.
- New job `verify` (`needs: deploy`) → `uses: ./.github/workflows/post-deploy-verify.yml`
  with `expected_sha: ${{ github.sha }}`. Reusable-workflow runs appear as
  the `verify / verify` job inside the Deployment run, not in the Post-deploy
  verify workflow's run list (that list shows only manual dispatches).
- New job `notify` (`needs: deploy`, `if: failure()`, `issues: write`): opens
  or comments on the same `deploy-smoke-failure` issue, without revert
  instructions because production still serves the previous version.
  Autonomous decisions:
  - **A separate `notify` job over relying on Actions failure email**, because
    `verify` is skipped when `deploy` fails, and the email for an App-made
    merge goes to the App instead of the owner, so an auto-merged break would
    go unnoticed.
  - **A shared composite action `.github/actions/report-deploy-failure` over
    copying the issue script into `deploy.yaml`**, because the #280 leak fix
    would otherwise have to be applied twice and could drift.
  - **One `deploy-smoke-failure` label over a separate deploy-failure label**,
    because either failure needs the same triage from the owner and one open
    issue collects them all.

### 7. `.github/dependabot.yml` (PR 2)

Add under the npm entry:

```yaml
cooldown:
  semver-patch-days: 3
  semver-minor-days: 7
  semver-major-days: 14
groups:
  react:
    patterns: ["react", "react-dom", "@types/react", "@types/react-dom"]
  vitest:
    patterns: ["vitest", "@vitest/*"]
```

### 8. `dependabot-automerge.yml` (PR 2)

- `on: pull_request` (`opened`, `synchronize`, `reopened`), branches
  `development`. Never `pull_request_target`.
- Job `if`: `github.event.pull_request.user.login == 'dependabot[bot]' &&
  github.event.sender.login == 'dependabot[bot]'`.
- Permissions: `contents: read`, `pull-requests: read`.
- Steps: checkout → setup-node (`.nvmrc`) →
  `dependabot/fetch-metadata@25dd0e34f4fe68f24cc83900b1fe3fe149efef98 # v3.1.0` →
  eligibility script → if eligible:
  `actions/create-github-app-token@bcd2ba49218906704ab6c1aa796996da409d3eb1 # v3.2.0`
  with `client-id: AUTOMERGE_APP_CLIENT_ID`, `private-key: AUTOMERGE_APP_PRIVATE_KEY`,
  `permission-contents: write`, `permission-pull-requests: write` →
  `gh pr merge --auto --squash "$PR_URL"` with the App token.

### 9. Repository settings (manual / `gh api`, after PR 1 merges)

- GitHub App: `contents: write`, `pull_requests: write`, installed on this
  repo only; `AUTOMERGE_APP_CLIENT_ID` and `AUTOMERGE_APP_PRIVATE_KEY` as
  Dependabot secrets.
- New active ruleset `development-gate` on `~DEFAULT_BRANCH`: pull request
  required (0 approvals), required status checks `test` and `smoke` (strict
  off), deletion and non-fast-forward blocked, no bypass actors. Applied only
  after owner confirms the payload. Proposal to delete the redundant disabled
  `default` ruleset requires owner confirmation.

### 10. Runbook — `docs/runbooks/dependabot-rollback.md`

## Rollout

1. PR 1 (`ci/dependabot-automerge` → `development`): components 1–6, 10,
   `.nvmrc`, ADRs, this spec. Owner merges.
2. Owner creates App + Dependabot secrets.
3. Ruleset applied after payload confirmation.
4. PR 2 (`ci/dependabot-automerge-enable`, stacked on PR 1): components 7–8.
5. End-to-end verification below.

## Verification

- `npm test` includes eligibility table tests (written failing first).
- `npx playwright test` passes locally against `vite preview`; each assertion
  observed failing against a throwaway break (throw in `App`, removed globe,
  missing meta).
- `actionlint` passes in CI.
- `post-deploy-verify.yml` dispatched with a bogus `expected_sha` opens a
  `deploy-smoke-failure` issue; dispatched with the current deployed SHA it
  passes (after PR 1 deploys).
- After PR 2: `@dependabot rebase` on a patch PR → auto-merge enabled, merged
  after checks, deploy + verify pass. A major PR (vitest 5 group) stays open.

## Out of scope

- `github-actions` Dependabot ecosystem / action version bumps.
- Duplicate `typescript` entry; `@types/*` in `dependencies`.
- Visual regression; automatic revert.
