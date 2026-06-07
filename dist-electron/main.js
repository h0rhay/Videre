import { ipcMain as r, dialog as f, shell as E, app as l, BrowserWindow as w } from "electron";
import { fileURLToPath as x } from "node:url";
import s from "node:path";
import d, { readdir as R } from "node:fs/promises";
const i = {
  OpenFolder: "dialog:open-folder",
  ReadDir: "fs:read-dir",
  ReadFile: "fs:read-file",
  WriteFile: "fs:write-file",
  PathExists: "fs:path-exists",
  OpenExternal: "shell:open-external",
  ShowErrorBox: "dialog:show-error-box"
};
async function m(e) {
  const n = await R(e, { withFileTypes: !0 });
  return (await Promise.all(
    n.map(async (t) => {
      const o = s.join(e, t.name);
      if (t.isDirectory()) {
        const u = await m(o);
        return { name: t.name, path: o, type: "dir", children: u };
      }
      return { name: t.name, path: o, type: "file" };
    })
  )).sort((t, o) => t.type !== o.type ? t.type === "dir" ? -1 : 1 : t.name.localeCompare(o.name));
}
const p = s.dirname(x(import.meta.url)), c = process.env.VITE_DEV_SERVER_URL;
function h() {
  const e = new w({
    width: 1024,
    height: 720,
    webPreferences: {
      preload: s.join(p, "preload.cjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  });
  c ? e.loadURL(c) : e.loadFile(s.join(p, "../dist/index.html"));
}
r.handle(i.OpenFolder, async () => {
  const e = await f.showOpenDialog({
    properties: ["openDirectory"]
  });
  return e.canceled || e.filePaths.length === 0 ? null : e.filePaths[0] ?? null;
});
r.handle(
  i.ReadDir,
  (e, n) => m(n)
);
r.handle(
  i.ReadFile,
  (e, n) => d.readFile(n, "utf-8")
);
r.handle(
  i.WriteFile,
  (e, n, a) => d.writeFile(n, a, "utf-8")
);
r.handle(i.PathExists, async (e, n) => {
  try {
    return await d.access(n), !0;
  } catch {
    return !1;
  }
});
r.handle(
  i.OpenExternal,
  (e, n) => E.openExternal(n)
);
r.handle(i.ShowErrorBox, (e, n, a) => {
  f.showErrorBox(n, a);
});
l.whenReady().then(() => {
  h(), l.on("activate", () => {
    w.getAllWindows().length === 0 && h();
  });
});
l.on("window-all-closed", () => {
  process.platform !== "darwin" && l.quit();
});
