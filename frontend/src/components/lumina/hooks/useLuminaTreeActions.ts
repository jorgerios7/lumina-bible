import type { Dispatch, SetStateAction } from "react";
import type { NodePanelTab } from "@/src/components/lumina/tree/types";
import type { LuminaState, Study } from "@backend/types/lumina";

type UseLuminaTreeActionsProps = {
  activeStudy?: Study;
  setNodePanelOpen: Dispatch<SetStateAction<boolean>>;
  setPanelTab: Dispatch<SetStateAction<NodePanelTab>>;
  setState: Dispatch<SetStateAction<LuminaState>>;
};

export function useLuminaTreeActions({
  activeStudy,
  setNodePanelOpen,
  setPanelTab,
  setState,
}: UseLuminaTreeActionsProps) {
  function handleSelectNode(nodeId: string) {
    setState((prev) => ({ ...prev, activeNodeId: nodeId }));
    setNodePanelOpen(true);
    setPanelTab("summary");
  }

  function handleClosePanel() {
    setNodePanelOpen(false);
  }

  function toggleExpanded(nodeId: string) {
    setState((prev) => ({
      ...prev,
      expandedNodeIds: prev.expandedNodeIds.includes(nodeId)
        ? prev.expandedNodeIds.filter((id) => id !== nodeId)
        : [...prev.expandedNodeIds, nodeId],
    }));
  }

  function handleExpandAll() {
    if (!activeStudy) {
      return;
    }

    setState((prev) => ({
      ...prev,
      expandedNodeIds: prev.nodes
        .filter((node) => node.studyId === activeStudy.id && node.childrenIds.length > 0)
        .map((node) => node.id),
    }));
  }

  function handleCollapseAll() {
    if (!activeStudy) {
      return;
    }

    setState((prev) => ({ ...prev, expandedNodeIds: [activeStudy.rootNodeId] }));
  }

  return {
    handleClosePanel,
    handleCollapseAll,
    handleExpandAll,
    handleSelectNode,
    toggleExpanded,
  };
}
