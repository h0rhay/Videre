import { ipcMain, dialog, shell, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs, { readdir } from "node:fs/promises";
const IpcChannel = {
  OpenFolder: "dialog:open-folder",
  ReadDir: "fs:read-dir",
  ReadFile: "fs:read-file",
  WriteFile: "fs:write-file",
  PathExists: "fs:path-exists",
  OpenExternal: "shell:open-external",
  ShowErrorBox: "dialog:show-error-box"
};
async function buildFileTree(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const nodes = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const children = await buildFileTree(entryPath);
        return { name: entry.name, path: entryPath, type: "dir", children };
      }
      return { name: entry.name, path: entryPath, type: "file" };
    })
  );
  return nodes.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "dir" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}
const dirname = path.dirname(fileURLToPath(import.meta.url));
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
function createWindow() {
  const window = new BrowserWindow({
    width: 1024,
    height: 720,
    webPreferences: {
      preload: path.join(dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (VITE_DEV_SERVER_URL) {
    void window.loadURL(VITE_DEV_SERVER_URL);
  } else {
    void window.loadFile(path.join(dirname, "../dist/index.html"));
  }
}
ipcMain.handle(IpcChannel.OpenFolder, async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  });
  return result.canceled || result.filePaths.length === 0 ? null : result.filePaths[0] ?? null;
});
ipcMain.handle(
  IpcChannel.ReadDir,
  (_event, dirPath) => buildFileTree(dirPath)
);
ipcMain.handle(
  IpcChannel.ReadFile,
  (_event, filePath) => fs.readFile(filePath, "utf-8")
);
ipcMain.handle(
  IpcChannel.WriteFile,
  (_event, filePath, content) => fs.writeFile(filePath, content, "utf-8")
);
ipcMain.handle(IpcChannel.PathExists, async (_event, filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
});
ipcMain.handle(
  IpcChannel.OpenExternal,
  (_event, url) => shell.openExternal(url)
);
ipcMain.handle(IpcChannel.ShowErrorBox, (_event, title, message) => {
  dialog.showErrorBox(title, message);
});
void app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
