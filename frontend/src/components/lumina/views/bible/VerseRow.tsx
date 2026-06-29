import type { BibleVerse } from "@backend/types/lumina";
import { VerseActions } from "@/src/components/lumina/views/bible/VerseActions";
import type { VerseActionHandlers } from "@/src/components/lumina/views/bible/types";

type VerseRowProps = VerseActionHandlers & {
  verse: BibleVerse;
};

export function VerseRow({ verse, ...handlers }: VerseRowProps) {
  return (
    <article className="verse-row">
      <span className="verse-number">{verse.verse}</span>
      <div>
        <p className="verse-text">{verse.text}</p>
        <VerseActions verse={verse} {...handlers} />
      </div>
    </article>
  );
}
