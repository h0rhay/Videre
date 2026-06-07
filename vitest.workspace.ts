import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vite.config.ts',
    test: {
      name: 'renderer',
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
    },
  },
  {
    test: {
      name: 'electron',
      environment: 'node',
      include: ['electron/**/*.test.ts'],
    },
  },
]);
