import type { CSSProperties } from "react";
import { Icon } from "@/src/components/common/Icon";
import { getNodeIcon } from "@/src/components/lumina/nodePresentation";
import { NodeNotesTab } from "@/src/components/lumina/tree/NodeNotesTab";
import { formatReference } from "@backend/services/ai/lumina-ai-service";
import { getNodeStatusLabel } from "@backend/services/studies/study-tree-engine";
import type { NodePanelProps } from "@/src/components/lumina/tree/types";
import type { NodeStatus, StudyNodeType } from "@backend/types/lumina";

export function NodePanel({
  visible,
  node,
  panelTab,
  nodeNotes,
  noteDraft,
  onAddNote,
  onChangeNoteDraft,
  onChangePanelTab,
  onClosePanel,
  onFavoriteNode,
  onOpenBible,
  onOpenChat,
  onOpenFocus,
  onShare,
}: NodePanelProps) {
  if (!visible) return null;

  const summary = node.aiExplanation ?? node.aiSummary ?? node.description ?? "Nenhum resumo disponivel.";
  const progress = getNodeProgress(node.status);
  const reference = node.bibleReference ? formatReference(node.bibleReference) : null;
  const nodeTypeLabel = getNodeTypeLabel(node.type);
  const lastAccessLabel = formatPanelTimestamp(node.updatedAt);

  return (
    <aside className="node-detail-panel" aria-label="Detalhes do node">
      <div className="node-panel-grabber" />
      <header className="node-panel-header">
        <div className="node-panel-title-group">
          <h2>{node.title}</h2>
          <span className="node-type-pill">
            <Icon name={getNodeIcon(node)} />
            {nodeTypeLabel}
          </span>
        </div>
        <div className="node-panel-header-actions">
          <button
            className={`node-panel-icon-action ${node.isFavorite ? "active" : ""}`}
            aria-label="Marcar como favorito"
            onClick={() => onFavoriteNode(node.id)}
          >
            <Icon name="star" />
          </button>
          <button className="node-panel-icon-action" aria-label="Compartilhar node" onClick={onShare}>
            ...
          </button>
          <button className="node-panel-close" aria-label="Fechar painel" onClick={onClosePanel}>
            <Icon name="close" />
          </button>
        </div>
      </header>

      <section className="node-panel-section">
        <h3>Relacionado a</h3>
        {reference ? (
          <div className="node-reference-card">
            <span>
              <Icon name="book" />
              {reference}
            </span>
            <button onClick={onOpenBible}>Abrir na Biblia</button>
          </div>
        ) : (
          <p className="node-panel-muted">Nenhuma referencia biblica vinculada.</p>
        )}
      </section>

      <section className="node-panel-section">
        <h3>Resumo</h3>
        <p className="node-panel-summary">{summary}</p>
        <button className="node-panel-link" onClick={onOpenFocus}>
          Ver mais
        </button>
      </section>

      <section className="node-panel-section">
        <h3>Progresso neste no</h3>
        <div className="node-progress-card">
          <span
            className="node-progress-ring"
            style={{ "--progress": `${progress}%` } as CSSProperties}
          >
            {progress}%
          </span>
          <div>
            <strong>{getNodeStatusLabel(node.status)}</strong>
            <span>{lastAccessLabel}</span>
          </div>
        </div>
      </section>

      <section className="node-panel-section">
        <h3>Acoes</h3>
        <div className="node-panel-action-list">
          <button onClick={onOpenChat}>
            <Icon name="chat" />
            Abrir chat deste no
          </button>
          <button onClick={onOpenFocus}>
            <Icon name="book" />
            Ver explicacao completa
          </button>
          <button onClick={() => onChangePanelTab("notes")}>
            <Icon name="edit" />
            Adicionar anotacao
          </button>
          <button onClick={() => onFavoriteNode(node.id)}>
            <Icon name="star" />
            {node.isFavorite ? "Remover dos favoritos" : "Marcar como favorito"}
          </button>
          <button onClick={onShare}>
            <Icon name="share" />
            Compartilhar este no
          </button>
        </div>
      </section>

      {panelTab === "notes" && (
        <NodeNotesTab
          node={node}
          nodeNotes={nodeNotes}
          noteDraft={noteDraft}
          onAddNote={onAddNote}
          onChangeNoteDraft={onChangeNoteDraft}
        />
      )}

      <button className="node-panel-primary-action" onClick={onOpenChat}>
        Continuar estudo
      </button>
    </aside>
  );
}

function getNodeProgress(status: NodeStatus) {
  if (status === "completed") {
    return 100;
  }

  if (status === "in_progress") {
    return 50;
  }

  return 0;
}

function getNodeTypeLabel(type: StudyNodeType) {
  const labels: Record<StudyNodeType, string> = {
    root: "Raiz",
    branch: "Ramo",
    verse: "Versiculo",
    chapter: "Capitulo",
    question: "Pergunta",
    explanation: "Explicacao",
    application: "Aplicacao",
    cross_reference: "Referencia",
    note: "Anotacao",
  };

  return labels[type];
}

function formatPanelTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Ultimo acesso indisponivel";
  }

  return `Ultimo acesso: ${date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })} as ${date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
