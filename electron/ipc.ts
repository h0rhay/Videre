export const IpcChannel = {
  OpenFolder: 'dialog:open-folder',
} as const;

export interface VidereApi {
  openFolder: () => Promise<string | null>;
}
