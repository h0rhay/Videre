import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppState } from './AppState';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('shows the selected folder path after opening a folder', async () => {
  const openFolder = vi.fn().mockResolvedValue('/Users/example/notes');
  const readDir = vi.fn().mockResolvedValue([]);
  vi.stubGlobal('videre', { openFolder, readDir });

  render(<AppState />);
  expect(screen.getByText('Open a folder to get started.')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Open folder' }));

  expect(await screen.findByText('Select a file to view it.')).toBeInTheDocument();
});

test('keeps the empty state when the dialog is cancelled', async () => {
  const openFolder = vi.fn().mockResolvedValue(null);
  const readDir = vi.fn().mockResolvedValue([]);
  vi.stubGlobal('videre', { openFolder, readDir });

  render(<AppState />);
  await userEvent.click(screen.getByRole('button', { name: 'Open folder' }));

  expect(screen.getByText('Open a folder to get started.')).toBeInTheDocument();
});
