import { Icon } from "@/src/components/common/Icon";
import type { Note, StudyNode } from "@backend/types/lumina";

type NodeNotesTabProps = {
  node: StudyNode;
  noteDraft: string;
  nodeNotes: Note[];
  onAddNote: (nodeId: string) => void;
  onChangeNoteDraft: (value: string) => void;
};

export function NodeNotesTab({
  node,
  noteDraft,
  nodeNotes,
  onAddNote,
  onChangeNoteDraft,
}: NodeNotesTabProps) {
  return (
    <div className="view-stack">
      {nodeNotes.map((note) => (
        <article className="note-card" key={note.id}>
          <strong>{note.title}</strong>
          <p>{note.content}</p>
        </article>
      ))}
      <textarea
        className="textarea-field"
        value={noteDraft}
        onChange={(event) => onChangeNoteDraft(event.target.value)}
        placeholder="Escreva uma anotacao..."
      />
      <button className="primary-button" onClick={() => onAddNote(node.id)}>
        <Icon name="note" />
        Salvar anotacao
      </button>
    </div>
  );
}
