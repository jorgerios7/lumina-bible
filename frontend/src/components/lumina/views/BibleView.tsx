"use client";

import { useEffect, useState } from "react";
import { BibleControls } from "@/src/components/lumina/views/bible/BibleControls";
import { BibleHeader } from "@/src/components/lumina/views/bible/BibleHeader";
import { VerseList } from "@/src/components/lumina/views/bible/VerseList";
import { filterVerses, getAllBibleVerses } from "@backend/services/bible/bible-service";
import { normalizeSearchText } from "@/src/components/lumina/utils/search";
import type { BibleViewProps } from "@/src/components/lumina/views/bible/types";
import type { BibleVerse } from "@backend/types/lumina";

export function BibleView({
  activeStudy,
  bibleBook,
  favorites,
  selectedBookId,
  selectedChapter,
  query,
  onChangeBook,
  onChangeChapter,
  onCreateBranch,
  onExplainVerse,
  onFavoriteVerse,
  onShareVerse,
}: BibleViewProps) {
  const [allBibleVerses, setAllBibleVerses] = useState<BibleVerse[] | null>(null);
  const verses = bibleBook?.versesByChapter[selectedChapter] ?? [];
  const isGlobalSearch = normalizeSearchText(query).length > 0;
  const isGlobalSearchLoading = isGlobalSearch && allBibleVerses === null;
  const searchSourceVerses = isGlobalSearch ? (allBibleVerses ?? []) : verses;
  const filteredVerses = filterVerses(searchSourceVerses, query);
  const favoriteVerseIds = new Set(
    favorites
      .filter((favorite) => favorite.type === "verse")
      .map((favorite) => favorite.id.replace("favorite-verse-", "")),
  );

  useEffect(() => {
    if (!isGlobalSearch || allBibleVerses) {
      return;
    }

    let active = true;

    getAllBibleVerses()
      .then((versesList) => {
        if (active) {
          setAllBibleVerses(versesList);
        }
      })
      .catch(() => {
        if (active) {
          setAllBibleVerses([]);
        }
      });

    return () => {
      active = false;
    };
  }, [allBibleVerses, isGlobalSearch]);

  return (
    <div className="bible-layout">
      <BibleHeader activeStudy={activeStudy} bibleBook={bibleBook} selectedChapter={selectedChapter} />
      <BibleControls
        bibleBook={bibleBook}
        selectedBookId={selectedBookId}
        selectedChapter={selectedChapter}
        onChangeBook={onChangeBook}
        onChangeChapter={onChangeChapter}
      />
      {isGlobalSearchLoading ? (
        <p className="muted">Buscando em toda a Biblia...</p>
      ) : (
        <VerseList
          favoriteVerseIds={favoriteVerseIds}
          showReference={isGlobalSearch}
          verses={filteredVerses}
          onCreateBranch={onCreateBranch}
          onExplainVerse={onExplainVerse}
          onFavoriteVerse={onFavoriteVerse}
          onShareVerse={onShareVerse}
        />
      )}
    </div>
  );
}
