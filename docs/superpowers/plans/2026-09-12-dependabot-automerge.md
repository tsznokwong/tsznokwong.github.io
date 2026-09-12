# Dependabot Auto-merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dependabot patch/minor updates auto-merge after unit tests and a browser smoke test pass, deploys are verified against the live site, and failures open an issue.

**Architecture:** A pure TypeScript eligibility function decides merge eligibility from `dependabot/fetch-metadata` output; a Playwright suite runs pre-merge against `vite preview` and post-deploy against GitHub Pages; a GitHub App token enables auto-merge so the merge push triggers deploy. Delivered as two stacked PRs so the auto-merge workflow cannot go live before the ruleset and secrets exist.

**Tech Stack:** Node 24 (native TS type stripping), Vitest 4, Playwright 1.63 (Chromium), GitHub Actions, actionlint 1.7.12.

**Spec:** `docs/superpowers/specs/2026-09-12-dependabot-automerge-design.md`

## Global Constraints

- Node version comes only from `.nvmrc` (`24`); workflows use `node-version-file: .nvmrc`.
- Third-party actions added by this plan are pinned by commit SHA with the tag in a comment: `dependabot/fetch-metadata@25dd0e34f4fe68f24cc83900b1fe3fe149efef98 # v3.1.0`, `actions/create-github-app-token@bcd2ba49218906704ab6c1aa796996da409d3eb1 # v3.2.0`. Existing `actions/*@v4` references stay as-is (out of scope).
- Auto-merge workflow uses `pull_request`, never `pull_request_target`, and never runs `npm ci` (no dependency code executes alongside the App secret).
- Secret names: `AUTOMERGE_APP_ID`, `AUTOMERGE_APP_PRIVATE_KEY` (Dependabot secrets).
- Issue label: `deploy-smoke-failure`.
- Required check job names: `test`, `smoke`.
- Conventional Commits; every commit ends with the session attribution trailers.
- PR 1 branch `ci/dependabot-automerge`; PR 2 branch `ci/dependabot-automerge-enable` based on PR 1. Both PRs open as drafts.

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `scripts/automerge-eligible.ts` | Eligibility rules + CLI writing `$GITHUB_OUTPUT` | 1 |
| `scripts/automerge-eligible.test.ts` | Table tests for rules, parser, CLI | 1 |
| `tsconfig.json` | Typecheck `scripts`, `e2e`, `playwright.config.ts` | 1, 2 |
| `e2e/smoke.spec.ts` | Per-route browser smoke + build SHA assertion | 2 |
| `playwright.config.ts` | Local preview server vs `SMOKE_BASE_URL` | 2 |
| `index.html` | `build-sha` meta tag | 2 |
| `vite.config.ts` | `VITE_BUILD_SHA` default; exclude `e2e/**` from Vitest | 2 |
| `.gitignore` | Playwright output dirs | 2 |
| `.nvmrc` | Node version source of truth | 3 |
| `.github/workflows/test.yml` | `test` (+audit signatures, actionlint) and `smoke` jobs | 3 |
| `.github/workflows/post-deploy-verify.yml` | Wait for live SHA, smoke live site, open issue | 4 |
| `.github/workflows/deploy.yaml` | Concurrency, build SHA, call verify | 4 |
| `.github/dependabot.yml` | Cooldown, coupled groups | 6 |
| `.github/workflows/dependabot-automerge.yml` | Eligibility → App token → `gh pr merge --auto --squash` | 6 |

---

### Task 1: Eligibility rules

**Files:**
- Create: `scripts/automerge-eligible.ts`
- Test: `scripts/automerge-eligible.test.ts`
- Modify: `tsconfig.json` (`include`)

**Interfaces:**
- Produces:
  - `type UpdatedDependency = { dependencyName: string; updateType: string; prevVersion: string; newVersion: string }`
  - `type Evaluation = { eligible: boolean; reasons: string[] }`
  - `evaluate(deps: UpdatedDependency[]): Evaluation`
  - `parseDependencies(json: string | undefined): UpdatedDependency[]` (throws on invalid/non-array)
  - CLI `node scripts/automerge-eligible.ts`: reads `UPDATED_DEPENDENCIES_JSON`, appends `eligible=true|false` to `$GITHUB_OUTPUT`, exits 0.

- [ ] **Step 1: Write the failing tests**

`scripts/automerge-eligible.test.ts`:

```ts
// @vitest-environment node
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  evaluate,
  parseDependencies,
  type UpdatedDependency,
} from "./automerge-eligible";

const dep = (overrides: Partial<UpdatedDependency> = {}): UpdatedDependency => ({
  dependencyName: "vite",
  updateType: "version-update:semver-patch",
  prevVersion: "8.2.0",
  newVersion: "8.2.2",
  ...overrides,
});

describe("evaluate", () => {
  it.each([
    ["patch", dep()],
    ["minor", dep({ updateType: "version-update:semver-minor", newVersion: "8.3.0" })],
  ])("accepts a %s update", (_, update) => {
    expect(evaluate([update])).toEqual({ eligible: true, reasons: [] });
  });

  it.each([
    ["major update", dep({ updateType: "version-update:semver-major", newVersion: "9.0.0" })],
    ["missing update type", dep({ updateType: "" })],
    ["pre-release previous version", dep({ prevVersion: "9.0.0-beta.9", newVersion: "9.0.0" })],
    ["pre-release new version", dep({ newVersion: "8.3.0-rc.1" })],
    ["0.x previous version", dep({ prevVersion: "0.4.1", newVersion: "0.5.0" })],
    ["missing new version", dep({ newVersion: "" })],
  ])("rejects a %s", (_, update) => {
    const result = evaluate([update]);
    expect(result.eligible).toBe(false);
    expect(result.reasons).toEqual([expect.stringContaining("vite")]);
  });

  it("rejects an empty list", () => {
    expect(evaluate([])).toEqual({ eligible: false, reasons: ["no updated dependencies"] });
  });

  it("rejects a group when any dependency is ineligible", () => {
    const result = evaluate([
      dep({ dependencyName: "vitest", prevVersion: "4.1.11", newVersion: "4.1.12" }),
      dep({
        dependencyName: "@vitest/coverage-v8",
        updateType: "version-update:semver-major",
        prevVersion: "4.1.11",
        newVersion: "5.0.0",
      }),
    ]);
    expect(result.eligible).toBe(false);
    expect(result.reasons).toEqual([expect.stringContaining("@vitest/coverage-v8")]);
  });
});

describe("parseDependencies", () => {
  it("parses a JSON array", () => {
    expect(parseDependencies(JSON.stringify([dep()]))).toEqual([dep()]);
  });

  it.each([[undefined], [""], ["not json"], ['{"dependencyName":"vite"}']])(
    "throws for %j",
    (input) => {
      expect(() => parseDependencies(input)).toThrow();
    },
  );
});

describe("CLI", () => {
  const run = (json: string) => {
    const output = join(mkdtempSync(join(tmpdir(), "automerge-")), "output");
    const result = spawnSync(process.execPath, ["scripts/automerge-eligible.ts"], {
      env: { ...process.env, UPDATED_DEPENDENCIES_JSON: json, GITHUB_OUTPUT: output },
      encoding: "utf8",
    });
    return { status: result.status, output: readFileSync(output, "utf8") };
  };

  it("writes eligible=true for an eligible update", () => {
    expect(run(JSON.stringify([dep()]))).toEqual({ status: 0, output: "eligible=true\n" });
  });

  it("writes eligible=false and exits 0 for invalid input", () => {
    expect(run("not json")).toEqual({ status: 0, output: "eligible=false\n" });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run scripts/automerge-eligible.test.ts`
Expected: FAIL — cannot resolve `./automerge-eligible`.

- [ ] **Step 3: Implement**

`scripts/automerge-eligible.ts`:

```ts
import { appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export type UpdatedDependency = {
  dependencyName: string;
  updateType: string;
  prevVersion: string;
  newVersion: string;
};

export type Evaluation = { eligible: boolean; reasons: string[] };

const ALLOWED_UPDATE_TYPES = new Set([
  "version-update:semver-patch",
  "version-update:semver-minor",
]);

const rejectionReason = (dep: UpdatedDependency): string | undefined => {
  const name = dep.dependencyName;
  if (!ALLOWED_UPDATE_TYPES.has(dep.updateType)) {
    return `${name}: update type "${dep.updateType}" is not patch or minor`;
  }
  if (!dep.prevVersion || !dep.newVersion) {
    return `${name}: missing previous or new version`;
  }
  if (dep.prevVersion.includes("-") || dep.newVersion.includes("-")) {
    return `${name}: pre-release version ${dep.prevVersion} -> ${dep.newVersion}`;
  }
  if (dep.prevVersion.split(".")[0] === "0") {
    return `${name}: 0.x version ${dep.prevVersion}`;
  }
  return undefined;
};

export const evaluate = (deps: UpdatedDependency[]): Evaluation => {
  if (deps.length === 0) {
    return { eligible: false, reasons: ["no updated dependencies"] };
  }
  const reasons = deps
    .map(rejectionReason)
    .filter((reason): reason is string => reason !== undefined);
  return { eligible: reasons.length === 0, reasons };
};

export const parseDependencies = (json: string | undefined): UpdatedDependency[] => {
  const parsed: unknown = JSON.parse(json ?? "");
  if (!Array.isArray(parsed)) {
    throw new Error("expected a JSON array of updated dependencies");
  }
  return parsed as UpdatedDependency[];
};

const main = (): void => {
  let result: Evaluation;
  try {
    result = evaluate(parseDependencies(process.env.UPDATED_DEPENDENCIES_JSON));
  } catch (error) {
    result = { eligible: false, reasons: [`invalid UPDATED_DEPENDENCIES_JSON: ${String(error)}`] };
  }
  for (const reason of result.reasons) {
    console.log(reason);
  }
  console.log(`eligible=${result.eligible}`);
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `eligible=${result.eligible}\n`);
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
```

`tsconfig.json` include becomes `["src", "src/vite-env.d.ts", "scripts"]`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run scripts/automerge-eligible.test.ts && npx tsc`
Expected: all tests PASS; `tsc` exits 0.

- [ ] **Step 5: Commit**

```bash
git add scripts tsconfig.json
git commit -m "feat(ci): add dependabot auto-merge eligibility rules"
```

---

### Task 2: Browser smoke suite and build SHA

**Files:**
- Create: `e2e/smoke.spec.ts`, `playwright.config.ts`
- Modify: `index.html` (head), `vite.config.ts`, `tsconfig.json`, `.gitignore`, `package.json` (devDependency, `smoke` script)

**Interfaces:**
- Produces: `npm run smoke` (= `playwright test`); env `SMOKE_BASE_URL` (skip local server), `SMOKE_EXPECTED_SHA` (assert meta); build env `VITE_BUILD_SHA`. Playwright report dir `playwright-report`.

- [ ] **Step 1: Install Playwright and exclude e2e from Vitest**

```bash
npm install --save-dev @playwright/test@1.63.0
npx playwright install chromium
```

`package.json` scripts add `"smoke": "playwright test"`.

`vite.config.ts`: add `import { configDefaults } from 'vitest/config'`, `process.env.VITE_BUILD_SHA ??= 'dev'` before `defineConfig`, and `exclude: [...configDefaults.exclude, 'e2e/**']` in `test`.

`.gitignore` add `playwright-report` and `test-results`.

`tsconfig.json` include becomes `["src", "src/vite-env.d.ts", "scripts", "e2e", "playwright.config.ts"]`.

- [ ] **Step 2: Write the smoke suite and config**

`playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

const externalBaseURL = process.env.SMOKE_BASE_URL;
const localBaseURL = "http://localhost:4173";

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: externalBaseURL ?? localBaseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: { args: ["--enable-unsafe-swiftshader"] },
      },
    },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: "npm run preview -- --port 4173 --strictPort",
        url: localBaseURL,
        reuseExistingServer: !process.env.CI,
      },
});
```

`e2e/smoke.spec.ts`:

```ts
import { expect, test, type Page } from "@playwright/test";

// Network failures of third-party assets (globe textures, Firebase) and the
// GitHub Pages 404.html SPA fallback are not code regressions.
const IGNORED_CONSOLE_ERROR = /^Failed to load resource/;

const routes = [
  { path: "/", heading: "Hello world" },
  { path: "/journey", heading: "Journey Timeline" },
  { path: "/travel", heading: "Travel", canvas: true },
];

const collectErrors = (page: Page): string[] => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" && !IGNORED_CONSOLE_ERROR.test(message.text())) {
      errors.push(`console.error: ${message.text()}`);
    }
  });
  return errors;
};

for (const route of routes) {
  test(`${route.path} renders without errors`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(route.path);
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
    if (route.canvas) {
      await expect(page.locator("canvas").first()).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

test("build SHA is embedded", async ({ page }) => {
  await page.goto("/");
  const sha = await page.locator('meta[name="build-sha"]').getAttribute("content");
  expect(sha).toBeTruthy();
  expect(sha).not.toContain("%");
  if (process.env.SMOKE_EXPECTED_SHA) {
    expect(sha).toBe(process.env.SMOKE_EXPECTED_SHA);
  }
});
```

- [ ] **Step 3: Run to verify the new behaviour fails**

Run: `npm run build && npm run smoke`
Expected: route tests PASS (characterising existing behaviour); `build SHA is embedded` FAILS (meta absent → `getAttribute` times out).

- [ ] **Step 4: Implement build SHA**

`index.html`, after the description meta:

```html
    <meta name="build-sha" content="%VITE_BUILD_SHA%" />
```

- [ ] **Step 5: Run to verify all pass**

Run: `npm run build && npm run smoke && VITE_BUILD_SHA=abc123 npm run build && SMOKE_EXPECTED_SHA=abc123 npm run smoke && npm test`
Expected: all PASS.

- [ ] **Step 6: Prove route assertions catch breakage (throwaway, not committed)**

1. Add `throw new Error("smoke-break");` as the first line inside `App` in `src/containers/app/app.tsx`; `npm run build && npm run smoke` → all route tests FAIL with `pageerror: smoke-break`. Revert.
2. Replace `<Globe ... />` in `src/components/globe/globe.tsx` with `null`; rebuild + smoke → `/travel` FAILS on canvas. Revert.
3. `git diff --stat src` shows nothing.

- [ ] **Step 7: Commit**

```bash
git add e2e playwright.config.ts index.html vite.config.ts tsconfig.json .gitignore package.json package-lock.json
git commit -m "test(e2e): add playwright smoke suite and embed build sha"
```

---

### Task 3: CI — Node alignment, smoke job, signatures, actionlint

**Files:**
- Create: `.nvmrc`
- Modify: `.github/workflows/test.yml`, `.github/workflows/deploy.yaml` (setup-node only in this task)

**Interfaces:**
- Consumes: `npm run smoke`, `VITE_BUILD_SHA` (Task 2).
- Produces: required check job names `test`, `smoke`.

- [ ] **Step 1: Write `.nvmrc`**

```
24
```

- [ ] **Step 2: Replace `.github/workflows/test.yml`**

```yaml
name: Tests

on:
  push:
    branches: [development]
  pull_request:
    branches: [development]

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Verify registry signatures
        run: npm audit signatures

      - name: Lint workflows
        uses: docker://rhysd/actionlint:1.7.12
        with:
          args: -color

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          VITE_BUILD_SHA: ${{ github.sha }}

  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Chromium
        run: npx playwright install --with-deps chromium

      - name: Build
        run: npm run build
        env:
          VITE_BUILD_SHA: ${{ github.sha }}

      - name: Run smoke tests
        run: npm run smoke

      - name: Upload Playwright report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
          retention-days: 7
```

- [ ] **Step 3: In `deploy.yaml`, change setup-node `node-version: '24'` to `node-version-file: .nvmrc`.**

- [ ] **Step 4: Verify**

Run: `npm test` then push the branch and confirm both `test` and `smoke` jobs are green in the PR (actionlint runs in CI only; no global install).
Expected: PASS. Fix any actionlint findings in the touched workflows.

- [ ] **Step 5: Commit**

```bash
git add .nvmrc .github/workflows/test.yml .github/workflows/deploy.yaml
git commit -m "ci: add smoke job, signature audit, actionlint, and pin node via nvmrc"
```

---

### Task 4: Post-deploy verification and alert

**Files:**
- Create: `.github/workflows/post-deploy-verify.yml`
- Modify: `.github/workflows/deploy.yaml`

**Interfaces:**
- Consumes: `npm run smoke`, `SMOKE_BASE_URL`, `SMOKE_EXPECTED_SHA` (Task 2); `.nvmrc` (Task 3).
- Produces: reusable workflow inputs `url` (string, default `https://tsznokwong.github.io`), `expected_sha` (string, required); issue label `deploy-smoke-failure`.

- [ ] **Step 1: Create `.github/workflows/post-deploy-verify.yml`**

```yaml
name: Post-deploy verify

on:
  workflow_call:
    inputs:
      url:
        type: string
        default: https://tsznokwong.github.io
      expected_sha:
        type: string
        required: true
  workflow_dispatch:
    inputs:
      url:
        type: string
        default: https://tsznokwong.github.io
      expected_sha:
        type: string
        required: true

permissions:
  contents: read
  issues: write

jobs:
  verify:
    runs-on: ubuntu-latest
    env:
      SITE_URL: ${{ inputs.url }}
      EXPECTED_SHA: ${{ inputs.expected_sha }}
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Chromium
        run: npx playwright install --with-deps chromium

      - name: Wait for deployment to go live
        run: |
          for attempt in $(seq 1 30); do
            if curl -fsS "${SITE_URL}/?cb=${attempt}-$(date +%s)" | grep -q "name=\"build-sha\" content=\"${EXPECTED_SHA}\""; then
              echo "Live site serves ${EXPECTED_SHA}"
              exit 0
            fi
            echo "Attempt ${attempt}/30: ${EXPECTED_SHA} not live yet"
            sleep 20
          done
          echo "::error::${EXPECTED_SHA} did not go live within 10 minutes"
          exit 1

      - name: Run smoke tests against live site
        run: npm run smoke
        env:
          SMOKE_BASE_URL: ${{ inputs.url }}
          SMOKE_EXPECTED_SHA: ${{ inputs.expected_sha }}

      - name: Open or update failure issue
        if: failure()
        env:
          GH_TOKEN: ${{ github.token }}
          GH_REPO: ${{ github.repository }}
          OWNER: ${{ github.repository_owner }}
          RUN_URL: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
        run: |
          label=deploy-smoke-failure
          gh label create "$label" --color B60205 --description "Post-deploy smoke test failed" --force
          subject=$(gh api "repos/${GH_REPO}/commits/${EXPECTED_SHA}" --jq '.commit.message | split("\n")[0]' 2>/dev/null || echo "(unknown commit)")
          body=$(printf '%s\n' \
            "Post-deploy verification failed for \`${EXPECTED_SHA}\` — ${subject}" \
            "" \
            "- Site: ${SITE_URL}" \
            "- Run: ${RUN_URL}" \
            "" \
            "Roll back (see docs/runbooks/dependabot-rollback.md):" \
            "" \
            '```bash' \
            "git revert ${EXPECTED_SHA}" \
            '```')
          existing=$(gh issue list --label "$label" --state open --json number --jq '.[0].number // empty')
          if [ -n "$existing" ]; then
            gh issue comment "$existing" --body "$body"
          else
            gh issue create --title "Post-deploy smoke failed at ${EXPECTED_SHA:0:7}" --label "$label" --assignee "$OWNER" --body "$body"
          fi
```

- [ ] **Step 2: Update `.github/workflows/deploy.yaml`**

Add after `permissions`:

```yaml
concurrency:
  group: deploy
  cancel-in-progress: false

env:
  VITE_BUILD_SHA: ${{ github.sha }}
```

(`npm run deploy` rebuilds via `predeploy`, so the SHA must be workflow-level, not step-level.)

Append job:

```yaml
  verify:
    needs: deploy
    permissions:
      contents: read
      issues: write
    uses: ./.github/workflows/post-deploy-verify.yml
    with:
      expected_sha: ${{ github.sha }}
```

- [ ] **Step 3: Verify smoke against the live site locally (pre-merge)**

Run: `SMOKE_BASE_URL=https://tsznokwong.github.io npm run smoke`
Expected: route tests PASS; `build SHA is embedded` FAILS (live site predates the meta tag). This confirms the external-URL mode and the 404.html fallback handling.

Actionlint for both workflows runs in the PR's `test` job. Post-merge (workflow must exist on the default branch to dispatch):
`gh workflow run post-deploy-verify.yml -f expected_sha=0000000000000000000000000000000000000000` → times out → issue labelled `deploy-smoke-failure` opens. Recorded as a PR checklist item.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/post-deploy-verify.yml .github/workflows/deploy.yaml
git commit -m "ci: verify live deploy with smoke tests and open issue on failure"
```

---

### Task 5: PR 1

- [ ] **Step 1:** `git push -u origin ci/dependabot-automerge`
- [ ] **Step 2:** `gh pr create --draft --base development` with summary, decisions (ADR table with provenance), verification evidence, and post-merge checklist (App creation, secrets, ruleset payload awaiting confirmation, dispatch alert test).
- [ ] **Step 3:** Watch `test` and `smoke` to green; fix and push if red.

---

### Task 6: PR 2 — enable auto-merge

**Files:**
- Modify: `.github/dependabot.yml`
- Create: `.github/workflows/dependabot-automerge.yml`

**Interfaces:**
- Consumes: `node scripts/automerge-eligible.ts` output `eligible` (Task 1); secrets `AUTOMERGE_APP_ID`, `AUTOMERGE_APP_PRIVATE_KEY`; required checks `test`, `smoke`.

- [ ] **Step 1:** `git switch -c ci/dependabot-automerge-enable` (from `ci/dependabot-automerge`).

- [ ] **Step 2: Add to the npm entry in `.github/dependabot.yml`**

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

- [ ] **Step 3: Confirm `create-github-app-token@v3.2.0` input names** (`app-id` vs `client-id`) from its `action.yml` before writing the workflow.

- [ ] **Step 4: Create `.github/workflows/dependabot-automerge.yml`**

```yaml
name: Dependabot auto-merge

on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [development]

permissions:
  contents: read
  pull-requests: read

jobs:
  automerge:
    # Author AND sender: a human pushing to a Dependabot branch must not be auto-merged.
    if: github.event.pull_request.user.login == 'dependabot[bot]' && github.event.sender.login == 'dependabot[bot]'
    runs-on: ubuntu-latest
    steps:
      # No npm ci: dependency code must never run alongside the App secret.
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc

      - name: Fetch Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@25dd0e34f4fe68f24cc83900b1fe3fe149efef98 # v3.1.0

      - name: Evaluate eligibility
        id: eligibility
        env:
          UPDATED_DEPENDENCIES_JSON: ${{ steps.metadata.outputs.updated-dependencies-json }}
        run: node scripts/automerge-eligible.ts

      - name: Mint GitHub App token
        id: app-token
        if: steps.eligibility.outputs.eligible == 'true'
        uses: actions/create-github-app-token@bcd2ba49218906704ab6c1aa796996da409d3eb1 # v3.2.0
        with:
          app-id: ${{ secrets.AUTOMERGE_APP_ID }}
          private-key: ${{ secrets.AUTOMERGE_APP_PRIVATE_KEY }}

      - name: Enable auto-merge
        if: steps.eligibility.outputs.eligible == 'true'
        env:
          GH_TOKEN: ${{ steps.app-token.outputs.token }}
          PR_URL: ${{ github.event.pull_request.html_url }}
        run: gh pr merge --auto --squash "$PR_URL"
```

- [ ] **Step 5: Verify** — actionlint runs in CI on the PR; `npm test` still green.

- [ ] **Step 6: Commit, push, open draft PR** with base `ci/dependabot-automerge`, body stating: merge only after PR 1, App secrets, and ruleset are in place; post-merge E2E checklist (`@dependabot rebase` on a patch PR → merges and deploys; vitest 5 group stays open).

```bash
git add .github/dependabot.yml .github/workflows/dependabot-automerge.yml
git commit -m "ci: auto-merge eligible dependabot updates with cooldown and groups"
git push -u origin ci/dependabot-automerge-enable
```
