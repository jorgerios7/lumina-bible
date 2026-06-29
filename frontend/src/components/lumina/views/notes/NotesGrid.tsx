import { NoteCard } from "@/src/components/lumina/views/notes/NoteCard";
import type { Note } from "@backend/types/lumina";

type NotesGridProps = {
  notes: Note[];
  onDeleteNote: (noteId: string) => void;
  onUpdateNote: (noteId: string, content: string) => void;
};

export function NotesGrid({ notes, onDeleteNote, onUpdateNote }: NotesGridProps) {
  return (
    <div className="cards-grid">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDeleteNote={onDeleteNote}
          onUpdateNote={onUpdateNote}
        />
      ))}
    </div>
  );
}
