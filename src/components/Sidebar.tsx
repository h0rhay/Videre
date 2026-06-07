import type { FileNode } from '../../electron/ipc';
import { Toolbar } from './Toolbar';
import { FileTree } from './FileTree';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  onOpenFolder: () => void;
  fileTree: FileNode[];
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Sidebar({
  onOpenFolder,
  fileTree,
  selectedPath,
  onSelectFile,
  isDark,
  onToggleTheme,
}: SidebarProps) {
  return (
    <aside className="shell-sidebar stack">
      <h1 className="shell-title">Videre</h1>
      <Toolbar onOpenFolder={onOpenFolder} />
      <FileTree
        nodes={fileTree}
        selectedPath={selectedPath}
        onSelectFile={onSelectFile}
      />
      <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
    </aside>
  );
}
