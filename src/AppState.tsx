import { useCallback, useState } from 'react';
import type { FileNode } from '../electron/ipc';
import { Sidebar } from './components/Sidebar';
import { ContentPane } from './components/ContentPane';

export function AppState() {
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleOpenFolder = useCallback(async () => {
    const selected = await window.videre.openFolder();
    if (selected !== null) {
      const tree = await window.videre.readDir(selected);
      setFolderPath(selected);
      setFileTree(tree);
      setSelectedPath(null);
    }
  }, []);

  return (
    <div className="with-sidebar">
      <Sidebar
        onOpenFolder={handleOpenFolder}
        fileTree={fileTree}
        selectedPath={selectedPath}
        onSelectFile={setSelectedPath}
      />
      <ContentPane folderPath={folderPath} selectedPath={selectedPath} />
    </div>
  );
}
