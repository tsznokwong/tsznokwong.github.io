// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Dependabot cannot read .nvmrc, so this guards the types against drifting
// to a Node major the runtime does not have.
describe("@types/node", () => {
  it("matches the Node major pinned in .nvmrc", () => {
    const runtimeMajor = readFileSync(".nvmrc", "utf8").trim().split(".")[0];
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    const range: string = pkg.dependencies?.["@types/node"] ?? pkg.devDependencies?.["@types/node"];
    expect(range.match(/\d+/)?.[0]).toBe(runtimeMajor);
  });
});
