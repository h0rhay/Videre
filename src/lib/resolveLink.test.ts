import { describe, it, expect } from 'vitest';
import { resolveLink } from './resolveLink';

const BASE = '/Users/me/notes/docs/file.md';

describe('resolveLink', () => {
  it('classifies http links as external and returns href unchanged', () => {
    const result = resolveLink('http://example.com/page', BASE);
    expect(result.kind).toBe('external');
    expect(result.resolved).toBe('http://example.com/page');
  });

  it('classifies https links as external and returns href unchanged', () => {
    const result = resolveLink('https://example.com/page', BASE);
    expect(result.kind).toBe('external');
    expect(result.resolved).toBe('https://example.com/page');
  });

  it('resolves ./sibling.md relative to current file directory', () => {
    const result = resolveLink('./sibling.md', BASE);
    expect(result.kind).toBe('internal');
    expect(result.resolved).toBe('/Users/me/notes/docs/sibling.md');
  });

  it('resolves ../parent.md one directory up', () => {
    const result = resolveLink('../parent.md', BASE);
    expect(result.kind).toBe('internal');
    expect(result.resolved).toBe('/Users/me/notes/parent.md');
  });

  it('resolves a plain filename as sibling in same directory', () => {
    const result = resolveLink('other.md', BASE);
    expect(result.kind).toBe('internal');
    expect(result.resolved).toBe('/Users/me/notes/docs/other.md');
  });

  it('resolves a nested relative path', () => {
    const result = resolveLink('./sub/deep.md', BASE);
    expect(result.kind).toBe('internal');
    expect(result.resolved).toBe('/Users/me/notes/docs/sub/deep.md');
  });
});
