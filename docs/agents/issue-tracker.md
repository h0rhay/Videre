# Issue tracker: Local Markdown

Issues and PRDs for this repo live as markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The PRD is `.scratch/<feature-slug>/PRD.md`
- Implementation issues are `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`
- Triage state is recorded as a `Status:` line near the top of each issue file (see `triage-labels.md`)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/` (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue id directly.

## Ralph integration

The autonomous `harness ralph` loop reads `.scratch/*/issues/*.md`. It picks the next file with `Status: ready-for-agent` whose `Blocked-by:` entries are all `done`. Ralph marks completed issues `Status: done` and commits.

Other valid statuses (do not change without updating ralph.sh): `needs-triage`, `needs-info`, `ready-for-human`, `wontfix`.

Optional per-issue lines (besides `Status:`):

- `Priority: <number>` — lower runs first; default 999
- `Blocked-by: id1, id2` — comma-separated; Ralph waits until each is done
