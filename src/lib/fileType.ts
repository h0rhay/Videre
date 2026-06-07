export type FileCategory = 'markdown' | 'unsupported';

export function categoriseFile(filePath: string): FileCategory {
  const lower = filePath.toLowerCase();
  return lower.endsWith('.md') ? 'markdown' : 'unsupported';
}
