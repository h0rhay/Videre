import { contextBridge as i, ipcRenderer as r } from "electron";
const d = {
  OpenFolder: "dialog:open-folder",
  ReadDir: "fs:read-dir",
  ReadFile: "fs:read-file"
}, o = {
  openFolder: () => r.invoke(d.OpenFolder),
  readDir: (e) => r.invoke(d.ReadDir, e),
  readFile: (e) => r.invoke(d.ReadFile, e)
};
i.exposeInMainWorld("videre", o);
