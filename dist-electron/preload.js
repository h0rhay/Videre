import { contextBridge, ipcRenderer } from "electron";
const IpcChannel = {
  OpenFolder: "dialog:open-folder",
  ReadDir: "fs:read-dir",
  ReadFile: "fs:read-file",
  WriteFile: "fs:write-file",
  PathExists: "fs:path-exists",
  OpenExternal: "shell:open-external",
  ShowErrorBox: "dialog:show-error-box"
};
const api = {
  openFolder: () => ipcRenderer.invoke(IpcChannel.OpenFolder),
  readDir: (path) => ipcRenderer.invoke(IpcChannel.ReadDir, path),
  readFile: (path) => ipcRenderer.invoke(IpcChannel.ReadFile, path),
  writeFile: (path, content) => ipcRenderer.invoke(IpcChannel.WriteFile, path, content),
  pathExists: (path) => ipcRenderer.invoke(IpcChannel.PathExists, path),
  openExternal: (url) => ipcRenderer.invoke(IpcChannel.OpenExternal, url),
  showErrorBox: (title, message) => ipcRenderer.invoke(IpcChannel.ShowErrorBox, title, message)
};
contextBridge.exposeInMainWorld("videre", api);
