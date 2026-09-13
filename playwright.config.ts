import { defineConfig, devices } from "@playwright/test";

const externalBaseURL = process.env.SMOKE_BASE_URL;
const localBaseURL = "http://localhost:4173";

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: externalBaseURL ?? localBaseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: { args: ["--enable-unsafe-swiftshader"] },
      },
    },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: "npm run preview -- --port 4173 --strictPort",
        url: localBaseURL,
        reuseExistingServer: !process.env.CI,
      },
});
