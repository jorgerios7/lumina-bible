import type { Dispatch, SetStateAction } from "react";
import { DEMO_USER_ID } from "@/src/data/starter-content";
import { findNode, makeId } from "@backend/services/studies/study-tree-engine";
import type { LuminaState, Note } from "@backend/types/lumina";

type UseLuminaNoteActionsProps = {
  noteDraft: string;
  state: LuminaState;
  setNoteDraft: Dispatch<SetStateAction<string>>;
  setState: Dispatch<SetStateAction<LuminaState>>;
  setToast: Dispatch<SetStateAction<string>>;
};

export function useLuminaNoteActions({
  noteDraft,
  state,
  setNoteDraft,
  setState,
  setToast,
}: UseLuminaNoteActionsProps) {
  function handleAddNote(nodeId: string) {
    const node = findNode(state.nodes, nodeId);
    const content = noteDraft.trim();
    if (!node || !content) {
      return;
    }

    const now = new Date().toISOString();
    const note: Note = {
      id: makeId("note"),
      userId: state.user?.id ?? DEMO_USER_ID,
      studyId: node.studyId,
      nodeId: node.id,
      bibleReference: node.bibleReference,
      title: node.title,
      content,
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => ({ ...prev, notes: [note, ...prev.notes] }));
    setNoteDraft("");
    setToast("Anotacao salva.");
  }

  function handleUpdateNote(noteId: string, content: string) {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((note) =>
        note.id === noteId ? { ...note, content, updatedAt: now } : note,
      ),
    }));
  }

  function handleDeleteNote(noteId: string) {
    setState((prev) => ({ ...prev, notes: prev.notes.filter((note) => note.id !== noteId) }));
    setToast("Anotacao excluida.");
  }

  return {
    handleAddNote,
    handleDeleteNote,
    handleUpdateNote,
  };
}
