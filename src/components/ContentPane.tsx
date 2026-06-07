interface ContentPaneProps {
  folderPath: string | null;
  selectedPath: string | null;
}

export function ContentPane({ folderPath, selectedPath }: ContentPaneProps) {
  if (folderPath === null) {
    return (
      <main className="shell-content">
        <p className="shell-empty">Open a folder to get started.</p>
      </main>
    );
  }

  return (
    <main className="shell-content">
      {selectedPath !== null ? (
        <p className="shell-path">{selectedPath}</p>
      ) : (
        <p className="shell-empty">Select a file to view it.</p>
      )}
    </main>
  );
}
