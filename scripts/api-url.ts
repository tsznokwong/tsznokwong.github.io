// Joins a collection endpoint and a relative path. A query attaches with no
// slash: GitHub answers 404 for `/deployments/?environment=...`.
export const apiUrl = (base: string, path: string): string =>
  path === "" || path.startsWith("?") ? base + path : `${base}/${path}`;
