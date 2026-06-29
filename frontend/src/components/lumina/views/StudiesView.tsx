import { StudiesGrid } from "@/src/components/lumina/views/studies/StudiesGrid";
import { StudyPromptPanel } from "@/src/components/lumina/views/studies/StudyPromptPanel";
import { SuggestedTopicsPanel } from "@/src/components/lumina/views/studies/SuggestedTopicsPanel";
import type { StudiesViewProps } from "@/src/components/lumina/views/studies/types";

export function StudiesView({
  activeStudy,
  studies,
  nodes,
  prompt,
  onPromptChange,
  onCreateStudy,
  onDeleteStudy,
  onOpenStudy,
}: StudiesViewProps) {
  return (
    <div className="view-stack">
      <StudyPromptPanel
        prompt={prompt}
        onCreateStudy={onCreateStudy}
        onPromptChange={onPromptChange}
      />
      <StudiesGrid
        activeStudy={activeStudy}
        studies={studies}
        nodes={nodes}
        onDeleteStudy={onDeleteStudy}
        onOpenChat={(studyId) => onOpenStudy(studyId, "chat")}
        onOpenTree={(studyId) => onOpenStudy(studyId, "tree")}
      />
      <SuggestedTopicsPanel onCreateStudy={onCreateStudy} />
    </div>
  );
}
