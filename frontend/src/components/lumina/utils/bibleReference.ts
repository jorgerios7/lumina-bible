import type { BibleReference, BibleVerse } from "@backend/types/lumina";

export function createBibleReferenceFromVerse(verse: BibleVerse): BibleReference {
  return {
    book: verse.bookName,
    bookId: verse.bookId,
    chapter: verse.chapter,
    verseStart: verse.verse,
    translation: verse.translation,
  };
}
