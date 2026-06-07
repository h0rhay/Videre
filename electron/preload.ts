import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannel, type VidereApi } from './ipc';

const api: VidereApi = {
  openFolder: () => ipcRenderer.invoke(IpcChannel.OpenFolder),
  readDir: (path: string) => ipcRenderer.invoke(IpcChannel.ReadDir, path),
  readFile: (path: string) => ipcRenderer.invoke(IpcChannel.ReadFile, path),
  writeFile: (path: string, content: string) =>
    ipcRenderer.invoke(IpcChannel.WriteFile, path, content),
  pathExists: (path: string) => ipcRenderer.invoke(IpcChannel.PathExists, path),
  openExternal: (url: string) => ipcRenderer.invoke(IpcChannel.OpenExternal, url),
};

contextBridge.exposeInMainWorld('videre', api);
