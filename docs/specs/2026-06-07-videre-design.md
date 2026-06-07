# Videre — Design Spec

**Date:** 2026-06-07  
**Status:** Draft, pending sign-off

---

## 1. Product Summary

Videre is a stateless desktop markdown viewer/editor. Open a folder, navigate files in a sidebar, click a `.md` file to view and edit it in a TipTap block editor. Edits write to disk immediately (debounced 500ms). Non-MD files show an unsupported message. No config or state is persisted between sessions.

**Platform:** Electron (main process + renderer React SPA)  
**Stack:** React 18, TypeScript strict, TipTap, Electron IPC, Radix UI Primitives

---

## 2. UI Structure

### Layout Primitives (Every Layout paradigm)

The entire app shell is built from composable layout primitives. No `@media` breakpoints for layout changes.

```
App (Box — dark/light token inversion)
  WithSidebar
    ├── Sidebar (Stack — file tree)
    │     Toolbar (Cluster — folder open button)
    │     FileTree (Stack — recursive tree nodes)
    └── Main (Stack — editor area)
          Header (Cluster — filename, dark/light toggle)
          EditorPane (TipTap block editor OR unsupported message)
```

### Sidebar primitive mapping

```css
.app-shell {               /* WithSidebar */
  display: flex;
  flex-wrap: wrap;
  gap: 0;                  /* no gutter; panels are flush with internal borders */
}

.file-tree-panel {         /* sidebar child */
  flex-basis: 16rem;       /* ideal width */
  flex-grow: 1;
  min-block-size: 100vh;
  border-inline-end: var(--border-thin) solid var(--color-border);
}

.editor-panel {            /* not-sidebar child */
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: 50%;    /* wrap threshold */
  min-block-size: 100vh;
}
```

### Viewport constraint

The app window is fixed to `100vw` / `100vh`. The `WithSidebar` container will never actually wrap in normal use — the threshold exists as a safety net for very narrow windows.

---

## 3. Component Inventory

| Component | Layout primitive | Notes |
|---|---|---|
| `AppShell` | WithSidebar | Root shell, applies Box inversion for dark mode |
| `FileTreePanel` | Stack | Contains toolbar + tree |
| `Toolbar` | Cluster | "Open folder" button, gap: var(--s-1) |
| `FileTree` | Stack | Recursive; items spaced by --s-2 |
| `FileTreeNode` | — | Button for files, expandable for dirs |
| `EditorPanel` | Stack | Header + EditorPane |
| `EditorHeader` | Cluster | Filename (left), DarkModeToggle (right, margin-inline-start: auto) |
| `EditorPane` | Box + Center | TipTap editor; Center constrains prose to measure |
| `UnsupportedPane` | Box + Center | "We can't read this file type" message |
| `EmptyState` | Box + Center | No file selected |

---

## 4. Data Flow

### Electron IPC channels

| Channel | Direction | Payload |
|---|---|---|
| `dialog:open-folder` | renderer → main | — |
| `fs:read-dir` | renderer → main | `{ path: string }` |
| `fs:read-file` | renderer → main | `{ path: string }` |
| `fs:write-file` | renderer → main | `{ path: string, content: string }` |
| `folder:opened` | main → renderer | `{ path: string, tree: FileNode[] }` |
| `file:contents` | main → renderer | `{ path: string, content: string }` |

### State (renderer, React)

```ts
type AppState = {
  folderPath: string | null
  tree: FileNode[]
  selectedFile: string | null
  fileContent: string | null
  isDark: boolean
}
```

All state lives in a single top-level component (no context, no external store). Stateless on mount — nothing reads from disk or config on startup.

### Write debounce

TipTap `onUpdate` fires `fs:write-file` after a 500ms debounce. The file on disk IS the save; no save button, no dirty indicator.

### FileNode type

```ts
type FileNode = {
  name: string
  path: string
  type: 'file' | 'dir'
  children?: FileNode[]
}
```

---

## 5. Link Handling

### Interaction model

All links in the TipTap editor require **Cmd+click** to follow. A plain click stays in edit mode. This matches Obsidian and VS Code conventions and prevents accidental navigation while editing.

### Tooltip

Every link shows a Radix `Tooltip` on hover with the label **"Cmd+click to open"**. Use `@radix-ui/react-tooltip` — accessible, unstyled, zero opinion on styling.

```tsx
import * as Tooltip from '@radix-ui/react-tooltip'

// Wraps TipTap's NodeViewWrapper for link nodes
<Tooltip.Provider delayDuration={400}>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <a onClick={handleLinkClick} href={href}>{children}</a>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content className="link-tooltip" sideOffset={4}>
        Cmd+click to open
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

`delayDuration={400}` avoids tooltip flicker on casual mouse movement.

### Click handler

```ts
function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  if (!e.metaKey) return  // only act on Cmd+click

  const href = e.currentTarget.getAttribute('href') ?? ''

  if (/^https?:\/\//.test(href)) {
    // External: open in default browser
    window.electronAPI.openExternal(href)
  } else {
    // Internal: resolve relative to current file, navigate in tree
    window.electronAPI.resolveAndOpen({ from: currentFilePath, href })
  }
}
```

### Internal link resolution (main process)

`resolveAndOpen` IPC handler:
1. Resolves `href` relative to the current file's directory using `path.resolve`
2. Checks the file exists on disk
3. If it does: emits `file:navigate` back to renderer with the resolved path; tree highlights the node, editor loads the file
4. If it doesn't: emits `file:navigate-error` with a "File not found" reason; renderer shows an inline error toast (Radix `Toast` primitive)

### IPC additions

| Channel | Direction | Payload |
|---|---|---|
| `shell:open-external` | renderer → main | `{ url: string }` |
| `fs:resolve-and-open` | renderer → main | `{ from: string, href: string }` |
| `file:navigate` | main → renderer | `{ path: string }` |
| `file:navigate-error` | main → renderer | `{ href: string, reason: string }` |

---

## 6. Error Handling

| Scenario | Behaviour |
|---|---|
| Non-MD file clicked | `EditorPane` renders `UnsupportedPane` — "We can't read this file type" |
| Folder read error | Alert via Electron `dialog.showErrorBox`; tree stays empty |
| File read error | `EditorPane` renders inline error message |
| File write error | Log to console; no user-facing alert (silent, non-blocking) |
| Empty folder | FileTree renders "No files found" empty state |
| No folder opened | `EditorPanel` renders `EmptyState` |

---

## 6. Dark / Light Mode

Toggle is in `EditorHeader`. State is `isDark: boolean` in `AppState`.

Implementation: CSS custom properties on `:root` swapped via a `data-theme` attribute. The Box `.invert` pattern from Every Layout handles panel-level inversions.

```css
:root[data-theme="light"] {
  --color-bg: #ffffff;
  --color-surface: #f5f5f5;
  --color-text: #111111;
  --color-border: #e0e0e0;
  --color-accent: #0066ff;
}

:root[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-surface: #242424;
  --color-text: #efefef;
  --color-border: #333333;
  --color-accent: #4d9bff;
}
```

No `prefers-color-scheme` auto-detection — the toggle is the single source of truth.

---

## 7. Typography

**Primary UI font:** [Inter](https://rsms.me/inter/) — the benchmark neo-grotesque for screen UI. Tight letter-spacing, large x-height, optical sizing support. Loaded via `@fontsource/inter` (variable font, no external network request from Electron).

**Fallback stack:** `'Inter Variable', Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif`

**Mono font:** [Geist Mono](https://vercel.com/font) via `@fontsource/geist-mono` — used in code blocks inside TipTap and file tree paths.

```css
@import '@fontsource-variable/inter';
@import '@fontsource/geist-mono';

:root {
  --font-sans: 'Inter Variable', Inter, system-ui, 'Helvetica Neue', sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, monospace;

  --font-size-xs:   var(--s-2);   /* ~0.44rem */
  --font-size-sm:   var(--s-1);   /* ~0.67rem */
  --font-size-base: var(--s0);    /* 1rem */
  --font-size-md:   var(--s1);    /* 1.5rem */
  --font-size-lg:   var(--s2);    /* 2.25rem */

  --font-weight-regular: 400;
  --font-weight-medium:  500;
  --font-weight-semibold: 600;

  --tracking-tight:  -0.02em;
  --tracking-normal:  0em;

  --line-height-tight: 1.25;
  --line-height-base:  1.5;
  --line-height-loose: 1.75;
}

body {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'; /* Inter stylistic alternates */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* UI chrome: tight, slightly tracked-in */
.file-tree-panel,
.editor-header {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-tight);
  line-height: var(--line-height-tight);
}

/* Editor prose: readable, generous */
.editor-pane {
  font-size: var(--font-size-base);
  line-height: var(--line-height-loose);
  letter-spacing: var(--tracking-normal);
}
```

Inter's `cv02`/`cv03`/`cv04`/`cv11` features activate disambiguated glyphs (open 4, open 6, open 9, single-storey a) — noticeably sharper in dense UI contexts.

The TipTap editor pane is wrapped in a `.center` with `max-inline-size: var(--measure)` (60ch) to constrain prose line length.

---

## 8. Testing

| Layer | Tool | What |
|---|---|---|
| Unit | Vitest | IPC handler logic, debounce utility, FileNode tree builder |
| Component | Vitest + jsdom | FileTree rendering, EditorPane state, UnsupportedPane trigger |
| E2E | Playwright | Open folder, select file, edit, verify disk write |

---

## 9. Implementation Phases

1. **Scaffold** — Electron + Vite + React + TypeScript boilerplate, pnpm workspaces
2. **IPC layer** — main process handlers for folder open, read-dir, read-file, write-file
3. **Layout shell** — AppShell, FileTreePanel, EditorPanel with Every Layout primitives
4. **File tree** — recursive FileTree + FileTreeNode, folder expand/collapse
5. **TipTap editor** — markdown import/export, block editing, 500ms debounce write
6. **Dark/light mode** — CSS custom properties, toggle
7. **Error states** — UnsupportedPane, EmptyState, error handling
8. **Polish** — typography, modular scale, spacing consistency audit against every-layout skill checklist
