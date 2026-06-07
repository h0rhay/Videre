import { ThemeToggle } from './ThemeToggle';

interface EditorHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function EditorHeader({ isDark, onToggleTheme }: EditorHeaderProps) {
  return (
    <header className="cluster editor-header">
      <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
    </header>
  );
}
