import { pathToFileURL } from "node:url";

import { apiUrl } from "./api-url.ts";

// `path` is relative to the repository's deployments endpoint. Throws on a
// non-2xx response.
export type GitHubRequest = (
  method: "GET" | "POST",
  path: string,
  body?: Record<string, unknown>,
) => Promise<unknown>;

export type PreviewRecord = { sha: string; pr: number; url: string; logUrl: string };

type Deployment = { id: number; payload?: { pr?: number } };

const ENVIRONMENT = "preview";
const PER_PAGE = 100;

const deploymentIdsForPr = async (request: GitHubRequest, pr: number): Promise<number[]> => {
  const ids: number[] = [];
  for (let page = 1; ; page++) {
    const deployments = (await request(
      "GET",
      `?environment=${ENVIRONMENT}&per_page=${PER_PAGE}&page=${page}`,
    )) as Deployment[];
    ids.push(...deployments.filter((d) => d.payload?.pr === pr).map((d) => d.id));
    if (deployments.length < PER_PAGE) {
      return ids;
    }
  }
};

const retire = async (request: GitHubRequest, ids: number[]): Promise<void> => {
  for (const id of ids) {
    await request("POST", `${id}/statuses`, { state: "inactive" });
  }
};

// Every PR shares the `preview` environment. auto_inactive is off so one PR's
// deploy leaves other PRs' buttons live; the PR's own older deployments are
// retired here instead. See docs/adr/0013.
export const recordPreviewDeployment = async (
  request: GitHubRequest,
  { sha, pr, url, logUrl }: PreviewRecord,
): Promise<{ id: number; retired: number[] }> => {
  const older = await deploymentIdsForPr(request, pr);
  const { id } = (await request("POST", "", {
    ref: sha,
    environment: ENVIRONMENT,
    // The API otherwise merges the base branch into `ref` and waits on checks.
    auto_merge: false,
    required_contexts: [],
    transient_environment: true,
    payload: { pr },
    description: `Preview of #${pr}`,
  })) as { id: number };
  await request("POST", `${id}/statuses`, {
    state: "success",
    environment_url: url,
    log_url: logUrl,
    auto_inactive: false,
  });
  await retire(request, older);
  return { id, retired: older };
};

export const retirePreviewDeployments = async (
  request: GitHubRequest,
  pr: number,
): Promise<number[]> => {
  const ids = await deploymentIdsForPr(request, pr);
  await retire(request, ids);
  return ids;
};

const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
};

const main = async (): Promise<void> => {
  const token = requiredEnv("GITHUB_TOKEN");
  const base = `${process.env.GITHUB_API_URL ?? "https://api.github.com"}/repos/${requiredEnv("GITHUB_REPOSITORY")}/deployments`;
  const pr = Number(requiredEnv("PR"));

  const request: GitHubRequest = async (method, path, body) => {
    const response = await fetch(apiUrl(base, path), {
      method,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: body && JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`${method} deployments/${path}: ${response.status} ${await response.text()}`);
    }
    return response.json();
  };

  const mode = requiredEnv("MODE");
  if (mode === "record") {
    const { id, retired } = await recordPreviewDeployment(request, {
      sha: requiredEnv("SHA"),
      pr,
      url: requiredEnv("PREVIEW_URL"),
      logUrl: requiredEnv("LOG_URL"),
    });
    console.log(`recorded deployment ${id} for #${pr}; retired [${retired.join(", ")}]`);
  } else if (mode === "retire") {
    const retired = await retirePreviewDeployments(request, pr);
    console.log(`retired ${retired.length} deployment(s) of #${pr}: [${retired.join(", ")}]`);
  } else {
    throw new Error(`MODE must be record or retire, got "${mode}"`);
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(String(error));
    process.exitCode = 1;
  });
}
