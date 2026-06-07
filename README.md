# Videre

**MD file editing made simple.**

A stateless desktop markdown editor. Open a folder, browse your files, edit `.md` in place. No accounts, no sync, no settings, no database — the file on disk is the only state.

---

## What it is

Videre is a calm, local-first markdown editor for people who keep their notes as plain `.md` files. It does one thing well: let you read and edit markdown with a minimum of ceremony.

- **Stateless by design** — nothing is persisted but your files. Close the app and the tree and selection reset; there is no config to manage.
- **The file is the save** — edits flush to disk automatically, 500 ms after you stop typing. No save button, no dirty indicator.
- **Just markdown** — open any folder; click a `.md` file to edit it. Non-markdown files show a polite "We can't read this file type."

## How it works

1. **Open a folder.** A recursive file tree appears in the sidebar (lucide folder icons, expand/collapse).
2. **Click a `.md` file.** It renders in the main pane as rich text via [TipTap](https://tiptap.dev).
3. **Edit anywhere.** Click into the document and a floating formatting toolbar appears just above the block you're editing (headings, bold, italic, lists, quote, code…). It disappears when you click away, and never bleeds over the sidebar.
4. **It saves itself.** Changes are debounced and written straight back to the file.
5. **Follow links with ⌘-click.** Internal links jump to that file in the tree; external links open in your browser. A plain click keeps you editing.
6. **Toggle dark / light** from the corner of the window.

## Built with

- **Electron** — main + renderer, `contextIsolation` on, all filesystem access in the main process behind a typed IPC bridge.
- **React 18 + TypeScript** (strict), bundled with **Vite**.
- **TipTap** for block editing; **Radix UI** primitives for tooltips and toasts.
- **CSS custom properties + [Every Layout](https://every-layout.dev)** — no utility framework. Layout is composed from intrinsic primitives (Sidebar, Stack, Center, Cluster) using logical properties and a modular scale, so it's responsive without breakpoints.
- **Geist Sans / Geist Mono** typography; **lucide** icons throughout.

## Architecture

```
electron/main.ts      Window, IPC handlers (open folder, read/write file, links)
electron/preload.cjs  contextBridge → window.videre (typed, CommonJS)
src/AppState.tsx      Single top-level state holder (no global store)
src/components/        Sidebar · FileTree · ContentPane · MarkdownViewer · EditorToolbar
src/styles/            Tokens + Every Layout primitives (CSS custom properties)
```

The whole UI is one component tree with state lifted to the top; children render and call callbacks. App state derives during render, never in effects.

## Develop

```bash
pnpm install
pnpm dev          # Vite + Electron, hot-reloaded
```

Quality gates (all run in the build/CI loop):

```bash
pnpm lint         # eslint, zero warnings
pnpm typecheck    # tsc strict
pnpm test         # Vitest (unit + component)
pnpm test:e2e     # Playwright, drives the real Electron app
```

## Package

```bash
pnpm package      # builds out/Videre-<version>-arm64.dmg + Videre.app
```

Open the DMG and drag Videre to Applications (or copy `out/mac-arm64/Videre.app`). The build is unsigned — fine for personal use; distributing to others needs an Apple Developer ID to sign and notarise.

To regenerate the app icon after changing the mark:

```bash
pnpm make-icon    # build/icon.svg → build/icon.png (via QuickLook)
```

---

Built with the product engineering harness. Stateless, fast, and out of your way.
