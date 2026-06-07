interface ToolbarProps {
  onOpenFolder: () => void;
}

export function Toolbar({ onOpenFolder }: ToolbarProps) {
  return (
    <div className="cluster">
      <button type="button" className="shell-button" onClick={onOpenFolder}>
        Open folder
      </button>
    </div>
  );
}
