import { Icon } from "@/src/components/common/Icon";
import { formatReference } from "@backend/services/ai/lumina-ai-service";
import type { StudyNode } from "@backend/types/lumina";

type ChatReferenceGridProps = {
  references: StudyNode[];
  onOpenBible: () => void;
};

export function ChatReferenceGrid({ references, onOpenBible }: ChatReferenceGridProps) {
  return (
    <div className="reference-grid">
      {references.map((node) => (
        <article className="verse-card" key={node.id}>
          <h3>{node.bibleReference ? formatReference(node.bibleReference) : node.title}</h3>
          <p>{node.description}</p>
          <div className="button-row">
            <button className="secondary-button" onClick={onOpenBible}>
              <Icon name="book" />
              Abrir Biblia
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
