# 05 — dark / light toggle

Status: ready-for-agent
Priority: 5
Blocked-by: 03-markdown-viewing

## What to build
A theme toggle in the editor header. Theme is `isDark` in `AppState`, applied as
a `data-theme` attribute (`light` / `dark`) on `:root`. Colour tokens swap via
custom properties. No `prefers-color-scheme` auto-detection; the toggle is the
only source of truth. (Stateless: theme resets to default on app close.)

Header is a **Cluster**; the toggle sits at the inline-end (`margin-inline-start:
auto`).

## Acceptance criteria
- [ ] Toggle switches `data-theme` between light and dark
- [ ] All surfaces (sidebar, editor, panes) recolour via tokens, no hardcoded colours
- [ ] No `prefers-color-scheme` usage
- [ ] Header composed as a Cluster; toggle pushed to inline-end logically
- [ ] All quality gates pass
