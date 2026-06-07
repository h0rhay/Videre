import { contextBridge as d, ipcRenderer as e } from "electron";
const r = {
  OpenFolder: "dialog:open-folder",
  ReadDir: "fs:read-dir"
}, n = {
  openFolder: () => e.invoke(r.OpenFolder),
  readDir: (o) => e.invoke(r.ReadDir, o)
};
d.exposeInMainWorld("videre", n);
