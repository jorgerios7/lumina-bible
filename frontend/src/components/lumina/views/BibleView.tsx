import { Icon } from "@/src/components/common/Icon";
import {
  bibleCatalog,
  filterVerses,
  type BibleBookData,
} from "@backend/services/bible/bible-service";
import type { BibleVerse, Study } from "@backend/types/lumina";

export function BibleView({
  activeStudy,
  bibleBook,
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
}: {
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
}) {
  const verses = bibleBook?.versesByChapter[selectedChapter] ?? [];
  const filteredVerses = filterVerses(verses, query);

  return (
    <div className="bible-layout">
      <div className="section-header">
        <div>
          <h2>
            {bibleBook?.name ?? "Biblia"} {selectedChapter}
          </h2>
          <span className="muted">{activeStudy ? `Vinculado a ${activeStudy.title}` : "Leitura local"}</span>
        </div>
      </div>
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
      <div className="search-field">
        <Icon name="search" />
        <input
          className="text-field"
          value={query}
          onChange={(event) => onChangeQuery(event.target.value)}
          placeholder="Pesquisar neste capitulo..."
        />
      </div>
      <section className="verse-list">
        {filteredVerses.map((verse) => (
          <article className="verse-row" key={verse.id}>
            <span className="verse-number">{verse.verse}</span>
            <div>
              <p className="verse-text">{verse.text}</p>
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
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
