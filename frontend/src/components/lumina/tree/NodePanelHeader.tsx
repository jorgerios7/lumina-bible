import { Icon } from "@/src/components/common/Icon";
import { getNodeIcon } from "@/src/components/lumina/nodePresentation";
import { getNodeStatusLabel } from "@backend/services/studies/study-tree-engine";
import type { StudyNode } from "@backend/types/lumina";

type NodePanelHeaderProps = {
  node: StudyNode;
  onClosePanel: () => void;
};

export function NodePanelHeader({ node, onClosePanel }: NodePanelHeaderProps) {
  return (
    <div className="panel-header">
      <span className="node-icon">
        <Icon name={getNodeIcon(node)} />
      </span>
      <div>
        <h2>{node.title}</h2>
        <span className="muted">{getNodeStatusLabel(node.status)}</span>
      </div>
      <button className="icon-button" aria-label="Fechar painel" onClick={onClosePanel}>
        <Icon name="close" />
      </button>
    </div>
  );
}
