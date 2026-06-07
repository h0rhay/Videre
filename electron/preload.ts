import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannel, type VidereApi } from './ipc';

const api: VidereApi = {
  openFolder: () => ipcRenderer.invoke(IpcChannel.OpenFolder),
};

contextBridge.exposeInMainWorld('videre', api);
