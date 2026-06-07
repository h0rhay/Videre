import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoFolderState, NoFileState } from './EmptyState';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('NoFolderState renders the open-folder affordance', () => {
  render(<NoFolderState onOpenFolder={vi.fn()} />);
  expect(screen.getByText('Open a folder to get started.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Choose a folder' })).toBeInTheDocument();
});

test('NoFolderState calls onOpenFolder when the button is clicked', async () => {
  const onOpenFolder = vi.fn();
  render(<NoFolderState onOpenFolder={onOpenFolder} />);
  await userEvent.click(screen.getByRole('button', { name: 'Choose a folder' }));
  expect(onOpenFolder).toHaveBeenCalledTimes(1);
});

test('NoFileState renders a calm message distinct from NoFolderState', () => {
  render(<NoFileState />);
  expect(screen.getByText('Select a file from the sidebar to view it.')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Choose a folder' })).toBeNull();
});
