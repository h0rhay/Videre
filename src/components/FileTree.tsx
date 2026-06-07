import { useState } from 'react';
import type { FileNode } from '../../electron/ipc';

interface FileTreeProps {
  nodes: FileNode[];
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  depth?: number;
}

interface FileTreeNodeProps {
  node: FileNode;
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  depth: number;
}

function FileTreeNode({ node, selectedPath, onSelectFile, depth }: FileTreeNodeProps) {
  const [expanded, setExpanded] = useState(true);

  if (node.type === 'dir') {
    return (
      <li className="file-tree-item" data-depth={depth}>
        <button
          type="button"
          className="file-tree-dir"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          <span className="file-tree-icon" aria-hidden="true">
            {expanded ? '▾' : '▸'}
          </span>
          {node.name}
        </button>
        {expanded && node.children && node.children.length > 0 ? (
          <ul className="stack file-tree-list" role="list">
            {node.children.map((child) => (
              <FileTreeNode
                key={child.path}
                node={child}
                selectedPath={selectedPath}
                onSelectFile={onSelectFile}
                depth={depth + 1}
              />
            ))}
          </ul>
        ) : null}
      </li>
    );
  }

  const isSelected = node.path === selectedPath;

  return (
    <li className="file-tree-item" data-depth={depth}>
      <button
        type="button"
        className="file-tree-file"
        data-selected={isSelected ? 'true' : undefined}
        onClick={() => onSelectFile(node.path)}
        aria-current={isSelected ? 'true' : undefined}
      >
        {node.name}
      </button>
    </li>
  );
}

export function FileTree({ nodes, selectedPath, onSelectFile, depth = 0 }: FileTreeProps) {
  if (nodes.length === 0) {
    return <p className="shell-empty file-tree-empty">No files found.</p>;
  }

  return (
    <ul className="stack file-tree-list" role="list">
      {nodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          selectedPath={selectedPath}
          onSelectFile={onSelectFile}
          depth={depth}
        />
      ))}
    </ul>
  );
}
