import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { FileTree } from './FileTree';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('renders "No files found" when the folder is empty', () => {
  render(<FileTree nodes={[]} selectedPath={null} onSelectFile={vi.fn()} />);
  expect(screen.getByText('No files found.')).toBeInTheDocument();
});
