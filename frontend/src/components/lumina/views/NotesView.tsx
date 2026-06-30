import { NotesGrid } from "@/src/components/lumina/views/notes/NotesGrid";
import { matchesSearchQuery } from "@/src/components/lumina/utils/search";
import type { Note } from "@backend/types/lumina";

export function NotesView({
  notes,
  query,
  onDeleteNote,
  onUpdateNote,
}: {
  notes: Note[];
  query: string;
  onDeleteNote: (noteId: string) => void;
  onUpdateNote: (noteId: string, content: string) => void;
}) {
  const filteredNotes = notes.filter((note) =>
    matchesSearchQuery(query, [note.title, note.content]),
  );

  return (
    <div className="view-stack">
      <div className="section-header">
        <h2>Anotacoes</h2>
      </div>
      {filteredNotes.length === 0 ? (
        <p className="muted">Nenhuma anotacao encontrada.</p>
      ) : (
        <NotesGrid notes={filteredNotes} onDeleteNote={onDeleteNote} onUpdateNote={onUpdateNote} />
      )}
    </div>
  );
}
