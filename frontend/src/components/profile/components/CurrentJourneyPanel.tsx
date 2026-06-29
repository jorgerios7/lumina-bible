import type { CSSProperties } from "react";
import { Icon } from "@/src/components/common/Icon";
import { formatDate } from "@/src/components/profile/profileUtils";
import type { Study } from "@backend/types/lumina";
import type { StudyProgressSummary } from "@/src/components/profile/types";

type CurrentJourneyPanelProps = {
  primaryProgress: StudyProgressSummary;
  primaryStudy?: Study;
  onOpenStudy: (studyId: string) => void;
};

export function CurrentJourneyPanel({
  primaryProgress,
  primaryStudy,
  onOpenStudy,
}: CurrentJourneyPanelProps) {
  return (
    <article className="profile-panel profile-progress-panel">
      <div className="section-header">
        <div>
          <h3>Jornada atual</h3>
          <span className="muted">
            {primaryStudy ? primaryStudy.title : "Nenhum estudo ativo"}
          </span>
        </div>
        {primaryStudy && (
          <span
            className="progress-ring"
            style={{ "--progress": `${primaryProgress.percentage}%` } as CSSProperties}
          >
            {primaryProgress.percentage}%
          </span>
        )}
      </div>
      {primaryStudy ? (
        <>
          <p>{primaryStudy.summary}</p>
          <div className="progress-line">
            <span style={{ width: `${primaryProgress.percentage}%` }} />
          </div>
          <div className="profile-progress-meta">
            <span>
              {primaryProgress.completedNodes}/{primaryProgress.totalNodes} nodes
            </span>
            <span>Atualizado {formatDate(primaryStudy.updatedAt)}</span>
          </div>
          <button className="primary-button" onClick={() => onOpenStudy(primaryStudy.id)}>
            <Icon name="tree" />
            Continuar estudo
          </button>
        </>
      ) : (
        <p className="muted">Crie um estudo para iniciar sua jornada.</p>
      )}
    </article>
  );
}
