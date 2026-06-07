import { test, expect, _electron as electron } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const URL = 'http://localhost:5173';
let vite: ChildProcess;

async function waitForServer(url: string, ms = 20000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try { if ((await fetch(url)).ok) return; } catch { /* retry */ }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('vite dev server did not start');
}

test.beforeAll(async () => {
  vite = spawn('pnpm', ['dev'], { cwd: root, stdio: 'ignore' });
  await waitForServer(URL);
  await new Promise((r) => setTimeout(r, 1500)); // let preload copy land
});

test.afterAll(() => { vite?.kill('SIGKILL'); });

test('DEV mode: open-folder works against the vite dev server', async () => {
  const app = await electron.launch({
    args: [path.join(root, 'dist-electron/main.js')],
    env: { ...process.env, VITE_DEV_SERVER_URL: URL },
  });
  await app.evaluate(({ dialog }, dir) => {
    dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [dir] });
  }, root);
  const w = await app.firstWindow();
  const api = await w.evaluate(() => typeof (window as any).videre?.openFolder);
  expect(api).toBe('function');
  await w.locator('.shell-sidebar').getByRole('button', { name: 'Open folder' }).click();
  await expect(w.getByText('.claude').first()).toBeVisible({ timeout: 5000 });
  await app.close();
});
