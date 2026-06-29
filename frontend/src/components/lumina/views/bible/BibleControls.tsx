import { bibleCatalog, type BibleBookData } from "@backend/services/bible/bible-service";

type BibleControlsProps = {
  bibleBook: BibleBookData | null;
  selectedBookId: string;
  selectedChapter: number;
  onChangeBook: (bookId: string) => void;
  onChangeChapter: (chapter: number) => void;
};

export function BibleControls({
  bibleBook,
  selectedBookId,
  selectedChapter,
  onChangeBook,
  onChangeChapter,
}: BibleControlsProps) {
  return (
    <div className="bible-controls">
      <select className="select-field" value={selectedBookId} onChange={(event) => onChangeBook(event.target.value)}>
        {bibleCatalog.map((book) => (
          <option key={book.id} value={book.id}>
            {book.name}
          </option>
        ))}
      </select>
      <select
        className="select-field"
        value={selectedChapter}
        onChange={(event) => onChangeChapter(Number(event.target.value))}
      >
        {(bibleBook?.chapters ?? [selectedChapter]).map((chapter) => (
          <option key={chapter} value={chapter}>
            Capitulo {chapter}
          </option>
        ))}
      </select>
    </div>
  );
}
