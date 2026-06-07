import { describe, it, expect } from 'vitest';
import { categoriseFile } from './fileType';

describe('categoriseFile', () => {
  it('returns markdown for .md extension', () => {
    expect(categoriseFile('/some/path/README.md')).toBe('markdown');
  });

  it('returns markdown for uppercase .MD extension', () => {
    expect(categoriseFile('/some/path/README.MD')).toBe('markdown');
  });

  it('returns markdown for mixed-case .Md extension', () => {
    expect(categoriseFile('/some/path/note.Md')).toBe('markdown');
  });

  it('returns unsupported for .txt files', () => {
    expect(categoriseFile('/some/path/notes.txt')).toBe('unsupported');
  });

  it('returns unsupported for .png files', () => {
    expect(categoriseFile('/some/path/image.png')).toBe('unsupported');
  });

  it('returns unsupported for files with no extension', () => {
    expect(categoriseFile('/some/path/Makefile')).toBe('unsupported');
  });

  it('returns unsupported for .mdx files', () => {
    expect(categoriseFile('/some/path/page.mdx')).toBe('unsupported');
  });
});
