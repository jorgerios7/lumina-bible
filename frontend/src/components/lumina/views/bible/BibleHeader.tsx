import type { BibleBookData } from "@backend/services/bible/bible-service";
import type { Study } from "@backend/types/lumina";

type BibleHeaderProps = {
  activeStudy?: Study;
  bibleBook: BibleBookData | null;
  selectedChapter: number;
};

export function BibleHeader({ activeStudy, bibleBook, selectedChapter }: BibleHeaderProps) {
  return (
    <div className="section-header">
      <div>
        <h2>
          {bibleBook?.name ?? "Biblia"} {selectedChapter}
        </h2>
        <span className="muted">{activeStudy ? `Vinculado a ${activeStudy.title}` : "Leitura local"}</span>
      </div>
    </div>
  );
}
