import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { IpcChannel } from './ipc';
import { buildFileTree } from './fileTree';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1024,
    height: 720,
    webPreferences: {
      preload: path.join(dirname, 'preload.js'),
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
