export type LinkKind = 'external' | 'internal';

export interface ResolvedLink {
  kind: LinkKind;
  /** For external links: the original href. For internal: the absolute path. */
  resolved: string;
}

const EXTERNAL_RE = /^https?:\/\//i;

/**
 * Return the directory portion of an absolute file path (everything up to and
 * including the last separator). Works with POSIX and Win32 separators.
 */
function dirOf(filePath: string): string {
  const sep = filePath.includes('/') ? '/' : '\\';
  const idx = filePath.lastIndexOf(sep);
  return idx === -1 ? '' : filePath.slice(0, idx + 1);
}

/**
 * Resolve a relative path segment against a base directory.
 * Pure string implementation — no Node.js dependency, safe in the renderer.
 */
function joinAndNormalise(base: string, relative: string): string {
  const sep = base.includes('/') ? '/' : '\\';
  const parts = base
    .split(sep)
    .filter((p) => p !== '')
    .concat(relative.split('/').filter((p) => p !== ''));

  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '..') {
      resolved.pop();
    } else if (part !== '.') {
      resolved.push(part);
    }
  }

  return sep + resolved.join(sep);
}

/**
 * Classify and resolve a link href.
 *
 * External (http/https) links are returned as-is.
 * Internal links are resolved relative to the directory of currentFilePath.
 *
 * Pure function — no I/O, no Node.js imports, safe to unit test in jsdom.
 */
export function resolveLink(href: string, currentFilePath: string): ResolvedLink {
  if (EXTERNAL_RE.test(href)) {
    return { kind: 'external', resolved: href };
  }

  const dir = dirOf(currentFilePath);
  const resolved = joinAndNormalise(dir, href);
  return { kind: 'internal', resolved };
}
