import { TreeNodeRow } from "@/src/components/lumina/tree/TreeNodeRow";
import { getTreeRowTone } from "@/src/components/lumina/views/tree/treeViewUtils";
import { getVisibleRows } from "@backend/services/studies/study-tree-engine";

type TreeRowsProps = {
  activeNodeId: string;
  rows: ReturnType<typeof getVisibleRows>;
  onFavoriteNode: (nodeId: string) => void;
  onSelectNode: (nodeId: string) => void;
  onToggleExpanded: (nodeId: string) => void;
};

export function TreeRows({
  activeNodeId,
  rows,
  onFavoriteNode,
  onSelectNode,
  onToggleExpanded,
}: TreeRowsProps) {
  return (
    <div className="tree-list">
      {rows.map((row, index) => (
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
