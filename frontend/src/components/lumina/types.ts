import type { Dispatch, SetStateAction } from "react";
import type { BibleBookData } from "@backend/services/bible/bible-service";
import type { NavigationViewItem } from "@/src/components/lumina/navigation";
import type { NodePanelTab } from "@/src/components/lumina/tree/types";
import type {
  AppView,
  BibleVerse,
  Favorite,
  LuminaState,
  Message,
  Study,
  StudyNode,
  User,
} from "@backend/types/lumina";

export type LuminaAppProps = {
  initialView?: AppView;
};

export type LuminaDerivedState = {
  activeMessages: Message[];
  activeNode?: StudyNode;
  activeStudy?: Study;
  breadcrumb: StudyNode[];
};

export type LuminaAppController = LuminaDerivedState & {
  authReady: boolean;
  bibleBook: BibleBookData | null;
  bibleQuery: string;
  chatDraft: string;
  isDark: boolean;
  noteDraft: string;
  panelTab: NodePanelTab;
  selectedBookId: string;
  selectedChapter: number;
  state: LuminaState;
  studyPrompt: string;
  toast: string;
  treeSearch: string;
  view: AppView;
  setBibleQuery: Dispatch<SetStateAction<string>>;
  setChatDraft: Dispatch<SetStateAction<string>>;
  setNoteDraft: Dispatch<SetStateAction<string>>;
  setPanelTab: Dispatch<SetStateAction<NodePanelTab>>;
  setSelectedBookId: Dispatch<SetStateAction<string>>;
  setSelectedChapter: Dispatch<SetStateAction<number>>;
  setStudyPrompt: Dispatch<SetStateAction<string>>;
  setToast: Dispatch<SetStateAction<string>>;
  setTreeSearch: Dispatch<SetStateAction<string>>;
  setView: Dispatch<SetStateAction<AppView>>;
  createBranchFromVerse: (verse: BibleVerse) => void;
  handleAddNote: (nodeId: string) => void;
  handleAskFromSuggestion: (question: string) => void;
  handleAuthenticatedUser: (user: User) => void;
  handleClosePanel: () => void;
  handleCollapseAll: () => void;
  handleCreateStudy: (prompt: string) => void;
  handleDeleteNote: (noteId: string) => void;
  handleDeleteStudy: (studyId: string) => void;
  handleDesktopView: (item: NavigationViewItem) => void;
  handleExpandAll: () => void;
  handleExplainVerse: (verse: BibleVerse) => void;
  handleLogout: () => void;
  handleOpenFavorite: (favorite: Favorite) => void;
  handleOpenStudy: (studyId: string, nextView?: AppView) => void;
  handleSelectNode: (nodeId: string) => void;
  handleSendMessage: () => void;
  handleUpdateNote: (noteId: string, content: string) => void;
  isViewActive: (itemView: AppView) => boolean;
  openNodeBible: () => void;
  shareNode: () => void;
  shareText: (text: string) => void;
  shareVerse: (verse: BibleVerse) => void;
  toggleExpanded: (nodeId: string) => void;
  toggleNodeFavorite: (nodeId: string) => void;
  toggleStudyFavorite: () => void;
  toggleVerseFavorite: (verse: BibleVerse) => void;
  updateSettings: (partial: Partial<LuminaState["settings"]>) => void;
};
