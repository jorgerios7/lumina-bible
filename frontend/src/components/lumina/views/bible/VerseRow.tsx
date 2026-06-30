"use client";

import { useId, useState } from "react";
import { Icon } from "@/src/components/common/Icon";
import type { BibleVerse } from "@backend/types/lumina";
import { VerseActions } from "@/src/components/lumina/views/bible/VerseActions";
import type { VerseActionHandlers } from "@/src/components/lumina/views/bible/types";

type VerseRowProps = VerseActionHandlers & {
  isFavorite: boolean;
  verse: BibleVerse;
};

export function VerseRow({ isFavorite, verse, ...handlers }: VerseRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();

  function toggleMenu() {
    setIsMenuOpen((current) => !current);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <article
      className={`verse-row ${isFavorite ? "favorite" : ""} ${isMenuOpen ? "menu-open" : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          closeMenu();
        }
      }}
    >
      <span className="verse-number">{verse.verse}</span>
      <div className="verse-copy">
        <p className="verse-text">
          {verse.text}
          {isFavorite && (
            <span className="verse-favorite-mark" aria-label="Versiculo favoritado" title="Favorito">
              <Icon name="star" />
            </span>
          )}
        </p>
        <VerseActions
          isMenuOpen={isMenuOpen}
          isFavorite={isFavorite}
          menuId={menuId}
          verse={verse}
          onCloseMenu={closeMenu}
          onOpenMenu={toggleMenu}
          {...handlers}
        />
      </div>
    </article>
  );
}
