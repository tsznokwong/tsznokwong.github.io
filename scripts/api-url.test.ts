// @vitest-environment node
import { describe, expect, it } from "vitest";

import { apiUrl } from "./api-url";

describe("apiUrl", () => {
  const base = "https://api.test/repos/o/r/deployments";

  it.each([
    ["a query onto the collection, with no slash before it", "?environment=preview&page=1", `${base}?environment=preview&page=1`],
    ["the collection itself", "", base],
    ["a sub-path", "42/statuses", `${base}/42/statuses`],
    ["a sub-path with a query", "42?force=true", `${base}/42?force=true`],
  ])("joins %s", (_, path, expected) => {
    expect(apiUrl(base, path)).toBe(expected);
  });
});
