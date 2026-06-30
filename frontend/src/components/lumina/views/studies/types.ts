import type { AppView, Study, StudyNode } from "@backend/types/lumina";

export type StudiesViewProps = {
  activeStudy?: Study;
  studies: Study[];
  nodes: StudyNode[];
  prompt: string;
  query: string;
  onPromptChange: (value: string) => void;
  onCreateStudy: (prompt: string) => void;
  onDeleteStudy: (studyId: string) => void;
  onOpenStudy: (studyId: string, view?: AppView) => void;
};

export type StudyProgress = {
  percentage: number;
};
