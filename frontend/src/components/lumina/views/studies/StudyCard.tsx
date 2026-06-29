import type { CSSProperties } from "react";
import { Icon } from "@/src/components/common/Icon";
import type { Study } from "@backend/types/lumina";
import type { StudyProgress } from "@/src/components/lumina/views/studies/types";

type StudyCardProps = {
  activeStudyId?: string;
  progress: StudyProgress;
  study: Study;
  onDeleteStudy: (studyId: string) => void;
  onOpenChat: (studyId: string) => void;
  onOpenTree: (studyId: string) => void;
};

export function StudyCard({
  activeStudyId,
  progress,
  study,
  onDeleteStudy,
  onOpenChat,
  onOpenTree,
}: StudyCardProps) {
  return (
    <article className="study-card">
      <div className="study-card-header">
        <span className="brand-mark">
          <Icon name="leaf" />
        </span>
        <span
          className="progress-ring"
          style={{ "--progress": `${progress.percentage}%` } as CSSProperties}
        >
          {progress.percentage}%
        </span>
      </div>
      <div>
        <h3>{study.title}</h3>
        <p className="muted">{study.summary}</p>
      </div>
      <div className="progress-line">
        <span style={{ width: `${progress.percentage}%` }} />
      </div>
      <div className="button-row">
        <button className="secondary-button" onClick={() => onOpenTree(study.id)}>
          <Icon name="tree" />
          Arvore
        </button>
        <button className="secondary-button" onClick={() => onOpenChat(study.id)}>
          <Icon name="chat" />
          Continuar
        </button>
        {study.id !== activeStudyId && (
          <button className="ghost-button" onClick={() => onDeleteStudy(study.id)}>
            <Icon name="trash" />
            Excluir
          </button>
        )}
      </div>
    </article>
  );
}
