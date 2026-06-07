import type { Editor } from '@tiptap/react';
import {
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
}

interface Item {
  key: string;
  label: string;
  icon: typeof Bold;
  run: () => void;
  active?: boolean;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const items: Item[] = [
    { key: 'undo', label: 'Undo', icon: Undo2, run: () => editor.chain().focus().undo().run() },
    { key: 'redo', label: 'Redo', icon: Redo2, run: () => editor.chain().focus().redo().run() },
    {
      key: 'h1',
      label: 'Heading 1',
      icon: Heading1,
      run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive('heading', { level: 1 }),
    },
    {
      key: 'h2',
      label: 'Heading 2',
      icon: Heading2,
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive('heading', { level: 2 }),
    },
    {
      key: 'h3',
      label: 'Heading 3',
      icon: Heading3,
      run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive('heading', { level: 3 }),
    },
    {
      key: 'bold',
      label: 'Bold',
      icon: Bold,
      run: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive('bold'),
    },
    {
      key: 'italic',
      label: 'Italic',
      icon: Italic,
      run: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive('italic'),
    },
    {
      key: 'strike',
      label: 'Strikethrough',
      icon: Strikethrough,
      run: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive('strike'),
    },
    {
      key: 'code',
      label: 'Inline code',
      icon: Code,
      run: () => editor.chain().focus().toggleCode().run(),
      active: editor.isActive('code'),
    },
    {
      key: 'bullet',
      label: 'Bullet list',
      icon: List,
      run: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive('bulletList'),
    },
    {
      key: 'ordered',
      label: 'Numbered list',
      icon: ListOrdered,
      run: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive('orderedList'),
    },
    {
      key: 'quote',
      label: 'Blockquote',
      icon: Quote,
      run: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive('blockquote'),
    },
  ];

  return (
    <div className="editor-toolbar cluster" role="toolbar" aria-label="Formatting">
      {items.map(({ key, label, icon: Icon, run, active }) => (
        <button
          key={key}
          type="button"
          className="editor-toolbar-button"
          aria-label={label}
          data-active={active ? 'true' : undefined}
          // Keep the editor focused so the command applies and the toolbar
          // does not hide on click.
          onMouseDown={(e) => e.preventDefault()}
          onClick={run}
        >
          <Icon size={16} aria-hidden />
        </button>
      ))}
    </div>
  );
}
