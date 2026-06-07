# PRD — Videre

Source spec: `docs/specs/2026-06-07-videre-design.md`. Binding rules: `docs/rules.md`.

## Problem

People who keep notes as local markdown files want to browse and edit them in a
fast, calm desktop app without a database, sync, or account. Existing tools
(Obsidian, VS Code) carry persistent state, config, and complexity. Videre is
stateless: open a folder, edit `.md` in place, close. The file on disk is the
only state.

## Users

A single local user on macOS editing their own markdown files. No multi-user,
no network, no auth.

## User stories

1. As a user, I open a folder and see all its files in a sidebar tree.
2. As a user, I click a `.md` file and read it rendered in the main pane.
3. As a user, I click a block and edit it; the rest stays rendered; my edit is
   on disk within a second, with no save action.
4. As a user, I click a non-markdown file and see "We can't read this file type".
5. As a user, I toggle dark/light.
6. As a user, I Cmd+click a link: internal links jump to that file in the tree;
   external links open in my browser.
7. As a user, when nothing is open I see a calm empty state, not a broken screen.

## Implementation decisions (contract-level)

- **Stateless:** no config files, localStorage, or DB. Tree + selection reset on
  close. (rules.md → Behaviour)
- **Process model:** Electron, `contextIsolation: true`, `nodeIntegration: false`.
  All fs in main; renderer via `contextBridge` + typed IPC in `src/preload.ts`.
- **Write model:** TipTap `onUpdate` → 500ms debounce → `fs:write-file`. No save
  button, no dirty indicator.
- **File type gate:** only `.md` opens in the editor; everything else →
  UnsupportedPane.
- **Links:** Cmd+click only. External → `shell.openExternal`. Internal → resolve
  relative to current file, navigate in tree; unresolved → Radix Toast.
- **Theme:** `data-theme` on `:root`; in-app toggle is the only source of truth.
- **Styling:** CSS custom properties + every-layout primitives. NOT Tailwind.
- **Fonts:** Geist Sans (UI) + Geist Mono (code) via fontsource.

## Layout (every-layout — binding)

- **App shell:** Sidebar primitive — sidebar = file tree (`flex-basis: 16rem`),
  content = editor pane (`flex-grow: 999; min-inline-size: 50%`).
- **Toolbar / editor header:** Cluster.
- **File tree:** Stack of recursive nodes.
- **Editor content + empty/unsupported panes:** Box → Center (measure ~60ch) → Stack.

## Out of scope

- Search, multi-folder/workspaces, tabs, file create/rename/delete from the UI.
- Markdown other than the TipTap starter-kit feature set (no tables/mermaid/math
  in v1 unless starter-kit covers it).
- Settings, preferences, persistence of any kind.
- Windows/Linux packaging (macOS dev target for v1).
- Auto-update, telemetry, crash reporting.
- `prefers-color-scheme` auto-detection.

## Testing decisions

- Unit (Vitest): debounce util, FileNode tree builder, link resolver, file-type gate.
- Component (Vitest + jsdom): FileTree render, EditorPane mode switching,
  UnsupportedPane/EmptyState triggers, theme toggle.
- E2E (Playwright): open folder → select file → edit → assert disk write;
  Cmd+click internal/external link behaviour.
