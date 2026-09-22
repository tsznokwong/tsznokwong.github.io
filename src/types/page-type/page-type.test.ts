import PageType from ".";
import { Routes, SITE_URL, documentTitle, routeUrl } from "./routes";

describe("routes", () => {
  it("covers every page PageType routes", () => {
    expect(PageType.AllValues.map((page) => page.path)).toEqual(
      Routes.map((route) => route.path),
    );
  });

  it("gives every route a description", () => {
    for (const route of Routes) {
      expect(route.description).not.toBe("");
    }
  });

  it("formats the document title", () => {
    expect(documentTitle(PageType.Home)).toBe("Joshua");
    expect(documentTitle(PageType.Travel)).toBe("Joshua | Travel");
  });

  it("builds absolute URLs with a trailing slash", () => {
    expect(routeUrl("/")).toBe(`${SITE_URL}/`);
    expect(routeUrl("/travel")).toBe(`${SITE_URL}/travel/`);
  });
});

describe("PageType.fromPath", () => {
  // GitHub Pages redirects /travel to /travel/ once travel/index.html exists.
  it("matches a route with a trailing slash", () => {
    expect(PageType.fromPath("/travel/")).toBe(PageType.Travel);
    expect(PageType.fromPath("/journey/")).toBe(PageType.Experience);
  });
});
