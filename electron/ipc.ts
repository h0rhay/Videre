export const IpcChannel = {
  OpenFolder: 'dialog:open-folder',
  ReadDir: 'fs:read-dir',
  ReadFile: 'fs:read-file',
  WriteFile: 'fs:write-file',
  PathExists: 'fs:path-exists',
  OpenExternal: 'shell:open-external',
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
  pathExists: (path: string) => Promise<boolean>;
  openExternal: (url: string) => Promise<void>;
}
