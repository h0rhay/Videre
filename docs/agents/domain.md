# Domain Docs

How the engineering skills should consume this repo's domain documentation.

## Before exploring, read these

- `CONTEXT.md` at the repo root
- `docs/adr/` — ADRs that touch the area you're working in

If any are absent, proceed silently. Don't flag their absence or suggest creating them upfront. `/grill-with-docs` creates them lazily as terms and decisions get resolved.

## File structure (single-context)

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-...
│   └── 0002-...
└── src/
```

If this repo grows into a multi-context layout, create `CONTEXT-MAP.md` at the root and move per-context glossaries under each module.

## Use the glossary's vocabulary

When output names a domain concept (issue title, refactor proposal, hypothesis, test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary avoids.

If a concept isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider), or there's a real gap (note it for `/grill-with-docs`).

## Flag ADR conflicts

If output contradicts an existing ADR, surface it rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because..._
