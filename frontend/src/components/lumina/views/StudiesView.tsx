import { StudiesGrid } from "@/src/components/lumina/views/studies/StudiesGrid";
import { StudyPromptPanel } from "@/src/components/lumina/views/studies/StudyPromptPanel";
import { SuggestedTopicsPanel } from "@/src/components/lumina/views/studies/SuggestedTopicsPanel";
import { matchesSearchQuery } from "@/src/components/lumina/utils/search";
import type { StudiesViewProps } from "@/src/components/lumina/views/studies/types";

export function StudiesView({
  activeStudy,
  studies,
  nodes,
  prompt,
  query,
  onPromptChange,
  onCreateStudy,
  onDeleteStudy,
  onOpenStudy,
}: StudiesViewProps) {
  const filteredStudies = studies.filter((study) =>
    matchesSearchQuery(query, [study.title, study.summary, study.theme]),
  );

  return (
    <div className="view-stack">
      <StudyPromptPanel
        prompt={prompt}
        onCreateStudy={onCreateStudy}
        onPromptChange={onPromptChange}
      />
      <StudiesGrid
        activeStudy={activeStudy}
        studies={filteredStudies}
        nodes={nodes}
        onDeleteStudy={onDeleteStudy}
        onOpenChat={(studyId) => onOpenStudy(studyId, "chat")}
        onOpenTree={(studyId) => onOpenStudy(studyId, "tree")}
      />
      <SuggestedTopicsPanel onCreateStudy={onCreateStudy} />
    </div>
  );
}
