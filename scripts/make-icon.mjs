// Regenerate build/icon.png from build/icon.svg.
// sharp is not a project dependency (one-off tool); run via dlx:
//   pnpm dlx sharp-cli -i build/icon.svg -o build/icon.png resize 1024 1024
// Or temporarily `pnpm add -D sharp` and use the sharp API. icon.png is
// committed, so this is only needed when the logo changes.
