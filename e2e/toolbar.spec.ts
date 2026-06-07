import { test, expect, _electron as electron } from '@playwright/test';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('formatting toolbar shows only while editing', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'videre-'));
  fs.writeFileSync(path.join(dir, 'note.md'), '# Title\n\nSome text.\n');

  const app = await electron.launch({ args: [path.join(root, 'dist-electron/main.js')] });
  await app.evaluate(({ dialog }, d) => {
    dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [d] });
  }, dir);
  const w = await app.firstWindow();

  await w.locator('.shell-sidebar').getByRole('button', { name: 'Open folder' }).click();
  await w.getByRole('button', { name: 'note.md' }).click();
  await expect(w.locator('.tiptap')).toBeVisible();

  // Not editing yet → no toolbar.
  await expect(w.locator('.editor-toolbar')).toHaveCount(0);

  // Focus the editor → toolbar appears.
  await w.locator('.tiptap').click();
  await expect(w.locator('.editor-toolbar')).toBeVisible();
  await expect(w.getByRole('button', { name: 'Bold' })).toBeVisible();

  await app.close();
});
