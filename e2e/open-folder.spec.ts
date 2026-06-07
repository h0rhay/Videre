import { test, expect, _electron as electron } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('clicking Open folder invokes the dialog and loads the tree', async () => {
  const app = await electron.launch({ args: [path.join(root, 'dist-electron/main.js')] });

  // Stub the native dialog in the MAIN process to return a known dir.
  await app.evaluate(({ dialog }, dir) => {
    dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [dir] });
  }, root);

  const window = await app.firstWindow();
  await window.locator('.shell-sidebar').getByRole('button', { name: 'Open folder' }).click();

  // After a successful open, the file tree should render entries from root.
  await expect(window.getByText('.claude').first()).toBeVisible({ timeout: 5000 });

  // The theme toggle stays pinned and visible even with a long tree loaded.
  await expect(window.locator('.shell-sidebar .theme-toggle')).toBeVisible();
  await app.close();
});
