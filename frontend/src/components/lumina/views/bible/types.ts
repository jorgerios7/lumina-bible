import type { BibleBookData } from "@backend/services/bible/bible-service";
import type { BibleVerse, Study } from "@backend/types/lumina";

export type BibleViewProps = {
  activeStudy?: Study;
  bibleBook: BibleBookData | null;
  selectedBookId: string;
  selectedChapter: number;
  query: string;
  onChangeBook: (bookId: string) => void;
  onChangeChapter: (chapter: number) => void;
  onChangeQuery: (value: string) => void;
  onCreateBranch: (verse: BibleVerse) => void;
  onExplainVerse: (verse: BibleVerse) => void;
  onFavoriteVerse: (verse: BibleVerse) => void;
  onShareVerse: (verse: BibleVerse) => void;
};

export type VerseActionHandlers = {
  onCreateBranch: (verse: BibleVerse) => void;
  onExplainVerse: (verse: BibleVerse) => void;
  onFavoriteVerse: (verse: BibleVerse) => void;
  onShareVerse: (verse: BibleVerse) => void;
};
