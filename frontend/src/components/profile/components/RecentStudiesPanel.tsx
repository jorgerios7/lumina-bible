import { computeStudyProgress } from "@backend/services/studies/study-tree-engine";
import type { Study, StudyNode } from "@backend/types/lumina";

type RecentStudiesPanelProps = {
  nodes: StudyNode[];
  recentStudies: Study[];
  onOpenStudy: (studyId: string) => void;
};

export function RecentStudiesPanel({ nodes, recentStudies, onOpenStudy }: RecentStudiesPanelProps) {
  return (
    <article className="profile-panel">
      <div className="section-header">
        <h3>Estudos recentes</h3>
      </div>
      <div className="profile-study-list">
        {recentStudies.map((study) => {
          const progress = computeStudyProgress(study, nodes);

          return (
            <button key={study.id} onClick={() => onOpenStudy(study.id)}>
              <span>
                <strong>{study.title}</strong>
                <small>{study.summary}</small>
              </span>
              <em>{progress.percentage}%</em>
            </button>
          );
        })}
      </div>
    </article>
  );
}
