import type { CSSProperties } from "react";
import { Icon } from "@/src/components/common/Icon";
import { getNodeIcon } from "@/src/components/lumina/nodePresentation";
import { getNodeStatusLabel, getVisibleRows } from "@/src/services/studies/study-tree-engine";

export function TreeNodeRow({
  row,
  activeNodeId,
  tone,
  onFavoriteNode,
  onSelectNode,
  onToggleExpanded,
}: {
  row: ReturnType<typeof getVisibleRows>[number];
  activeNodeId: string;
  tone: string;
  onFavoriteNode: (nodeId: string) => void;
  onSelectNode: (nodeId: string) => void;
  onToggleExpanded: (nodeId: string) => void;
}) {
  return (
    <div className="tree-row" style={{ "--depth": row.depth } as CSSProperties}>
      <button
        className={`tree-node ${activeNodeId === row.node.id ? "current" : ""} ${tone}`}
        onClick={() => onSelectNode(row.node.id)}
      >
        <span className="node-icon">
          <Icon name={getNodeIcon(row.node)} />
        </span>
        <span className="node-copy">
          <h3>{row.node.title}</h3>
          <p>{row.node.description ?? row.node.aiSummary}</p>
        </span>
        <span className="node-meta">
          <span>{getNodeStatusLabel(row.node.status)}</span>
          <span className="tiny-actions">
            {row.node.isFavorite && <Icon name="star" />}
            {row.hasChildren && (
              <span
                aria-label={row.isExpanded ? "Recolher node" : "Expandir node"}
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleExpanded(row.node.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.stopPropagation();
                    onToggleExpanded(row.node.id);
                  }
                }}
              >
                <Icon name="chevron" style={{ transform: row.isExpanded ? "rotate(180deg)" : undefined }} />
              </span>
            )}
            <span
              aria-label="Favoritar node"
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                onFavoriteNode(row.node.id);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.stopPropagation();
                  onFavoriteNode(row.node.id);
                }
              }}
            >
              <Icon name="bookmark" />
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}
