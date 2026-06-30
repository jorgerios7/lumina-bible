import type { Note, Study, StudyNode } from "@backend/types/lumina";
import type { NodePanelTab } from "@/src/components/lumina/tree/types";

export type TreeViewProps = {
  activeStudy: Study;
  activeNode: StudyNode;
  breadcrumb: StudyNode[];
  expandedNodeIds: string[];
  isNodePanelOpen: boolean;
  nodes: StudyNode[];
  query: string;
  panelTab: NodePanelTab;
  noteDraft: string;
  notes: Note[];
  onAddNote: (nodeId: string) => void;
  onAskFromSuggestion: (question: string) => void;
  onChangeNoteDraft: (value: string) => void;
  onChangePanelTab: (tab: NodePanelTab) => void;
  onClosePanel: () => void;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  onFavoriteNode: (nodeId: string) => void;
  onOpenBible: () => void;
  onOpenChat: () => void;
  onOpenFocus: () => void;
  onSelectNode: (nodeId: string) => void;
  onShare: () => void;
  onToggleExpanded: (nodeId: string) => void;
};
