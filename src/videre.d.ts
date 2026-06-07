import type { VidereApi } from '../electron/ipc';

declare global {
  interface Window {
    videre: VidereApi;
  }
}

export {};
