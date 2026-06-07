import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import { IpcChannel } from './ipc';
import { buildFileTree } from './fileTree';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1024,
    height: 720,
    webPreferences: {
      preload: path.join(dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    void window.loadURL(VITE_DEV_SERVER_URL);
  } else {
    void window.loadFile(path.join(dirname, '../dist/index.html'));
  }
}

ipcMain.handle(IpcChannel.OpenFolder, async (): Promise<string | null> => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  return result.canceled || result.filePaths.length === 0
    ? null
    : (result.filePaths[0] ?? null);
});

ipcMain.handle(IpcChannel.ReadDir, (_event, dirPath: string) =>
  buildFileTree(dirPath),
);

ipcMain.handle(IpcChannel.ReadFile, (_event, filePath: string) =>
  fs.readFile(filePath, 'utf-8'),
);

ipcMain.handle(IpcChannel.WriteFile, (_event, filePath: string, content: string) =>
  fs.writeFile(filePath, content, 'utf-8'),
);

ipcMain.handle(IpcChannel.PathExists, async (_event, filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle(IpcChannel.OpenExternal, (_event, url: string): Promise<void> =>
  shell.openExternal(url),
);

void app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
