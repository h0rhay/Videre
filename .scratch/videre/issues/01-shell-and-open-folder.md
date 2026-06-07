# 01 — app shell + open folder

Status: ready-for-agent
Priority: 1
Blocked-by: none

## What to build
Scaffold the Electron + Vite + React + TS project and the app shell. An "Open
folder" button in the sidebar toolbar triggers the native folder dialog (main
process); the chosen path is sent back to the renderer and shown. This slice
carries the scaffolding overhead (build config, IPC plumbing, base tokens).

The shell uses the every-layout **Sidebar** primitive: sidebar child
(`flex-basis: 16rem; flex-grow: 1`) + content child (`flex-basis: 0;
flex-grow: 999; min-inline-size: 50%`). Toolbar is a **Cluster**. Base design
tokens (modular scale, colour, font tokens) defined on `:root`. Geist Sans/Mono
loaded via fontsource.

## Acceptance criteria
- [ ] `pnpm dev` launches the Electron app with a window
- [ ] `contextIsolation: true`, `nodeIntegration: false`; fs only in main; typed IPC via `src/preload.ts`
- [ ] Sidebar + content laid out via the every-layout Sidebar primitive (no @media, logical properties, modular-scale spacing)
- [ ] "Open folder" button opens the native dialog and the selected absolute path renders in the content pane
- [ ] CSS custom properties only — no Tailwind, no inline static styles, no hex literals in components
- [ ] All quality gates pass (lint, test, typecheck, build)

## Notes
First slice; expect package.json, vite/electron config, tsconfig (strict),
preload typings, and a base stylesheet to land here.
