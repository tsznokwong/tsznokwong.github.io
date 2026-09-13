// @vitest-environment node
import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const SCRIPT = fileURLToPath(new URL("../.github/actions/report-deploy-failure/report.sh", import.meta.url));
const SHA = "abc1234def5678abc1234def5678abc1234def56";

// Stands in for gh: api prints FAKE_API_STDOUT (as --jq output would be) and
// exits FAKE_API_EXIT; issue create/comment record their arguments.
const FAKE_GH = `#!/usr/bin/env bash
case "$1 $2" in
  "label create") exit 0 ;;
  "api "*) printf '%s' "$FAKE_API_STDOUT"; exit "\${FAKE_API_EXIT:-0}" ;;
  "issue list") printf '%s\\n' "\${FAKE_EXISTING_ISSUE:-}"; exit 0 ;;
  "issue create"|"issue comment")
    action=$2; shift 2; target=""; title=""; body=""
    while [ $# -gt 0 ]; do
      case "$1" in
        --body) body=$2; shift 2 ;;
        --title) title=$2; shift 2 ;;
        --label|--assignee) shift 2 ;;
        *) target=$1; shift ;;
      esac
    done
    printf 'action=%s\\ntarget=%s\\ntitle=%s\\n---\\n%s' "$action" "$target" "$title" "$body" > "$FAKE_GH_OUT"
    exit 0 ;;
esac
echo "unexpected gh $*" >&2
exit 1
`;

type Report = { status: number | null; stderr: string; action: string; target: string; title: string; body: string };

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "report-deploy-failure-"));
  writeFileSync(join(dir, "gh"), FAKE_GH);
  chmodSync(join(dir, "gh"), 0o755);
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

const report = (env: Record<string, string>): Report => {
  const out = join(dir, "issue.txt");
  const result = spawnSync("bash", [SCRIPT], {
    encoding: "utf8",
    env: {
      PATH: `${dir}:${process.env.PATH}`,
      GH_REPO: "o/r",
      OWNER: "o",
      RUN_URL: "https://run",
      SHA,
      TITLE: "Deploy failed at",
      SUMMARY: "Deploy failed for",
      SITE_URL: "",
      ROLLBACK: "false",
      FAKE_API_STDOUT: "1 chore(deps): bump x",
      FAKE_GH_OUT: out,
      ...env,
    },
  });
  const recorded = existsSync(out) ? readFileSync(out, "utf8") : "\n---\n";
  const split = recorded.indexOf("\n---\n");
  const fields = Object.fromEntries(
    recorded
      .slice(0, split)
      .split("\n")
      .filter(Boolean)
      .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]),
  );
  return {
    status: result.status,
    stderr: result.stderr,
    action: fields.action ?? "",
    target: fields.target ?? "",
    title: fields.title ?? "",
    body: recorded.slice(split + "\n---\n".length),
  };
};

describe("report-deploy-failure", () => {
  it("opens an issue with SHA, subject and run, without site or revert when rollback is off", () => {
    const r = report({});
    expect(r.status).toBe(0);
    expect(r.action).toBe("create");
    expect(r.title).toBe("Deploy failed at abc1234");
    expect(r.body).toContain(`Deploy failed for \`${SHA}\` — chore(deps): bump x`);
    expect(r.body).toContain("- Run: https://run");
    expect(r.body).not.toContain("- Site:");
    expect(r.body).not.toContain("git revert");
  });

  it("uses a plain revert for a single-parent (squash) commit", () => {
    const r = report({ ROLLBACK: "true", SITE_URL: "https://site" });
    expect(r.body).toContain("- Site: https://site");
    expect(r.body).toContain(`git revert ${SHA}\n`);
    expect(r.body).not.toContain("-m 1");
  });

  it("reverts against the first parent for a merge commit", () => {
    const r = report({ ROLLBACK: "true", FAKE_API_STDOUT: "2 Merge pull request #1 from x/y" });
    expect(r.body).toContain(`— Merge pull request #1 from x/y`);
    expect(r.body).toContain(`git revert -m 1 ${SHA}`);
  });

  it("falls back to an unknown commit without leaking the api error body", () => {
    const r = report({ ROLLBACK: "true", FAKE_API_STDOUT: '{"message":"No commit found","status":"422"}', FAKE_API_EXIT: "1" });
    expect(r.status).toBe(0);
    expect(r.body).toContain(`\`${SHA}\` — (unknown commit)`);
    expect(r.body).not.toContain("422");
    expect(r.body).toContain(`git revert ${SHA}`);
    expect(r.body).toContain("-m 1 if");
  });

  it("comments on the open alert issue instead of opening another", () => {
    const r = report({ FAKE_EXISTING_ISSUE: "42" });
    expect(r.action).toBe("comment");
    expect(r.target).toBe("42");
  });
});
