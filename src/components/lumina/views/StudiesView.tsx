import type { CSSProperties } from "react";
import { Icon } from "@/src/components/common/Icon";
import { suggestedTopics } from "@/src/data/starter-content";
import { computeStudyProgress } from "@/src/services/studies/study-tree-engine";
import type { AppView, Study, StudyNode } from "@/src/types/lumina";

export function StudiesView({
  activeStudy,
  studies,
  nodes,
  prompt,
  onPromptChange,
  onCreateStudy,
  onDeleteStudy,
  onOpenStudy,
}: {
  activeStudy?: Study;
  studies: Study[];
  nodes: StudyNode[];
  prompt: string;
  onPromptChange: (value: string) => void;
  onCreateStudy: (prompt: string) => void;
  onDeleteStudy: (studyId: string) => void;
  onOpenStudy: (studyId: string, view?: AppView) => void;
}) {
  return (
    <div className="view-stack">
      <section className="home-prompt">
        <div className="section-header">
          <div>
            <h2>O que deseja estudar hoje?</h2>
            <span className="muted">Tema, pergunta, duvida, versiculo ou capitulo.</span>
          </div>
        </div>
        <div className="prompt-row">
          <div className="search-field">
            <Icon name="search" />
            <input
              className="text-field"
              value={prompt}
              onChange={(event) => onPromptChange(event.target.value)}
              placeholder="Ex.: Quero estudar fe"
            />
          </div>
          <button className="primary-button" onClick={() => onCreateStudy(prompt)}>
            <Icon name="plus" />
            Criar estudo
          </button>
        </div>
      </section>

      <section className="view-stack">
        <div className="section-header">
          <h3>Estudos recentes</h3>
        </div>
        <div className="study-grid">
          {studies.map((study) => {
            const progress = computeStudyProgress(study, nodes);
            return (
              <article className="study-card" key={study.id}>
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
                  <button className="secondary-button" onClick={() => onOpenStudy(study.id, "tree")}>
                    <Icon name="tree" />
                    Arvore
                  </button>
                  <button className="secondary-button" onClick={() => onOpenStudy(study.id, "chat")}>
                    <Icon name="chat" />
                    Continuar
                  </button>
                  {study.id !== activeStudy?.id && (
                    <button className="ghost-button" onClick={() => onDeleteStudy(study.id)}>
                      <Icon name="trash" />
                      Excluir
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="view-stack">
        <div className="section-header">
          <h3>Temas sugeridos</h3>
        </div>
        <div className="topic-grid">
          {suggestedTopics.map((topic) => (
            <button className="chip-button" key={topic} onClick={() => onCreateStudy(topic)}>
              {topic}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
