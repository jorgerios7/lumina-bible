export type StudyNodeType =
  | "root"
  | "branch"
  | "verse"
  | "chapter"
  | "question"
  | "explanation"
  | "application"
  | "cross_reference"
  | "note";

export type NodeStatus = "not_started" | "in_progress" | "completed";
export type StudyStatus = "active" | "completed" | "archived";
export type MessageRole = "user" | "assistant" | "system";
export type ThemePreference = "light" | "dark" | "system";
export type FontSizePreference =
  | "small"
  | "medium"
  | "large"
  | "extra_large";
export type ExplanationLevel = "beginner" | "intermediate" | "advanced";
export type FavoriteType = "study" | "node" | "verse";
export type AppView =
  | "studies"
  | "tree"
  | "chat"
  | "bible"
  | "profile"
  | "settings"
  | "favorites"
  | "notes"
  | "focus";

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BibleReference {
  book: string;
  bookId?: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  translation?: string;
}

export interface BibleBook {
  id: string;
  name: string;
  abbreviation: string;
  testament: "old" | "new";
  order: number;
}

export interface BibleVerse {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

export interface Study {
  id: string;
  userId: string;
  title: string;
  theme: string;
  rootNodeId: string;
  summary?: string;
  totalNodes: number;
  completedNodes: number;
  status: StudyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StudyNode {
  id: string;
  userId: string;
  studyId: string;
  parentId: string | null;
  rootNodeId: string;
  type: StudyNodeType;
  title: string;
  description?: string;
  bibleReference?: BibleReference;
  aiExplanation?: string;
  aiSummary?: string;
  childrenIds: string[];
  depth: number;
  path: string[];
  status: NodeStatus;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  studyId: string;
  nodeId: string;
  userId: string;
  role: MessageRole;
  content: string;
  generatedNodeIds?: string[];
  references?: BibleReference[];
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  type: FavoriteType;
  studyId?: string;
  nodeId?: string;
  bibleReference?: BibleReference;
  title: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  studyId?: string;
  nodeId?: string;
  bibleReference?: BibleReference;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  userId: string;
  theme: ThemePreference;
  fontSize: FontSizePreference;
  explanationLevel: ExplanationLevel;
  preferredTranslation: string;
  createdAt: string;
  updatedAt: string;
}

export interface LuminaState {
  user: User | null;
  studies: Study[];
  nodes: StudyNode[];
  messages: Message[];
  favorites: Favorite[];
  notes: Note[];
  settings: UserSettings;
  activeStudyId: string;
  activeNodeId: string;
  expandedNodeIds: string[];
}

export interface StudyBundle {
  study: Study;
  nodes: StudyNode[];
  messages: Message[];
}

export interface TreeRow {
  node: StudyNode;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
}
