import type { StudyNode } from "@/src/types/lumina";

export function FocusMode({
  node,
  onClose,
  onNext,
}: {
  node: StudyNode;
  onClose: () => void;
  onNext: () => void;
}) {
  return (
    <main className="focus-mode">
      <section className="focus-panel">
        <div className="inline-between">
          <button className="secondary-button" onClick={onClose}>
            Voltar
          </button>
          <button className="primary-button" onClick={onNext}>
            Proximo
          </button>
        </div>
        <span className="muted">{node.title}</span>
        <blockquote>{node.description ?? node.aiSummary ?? node.title}</blockquote>
        <article className="summary-card">
          <h3>Explicacao</h3>
          <p>{node.aiExplanation ?? "Retorne ao chat para aprofundar este node."}</p>
        </article>
        <article className="summary-card">
          <h3>Aplicacao pratica</h3>
          <p>Escolha uma acao pequena, registre uma anotacao e avance para a proxima pergunta.</p>
        </article>
      </section>
    </main>
  );
}
