import { NotesGrid } from "@/src/components/lumina/views/notes/NotesGrid";
import type { Note } from "@backend/types/lumina";

export function NotesView({
  notes,
  onDeleteNote,
  onUpdateNote,
}: {
  notes: Note[];
  onDeleteNote: (noteId: string) => void;
  onUpdateNote: (noteId: string, content: string) => void;
}) {
  return (
    <div className="view-stack">
      <div className="section-header">
        <h2>Anotacoes</h2>
      </div>
      {notes.length === 0 ? (
        <p className="muted">Nenhuma anotacao encontrada.</p>
      ) : (
        <NotesGrid notes={notes} onDeleteNote={onDeleteNote} onUpdateNote={onUpdateNote} />
      )}
    </div>
  );
}
