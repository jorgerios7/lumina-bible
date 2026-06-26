import type { CSSProperties } from "react";
import { Icon } from "@/src/components/common/Icon";
import { Breadcrumb } from "@/src/components/lumina/tree/Breadcrumb";
import { NodePanel } from "@/src/components/lumina/tree/NodePanel";
import { TreeNodeRow } from "@/src/components/lumina/tree/TreeNodeRow";
import { computeStudyProgress, getVisibleRows } from "@/src/services/studies/study-tree-engine";
import type { Note, Study, StudyNode } from "@/src/types/lumina";

export function TreeView({
  activeStudy,
  activeNode,
  breadcrumb,
  expandedNodeIds,
  nodes,
  query,
  panelTab,
  noteDraft,
  notes,
  onAddNote,
  onAskFromSuggestion,
  onChangeNoteDraft,
  onChangePanelTab,
  onChangeQuery,
  onClosePanel,
  onCollapseAll,
  onExpandAll,
  onFavoriteNode,
  onOpenBible,
  onOpenChat,
  onOpenFocus,
  onSelectNode,
  onShare,
  onToggleExpanded,
}: {
  activeStudy: Study;
  activeNode: StudyNode;
  breadcrumb: StudyNode[];
  expandedNodeIds: string[];
  nodes: StudyNode[];
  query: string;
  panelTab: "summary" | "verses" | "notes";
  noteDraft: string;
  notes: Note[];
  onAddNote: (nodeId: string) => void;
  onAskFromSuggestion: (question: string) => void;
  onChangeNoteDraft: (value: string) => void;
  onChangePanelTab: (tab: "summary" | "verses" | "notes") => void;
  onChangeQuery: (value: string) => void;
  onClosePanel: () => void;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  onFavoriteNode: (nodeId: string) => void;
  onOpenBible: () => void;
  onOpenChat: () => void;
  onOpenFocus: () => void;
  onSelectNode: (nodeId: string) => void;
  onShare: () => void;
  onToggleExpanded: (nodeId: string) => void;
}) {
  const rows = getVisibleRows(nodes, activeStudy.rootNodeId, expandedNodeIds, query);
  const progress = computeStudyProgress(activeStudy, nodes);
  const nodeNotes = notes.filter((note) => note.nodeId === activeNode.id);

  return (
    <div className="tree-layout">
      <section className="tree-main">
        <Breadcrumb nodes={breadcrumb} onSelect={onSelectNode} />
        <div className="tree-toolbar">
          <div className="search-field">
            <Icon name="search" />
            <input
              className="text-field"
              placeholder="Buscar na arvore..."
              value={query}
              onChange={(event) => onChangeQuery(event.target.value)}
            />
          </div>
          <div className="button-row">
            <button className="secondary-button" onClick={onExpandAll}>
              <Icon name="plus" />
              Expandir tudo
            </button>
            <button className="secondary-button" onClick={onCollapseAll}>
              <Icon name="chevron" />
              Recolher
            </button>
          </div>
        </div>

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
            style={{ "--progress": `${progress.percentage}%` } as CSSProperties}
          >
            {progress.percentage}%
          </span>
        </article>

        <div className="legend">
          <span>
            <i className="status-dot" />
            Nao iniciado
          </span>
          <span>
            <i className="status-dot in_progress" />
            Em andamento
          </span>
          <span>
            <i className="status-dot completed" />
            Concluido
          </span>
          <span>
            <Icon name="star" />
            Favorito
          </span>
        </div>

        <div className="tree-list">
          {rows.map((row, index) => (
            <TreeNodeRow
              activeNodeId={activeNode.id}
              key={row.node.id}
              row={row}
              tone={index % 3 === 1 ? "branch-blue" : index % 3 === 2 ? "branch-purple" : ""}
              onFavoriteNode={onFavoriteNode}
              onSelectNode={onSelectNode}
              onToggleExpanded={onToggleExpanded}
            />
          ))}
        </div>
      </section>

      <NodePanel
        node={activeNode}
        nodeNotes={nodeNotes}
        noteDraft={noteDraft}
        panelTab={panelTab}
        onAddNote={onAddNote}
        onAskFromSuggestion={onAskFromSuggestion}
        onChangeNoteDraft={onChangeNoteDraft}
        onChangePanelTab={onChangePanelTab}
        onClosePanel={onClosePanel}
        onFavoriteNode={onFavoriteNode}
        onOpenBible={onOpenBible}
        onOpenChat={onOpenChat}
        onOpenFocus={onOpenFocus}
        onShare={onShare}
      />
    </div>
  );
}
