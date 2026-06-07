import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { marked } from 'marked';

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  const html = marked(content) as string;

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: html,
    editable: false,
  }, [html]);

  return (
    <div className="markdown-viewer">
      <EditorContent editor={editor} />
    </div>
  );
}
