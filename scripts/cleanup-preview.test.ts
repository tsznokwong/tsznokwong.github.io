// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  cleanupPreview,
  deploymentIdsForBranch,
  type CloudflareRequest,
} from "./cleanup-preview";

type Deployment = { id: string; branch: string };

const page = (deployments: Deployment[], pageNumber: number, totalPages: number) => ({
  success: true,
  errors: [],
  result: deployments.map(({ id, branch }) => ({
    id,
    deployment_trigger: { metadata: { branch } },
  })),
  result_info: { page: pageNumber, total_pages: totalPages },
});

// A fake Cloudflare API over a list of deployments, recording each call.
const fakeApi = (deployments: Deployment[], perPage: number, failDeletes: string[] = []) => {
  const remaining = [...deployments];
  const calls: string[] = [];
  const request: CloudflareRequest = async (method, path) => {
    calls.push(`${method} ${path}`);
    if (method === "GET") {
      const pageNumber = Number(new URL(path, "https://api.test").searchParams.get("page"));
      const totalPages = Math.max(1, Math.ceil(remaining.length / perPage));
      const start = (pageNumber - 1) * perPage;
      return page(remaining.slice(start, start + perPage), pageNumber, totalPages);
    }
    const id = path.split("/").pop()!.split("?")[0];
    if (failDeletes.includes(id)) {
      return { success: false, errors: [{ message: "boom" }], result: null };
    }
    remaining.splice(remaining.findIndex((d) => d.id === id), 1);
    return { success: true, errors: [], result: null };
  };
  return { request, calls, remaining };
};

describe("deploymentIdsForBranch", () => {
  it("collects every deployment of the branch across all pages", async () => {
    const api = fakeApi(
      [
        { id: "a", branch: "pr-7" },
        { id: "b", branch: "pr-8" },
        { id: "c", branch: "pr-7" },
        { id: "d", branch: "pr-7" },
        { id: "e", branch: "pr-70" },
      ],
      2,
    );

    expect(await deploymentIdsForBranch(api.request, "pr-7")).toEqual(["a", "c", "d"]);
    expect(api.calls.filter((c) => c.startsWith("GET"))).toHaveLength(3);
  });

  it("returns nothing when the branch has no deployments", async () => {
    const api = fakeApi([{ id: "b", branch: "pr-8" }], 25);

    expect(await deploymentIdsForBranch(api.request, "pr-7")).toEqual([]);
  });

  it("throws when listing fails", async () => {
    const request: CloudflareRequest = async () => ({
      success: false,
      errors: [{ message: "Authentication error" }],
      result: null,
    });

    await expect(deploymentIdsForBranch(request, "pr-7")).rejects.toThrow(
      "Authentication error",
    );
  });
});

describe("cleanupPreview", () => {
  it("deletes every deployment of the branch, including ones past the first page", async () => {
    const api = fakeApi(
      [
        { id: "a", branch: "pr-7" },
        { id: "b", branch: "pr-7" },
        { id: "c", branch: "pr-8" },
        { id: "d", branch: "pr-7" },
        { id: "e", branch: "pr-7" },
      ],
      2,
    );

    const result = await cleanupPreview(api.request, "pr-7");

    expect(result).toEqual({ deleted: ["a", "b", "d", "e"], failed: [] });
    expect(api.remaining.map((d) => d.id)).toEqual(["c"]);
  });

  it("force-deletes, because the branch alias points at the latest deployment", async () => {
    const api = fakeApi([{ id: "a", branch: "pr-7" }], 25);

    await cleanupPreview(api.request, "pr-7");

    expect(api.calls).toContain("DELETE a?force=true");
  });

  it("keeps deleting after one delete fails, and reports the failure", async () => {
    const api = fakeApi(
      [
        { id: "a", branch: "pr-7" },
        { id: "b", branch: "pr-7" },
      ],
      25,
      ["a"],
    );

    const result = await cleanupPreview(api.request, "pr-7");

    expect(result).toEqual({ deleted: ["b"], failed: ["a: boom"] });
  });
});
