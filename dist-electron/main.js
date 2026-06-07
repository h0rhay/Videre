import { ipcMain as s, dialog as h, app as i, BrowserWindow as p } from "electron";
import { fileURLToPath as w } from "node:url";
import t from "node:path";
import { readdir as u } from "node:fs/promises";
const c = {
  OpenFolder: "dialog:open-folder",
  ReadDir: "fs:read-dir"
};
async function m(e) {
  const r = await u(e, { withFileTypes: !0 });
  return (await Promise.all(
    r.map(async (n) => {
      const o = t.join(e, n.name);
      if (n.isDirectory()) {
        const f = await m(o);
        return { name: n.name, path: o, type: "dir", children: f };
      }
      return { name: n.name, path: o, type: "file" };
    })
  )).sort((n, o) => n.type !== o.type ? n.type === "dir" ? -1 : 1 : n.name.localeCompare(o.name));
}
const a = t.dirname(w(import.meta.url)), l = process.env.VITE_DEV_SERVER_URL;
function d() {
  const e = new p({
    width: 1024,
    height: 720,
    webPreferences: {
      preload: t.join(a, "preload.js"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  });
  l ? e.loadURL(l) : e.loadFile(t.join(a, "../dist/index.html"));
}
s.handle(c.OpenFolder, async () => {
  const e = await h.showOpenDialog({
    properties: ["openDirectory"]
  });
  return e.canceled || e.filePaths.length === 0 ? null : e.filePaths[0] ?? null;
});
s.handle(
  c.ReadDir,
  (e, r) => m(r)
);
i.whenReady().then(() => {
  d(), i.on("activate", () => {
    p.getAllWindows().length === 0 && d();
  });
});
i.on("window-all-closed", () => {
  process.platform !== "darwin" && i.quit();
});
