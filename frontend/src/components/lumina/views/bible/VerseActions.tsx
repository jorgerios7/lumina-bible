import type { MouseEvent } from "react";
import { Icon, type IconName } from "@/src/components/common/Icon";
import type { BibleVerse } from "@backend/types/lumina";
import type { VerseActionHandlers } from "@/src/components/lumina/views/bible/types";

type VerseActionsProps = VerseActionHandlers & {
  isMenuOpen: boolean;
  isSelected: boolean;
  menuId: string;
  verse: BibleVerse;
  onCloseMenu: () => void;
  onOpenMenu: () => void;
};

export function VerseActions({
  isMenuOpen,
  isSelected,
  menuId,
  verse,
  onCreateBranch,
  onExplainVerse,
  onFavoriteVerse,
  onCloseMenu,
  onOpenMenu,
  onShareVerse,
}: VerseActionsProps) {
  function handleTriggerClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onOpenMenu();
  }

  return (
    <div className="verse-actions" onClick={(event) => event.stopPropagation()}>
      <button
        className="verse-menu-trigger"
        aria-controls={isSelected ? menuId : undefined}
        aria-expanded={isSelected && isMenuOpen}
        aria-haspopup="menu"
        aria-label={`Abrir acoes de ${verse.bookName} ${verse.chapter}:${verse.verse}`}
        onClick={handleTriggerClick}
        type="button"
      >
        <Icon name="menu" />
      </button>
      {isSelected && isMenuOpen && (
        <div className="verse-action-menu" id={menuId} role="menu">
          <VerseActionButton
            icon="chat"
            label="Explicar IA"
            onClick={() => {
              onExplainVerse(verse);
              onCloseMenu();
            }}
          />
          <VerseActionButton
            icon="tree"
            label="Criar branch"
            onClick={() => {
              onCreateBranch(verse);
              onCloseMenu();
            }}
          />
          <VerseActionButton
            icon="star"
            label="Favoritar"
            onClick={() => {
              onFavoriteVerse(verse);
              onCloseMenu();
            }}
          />
          <VerseActionButton
            icon="share"
            label="Compartilhar"
            onClick={() => {
              onShareVerse(verse);
              onCloseMenu();
            }}
          />
        </div>
      )}
    </div>
  );
}

type VerseActionButtonProps = {
  icon: IconName;
  label: string;
  onClick: () => void;
};

function VerseActionButton({ icon, label, onClick }: VerseActionButtonProps) {
  return (
    <button className="verse-action-item" onClick={onClick} role="menuitem" type="button">
      <Icon name={icon} />
      {label}
    </button>
  );
}
