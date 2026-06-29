import type { BibleVerse } from "@backend/types/lumina";
import { VerseRow } from "@/src/components/lumina/views/bible/VerseRow";
import type { VerseActionHandlers } from "@/src/components/lumina/views/bible/types";

type VerseListProps = VerseActionHandlers & {
  verses: BibleVerse[];
};

export function VerseList({ verses, ...handlers }: VerseListProps) {
  return (
    <section className="verse-list">
      {verses.map((verse) => (
        <VerseRow key={verse.id} verse={verse} {...handlers} />
      ))}
    </section>
  );
}
