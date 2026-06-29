import type { Dispatch, SetStateAction } from "react";
import { shareTextWithNavigator } from "@/src/components/lumina/utils/shareText";
import type { BibleVerse, Study, StudyNode } from "@backend/types/lumina";

type UseLuminaShareActionsProps = {
  activeNode?: StudyNode;
  activeStudy?: Study;
  setToast: Dispatch<SetStateAction<string>>;
};

export function useLuminaShareActions({
  activeNode,
  activeStudy,
  setToast,
}: UseLuminaShareActionsProps) {
  function shareText(text: string) {
    shareTextWithNavigator(text);
    setToast("Conteudo pronto para compartilhar.");
  }

  function shareNode() {
    if (activeNode) {
      shareText(`${activeNode.title}\n${activeNode.aiExplanation ?? activeNode.description ?? ""}`);
    }
  }

  function shareVerse(verse: BibleVerse) {
    shareText(`${verse.bookName} ${verse.chapter}:${verse.verse}\n${verse.text}`);
  }

  function shareActiveStudy() {
    shareText(activeStudy?.title ?? "Lumina Bible");
  }

  return {
    shareActiveStudy,
    shareNode,
    shareText,
    shareVerse,
  };
}
