import { useCallback, useState } from 'react';
import type { FileNode } from '../electron/ipc';
import { Sidebar } from './components/Sidebar';
import { ContentPane } from './components/ContentPane';

export function AppState() {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

  const handleOpenFolder = useCallback(async () => {
    const selected = await window.videre.openFolder();
    if (selected !== null) {
      const tree = await window.videre.readDir(selected);
      setFileTree(tree);
      setSelectedPath(null);
    }
  }, []);

  const handleToggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return (
    <div className="with-sidebar">
      <Sidebar
        onOpenFolder={handleOpenFolder}
        fileTree={fileTree}
        selectedPath={selectedPath}
        onSelectFile={setSelectedPath}
      />
      <ContentPane
        selectedPath={selectedPath}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />
    </div>
  );
}
