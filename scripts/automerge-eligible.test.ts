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
  packageEcosystem: "npm_and_yarn",
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
    ["github_actions update", dep({ packageEcosystem: "github_actions" })],
    ["docker update", dep({ packageEcosystem: "docker" })],
    ["missing ecosystem", dep({ packageEcosystem: "" })],
  ])("rejects a %s", (_, update) => {
    const result = evaluate([update]);
    expect(result.eligible).toBe(false);
    expect(result.reasons).toEqual([expect.stringContaining("vite")]);
  });

  it("names the ecosystem when rejecting a non-npm update", () => {
    expect(evaluate([dep({ packageEcosystem: "github_actions" })]).reasons).toEqual([
      expect.stringContaining('"github_actions"'),
    ]);
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

  it("writes eligible=false for a github_actions update", () => {
    expect(run(JSON.stringify([dep({ packageEcosystem: "github_actions" })]))).toEqual({
      status: 0,
      output: "eligible=false\n",
    });
  });

  it("writes eligible=false and exits 0 for invalid input", () => {
    expect(run("not json")).toEqual({ status: 0, output: "eligible=false\n" });
  });
});
