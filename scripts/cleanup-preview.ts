import { pathToFileURL } from "node:url";

export type CloudflareResponse = {
  success: boolean;
  errors: { message: string }[];
  result: unknown;
  result_info?: { page: number; total_pages: number };
};

// `path` is relative to the project's deployments endpoint.
export type CloudflareRequest = (
  method: "GET" | "DELETE",
  path: string,
) => Promise<CloudflareResponse>;

export type CleanupResult = { deleted: string[]; failed: string[] };

type Deployment = {
  id: string;
  deployment_trigger?: { metadata?: { branch?: string } };
};

const PER_PAGE = 25;

const errorMessage = (response: CloudflareResponse): string =>
  response.errors.map((error) => error.message).join("; ") || "unknown error";

// Lists every page before anything is deleted: deleting while paging would
// shift later deployments onto pages already read, and they would be missed.
export const deploymentIdsForBranch = async (
  request: CloudflareRequest,
  branch: string,
): Promise<string[]> => {
  const ids: string[] = [];
  for (let page = 1, totalPages = 1; page <= totalPages; page++) {
    const response = await request("GET", `?env=preview&page=${page}&per_page=${PER_PAGE}`);
    if (!response.success) {
      throw new Error(`listing deployments failed: ${errorMessage(response)}`);
    }
    for (const deployment of response.result as Deployment[]) {
      if (deployment.deployment_trigger?.metadata?.branch === branch) {
        ids.push(deployment.id);
      }
    }
    totalPages = response.result_info?.total_pages ?? page;
  }
  return ids;
};

// force=true: the branch alias points at its latest deployment, which
// Cloudflare otherwise refuses to delete.
export const cleanupPreview = async (
  request: CloudflareRequest,
  branch: string,
): Promise<CleanupResult> => {
  const result: CleanupResult = { deleted: [], failed: [] };
  for (const id of await deploymentIdsForBranch(request, branch)) {
    const response = await request("DELETE", `${id}?force=true`);
    if (response.success) {
      result.deleted.push(id);
    } else {
      result.failed.push(`${id}: ${errorMessage(response)}`);
    }
  }
  return result;
};

const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
};

const main = async (): Promise<void> => {
  const token = requiredEnv("CLOUDFLARE_API_TOKEN");
  const accountId = requiredEnv("CLOUDFLARE_ACCOUNT_ID");
  const project = requiredEnv("PAGES_PROJECT");
  const branch = requiredEnv("PREVIEW_BRANCH");
  const base = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${project}/deployments/`;

  const request: CloudflareRequest = async (method, path) => {
    const response = await fetch(base + path, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });
    return (await response.json()) as CloudflareResponse;
  };

  const { deleted, failed } = await cleanupPreview(request, branch);
  console.log(`deleted ${deleted.length} deployment(s) of ${branch}`);
  for (const id of deleted) {
    console.log(`  ${id}`);
  }
  if (failed.length > 0) {
    console.error(`failed to delete ${failed.length}:\n  ${failed.join("\n  ")}`);
    process.exitCode = 1;
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(String(error));
    process.exitCode = 1;
  });
}
