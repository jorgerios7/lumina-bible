import type { BibleVerse } from "@backend/types/lumina";
import { VerseRow } from "@/src/components/lumina/views/bible/VerseRow";
import type { VerseActionHandlers } from "@/src/components/lumina/views/bible/types";

type VerseListProps = VerseActionHandlers & {
  favoriteVerseIds: Set<string>;
  verses: BibleVerse[];
};

export function VerseList({ favoriteVerseIds, verses, ...handlers }: VerseListProps) {
  return (
    <section className="verse-list">
      {verses.map((verse) => (
        <VerseRow
          isFavorite={favoriteVerseIds.has(verse.id)}
          key={verse.id}
          verse={verse}
          {...handlers}
        />
      ))}
    </section>
  );
}
