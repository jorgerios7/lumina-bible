import { Icon } from "@/src/components/common/Icon";
import type { BibleVerse } from "@backend/types/lumina";
import type { VerseActionHandlers } from "@/src/components/lumina/views/bible/types";

type VerseActionsProps = VerseActionHandlers & {
  verse: BibleVerse;
};

export function VerseActions({
  verse,
  onCreateBranch,
  onExplainVerse,
  onFavoriteVerse,
  onShareVerse,
}: VerseActionsProps) {
  return (
    <div className="verse-actions">
      <button className="chip-button" onClick={() => onExplainVerse(verse)}>
        <Icon name="chat" />
        Explicar IA
      </button>
      <button className="chip-button" onClick={() => onCreateBranch(verse)}>
        <Icon name="tree" />
        Criar branch
      </button>
      <button className="chip-button" onClick={() => onFavoriteVerse(verse)}>
        <Icon name="star" />
        Favoritar
      </button>
      <button className="chip-button" onClick={() => onShareVerse(verse)}>
        <Icon name="share" />
        Compartilhar
      </button>
    </div>
  );
}
