# 04 — block editing + debounced write

Status: ready-for-agent
Priority: 4
Blocked-by: 03-markdown-viewing

## What to build
Make the TipTap pane editable with block editing: click a block to edit, the
rest stays rendered. On change, debounce 500ms after the last keystroke, then
write to disk via `fs:write-file`. No save button, no dirty indicator. The file
is the save.

## Acceptance criteria
- [ ] Clicking a block edits it in place; other blocks remain rendered
- [ ] Edits flush to disk 500ms after the last keystroke (not per keystroke)
- [ ] Debounce utility has a Vitest unit test (fake timers)
- [ ] Round-trip preserved: markdown content read → edit → written back without corruption of untouched content
- [ ] File write error is logged, non-blocking (no crash, no modal)
- [ ] E2E (Playwright): open folder → select file → edit → assert file on disk changed
- [ ] All quality gates pass
