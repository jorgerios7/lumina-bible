import type { StudyNode } from "@backend/types/lumina";

export function Breadcrumb({ nodes, onSelect }: { nodes: StudyNode[]; onSelect: (nodeId: string) => void }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {nodes.map((node, index) => (
        <span key={node.id}>
          {index > 0 && <span aria-hidden="true"> &gt; </span>}
          <button onClick={() => onSelect(node.id)}>{node.title}</button>
        </span>
      ))}
    </nav>
  );
}
