import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Markdown, type MarkdownStorage } from 'tiptap-markdown';
import { debounce } from '../lib/debounce';

interface MarkdownViewerProps {
  filePath: string;
  content: string;
}

const DEBOUNCE_MS = 500;

export function MarkdownViewer({ filePath, content }: MarkdownViewerProps) {
  const filePathRef = useRef(filePath);

  const debouncedWrite = useRef(
    debounce((path: string, markdown: string) => {
      window.videre.writeFile(path, markdown).catch((err: unknown) => {
        console.error('[videre] write failed', err);
      });
    }, DEBOUNCE_MS),
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Markdown,
    ],
    content,
    editable: true,
    onUpdate({ editor: ed }) {
      // TipTap types storage as the DOM Storage global; cast to the correct shape
      const mdStorage = (ed.storage as unknown as Record<string, MarkdownStorage | undefined>)['markdown'];
      const markdown = mdStorage?.getMarkdown() ?? ed.getHTML();
      debouncedWrite.current(filePathRef.current, markdown);
    },
  });

  useEffect(() => {
    if (editor === null) return;

    const isNewPath = filePath !== filePathRef.current;

    if (isNewPath) {
      debouncedWrite.current.cancel();
      filePathRef.current = filePath;
    }

    editor.commands.setContent(content);
  }, [filePath, content, editor]);

  return (
    <div className="markdown-viewer">
      <EditorContent editor={editor} />
    </div>
  );
}
