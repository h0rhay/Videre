# Harness config for videre
# Sourced by ~/.claude/harness/ralph.sh — edit values to taste.

PROJECT_NAME="videre"
COMMIT_PREFIX="feat(ralph)"

# Quality checks run after every Ralph iteration. All must pass for the issue
# to be marked done.
QUALITY_CHECKS=(
  "pnpm lint"
  "pnpm test -- --run"
  "pnpm typecheck"
  "pnpm build"
  "pnpm test:e2e"
)

# Files loaded into every Ralph iteration as binding rules.
# Add design-system, code-patterns, naming docs, etc. as your project grows.
CONTEXT_FILES=(
  "CONTEXT.md"
  "docs/rules.md"
)

# Where to find issues. Matt Pocock's local-markdown convention.
ISSUES_GLOB=".scratch/*/issues/*.md"

# Specialist agents the orchestrator may dispatch. Two flags compose the set:
#
#   HARNESS_MODE
#     poc:  lean team for prototypes
#     full: adds devops + security for production-bound work
#
#   DESIGN_PHASE
#     enabled:  art-director + designer run before engineer for visual slices
#     disabled: skip straight to engineer (current behaviour for code-only slices)
#
# Reviewer always runs as the eval stage; not listed here.
HARNESS_MODE="poc"           # change to "full" when promoting beyond prototype
DESIGN_PHASE="disabled"      # change to "enabled" when slices have a visual component

AGENTS_ENABLED=("product-manager" "engineer" "tester")
case "$HARNESS_MODE" in
  full) AGENTS_ENABLED+=("devops" "security") ;;
esac
case "$DESIGN_PHASE" in
  enabled) AGENTS_ENABLED+=("art-director" "designer") ;;
esac
