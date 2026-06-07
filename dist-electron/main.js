import { ipcMain as a, dialog as d, app as o, BrowserWindow as r } from "electron";
import { fileURLToPath as s } from "node:url";
import n from "node:path";
const p = {
  OpenFolder: "dialog:open-folder"
}, i = n.dirname(s(import.meta.url)), t = process.env.VITE_DEV_SERVER_URL;
function l() {
  const e = new r({
    width: 1024,
    height: 720,
    webPreferences: {
      preload: n.join(i, "preload.js"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  });
  t ? e.loadURL(t) : e.loadFile(n.join(i, "../dist/index.html"));
}
a.handle(p.OpenFolder, async () => {
  const e = await d.showOpenDialog({
    properties: ["openDirectory"]
  });
  return e.canceled || e.filePaths.length === 0 ? null : e.filePaths[0] ?? null;
});
o.whenReady().then(() => {
  l(), o.on("activate", () => {
    r.getAllWindows().length === 0 && l();
  });
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
