import { expect, test, type Page } from "@playwright/test";

// Network failures of third-party assets (globe textures, Firebase) and the
// GitHub Pages 404.html SPA fallback are not code regressions.
const IGNORED_CONSOLE_ERROR = /^Failed to load resource/;

const routes = [
  { path: "/", heading: "Hello world" },
  { path: "/journey", heading: "Journey Timeline" },
  // GitHub Pages serves routes at their trailing-slash form.
  { path: "/journey/", heading: "Journey Timeline" },
  { path: "/travel", heading: "Travel", canvas: true },
];

const collectErrors = (page: Page): string[] => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" && !IGNORED_CONSOLE_ERROR.test(message.text())) {
      errors.push(`console.error: ${message.text()}`);
    }
  });
  return errors;
};

for (const route of routes) {
  test(`${route.path} renders without errors`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(route.path);
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
    if (route.canvas) {
      await expect(page.locator("canvas").first()).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

test("build SHA is embedded", async ({ page }) => {
  await page.goto("/");
  const sha = await page.locator('meta[name="build-sha"]').getAttribute("content");
  expect(sha).toBeTruthy();
  expect(sha).not.toContain("%");
  if (process.env.SMOKE_EXPECTED_SHA) {
    expect(sha).toBe(process.env.SMOKE_EXPECTED_SHA);
  }
});

// Link-preview scrapers read the raw HTML without running JavaScript.
// Canonical trailing-slash paths: GitHub Pages redirects /travel to /travel/,
// while vite preview's SPA fallback would serve the root HTML for /travel.
const previews = [
  { path: "/", title: "Joshua" },
  { path: "/journey/", title: "Joshua | Journey" },
  { path: "/travel/", title: "Joshua | Travel" },
];

for (const preview of previews) {
  test(`${preview.path} serves link-preview tags`, async ({ request }) => {
    const response = await request.get(preview.path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(`<title>${preview.title}</title>`);
    expect(html).toContain(`<meta property="og:title" content="${preview.title}" />`);
    const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    expect(image).toBeTruthy();
    expect((await request.get(new URL(image!).pathname)).status()).toBe(200);
  });
}
