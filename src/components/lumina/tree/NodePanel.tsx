import { Icon } from "@/src/components/common/Icon";
import { getNodeIcon } from "@/src/components/lumina/nodePresentation";
import { formatReference } from "@/src/services/ai/lumina-ai-service";
import { getNodeStatusLabel } from "@/src/services/studies/study-tree-engine";
import type { Note, StudyNode } from "@/src/types/lumina";

export function NodePanel({
  node,
  panelTab,
  nodeNotes,
  noteDraft,
  onAddNote,
  onAskFromSuggestion,
  onChangeNoteDraft,
  onChangePanelTab,
  onClosePanel,
  onFavoriteNode,
  onOpenBible,
  onOpenChat,
  onOpenFocus,
  onShare,
}: {
  node: StudyNode;
  panelTab: "summary" | "verses" | "notes";
  nodeNotes: Note[];
  noteDraft: string;
  onAddNote: (nodeId: string) => void;
  onAskFromSuggestion: (question: string) => void;
  onChangeNoteDraft: (value: string) => void;
  onChangePanelTab: (tab: "summary" | "verses" | "notes") => void;
  onClosePanel: () => void;
  onFavoriteNode: (nodeId: string) => void;
  onOpenBible: () => void;
  onOpenChat: () => void;
  onOpenFocus: () => void;
  onShare: () => void;
}) {
  const suggestions = [
    "Como este texto aponta para Cristo?",
    "Qual aplicacao pratica nasce daqui?",
    "Que referencia cruzada ajuda neste tema?",
  ];

  return (
    <aside className="node-detail-panel" aria-label="Detalhes do node">
      <div className="panel-header">
        <span className="node-icon">
          <Icon name={getNodeIcon(node)} />
        </span>
        <div>
          <h2>{node.title}</h2>
          <span className="muted">{getNodeStatusLabel(node.status)}</span>
        </div>
        <button className="icon-button" aria-label="Fechar painel" onClick={onClosePanel}>
          <Icon name="close" />
        </button>
      </div>
      <div className="panel-tabs">
        <button className={panelTab === "summary" ? "active" : ""} onClick={() => onChangePanelTab("summary")}>
          Resumo
        </button>
        <button className={panelTab === "verses" ? "active" : ""} onClick={() => onChangePanelTab("verses")}>
          Versiculos
        </button>
        <button className={panelTab === "notes" ? "active" : ""} onClick={() => onChangePanelTab("notes")}>
          Anotacoes ({nodeNotes.length})
        </button>
      </div>
      {panelTab === "summary" && (
        <div className="view-stack">
          <p>{node.aiExplanation ?? node.aiSummary ?? node.description}</p>
          <div className="view-stack">
            <strong>Proximo passo sugerido</strong>
            {suggestions.map((suggestion) => (
              <button className="secondary-button" key={suggestion} onClick={() => onAskFromSuggestion(suggestion)}>
                <Icon name="chat" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      {panelTab === "verses" && (
        <div className="view-stack">
          {node.bibleReference ? (
            <article className="verse-card">
              <h3>{formatReference(node.bibleReference)}</h3>
              <p className="muted">{node.description}</p>
              <button className="secondary-button" onClick={onOpenBible}>
                <Icon name="book" />
                Abrir na Biblia
              </button>
            </article>
          ) : (
            <p className="muted">Nenhum versiculo vinculado a este node.</p>
          )}
        </div>
      )}
      {panelTab === "notes" && (
        <div className="view-stack">
          {nodeNotes.map((note) => (
            <article className="note-card" key={note.id}>
              <strong>{note.title}</strong>
              <p>{note.content}</p>
            </article>
          ))}
          <textarea
            className="textarea-field"
            value={noteDraft}
            onChange={(event) => onChangeNoteDraft(event.target.value)}
            placeholder="Escreva uma anotacao..."
          />
          <button className="primary-button" onClick={() => onAddNote(node.id)}>
            <Icon name="note" />
            Salvar anotacao
          </button>
        </div>
      )}
      <div className="action-list">
        <button className="secondary-button" onClick={onOpenChat}>
          <Icon name="chat" />
          Abrir chat deste node
        </button>
        <button className="secondary-button" onClick={onOpenFocus}>
          <Icon name="book" />
          Modo foco
        </button>
        <button className="secondary-button" onClick={() => onFavoriteNode(node.id)}>
          <Icon name="star" />
          Marcar como favorito
        </button>
        <button className="secondary-button" onClick={onShare}>
          <Icon name="share" />
          Compartilhar este node
        </button>
      </div>
    </aside>
  );
}
