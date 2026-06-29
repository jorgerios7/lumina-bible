import { Breadcrumb } from "@/src/components/lumina/tree/Breadcrumb";
import { NodePanel } from "@/src/components/lumina/tree/NodePanel";
import { TreeHero } from "@/src/components/lumina/views/tree/TreeHero";
import { TreeLegend } from "@/src/components/lumina/views/tree/TreeLegend";
import { TreeRows } from "@/src/components/lumina/views/tree/TreeRows";
import { TreeToolbar } from "@/src/components/lumina/views/tree/TreeToolbar";
import { computeStudyProgress, getVisibleRows } from "@backend/services/studies/study-tree-engine";
import type { TreeViewProps } from "@/src/components/lumina/views/tree/types";

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
}: TreeViewProps) {
  const rows = getVisibleRows(nodes, activeStudy.rootNodeId, expandedNodeIds, query);
  const progress = computeStudyProgress(activeStudy, nodes);
  const nodeNotes = notes.filter((note) => note.nodeId === activeNode.id);

  return (
    <div className="tree-layout">
      <section className="tree-main">
        <Breadcrumb nodes={breadcrumb} onSelect={onSelectNode} />
        <TreeToolbar
          query={query}
          onChangeQuery={onChangeQuery}
          onCollapseAll={onCollapseAll}
          onExpandAll={onExpandAll}
        />
        <TreeHero activeStudy={activeStudy} progressPercentage={progress.percentage} />
        <TreeLegend />
        <TreeRows
          activeNodeId={activeNode.id}
          rows={rows}
          onFavoriteNode={onFavoriteNode}
          onSelectNode={onSelectNode}
          onToggleExpanded={onToggleExpanded}
        />
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
