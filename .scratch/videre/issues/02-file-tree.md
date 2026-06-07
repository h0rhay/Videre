# 02 — file tree

Status: done
Priority: 2
Blocked-by: 01-shell-and-open-folder

## What to build
Read the opened folder recursively in the main process (`fs:read-dir` → returns
`FileNode[]`) and render it as a navigable tree in the sidebar. All files shown,
not just markdown. Directories expand/collapse. Clicking a file sets the selected
file in `AppState` (no content load yet — that's slice 03).

Tree is an every-layout **Stack** of recursive `FileTreeNode`s; nesting indents
via logical inline padding from the modular scale. File rows are buttons; dir
rows toggle expansion.

## Acceptance criteria
- [ ] `fs:read-dir` returns a typed `FileNode[]` tree (`{ name, path, type, children? }`)
- [ ] Tree renders all entries; directories expand/collapse on click
- [ ] Clicking a file marks it selected in state (visible active style)
- [ ] FileNode tree builder has a Vitest unit test
- [ ] Tree composed as a Stack; nesting via logical properties + modular scale
- [ ] Empty folder shows a "No files found" state
- [ ] All quality gates pass

## Completion
2026-06-07 09:53:56 — file-tree verified clean
