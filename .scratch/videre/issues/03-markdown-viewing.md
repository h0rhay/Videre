# 03 — markdown viewing + unsupported files

Status: ready-for-agent
Priority: 3
Blocked-by: 02-file-tree

## What to build
Selecting a `.md` file reads it (`fs:read-file`) and renders it in the editor
pane via TipTap in read/rendered mode (no editing yet — slice 04). Selecting any
non-`.md` file renders the UnsupportedPane: "We can't read this file type".

Editor pane is Box → **Center** (measure ~60ch) → **Stack**. UnsupportedPane and
the no-file EmptyState use the same Box/Center treatment.

## Acceptance criteria
- [ ] Selecting a `.md` file loads and renders its content via TipTap
- [ ] File-type gate routes non-`.md` files to UnsupportedPane with the exact copy "We can't read this file type"
- [ ] File-type gate has a Vitest unit test
- [ ] Prose constrained to ~60ch measure via Center
- [ ] No file selected → EmptyState
- [ ] File read error → inline error message in the pane
- [ ] All quality gates pass
