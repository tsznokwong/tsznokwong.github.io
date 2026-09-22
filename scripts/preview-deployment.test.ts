// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  recordPreviewDeployment,
  retirePreviewDeployments,
  type GitHubRequest,
} from "./preview-deployment";

type FakeDeployment = { id: number; pr: number; environment: string; states: string[] };

// A fake of GitHub's deployments API, recording each call.
const fakeApi = (existing: Omit<FakeDeployment, "states">[] = []) => {
  const deployments: FakeDeployment[] = existing.map((d) => ({ ...d, states: ["success"] }));
  const calls: { method: string; path: string; body?: Record<string, unknown> }[] = [];
  let nextId = 1000;

  const request: GitHubRequest = async (method, path, body) => {
    calls.push({ method, path, body });
    const url = new URL(path, "https://api.test/");
    if (method === "GET") {
      const perPage = Number(url.searchParams.get("per_page"));
      const page = Number(url.searchParams.get("page"));
      return deployments
        .filter((d) => d.environment === url.searchParams.get("environment"))
        .slice((page - 1) * perPage, page * perPage)
        .map((d) => ({ id: d.id, environment: d.environment, payload: { pr: d.pr } }));
    }
    const statusMatch = url.pathname.match(/^\/(\d+)\/statuses$/);
    if (statusMatch) {
      deployments.find((d) => d.id === Number(statusMatch[1]))!.states.push(String(body!.state));
      return {};
    }
    const created: FakeDeployment = {
      id: nextId++,
      pr: (body!.payload as { pr: number }).pr,
      environment: String(body!.environment),
      states: [],
    };
    deployments.push(created);
    return { id: created.id };
  };

  const stateOf = (id: number) => {
    const states = deployments.find((d) => d.id === id)!.states;
    return states[states.length - 1];
  };
  return { request, calls, deployments, stateOf };
};

const record = { sha: "abc123", pr: 7, url: "https://pr-7.x.pages.dev", logUrl: "https://log" };

describe("recordPreviewDeployment", () => {
  it("creates a preview deployment for the commit without merging or waiting on checks", async () => {
    const api = fakeApi();

    await recordPreviewDeployment(api.request, record);

    const create = api.calls.find((c) => c.method === "POST" && c.path === "");
    expect(create?.body).toMatchObject({
      ref: "abc123",
      environment: "preview",
      auto_merge: false,
      required_contexts: [],
      payload: { pr: 7 },
    });
  });

  it("marks the new deployment successful without inactivating older ones", async () => {
    const api = fakeApi();

    const { id } = await recordPreviewDeployment(api.request, record);

    const status = api.calls.find((c) => c.path === `${id}/statuses`);
    expect(status?.body).toMatchObject({
      state: "success",
      environment_url: "https://pr-7.x.pages.dev",
      log_url: "https://log",
      auto_inactive: false,
    });
  });

  it("retires the PR's older deployments but leaves other PRs' active", async () => {
    const api = fakeApi([
      { id: 1, pr: 7, environment: "preview" },
      { id: 2, pr: 8, environment: "preview" },
      { id: 3, pr: 7, environment: "preview" },
      { id: 4, pr: 7, environment: "github-pages" },
    ]);

    const { id, retired } = await recordPreviewDeployment(api.request, record);

    expect(retired).toEqual([1, 3]);
    expect(api.stateOf(1)).toBe("inactive");
    expect(api.stateOf(3)).toBe("inactive");
    expect(api.stateOf(2)).toBe("success");
    expect(api.stateOf(4)).toBe("success");
    expect(api.stateOf(id)).toBe("success");
  });
});

describe("retirePreviewDeployments", () => {
  it("retires every deployment of the PR, including ones past the first page", async () => {
    const others = Array.from({ length: 150 }, (_, i) => ({ id: i + 1, pr: 8, environment: "preview" }));
    const api = fakeApi([
      { id: 500, pr: 7, environment: "preview" },
      ...others,
      { id: 501, pr: 7, environment: "preview" },
    ]);

    const retired = await retirePreviewDeployments(api.request, 7);

    expect(retired).toEqual([500, 501]);
    expect(api.stateOf(500)).toBe("inactive");
    expect(api.stateOf(501)).toBe("inactive");
    expect(api.stateOf(1)).toBe("success");
  });

  it("retires nothing when the PR has no deployments", async () => {
    const api = fakeApi([{ id: 2, pr: 8, environment: "preview" }]);

    expect(await retirePreviewDeployments(api.request, 7)).toEqual([]);
    expect(api.calls.filter((c) => c.method === "POST")).toHaveLength(0);
  });
});
