export const IpcChannel = {
  OpenFolder: 'dialog:open-folder',
  ReadDir: 'fs:read-dir',
  ReadFile: 'fs:read-file',
  WriteFile: 'fs:write-file',
} as const;

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: FileNode[];
}

export interface VidereApi {
  openFolder: () => Promise<string | null>;
  readDir: (path: string) => Promise<FileNode[]>;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
}
