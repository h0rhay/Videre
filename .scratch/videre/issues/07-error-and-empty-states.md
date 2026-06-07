# 07 — error & empty states polish

Status: done
Priority: 7
Blocked-by: 06-links

## What to build
Consolidate and harden the non-happy-path surfaces so they are calm and
consistent: no folder open (EmptyState), no file selected, empty folder, file
read error, folder read error. All use the same Box → Center treatment as the
editor pane. Folder read errors surface via Electron `dialog.showErrorBox`.

## Acceptance criteria
- [ ] No folder open → EmptyState with a clear "Open a folder" affordance
- [ ] No file selected (folder open) → distinct calm empty state
- [ ] Empty folder → "No files found" (consistent with slice 02)
- [ ] File read error → inline error in the pane (consistent with slice 03)
- [ ] Folder read error → `dialog.showErrorBox`; tree stays empty, app stable
- [ ] Empty/error states composed via Box + Center; tokens only
- [ ] Component tests (Vitest + jsdom) cover each state trigger
- [ ] All quality gates pass

## Completion
2026-06-07 10:31:46 — error-and-empty-states verified clean
