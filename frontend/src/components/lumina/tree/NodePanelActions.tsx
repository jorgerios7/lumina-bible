import { Icon } from "@/src/components/common/Icon";

type NodePanelActionsProps = {
  nodeId: string;
  onFavoriteNode: (nodeId: string) => void;
  onOpenChat: () => void;
  onOpenFocus: () => void;
  onShare: () => void;
};

export function NodePanelActions({
  nodeId,
  onFavoriteNode,
  onOpenChat,
  onOpenFocus,
  onShare,
}: NodePanelActionsProps) {
  return (
    <div className="action-list">
      <button className="secondary-button" onClick={onOpenChat}>
        <Icon name="chat" />
        Abrir chat deste node
      </button>
      <button className="secondary-button" onClick={onOpenFocus}>
        <Icon name="book" />
        Modo foco
      </button>
      <button className="secondary-button" onClick={() => onFavoriteNode(nodeId)}>
        <Icon name="star" />
        Marcar como favorito
      </button>
      <button className="secondary-button" onClick={onShare}>
        <Icon name="share" />
        Compartilhar este node
      </button>
    </div>
  );
}
