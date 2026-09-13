import { appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export type UpdatedDependency = {
  dependencyName: string;
  packageEcosystem: string;
  updateType: string;
  prevVersion: string;
  newVersion: string;
};

export type Evaluation = { eligible: boolean; reasons: string[] };

// fetch-metadata reports Dependabot's internal name, not the dependabot.yml
// spelling "npm". Actions run beside deploy secrets, so only npm merges.
const ALLOWED_ECOSYSTEM = "npm_and_yarn";

const ALLOWED_UPDATE_TYPES = new Set([
  "version-update:semver-patch",
  "version-update:semver-minor",
]);

const rejectionReason = (dep: UpdatedDependency): string | undefined => {
  const name = dep.dependencyName;
  if (dep.packageEcosystem !== ALLOWED_ECOSYSTEM) {
    return `${name}: ecosystem "${dep.packageEcosystem}" is not npm`;
  }
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
