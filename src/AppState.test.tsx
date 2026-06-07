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
  vi.stubGlobal('videre', { openFolder });

  render(<AppState />);
  expect(screen.getByText('Open a folder to get started.')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Open folder' }));

  expect(await screen.findByText('/Users/example/notes')).toBeInTheDocument();
});

test('keeps the empty state when the dialog is cancelled', async () => {
  const openFolder = vi.fn().mockResolvedValue(null);
  vi.stubGlobal('videre', { openFolder });

  render(<AppState />);
  await userEvent.click(screen.getByRole('button', { name: 'Open folder' }));

  expect(screen.getByText('Open a folder to get started.')).toBeInTheDocument();
});
