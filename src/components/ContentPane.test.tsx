import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ContentPane } from './ContentPane';

// ContentPane renders inside a TooltipProvider at the app root; replicate that here.
function Wrapper({ children }: { children: React.ReactNode }) {
  return <Tooltip.Provider>{children}</Tooltip.Provider>;
}

const baseProps = {
  isDark: false,
  onToggleTheme: vi.fn(),
  onNavigate: vi.fn(),
  onShowToast: vi.fn(),
  onOpenFolder: vi.fn(),
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('renders inline error when readFile rejects', async () => {
  const readFile = vi.fn().mockRejectedValue(new Error('Permission denied'));
  vi.stubGlobal('videre', { readFile });

  render(
    <Wrapper>
      <ContentPane {...baseProps} selectedPath="/notes/hello.md" folderOpen={true} />
    </Wrapper>,
  );

  await waitFor(() => {
    expect(screen.getByText('Permission denied')).toBeInTheDocument();
  });
});
