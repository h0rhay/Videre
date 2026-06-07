import { ipcMain as a, dialog as u, shell as E, app as o, BrowserWindow as f } from "electron";
import { fileURLToPath as R } from "node:url";
import l from "node:path";
import s, { readdir as y } from "node:fs/promises";
const r = {
  OpenFolder: "dialog:open-folder",
  ReadDir: "fs:read-dir",
  ReadFile: "fs:read-file",
  WriteFile: "fs:write-file",
  PathExists: "fs:path-exists",
  OpenExternal: "shell:open-external"
};
async function m(e) {
  const n = await y(e, { withFileTypes: !0 });
  return (await Promise.all(
    n.map(async (t) => {
      const i = l.join(e, t.name);
      if (t.isDirectory()) {
        const w = await m(i);
        return { name: t.name, path: i, type: "dir", children: w };
      }
      return { name: t.name, path: i, type: "file" };
    })
  )).sort((t, i) => t.type !== i.type ? t.type === "dir" ? -1 : 1 : t.name.localeCompare(i.name));
}
const p = l.dirname(R(import.meta.url)), c = process.env.VITE_DEV_SERVER_URL;
function h() {
  const e = new f({
    width: 1024,
    height: 720,
    webPreferences: {
      preload: l.join(p, "preload.cjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  });
  c ? e.loadURL(c) : e.loadFile(l.join(p, "../dist/index.html"));
}
a.handle(r.OpenFolder, async () => {
  const e = await u.showOpenDialog({
    properties: ["openDirectory"]
  });
  return e.canceled || e.filePaths.length === 0 ? null : e.filePaths[0] ?? null;
});
a.handle(
  r.ReadDir,
  (e, n) => m(n)
);
a.handle(
  r.ReadFile,
  (e, n) => s.readFile(n, "utf-8")
);
a.handle(
  r.WriteFile,
  (e, n, d) => s.writeFile(n, d, "utf-8")
);
a.handle(r.PathExists, async (e, n) => {
  try {
    return await s.access(n), !0;
  } catch {
    return !1;
  }
});
a.handle(
  r.OpenExternal,
  (e, n) => E.openExternal(n)
);
o.whenReady().then(() => {
  h(), o.on("activate", () => {
    f.getAllWindows().length === 0 && h();
  });
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
