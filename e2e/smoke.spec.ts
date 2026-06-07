import { test, expect, _electron as electron } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('preload bridge exposed and open-folder wired', async () => {
  const app = await electron.launch({ args: [path.join(root, 'dist-electron/main.js')] });
  const window = await app.firstWindow();
  const api = await window.evaluate(() => {
    const v = (window as unknown as { videre?: Record<string, unknown> }).videre;
    return v ? Object.fromEntries(Object.keys(v).map((k) => [k, typeof v[k]])) : null;
  });
  expect(api).not.toBeNull();
  expect(api?.openFolder).toBe('function');
  await expect(window.getByRole('button', { name: /open folder/i })).toBeVisible();
  await app.close();
});
