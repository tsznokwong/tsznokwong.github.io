// @vitest-environment node
import { describe, expect, it } from "vitest";

import { renderRouteHtml, routeHtmlFileName, type RouteHtmlMeta } from "./route-html-plugin";

const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="description" content="Old description" />
    <title>tsznokwong.github.io</title>
</head>
<body><div id="root"></div></body>
</html>`;

const meta: RouteHtmlMeta = {
  title: "Joshua | Travel",
  description: "Places I've been to.",
  url: "https://tsznokwong.github.io/travel/",
  image: "https://tsznokwong.github.io/og-image.png",
};

const metaContent = (html: string, attribute: string, key: string): string[] =>
  [...html.matchAll(new RegExp(`<meta ${attribute}="${key}" content="([^"]*)"`, "g"))].map(
    (match) => match[1],
  );

describe("renderRouteHtml", () => {
  it("replaces the title", () => {
    const html = renderRouteHtml(template, meta);
    expect(html).toContain("<title>Joshua | Travel</title>");
    expect(html).not.toContain("tsznokwong.github.io</title>");
  });

  it("replaces the description instead of duplicating it", () => {
    const html = renderRouteHtml(template, meta);
    expect(metaContent(html, "name", "description")).toEqual(["Places I&#39;ve been to."]);
  });

  it("adds Open Graph tags with absolute URLs", () => {
    const html = renderRouteHtml(template, meta);
    expect(metaContent(html, "property", "og:type")).toEqual(["website"]);
    expect(metaContent(html, "property", "og:title")).toEqual(["Joshua | Travel"]);
    expect(metaContent(html, "property", "og:description")).toEqual(["Places I&#39;ve been to."]);
    expect(metaContent(html, "property", "og:url")).toEqual([meta.url]);
    expect(metaContent(html, "property", "og:image")).toEqual([meta.image]);
  });

  it("adds a large-image Twitter card and a canonical link", () => {
    const html = renderRouteHtml(template, meta);
    expect(metaContent(html, "name", "twitter:card")).toEqual(["summary_large_image"]);
    expect(html).toContain(`<link rel="canonical" href="${meta.url}" />`);
  });

  it("puts the tags inside head", () => {
    const html = renderRouteHtml(template, meta);
    const head = html.slice(0, html.indexOf("</head>"));
    expect(head).toContain('property="og:title"');
    expect(head).toContain('rel="canonical"');
  });

  it("escapes HTML in values", () => {
    const html = renderRouteHtml(template, { ...meta, title: `A & "B" <C>` });
    expect(html).toContain("<title>A &amp; &quot;B&quot; &lt;C&gt;</title>");
    expect(metaContent(html, "property", "og:title")).toEqual(["A &amp; &quot;B&quot; &lt;C&gt;"]);
  });

  it("is idempotent when rendered twice", () => {
    const once = renderRouteHtml(template, meta);
    expect(renderRouteHtml(once, meta)).toBe(once);
  });

  it("adds a description when the template has none", () => {
    const bare = template.replace(/\s*<meta name="description"[^>]*>/, "");
    expect(metaContent(renderRouteHtml(bare, meta), "name", "description")).toEqual([
      "Places I&#39;ve been to.",
    ]);
  });
});

describe("routeHtmlFileName", () => {
  it("maps the root to index.html", () => {
    expect(routeHtmlFileName("/")).toBe("index.html");
  });

  it("maps a route to a directory index", () => {
    expect(routeHtmlFileName("/travel")).toBe("travel/index.html");
  });
});
