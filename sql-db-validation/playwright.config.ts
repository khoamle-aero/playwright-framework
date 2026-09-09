import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // shared SQLite file + fixed port — keep runs serial
  // 'list' for readable console output; 'html' generates the report folder
  // that the GitHub Actions workflow uploads as a build artifact.
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
});