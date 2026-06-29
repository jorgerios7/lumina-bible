import type { CSSProperties } from "react";
import { Icon } from "@/src/components/common/Icon";
import type { Study } from "@backend/types/lumina";

type TreeHeroProps = {
  activeStudy: Study;
  progressPercentage: number;
};

export function TreeHero({ activeStudy, progressPercentage }: TreeHeroProps) {
  return (
    <article className="tree-hero">
      <span className="hero-icon">
        <Icon name="leaf" />
      </span>
      <div>
        <h2>{activeStudy.title}</h2>
        <p>{activeStudy.summary}</p>
      </div>
      <span
        className="progress-ring"
        style={{ "--progress": `${progressPercentage}%` } as CSSProperties}
      >
        {progressPercentage}%
      </span>
    </article>
  );
}
