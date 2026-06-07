# 06 — links (Cmd+click, internal + external)

Status: done
Priority: 6
Blocked-by: 04-block-editing-debounced-write

## What to build
Link handling in the TipTap editor. Cmd+click follows a link; plain click stays
in edit mode. External (`http(s)`) links open via `shell.openExternal`. Internal
(relative) links resolve against the current file's directory in the main process
and navigate the tree to that file. Unresolved internal links show a Radix Toast
("File not found"). Every link shows a Radix Tooltip on hover: "Cmd+click to open".

Uses `@radix-ui/react-tooltip` and `@radix-ui/react-toast` (individual packages).
`TooltipProvider` at app root; `Tooltip.Portal` + `Toast.Viewport` so overlays
escape the editor container. Style via `data-state`, not inline.

## Acceptance criteria
- [ ] Plain click on a link does nothing (stays editing); Cmd+click follows
- [ ] External link opens in default browser via `shell.openExternal`
- [ ] Internal relative link resolves and navigates the tree + loads the file
- [ ] Unresolved internal link shows a "File not found" Radix Toast
- [ ] Hovering a link shows a Radix Tooltip "Cmd+click to open"
- [ ] Link resolver has a Vitest unit test (relative path cases)
- [ ] E2E (Playwright): Cmd+click internal navigates; external triggers openExternal (mocked)
- [ ] All quality gates pass

## Completion
2026-06-07 10:26:34 — links verified clean
