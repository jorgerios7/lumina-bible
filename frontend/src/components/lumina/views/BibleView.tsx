import { BibleControls } from "@/src/components/lumina/views/bible/BibleControls";
import { BibleHeader } from "@/src/components/lumina/views/bible/BibleHeader";
import { BibleSearch } from "@/src/components/lumina/views/bible/BibleSearch";
import { VerseList } from "@/src/components/lumina/views/bible/VerseList";
import { filterVerses } from "@backend/services/bible/bible-service";
import type { BibleViewProps } from "@/src/components/lumina/views/bible/types";

export function BibleView({
  activeStudy,
  bibleBook,
  favorites,
  selectedBookId,
  selectedChapter,
  query,
  onChangeBook,
  onChangeChapter,
  onChangeQuery,
  onCreateBranch,
  onExplainVerse,
  onFavoriteVerse,
  onShareVerse,
}: BibleViewProps) {
  const verses = bibleBook?.versesByChapter[selectedChapter] ?? [];
  const filteredVerses = filterVerses(verses, query);
  const favoriteVerseIds = new Set(
    favorites
      .filter((favorite) => favorite.type === "verse")
      .map((favorite) => favorite.id.replace("favorite-verse-", "")),
  );

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
      <BibleSearch query={query} onChangeQuery={onChangeQuery} />
      <VerseList
        favoriteVerseIds={favoriteVerseIds}
        verses={filteredVerses}
        onCreateBranch={onCreateBranch}
        onExplainVerse={onExplainVerse}
        onFavoriteVerse={onFavoriteVerse}
        onShareVerse={onShareVerse}
      />
    </div>
  );
}
