import type { CSSProperties, ReactNode } from "react";
import { TreeNodeRow } from "@/src/components/lumina/tree/TreeNodeRow";
import { getTreeRowTone } from "@/src/components/lumina/views/tree/treeViewUtils";
import { getVisibleRows } from "@backend/services/studies/study-tree-engine";

type TreeRowsProps = {
  activeNodeId: string;
  hero: ReactNode;
  rootNodeId: string;
  rows: ReturnType<typeof getVisibleRows>;
  onFavoriteNode: (nodeId: string) => void;
  onSelectNode: (nodeId: string) => void;
  onToggleExpanded: (nodeId: string) => void;
};

export function TreeRows({
  activeNodeId,
  hero,
  rootNodeId,
  rows,
  onFavoriteNode,
  onSelectNode,
  onToggleExpanded,
}: TreeRowsProps) {
  const childRows = rows.filter((row) => row.node.id !== rootNodeId);

  return (
    <div className="tree-list">
      <div className="tree-row tree-hero-row" style={{ "--depth": 0 } as CSSProperties}>
        {hero}
      </div>
      {childRows.map((row, index) => (
        <TreeNodeRow
          activeNodeId={activeNodeId}
          key={row.node.id}
          row={row}
          tone={getTreeRowTone(index)}
          onFavoriteNode={onFavoriteNode}
          onSelectNode={onSelectNode}
          onToggleExpanded={onToggleExpanded}
        />
      ))}
    </div>
  );
}
