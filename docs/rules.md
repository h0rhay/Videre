# Binding Rules

These rules are re-injected into every Ralph iteration. Agents must obey them
over their own defaults. Add project-specific rules (data access, naming,
dependencies) as the project grows.

## Layout — every-layout (binding)

All structure is composed from the `every-layout` primitives. This is the
structural substrate; the design phase's aesthetic (typography, palette, motion)
sits on top of it and does not replace it.

- Compose with Stack, Box, Center, Cluster, Sidebar, Switcher.
- Logical properties only (`margin-inline`, `padding-block`, `inline-size`),
  never physical (`margin-left`, `width`).
- Spacing and sizing from the modular scale (`--s-2` … `--s5`), not ad-hoc values.
- No `@media` for layout reconfiguration; rely on intrinsic responsiveness
  (flex-basis + flex-grow + min-inline-size).
- No `px` except `1px` borders.
- Constrain text to a measure (~60ch).

See the `every-layout` skill for the full pattern set and the per-primitive CSS.

## Styling — CSS custom properties, NOT Tailwind (binding override)

**This project does not use Tailwind.** The engineer agent's default "Tailwind
classes only" rule is overridden here. Videre styles with plain CSS using custom
properties (design tokens) and the every-layout primitives.

- Tokens live as CSS custom properties on `:root` (the modular scale `--s-2`…`--s5`,
  colour tokens, font tokens). No utility-class framework.
- Theme via a `data-theme` attribute on `:root` (`light` / `dark`); no
  `prefers-color-scheme` auto-detection — the in-app toggle is the source of truth.
- No inline `style` props for static styling; no hex literals scattered in
  components — reference tokens.

## Stack (binding)

- **Platform:** Electron (main + renderer). `contextIsolation: true`,
  `nodeIntegration: false`. All Node/fs access in the main process; renderer talks
  to it via `contextBridge` + typed IPC in `src/preload.ts`.
- **Renderer:** React 18 + TypeScript strict, built with Vite.
- **Editor:** TipTap (`@tiptap/starter-kit` + `@tiptap/extension-link`).
- **UI primitives:** Radix — install packages individually
  (`@radix-ui/react-tooltip`, `@radix-ui/react-toast`, …). Never `@radix-ui/themes`.
- **State:** single top-level component holding `AppState`. No Redux, no global
  store. Derive state during render, not in effects.
- **Package manager:** pnpm.

## Typography (binding)

- **UI font:** Geist Sans via `@fontsource-variable/geist-sans` (NOT Inter).
- **Mono font:** Geist Mono via `@fontsource/geist-mono` (code blocks, file paths).
- Loaded locally via fontsource; no external font network requests.

## Behaviour (binding)

- **Stateless:** no persisted app config, localStorage, or DB. Tree + selection
  reset on close. The file on disk is the only persisted state.
- **Debounced write:** edits flush to disk 500ms after last keystroke. No save
  button. The file IS the save.
- **Non-MD files:** render "We can't read this file type". Never attempt to parse.
- **Links:** Cmd+click to follow. Internal → resolve relative + navigate in tree.
  External (`http(s)`) → `shell.openExternal`. Plain click stays in edit mode.

## Testing (binding)

- Unit + component: Vitest (+ jsdom for components).
- E2E: Playwright.
- Per the global contract, behaviour-level assertions; no testing of internals.
