import type { Message, StudyNode } from "@backend/types/lumina";

export type ChatViewProps = {
  activeNode: StudyNode;
  breadcrumb: StudyNode[];
  draft: string;
  messages: Message[];
  nodes: StudyNode[];
  onChangeDraft: (value: string) => void;
  onOpenBible: () => void;
  onSend: () => void;
};
