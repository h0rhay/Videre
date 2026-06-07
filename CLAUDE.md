# Videre — Project Instructions

## Stack

- **Framework:** Electron + React 18 + TypeScript strict
- **Build:** Vite (renderer) + electron-builder (packaging)
- **Package manager:** pnpm
- **Styling:** CSS custom properties only — no Tailwind. Every Layout primitives (see `every-layout` skill). Modular scale via `--s0` through `--s5`.
- **Component primitives:** Radix UI — use for all interactive primitives that require accessibility (tooltips, dialogs, toasts, dropdowns, context menus). Install packages individually (`@radix-ui/react-tooltip`, `@radix-ui/react-toast`, etc.) — never install the full suite.
- **Rich text editor:** TipTap with `@tiptap/starter-kit` + `@tiptap/extension-link`
- **Fonts:** `@fontsource-variable/inter` (UI), `@fontsource/geist-mono` (code/paths)

## Layout Rules

Apply the `every-layout` skill to all layout work. No `@media` breakpoints for layout reconfiguration. No `px` values except `1px` borders. Logical properties only.

## Radix Usage Rules

- Always use `Tooltip.Portal` and `Toast.Viewport` so overlays escape the editor container
- `TooltipProvider` lives at the app root — never nest multiple providers
- Style Radix primitives via CSS custom properties on `data-state` attributes, not inline styles
- Never use `@radix-ui/themes` — we own the design tokens

## Electron Rules

- All Node.js / fs access lives in the main process only
- Renderer communicates via `contextBridge` + typed IPC wrappers in `src/preload.ts`
- Never use `nodeIntegration: true` — always `contextIsolation: true`
- `shell.openExternal()` is the only way to open external URLs

## Architecture

- Stateless on mount — no config files, no localStorage, no persisted state
- All app state in a single top-level React component (`AppState`)
- TipTap `onUpdate` debounced 500ms then writes to disk via IPC — file is the save
- Cmd+click to follow links (internal or external); plain click stays in edit mode

## Spec

See `docs/specs/2026-06-07-videre-design.md` for the full design spec.
