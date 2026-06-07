// Hand-written CommonJS preload. NOT bundled by Vite — the project is
// `type: module`, and bundling kept emitting ESM into a .cjs file, which
// Electron cannot load (window.videre would be undefined). Keeping this as
// plain CJS is deterministic. Channel strings mirror electron/ipc.ts.
const { contextBridge, ipcRenderer } = require('electron');

const api = {
  openFolder: () => ipcRenderer.invoke('dialog:open-folder'),
  readDir: (path) => ipcRenderer.invoke('fs:read-dir', path),
  readFile: (path) => ipcRenderer.invoke('fs:read-file', path),
  writeFile: (path, content) => ipcRenderer.invoke('fs:write-file', path, content),
  pathExists: (path) => ipcRenderer.invoke('fs:path-exists', path),
  openExternal: (url) => ipcRenderer.invoke('shell:open-external', url),
  showErrorBox: (title, message) =>
    ipcRenderer.invoke('dialog:show-error-box', title, message),
};

contextBridge.exposeInMainWorld('videre', api);
