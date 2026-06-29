import type { StudyNode } from "@backend/types/lumina";

type FocusContentProps = {
  node: StudyNode;
};

export function FocusContent({ node }: FocusContentProps) {
  return (
    <>
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
    </>
  );
}
