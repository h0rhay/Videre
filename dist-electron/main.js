import { ipcMain as r, dialog as h, app as t, BrowserWindow as c } from "electron";
import { fileURLToPath as w } from "node:url";
import a from "node:path";
import u, { readdir as R } from "node:fs/promises";
const l = {
  OpenFolder: "dialog:open-folder",
  ReadDir: "fs:read-dir",
  ReadFile: "fs:read-file"
};
async function f(e) {
  const o = await R(e, { withFileTypes: !0 });
  return (await Promise.all(
    o.map(async (n) => {
      const i = a.join(e, n.name);
      if (n.isDirectory()) {
        const m = await f(i);
        return { name: n.name, path: i, type: "dir", children: m };
      }
      return { name: n.name, path: i, type: "file" };
    })
  )).sort((n, i) => n.type !== i.type ? n.type === "dir" ? -1 : 1 : n.name.localeCompare(i.name));
}
const d = a.dirname(w(import.meta.url)), s = process.env.VITE_DEV_SERVER_URL;
function p() {
  const e = new c({
    width: 1024,
    height: 720,
    webPreferences: {
      preload: a.join(d, "preload.js"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  });
  s ? e.loadURL(s) : e.loadFile(a.join(d, "../dist/index.html"));
}
r.handle(l.OpenFolder, async () => {
  const e = await h.showOpenDialog({
    properties: ["openDirectory"]
  });
  return e.canceled || e.filePaths.length === 0 ? null : e.filePaths[0] ?? null;
});
r.handle(
  l.ReadDir,
  (e, o) => f(o)
);
r.handle(
  l.ReadFile,
  (e, o) => u.readFile(o, "utf-8")
);
t.whenReady().then(() => {
  p(), t.on("activate", () => {
    c.getAllWindows().length === 0 && p();
  });
});
t.on("window-all-closed", () => {
  process.platform !== "darwin" && t.quit();
});
