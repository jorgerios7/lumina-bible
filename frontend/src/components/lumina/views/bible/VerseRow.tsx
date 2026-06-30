"use client";

import { useId, useState } from "react";
import type { BibleVerse } from "@backend/types/lumina";
import { VerseActions } from "@/src/components/lumina/views/bible/VerseActions";
import type { VerseActionHandlers } from "@/src/components/lumina/views/bible/types";

type VerseRowProps = VerseActionHandlers & {
  verse: BibleVerse;
};

export function VerseRow({ verse, ...handlers }: VerseRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const menuId = useId();

  function selectVerse() {
    setIsSelected(true);
  }

  function toggleMenu() {
    setIsSelected(true);
    setIsMenuOpen((current) => !current);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <article
      className={`verse-row ${isSelected ? "selected" : ""}`}
      onClick={selectVerse}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectVerse();
        }

        if (event.key === "Escape") {
          closeMenu();
        }
      }}
      tabIndex={0}
    >
      <span className="verse-number">{verse.verse}</span>
      <div className="verse-copy">
        <p className="verse-text">{verse.text}</p>
        <VerseActions
          isMenuOpen={isMenuOpen}
          isSelected={isSelected}
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
