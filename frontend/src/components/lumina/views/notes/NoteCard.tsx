import { Icon } from "@/src/components/common/Icon";
import type { Note } from "@backend/types/lumina";

type NoteCardProps = {
  note: Note;
  onDeleteNote: (noteId: string) => void;
  onUpdateNote: (noteId: string, content: string) => void;
};

export function NoteCard({ note, onDeleteNote, onUpdateNote }: NoteCardProps) {
  return (
    <article className="note-card">
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
  );
}
