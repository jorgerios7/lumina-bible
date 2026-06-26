import { Icon } from "@/src/components/common/Icon";
import type { Note } from "@/src/types/lumina";

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
        <div className="cards-grid">
          {notes.map((note) => (
            <article className="note-card" key={note.id}>
              <div className="inline-between">
                <strong>{note.title}</strong>
                <button className="icon-button" onClick={() => onDeleteNote(note.id)} aria-label="Excluir anotacao">
                  <Icon name="trash" />
                </button>
              </div>
              <textarea
                className="textarea-field"
                value={note.content}
                onChange={(event) => onUpdateNote(note.id, event.target.value)}
              />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
