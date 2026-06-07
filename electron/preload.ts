import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannel, type VidereApi } from './ipc';

const api: VidereApi = {
  openFolder: () => ipcRenderer.invoke(IpcChannel.OpenFolder),
  readDir: (path: string) => ipcRenderer.invoke(IpcChannel.ReadDir, path),
};

contextBridge.exposeInMainWorld('videre', api);
