import { useEffect, type Dispatch, type SetStateAction } from "react";
import { getBibleBookData, type BibleBookData } from "@backend/services/bible/bible-service";
import { cacheBibleBook } from "@/src/services/storage/indexed-bible-cache";

type UseBibleBookCacheProps = {
  selectedBookId: string;
  selectedChapter: number;
  setBibleBook: Dispatch<SetStateAction<BibleBookData | null>>;
  setSelectedChapter: Dispatch<SetStateAction<number>>;
};

export function useBibleBookCache({
  selectedBookId,
  selectedChapter,
  setBibleBook,
  setSelectedChapter,
}: UseBibleBookCacheProps) {
  useEffect(() => {
    let active = true;
    getBibleBookData(selectedBookId).then((book) => {
      if (!active) {
        return;
      }

      setBibleBook(book);
      const nextChapter = book.chapters.includes(selectedChapter)
        ? selectedChapter
        : book.chapters[0] ?? 1;
      setSelectedChapter(nextChapter);
      cacheBibleBook(
        book,
        Object.values(book.versesByChapter).flat(),
      );
    });

    return () => {
      active = false;
    };
  }, [selectedBookId, selectedChapter, setBibleBook, setSelectedChapter]);
}
