import { useCallback, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { FileNode } from '../electron/ipc';
import { Sidebar } from './components/Sidebar';
import { ContentPane } from './components/ContentPane';

export function AppState() {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [folderOpen, setFolderOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

  const handleOpenFolder = useCallback(async () => {
    const selected = await window.videre.openFolder();
    if (selected !== null) {
      try {
        const tree = await window.videre.readDir(selected);
        setFileTree(tree);
        setFolderOpen(true);
        setSelectedPath(null);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Could not read the folder.';
        await window.videre.showErrorBox('Folder error', message);
        setFileTree([]);
        setFolderOpen(false);
      }
    }
  }, []);

  const handleToggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const handleNavigate = useCallback((path: string) => {
    setSelectedPath(path);
  }, []);

  const handleShowToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  return (
    <Tooltip.Provider delayDuration={600}>
      <Toast.Provider swipeDirection="right">
        <div className="with-sidebar">
          <Sidebar
            onOpenFolder={handleOpenFolder}
            fileTree={fileTree}
            selectedPath={selectedPath}
            onSelectFile={setSelectedPath}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
          />
          <ContentPane
            selectedPath={selectedPath}
            folderOpen={folderOpen}
            onNavigate={handleNavigate}
            onShowToast={handleShowToast}
            onOpenFolder={handleOpenFolder}
          />
        </div>
        <Toast.Root
          className="toast-root"
          open={toastMessage !== null}
          onOpenChange={(open) => {
            if (!open) setToastMessage(null);
          }}
          duration={3000}
        >
          <Toast.Description className="toast-description">
            {toastMessage}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="toast-viewport" />
      </Toast.Provider>
    </Tooltip.Provider>
  );
}
