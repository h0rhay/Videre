import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppState } from './AppState';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('shows no-folder state before a folder is opened', () => {
  const openFolder = vi.fn().mockResolvedValue(null);
  const readDir = vi.fn().mockResolvedValue([]);
  vi.stubGlobal('videre', { openFolder, readDir });

  render(<AppState />);
  expect(screen.getByText('Open a folder to get started.')).toBeInTheDocument();
});

test('calls showErrorBox and leaves the tree empty when readDir rejects', async () => {
  const showErrorBox = vi.fn().mockResolvedValue(undefined);
  const openFolder = vi.fn().mockResolvedValue('/some/folder');
  const readDir = vi.fn().mockRejectedValue(new Error('EACCES: permission denied'));
  vi.stubGlobal('videre', { openFolder, readDir, showErrorBox });

  render(<AppState />);

  const [firstOpenFolderButton] = screen.getAllByRole('button', { name: 'Open folder' });
  await userEvent.click(firstOpenFolderButton!);

  await vi.waitFor(() => {
    expect(showErrorBox).toHaveBeenCalledWith('Folder error', 'EACCES: permission denied');
  });

  // Tree stays empty; no crash — no folder state is shown again
  expect(screen.getByText('Open a folder to get started.')).toBeInTheDocument();
});

test('keeps the no-folder state when the dialog is cancelled', async () => {
  const openFolder = vi.fn().mockResolvedValue(null);
  const readDir = vi.fn().mockResolvedValue([]);
  vi.stubGlobal('videre', { openFolder, readDir });

  render(<AppState />);

  // Two "Open folder" buttons exist: one in the toolbar, one in the empty state
  const [firstOpenFolderButton] = screen.getAllByRole('button', { name: 'Open folder' });
  await userEvent.click(firstOpenFolderButton!);

  expect(screen.getByText('Open a folder to get started.')).toBeInTheDocument();
});
