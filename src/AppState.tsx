import { useCallback, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentPane } from './components/ContentPane';

export function AppState() {
  const [folderPath, setFolderPath] = useState<string | null>(null);

  const handleOpenFolder = useCallback(async () => {
    const selected = await window.videre.openFolder();
    if (selected !== null) {
      setFolderPath(selected);
    }
  }, []);

  return (
    <div className="with-sidebar">
      <Sidebar onOpenFolder={handleOpenFolder} />
      <ContentPane folderPath={folderPath} />
    </div>
  );
}
