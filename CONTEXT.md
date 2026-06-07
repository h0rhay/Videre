# Domain Glossary

Shared language for Videre. Not a spec (see `docs/specs/`) or implementation log.

## Terms

- **Videre** — a stateless desktop markdown viewer/editor. Open a folder, browse files, edit `.md` in place.
- **Stateless** — no persisted app config, preferences, or database. The folder tree and selected file reset on close. The *file on disk* is the only persisted state.
- **Folder tree** — the recursive file/directory navigator in the sidebar. Shows all files, not just markdown.
- **FileNode** — a tree entry: `{ name, path, type: 'file' | 'dir', children? }`.
- **Editor pane** — the main area that renders/edits the selected file.
- **Block editing** — TipTap behaviour where clicking a block edits it while the rest of the document stays rendered.
- **Unsupported file** — any non-`.md` file. Clicking one shows "We can't read this file type".
- **Debounced write** — edits flush to disk 500ms after the last keystroke. There is no save button; the file *is* the save.
- **Internal link** — a relative link to another file in the tree (e.g. `./other.md`). Cmd+click navigates within Videre.
- **External link** — an `http(s)` link. Cmd+click opens it in the default browser via `shell.openExternal`.
- **Cmd+click** — the gesture required to follow any link; plain click stays in edit mode.
- **Dark/light toggle** — theme switch in the editor header; the single source of truth (no `prefers-color-scheme` auto-detection).

## Layout vocabulary (every-layout)

- **App shell** — composed as a **Sidebar** primitive (file tree + editor pane), intrinsically responsive.
- **Toolbar / header** — **Cluster** primitives.
- **Editor content** — a **Stack** inside a **Center** (constrained to a ~60ch measure).
