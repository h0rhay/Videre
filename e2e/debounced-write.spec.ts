/**
 * E2E: debounced write round-trip
 *
 * Limitation: the native `dialog.showOpenDialog` cannot be driven headlessly.
 * We work around this by intercepting the `dialog:open-folder` IPC handler in
 * the main process (via electronApp.evaluate) and replacing it with a stub that
 * returns our temp directory.  This is the most faithful achievable E2E short of
 * driving a native dialog.
 *
 * Requires the app to be pre-built (`pnpm build`) so dist-electron/main.js exists.
 *
 * BLOCKED — BUILD CONFIG: The preload script (dist-electron/preload.js) is
 * emitted as ESM by vite-plugin-electron, but Electron requires preload scripts
 * to be CJS when contextIsolation:true + sandbox:false.  When Playwright launches
 * the app, the preload fails with "Cannot use import statement outside a module",
 * so window.videre is undefined and the renderer crashes on the first IPC call.
 *
 * Fix required in vite.config.ts (preload entry): add
 *   vite: { build: { rollupOptions: { output: { format: 'cjs' } } } }
 * to the preload electron() entry so the preload is compiled to CJS.
 * This is a production source change — the engineer agent must apply it.
 * Until then, this test will fail at the "Open folder" click step.
 */

import { test, expect, type Page } from '@playwright/test';
import { _electron as electron } from '@playwright/test';
import type { ElectronApplication } from '@playwright/test';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

let electronApp: ElectronApplication;
let page: Page;
let tmpDir: string;
let filePath: string;

const INITIAL_CONTENT = '# Hello\n\nThis is the original content.\n';

test.beforeEach(async () => {
  // Create a temp dir with one markdown file.
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'videre-e2e-'));
  filePath = path.join(tmpDir, 'note.md');
  await fs.writeFile(filePath, INITIAL_CONTENT, 'utf-8');

  // Launch the built Electron app.
  electronApp = await electron.launch({
    args: [path.join(process.cwd(), 'dist-electron/main.js')],
  });

  // Wait for the first BrowserWindow.
  page = await electronApp.firstWindow();
  await page.waitForLoadState('domcontentloaded');

  // Intercept the open-folder IPC so it returns our temp dir without a dialog.
  await electronApp.evaluate(
    ({ ipcMain }, folder) => {
      // Remove the real handler registered in main.ts.
      ipcMain.removeHandler('dialog:open-folder');
      // Register a one-shot stub.
      ipcMain.handleOnce('dialog:open-folder', () => folder);
    },
    tmpDir,
  );
});

test.afterEach(async () => {
  await electronApp.close().catch(() => undefined);
  await fs.rm(tmpDir, { recursive: true, force: true });
});

test('edit is written to disk after debounce with untouched content preserved', async () => {
  // Trigger the "open folder" button so the stub IPC fires.
  await page.getByRole('button', { name: 'Open folder' }).click();

  // Wait for the file tree to show our file.
  await page.getByText('note.md').click();

  // Wait for the editor to appear with the initial content.
  const editor = page.locator('.tiptap');
  await expect(editor).toBeVisible();
  await expect(editor).toContainText('original content');

  // Place cursor at the end of the editor and append text.
  await editor.click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('New paragraph added.');

  // Wait longer than the 500ms debounce + buffer for the IPC round-trip.
  await page.waitForTimeout(800);

  // Read the file from disk and assert.
  const written = await fs.readFile(filePath, 'utf-8');

  // The new text must be present.
  expect(written).toContain('New paragraph added.');

  // The untouched heading must be preserved.
  expect(written).toContain('Hello');

  // The untouched body text must be preserved.
  expect(written).toContain('original content');
});
