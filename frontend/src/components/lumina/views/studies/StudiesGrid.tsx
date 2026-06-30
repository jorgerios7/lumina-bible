import { StudyCard } from "@/src/components/lumina/views/studies/StudyCard";
import { computeStudyProgress } from "@backend/services/studies/study-tree-engine";
import type { Study, StudyNode } from "@backend/types/lumina";

type StudiesGridProps = {
  activeStudy?: Study;
  studies: Study[];
  nodes: StudyNode[];
  onDeleteStudy: (studyId: string) => void;
  onOpenChat: (studyId: string) => void;
  onOpenTree: (studyId: string) => void;
};

export function StudiesGrid({
  activeStudy,
  studies,
  nodes,
  onDeleteStudy,
  onOpenChat,
  onOpenTree,
}: StudiesGridProps) {
  return (
    <section className="view-stack">
      <div className="section-header">
        <h3>Estudos recentes</h3>
      </div>
      {studies.length === 0 ? (
        <p className="muted">Nenhum estudo encontrado.</p>
      ) : (
        <div className="study-grid">
          {studies.map((study) => (
            <StudyCard
              activeStudyId={activeStudy?.id}
              key={study.id}
              progress={computeStudyProgress(study, nodes)}
              study={study}
              onDeleteStudy={onDeleteStudy}
              onOpenChat={onOpenChat}
              onOpenTree={onOpenTree}
            />
          ))}
        </div>
      )}
    </section>
  );
}
