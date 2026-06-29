import { Icon } from "@/src/components/common/Icon";
import { formatReference } from "@backend/services/ai/lumina-ai-service";
import type { StudyNode } from "@backend/types/lumina";

type NodeVersesTabProps = {
  node: StudyNode;
  onOpenBible: () => void;
};

export function NodeVersesTab({ node, onOpenBible }: NodeVersesTabProps) {
  return (
    <div className="view-stack">
      {node.bibleReference ? (
        <article className="verse-card">
          <h3>{formatReference(node.bibleReference)}</h3>
          <p className="muted">{node.description}</p>
          <button className="secondary-button" onClick={onOpenBible}>
            <Icon name="book" />
            Abrir na Biblia
          </button>
        </article>
      ) : (
        <p className="muted">Nenhum versiculo vinculado a este node.</p>
      )}
    </div>
  );
}
