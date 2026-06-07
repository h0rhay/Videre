/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import { copyFileSync, mkdirSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

// The preload is a hand-written CommonJS file (electron/preload.cjs). The project
// is `type: module`, so bundling the preload produced ESM-in-.cjs that Electron
// could not load. We copy the static file into dist-electron instead. Copy runs
// after the main build (closeBundle) and on dev server start so it always exists.
function copyPreload(): Plugin {
  const copy = () => {
    mkdirSync('dist-electron', { recursive: true });
    copyFileSync('electron/preload.cjs', 'dist-electron/preload.cjs');
  };
  return {
    name: 'videre-copy-preload',
    apply: () => true,
    configureServer: copy,
    closeBundle: copy,
    buildStart: copy,
  };
}

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.ts',
        vite: { build: { outDir: 'dist-electron', emptyOutDir: false } },
      },
    ]),
    renderer(),
    copyPreload(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
