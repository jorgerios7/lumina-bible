import type {
  Favorite,
  Note,
  Study,
  StudyNode,
  User,
  UserSettings,
} from "@backend/types/lumina";

export type ProfileScreenProps = {
  user: User;
  studies: Study[];
  nodes: StudyNode[];
  favorites: Favorite[];
  notes: Note[];
  settings: UserSettings;
  onLogout: () => void;
  onOpenFavorites: () => void;
  onOpenNotes: () => void;
  onOpenSettings: () => void;
  onOpenStudy: (studyId: string) => void;
};

export type StudyProgressSummary = {
  completedNodes: number;
  percentage: number;
  totalNodes: number;
};
