import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppState } from './AppState';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('shows empty state before a folder is opened', () => {
  const openFolder = vi.fn().mockResolvedValue(null);
  const readDir = vi.fn().mockResolvedValue([]);
  vi.stubGlobal('videre', { openFolder, readDir });

  render(<AppState />);
  expect(screen.getByText('Select a file to view it.')).toBeInTheDocument();
});

test('keeps the empty state when the dialog is cancelled', async () => {
  const openFolder = vi.fn().mockResolvedValue(null);
  const readDir = vi.fn().mockResolvedValue([]);
  vi.stubGlobal('videre', { openFolder, readDir });

  render(<AppState />);
  await userEvent.click(screen.getByRole('button', { name: 'Open folder' }));

  expect(screen.getByText('Select a file to view it.')).toBeInTheDocument();
});
