// @vitest-environment node
import { afterEach, describe, expect, test, vi } from 'vitest';
import path from 'node:path';

vi.mock('node:fs/promises', () => ({
  readdir: vi.fn(),
}));

import { readdir } from 'node:fs/promises';
import { buildFileTree } from './fileTree';

const mockReaddir = vi.mocked(readdir);

function makeDirent(name: string, isDir: boolean) {
  return {
    name,
    isDirectory: () => isDir,
  } as unknown as Awaited<ReturnType<typeof readdir>>[number];
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('buildFileTree', () => {
  test('returns empty array for empty directory', async () => {
    mockReaddir.mockResolvedValue([]);
    const result = await buildFileTree('/empty');
    expect(result).toEqual([]);
  });

  test('returns file nodes for flat directory', async () => {
    mockReaddir.mockResolvedValue([
      makeDirent('b.md', false),
      makeDirent('a.md', false),
    ]);

    const result = await buildFileTree('/notes');

    expect(result).toEqual([
      { name: 'a.md', path: path.join('/notes', 'a.md'), type: 'file' },
      { name: 'b.md', path: path.join('/notes', 'b.md'), type: 'file' },
    ]);
  });

  test('sorts dirs before files, then alphabetically within each group', async () => {
    mockReaddir.mockImplementation(async (dir) => {
      if (dir === '/root') {
        return [
          makeDirent('zebra.md', false),
          makeDirent('alpha', true),
          makeDirent('apple.md', false),
        ];
      }
      return [];
    });

    const result = await buildFileTree('/root');

    expect(result[0]).toMatchObject({ name: 'alpha', type: 'dir' });
    expect(result[1]).toMatchObject({ name: 'apple.md', type: 'file' });
    expect(result[2]).toMatchObject({ name: 'zebra.md', type: 'file' });
  });

  test('recurses into subdirectories', async () => {
    mockReaddir.mockImplementation(async (dir) => {
      if (dir === '/root') {
        return [makeDirent('sub', true)];
      }
      if (String(dir) === path.join('/root', 'sub')) {
        return [makeDirent('note.md', false)];
      }
      return [];
    });

    const result = await buildFileTree('/root');

    expect(result).toEqual([
      {
        name: 'sub',
        path: path.join('/root', 'sub'),
        type: 'dir',
        children: [
          { name: 'note.md', path: path.join('/root', 'sub', 'note.md'), type: 'file' },
        ],
      },
    ]);
  });
});
