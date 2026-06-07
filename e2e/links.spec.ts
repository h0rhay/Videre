/**
 * E2E: link handling (Cmd+click internal + external)
 *
 * Covers the E2E acceptance criteria from issue 06:
 *   - Cmd+click on an internal relative link resolves, navigates the tree, and
 *     loads the target file (asserted via editor content changing).
 *   - Cmd+click on an external link calls shell.openExternal with the URL
 *     (asserted by intercepting the IPC handler in the main process).
 *   - Plain click on a link does NOT navigate (editor content stays the same).
 *
 * Setup mirrors debounced-write.spec.ts: temp dir fixture, stub for
 * dialog:open-folder, built app at dist-electron/main.js.
 *
 * BLOCKED — BUILD CONFIG: same preload CJS issue as debounced-write.spec.ts.
 * The shell:open-external mock is implemented via ipcMain.removeHandler +
 * ipcMain.handleOnce, recording the URL in a shared variable retrieved via
 * electronApp.evaluate.  This is the deepest faithful mock the harness allows
 * without patching app source.
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

const SOURCE_CONTENT = `# Source

Here is an [internal link](target.md) and an [external link](https://example.com).
`;
const TARGET_CONTENT = '# Target\n\nYou reached the target file.\n';

test.beforeEach(async () => {
  // Two markdown files in the same directory so the relative link resolves.
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'videre-links-e2e-'));
  await fs.writeFile(path.join(tmpDir, 'source.md'), SOURCE_CONTENT, 'utf-8');
  await fs.writeFile(path.join(tmpDir, 'target.md'), TARGET_CONTENT, 'utf-8');

  electronApp = await electron.launch({
    args: [path.join(process.cwd(), 'dist-electron/main.js')],
  });

  page = await electronApp.firstWindow();
  await page.waitForLoadState('domcontentloaded');

  // Stub the open-folder dialog to return our temp dir.
  await electronApp.evaluate(
    ({ ipcMain }, folder) => {
      ipcMain.removeHandler('dialog:open-folder');
      ipcMain.handleOnce('dialog:open-folder', () => folder);
    },
    tmpDir,
  );

  // Mock shell:open-external — record the last URL called, return void.
  await electronApp.evaluate(({ ipcMain }) => {
    // Store on globalThis so we can retrieve it later.
    (globalThis as Record<string, unknown>).__lastOpenExternal = null;
    ipcMain.removeHandler('shell:open-external');
    ipcMain.handle('shell:open-external', (_event: Electron.IpcMainInvokeEvent, url: string) => {
      (globalThis as Record<string, unknown>).__lastOpenExternal = url;
    });
  });
});

test.afterEach(async () => {
  // Remove the open-external stub so it doesn't bleed into other tests.
  await electronApp
    .evaluate(({ ipcMain }) => {
      ipcMain.removeHandler('shell:open-external');
    })
    .catch(() => undefined);

  await electronApp.close().catch(() => undefined);
  await fs.rm(tmpDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function openFolder() {
  await page.getByRole('button', { name: 'Open folder' }).click();
}

async function openFile(name: string) {
  await page.getByText(name).click();
  const editor = page.locator('.tiptap');
  await expect(editor).toBeVisible();
  return editor;
}

async function getLastOpenExternal(): Promise<string | null> {
  return electronApp.evaluate(() => {
    return (globalThis as Record<string, unknown>).__lastOpenExternal as string | null;
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test('Cmd+click on an internal link navigates to and renders the target file', async () => {
  await openFolder();
  const editor = await openFile('source.md');

  await expect(editor).toContainText('internal link');

  // Cmd+click the internal link.
  const internalLink = editor.locator('a', { hasText: 'internal link' });
  await internalLink.click({ modifiers: ['Meta'] });

  // The editor should now show target.md content.
  await expect(editor).toContainText('You reached the target file.');

  // The file tree selection should reflect target.md.
  await expect(page.getByText('target.md')).toBeVisible();
});

test('Cmd+click on an external link calls openExternal with the URL', async () => {
  await openFolder();
  const editor = await openFile('source.md');

  await expect(editor).toContainText('external link');

  const externalLink = editor.locator('a', { hasText: 'external link' });
  await externalLink.click({ modifiers: ['Meta'] });

  // Give the IPC round-trip time to complete.
  await page.waitForTimeout(300);

  const calledWith = await getLastOpenExternal();
  expect(calledWith).toBe('https://example.com');
});

test('plain click on a link does not navigate (editor content unchanged)', async () => {
  await openFolder();
  const editor = await openFile('source.md');

  await expect(editor).toContainText('internal link');

  const internalLink = editor.locator('a', { hasText: 'internal link' });
  // Plain click — no Meta modifier.
  await internalLink.click();

  // Source content must still be visible; target content must not appear.
  await expect(editor).toContainText('internal link');
  await expect(editor).not.toContainText('You reached the target file.');

  // openExternal must not have fired.
  const calledWith = await getLastOpenExternal();
  expect(calledWith).toBeNull();
});
