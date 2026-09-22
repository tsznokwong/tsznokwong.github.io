import { expect, test, type Page } from "@playwright/test";

// Network failures of third-party scripts and the GitHub Pages 404.html SPA
// fallback are not code regressions.
const IGNORED_CONSOLE_ERROR = /^Failed to load resource/;

const ANALYTICS_BEACON = /static\.cloudflareinsights\.com/;
const ANALYTICS_TOKEN = "53281c2246f04683be50e1c982c5d38c";

// Keeps smoke runs, including the post-deploy run on the live site, out of the
// visit counts, and proves every page renders when an ad blocker drops analytics.
test.beforeEach(async ({ page }) => {
  await page.route(ANALYTICS_BEACON, (route) => route.abort("blockedbyclient"));
});

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

// The globe pulls in three.js, most of the bundle; only /travel should pay for it.
// Counts the site's own scripts; third-party ones (analytics) are out of scope.
const HOME_SCRIPT_BUDGET_BYTES = 1_000_000;

test("/ loads without the globe's scripts", async ({ page }) => {
  const scripts: Promise<number>[] = [];
  page.on("response", (response) => {
    const ownScript =
      response.request().resourceType() === "script" &&
      new URL(response.url()).origin === new URL(page.url()).origin;
    if (ownScript) {
      scripts.push(response.body().then((body) => body.length));
    }
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Hello world" })).toBeVisible();
  await page.waitForLoadState("networkidle");
  const bytes = (await Promise.all(scripts)).reduce((sum, size) => sum + size, 0);
  expect(bytes).toBeLessThan(HOME_SCRIPT_BUDGET_BYTES);
});

// Every home section's background downloads on load, whether or not it is in view.
const HOME_IMAGE_BUDGET_BYTES = 1_100_000;

test("/ keeps its images within budget", async ({ page }) => {
  const images: Promise<number>[] = [];
  page.on("response", (response) => {
    if (response.request().resourceType() === "image") {
      images.push(response.body().then((body) => body.length));
    }
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Hello world" })).toBeVisible();
  await page.waitForLoadState("networkidle");
  const bytes = (await Promise.all(images)).reduce((sum, size) => sum + size, 0);
  expect(bytes).toBeLessThan(HOME_IMAGE_BUDGET_BYTES);
});

test("/travel/ serves globe textures from the site", async ({ page }) => {
  const textures: { url: string; status: number }[] = [];
  page.on("response", (response) => {
    if (/earth-blue-marble|night-sky/.test(response.url())) {
      textures.push({ url: response.url(), status: response.status() });
    }
  });
  await page.goto("/travel/");
  await expect(page.locator("canvas").first()).toBeVisible();
  const loaded = () =>
    ["earth-blue-marble", "night-sky"].filter((name) =>
      textures.some((texture) => texture.url.includes(name) && texture.status === 200),
    );
  await expect.poll(loaded).toHaveLength(2);
  const ownOrigin = new URL(page.url()).origin;
  expect(textures.map((texture) => new URL(texture.url).origin)).toEqual(
    textures.map(() => ownOrigin),
  );
});

test("/ loads no Firebase or Google Analytics", async ({ page }) => {
  const google: string[] = [];
  page.on("request", (request) => {
    if (/gstatic\.com|firebase|google-analytics|googletagmanager/.test(request.url())) {
      google.push(request.url());
    }
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Hello world" })).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(google).toEqual([]);
});

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

  // A classic <script> without defer would hold back the app until the beacon loads.
  test(`${preview.path} loads the analytics beacon without blocking`, async ({ request }) => {
    const html = await (await request.get(preview.path)).text();
    const beacon = html.match(/<script[^>]*cloudflareinsights[^>]*>/)?.[0];
    expect(beacon).toBeTruthy();
    expect(beacon).toMatch(/type=['"]module['"]|\sdefer|\sasync/);
    expect(beacon).toContain(ANALYTICS_TOKEN);
  });
}
