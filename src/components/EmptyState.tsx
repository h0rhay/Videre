interface NoFolderStateProps {
  onOpenFolder: () => void;
}

export function NoFolderState({ onOpenFolder }: NoFolderStateProps) {
  return (
    <div className="content-box">
      <div className="center">
        <div className="stack empty-state">
          <p className="empty-state-message">Open a folder to get started.</p>
          <button type="button" className="empty-state-action" onClick={onOpenFolder}>
            Choose a folder
          </button>
        </div>
      </div>
    </div>
  );
}

export function NoFileState() {
  return (
    <div className="content-box">
      <div className="center">
        <p className="empty-state-message">Select a file from the sidebar to view it.</p>
      </div>
    </div>
  );
}
