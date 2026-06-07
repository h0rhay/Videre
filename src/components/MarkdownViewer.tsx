import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Markdown, type MarkdownStorage } from 'tiptap-markdown';
import * as Tooltip from '@radix-ui/react-tooltip';
import { debounce } from '../lib/debounce';
import { resolveLink } from '../lib/resolveLink';

interface MarkdownViewerProps {
  filePath: string;
  content: string;
  onNavigate: (path: string) => void;
  onShowToast: (message: string) => void;
}

const DEBOUNCE_MS = 500;

interface AnchorRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function rectFromElement(el: HTMLElement): AnchorRect {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export function MarkdownViewer({
  filePath,
  content,
  onNavigate,
  onShowToast,
}: MarkdownViewerProps) {
  const filePathRef = useRef(filePath);
  const onNavigateRef = useRef(onNavigate);
  const onShowToastRef = useRef(onShowToast);
  const [anchorRect, setAnchorRect] = useState<AnchorRect | null>(null);
  const editorDomRef = useRef<HTMLDivElement | null>(null);

  onNavigateRef.current = onNavigate;
  onShowToastRef.current = onShowToast;

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
      Link.configure({ openOnClick: false }),
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

  const handleClick = useCallback(async (event: MouseEvent) => {
    const target = (event.target as HTMLElement).closest('a');
    if (target === null) return;

    const href = target.getAttribute('href');
    if (href === null || href === '') return;

    if (!event.metaKey) {
      return;
    }

    event.preventDefault();

    const { kind, resolved } = resolveLink(href, filePathRef.current);

    if (kind === 'external') {
      await window.videre.openExternal(resolved);
      return;
    }

    const exists = await window.videre.pathExists(resolved);
    if (exists) {
      onNavigateRef.current(resolved);
    } else {
      onShowToastRef.current('File not found');
    }
  }, []);

  const handleMouseOver = useCallback((event: MouseEvent) => {
    const target = (event.target as HTMLElement).closest('a');
    if (target === null) {
      setAnchorRect(null);
      return;
    }
    setAnchorRect(rectFromElement(target as HTMLElement));
  }, []);

  const handleMouseOut = useCallback((event: MouseEvent) => {
    const related = event.relatedTarget as HTMLElement | null;
    if (related !== null && (event.target as HTMLElement).closest('a') !== null) {
      const link = (event.target as HTMLElement).closest('a');
      if (link !== null && link.contains(related)) return;
    }
    setAnchorRect(null);
  }, []);

  useEffect(() => {
    const el = editorDomRef.current;
    if (el === null) return;
    el.addEventListener('click', handleClick);
    el.addEventListener('mouseover', handleMouseOver);
    el.addEventListener('mouseout', handleMouseOut);
    return () => {
      el.removeEventListener('click', handleClick);
      el.removeEventListener('mouseover', handleMouseOver);
      el.removeEventListener('mouseout', handleMouseOut);
    };
  }, [handleClick, handleMouseOver, handleMouseOut]);

  return (
    <div className="markdown-viewer" ref={editorDomRef}>
      <EditorContent editor={editor} />
      <Tooltip.Root open={anchorRect !== null}>
        <Tooltip.Trigger asChild>
          <span
            aria-hidden
            className="tooltip-ghost-trigger"
            style={{
              position: 'fixed',
              top: anchorRect?.top ?? 0,
              left: anchorRect?.left ?? 0,
              width: anchorRect?.width ?? 0,
              height: anchorRect?.height ?? 0,
              pointerEvents: 'none',
            }}
          />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="tooltip-content" sideOffset={6}>
            Cmd+click to open
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>
  );
}
