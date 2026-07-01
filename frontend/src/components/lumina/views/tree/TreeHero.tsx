import type { CSSProperties } from "react";
import { Icon } from "@/src/components/common/Icon";
import type { Study } from "@backend/types/lumina";

type TreeHeroProps = {
  activeStudy: Study;
  isCurrent: boolean;
  isFavorite: boolean;
  progress: {
    percentage: number;
    totalNodes: number;
  };
  onFavorite: () => void;
  onSelect: () => void;
};

export function TreeHero({
  activeStudy,
  isCurrent,
  isFavorite,
  progress,
  onFavorite,
  onSelect,
}: TreeHeroProps) {
  const metaItems = [
    `Estudo iniciado em ${formatStudyDate(activeStudy.createdAt)}`,
    formatNodeCount(progress.totalNodes),
    `${formatStudyDuration(activeStudy.createdAt, activeStudy.updatedAt)} de estudo`,
  ];

  return (
    <article
      className={`tree-hero ${isCurrent ? "current" : ""}`}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.currentTarget !== event.target) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <span className="hero-icon">
        <Icon name="leaf" />
      </span>
      <div className="tree-hero-copy">
        <div className="tree-hero-heading">
          <h2>{activeStudy.title}</h2>
          <button
            className={`tree-hero-favorite ${isFavorite ? "active" : ""}`}
            type="button"
            aria-label={isFavorite ? "Remover dos favoritos" : "Marcar como favorito"}
            onClick={(event) => {
              event.stopPropagation();
              onFavorite();
            }}
          >
            <Icon name="star" />
          </button>
        </div>
        <div className="tree-hero-meta">
          {metaItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p className="tree-hero-summary">{activeStudy.summary}</p>
      </div>
      <div className="tree-hero-progress" aria-label={`Progresso ${progress.percentage}%`}>
        <span
          className="tree-hero-progress-ring"
          style={{ "--progress": `${progress.percentage}%` } as CSSProperties}
        >
          {progress.percentage}%
        </span>
        <span>Progresso</span>
      </div>
    </article>
  );
}

function formatStudyDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "data indisponivel";
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function formatStudyDuration(startValue: string, endValue: string) {
  const start = new Date(startValue);
  const end = new Date(endValue);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "0m";
  }

  const totalMinutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
}

function formatNodeCount(totalNodes: number) {
  return `${totalNodes} ${totalNodes === 1 ? "no" : "nos"}`;
}
