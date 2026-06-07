import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  // Electron tests are always serial — one process at a time.
  workers: 1,
  use: {
    // headless via xvfb in CI; locally runs headed Electron.
    headless: false,
  },
});
