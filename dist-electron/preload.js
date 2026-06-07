import { contextBridge as e, ipcRenderer as o } from "electron";
const n = {
  OpenFolder: "dialog:open-folder"
}, r = {
  openFolder: () => o.invoke(n.OpenFolder)
};
e.exposeInMainWorld("videre", r);
