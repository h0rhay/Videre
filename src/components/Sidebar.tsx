import type { FileNode } from '../../electron/ipc';
import { Toolbar } from './Toolbar';
import { FileTree } from './FileTree';

interface SidebarProps {
  onOpenFolder: () => void;
  fileTree: FileNode[];
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
}

export function Sidebar({ onOpenFolder, fileTree, selectedPath, onSelectFile }: SidebarProps) {
  return (
    <aside className="shell-sidebar stack">
      <h1 className="shell-title">Videre</h1>
      <Toolbar onOpenFolder={onOpenFolder} />
      <FileTree
        nodes={fileTree}
        selectedPath={selectedPath}
        onSelectFile={onSelectFile}
      />
    </aside>
  );
}
