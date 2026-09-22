import type { Plugin } from "vite";

// Link-preview scrapers (Slack, LinkedIn, WhatsApp, ...) read raw HTML without
// running JavaScript, and GitHub Pages answers unknown paths with 404.html and
// an HTTP 404. Writing an index.html per route gives each route a 200 response
// carrying its own title, description and Open Graph tags.

export type RouteHtmlMeta = {
  title: string;
  description: string;
  url: string;
  image: string;
};

export type RouteHtmlEntry = RouteHtmlMeta & { path: string };

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const GENERATED_TAG = /\s*<(?:meta (?:property="og:|name="twitter:)|link rel="canonical")[^>]*>/g;
const DESCRIPTION_TAG = /\s*<meta name="description"[^>]*>/g;

export const renderRouteHtml = (template: string, meta: RouteHtmlMeta): string => {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const url = escapeHtml(meta.url);
  const image = escapeHtml(meta.image);
  const tags = [
    `<meta name="description" content="${description}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="canonical" href="${url}" />`,
  ];
  return template
    .replace(GENERATED_TAG, "")
    .replace(DESCRIPTION_TAG, "")
    .replace(/<title>[^<]*<\/title>/, () => `<title>${title}</title>`)
    .replace(/\s*<\/head>/, (head) => `\n    ${tags.join("\n    ")}${head}`);
};

export const routeHtmlFileName = (path: string): string =>
  path === "/" ? "index.html" : `${path.replace(/^\/|\/$/g, "")}/index.html`;

export const routeHtml = (entries: RouteHtmlEntry[]): Plugin => ({
  name: "route-html",
  apply: "build",
  // Runs after Vite's HTML plugin has emitted index.html into the bundle.
  enforce: "post",
  generateBundle(_, bundle) {
    const index = bundle["index.html"];
    if (index?.type !== "asset") {
      this.error("route-html: index.html was not emitted");
    }
    const template = String(index.source);
    for (const { path, ...meta } of entries) {
      const fileName = routeHtmlFileName(path);
      const source = renderRouteHtml(template, meta);
      if (fileName === "index.html") {
        index.source = source;
      } else {
        this.emitFile({ type: "asset", fileName, source });
      }
    }
  },
});
