import { NodeNotesTab } from "@/src/components/lumina/tree/NodeNotesTab";
import { NodePanelActions } from "@/src/components/lumina/tree/NodePanelActions";
import { NodePanelHeader } from "@/src/components/lumina/tree/NodePanelHeader";
import { NodePanelTabs } from "@/src/components/lumina/tree/NodePanelTabs";
import { NodeSummaryTab } from "@/src/components/lumina/tree/NodeSummaryTab";
import { NodeVersesTab } from "@/src/components/lumina/tree/NodeVersesTab";
import type { NodePanelProps } from "@/src/components/lumina/tree/types";

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
}: NodePanelProps) {
  return (
    <aside className="node-detail-panel" aria-label="Detalhes do node">
      <NodePanelHeader node={node} onClosePanel={onClosePanel} />
      <NodePanelTabs activeTab={panelTab} notesCount={nodeNotes.length} onChangeTab={onChangePanelTab} />
      {panelTab === "summary" && (
        <NodeSummaryTab node={node} onAskFromSuggestion={onAskFromSuggestion} />
      )}
      {panelTab === "verses" && <NodeVersesTab node={node} onOpenBible={onOpenBible} />}
      {panelTab === "notes" && (
        <NodeNotesTab
          node={node}
          nodeNotes={nodeNotes}
          noteDraft={noteDraft}
          onAddNote={onAddNote}
          onChangeNoteDraft={onChangeNoteDraft}
        />
      )}
      <NodePanelActions
        nodeId={node.id}
        onFavoriteNode={onFavoriteNode}
        onOpenChat={onOpenChat}
        onOpenFocus={onOpenFocus}
        onShare={onShare}
      />
    </aside>
  );
}
