import { ipcMain as a, dialog as u, app as o, BrowserWindow as f } from "electron";
import { fileURLToPath as R } from "node:url";
import r from "node:path";
import m, { readdir as F } from "node:fs/promises";
const l = {
  OpenFolder: "dialog:open-folder",
  ReadDir: "fs:read-dir",
  ReadFile: "fs:read-file",
  WriteFile: "fs:write-file"
};
async function h(e) {
  const n = await F(e, { withFileTypes: !0 });
  return (await Promise.all(
    n.map(async (i) => {
      const t = r.join(e, i.name);
      if (i.isDirectory()) {
        const w = await h(t);
        return { name: i.name, path: t, type: "dir", children: w };
      }
      return { name: i.name, path: t, type: "file" };
    })
  )).sort((i, t) => i.type !== t.type ? i.type === "dir" ? -1 : 1 : i.name.localeCompare(t.name));
}
const s = r.dirname(R(import.meta.url)), p = process.env.VITE_DEV_SERVER_URL;
function c() {
  const e = new f({
    width: 1024,
    height: 720,
    webPreferences: {
      preload: r.join(s, "preload.cjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  });
  p ? e.loadURL(p) : e.loadFile(r.join(s, "../dist/index.html"));
}
a.handle(l.OpenFolder, async () => {
  const e = await u.showOpenDialog({
    properties: ["openDirectory"]
  });
  return e.canceled || e.filePaths.length === 0 ? null : e.filePaths[0] ?? null;
});
a.handle(
  l.ReadDir,
  (e, n) => h(n)
);
a.handle(
  l.ReadFile,
  (e, n) => m.readFile(n, "utf-8")
);
a.handle(
  l.WriteFile,
  (e, n, d) => m.writeFile(n, d, "utf-8")
);
o.whenReady().then(() => {
  c(), o.on("activate", () => {
    f.getAllWindows().length === 0 && c();
  });
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
