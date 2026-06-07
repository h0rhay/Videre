interface ContentPaneProps {
  folderPath: string | null;
}

export function ContentPane({ folderPath }: ContentPaneProps) {
  return (
    <main className="shell-content">
      {folderPath === null ? (
        <p className="shell-empty">Open a folder to get started.</p>
      ) : (
        <p className="shell-path">{folderPath}</p>
      )}
    </main>
  );
}
