import { useState, useEffect } from 'react';
import { categoriseFile } from '../lib/fileType';
import { MarkdownViewer } from './MarkdownViewer';
import { UnsupportedPane } from './UnsupportedPane';
import { NoFolderState, NoFileState } from './EmptyState';
import { EditorHeader } from './EditorHeader';

interface ContentPaneProps {
  selectedPath: string | null;
  folderOpen: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (path: string) => void;
  onShowToast: (message: string) => void;
  onOpenFolder: () => void;
}

export function ContentPane({
  selectedPath,
  folderOpen,
  isDark,
  onToggleTheme,
  onNavigate,
  onShowToast,
  onOpenFolder,
}: ContentPaneProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPath === null) {
      setContent(null);
      setError(null);
      return;
    }

    const category = categoriseFile(selectedPath);
    if (category !== 'markdown') {
      setContent(null);
      setError(null);
      return;
    }

    let cancelled = false;

    window.videre.readFile(selectedPath).then(
      (text) => {
        if (!cancelled) {
          setContent(text);
          setError(null);
        }
      },
      (err: unknown) => {
        if (!cancelled) {
          setContent(null);
          setError(err instanceof Error ? err.message : 'Failed to read file.');
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [selectedPath]);

  return (
    <main className="shell-content stack">
      <EditorHeader isDark={isDark} onToggleTheme={onToggleTheme} />
      {selectedPath === null && !folderOpen ? (
        <NoFolderState onOpenFolder={onOpenFolder} />
      ) : selectedPath === null ? (
        <NoFileState />
      ) : categoriseFile(selectedPath) !== 'markdown' ? (
        <UnsupportedPane />
      ) : error !== null ? (
        <div className="content-box">
          <div className="center">
            <p className="content-error">{error}</p>
          </div>
        </div>
      ) : content !== null ? (
        <div className="content-box">
          <div className="center">
            <div className="stack">
              <MarkdownViewer
                filePath={selectedPath}
                content={content}
                onNavigate={onNavigate}
                onShowToast={onShowToast}
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
