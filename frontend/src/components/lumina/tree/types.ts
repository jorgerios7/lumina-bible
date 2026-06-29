import type { Note, StudyNode } from "@backend/types/lumina";

export type NodePanelTab = "summary" | "verses" | "notes";

export type NodePanelProps = {
  node: StudyNode;
  panelTab: NodePanelTab;
  nodeNotes: Note[];
  noteDraft: string;
  onAddNote: (nodeId: string) => void;
  onAskFromSuggestion: (question: string) => void;
  onChangeNoteDraft: (value: string) => void;
  onChangePanelTab: (tab: NodePanelTab) => void;
  onClosePanel: () => void;
  onFavoriteNode: (nodeId: string) => void;
  onOpenBible: () => void;
  onOpenChat: () => void;
  onOpenFocus: () => void;
  onShare: () => void;
};
