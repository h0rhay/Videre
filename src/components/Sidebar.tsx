import { Toolbar } from './Toolbar';

interface SidebarProps {
  onOpenFolder: () => void;
}

export function Sidebar({ onOpenFolder }: SidebarProps) {
  return (
    <aside className="shell-sidebar stack">
      <h1 className="shell-title">Videre</h1>
      <Toolbar onOpenFolder={onOpenFolder} />
    </aside>
  );
}
