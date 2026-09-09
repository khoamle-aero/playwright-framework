import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // shared SQLite file + fixed port — keep runs serial
  reporter: [["list"]],
});
