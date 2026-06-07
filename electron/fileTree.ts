import { readdir } from 'node:fs/promises';
import path from 'node:path';
import type { FileNode } from './ipc';

export async function buildFileTree(dirPath: string): Promise<FileNode[]> {
  const entries = await readdir(dirPath, { withFileTypes: true });

  const nodes = await Promise.all(
    entries.map(async (entry): Promise<FileNode> => {
      const entryPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        const children = await buildFileTree(entryPath);
        return { name: entry.name, path: entryPath, type: 'dir', children };
      }

      return { name: entry.name, path: entryPath, type: 'file' };
    }),
  );

  return nodes.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'dir' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}
