import { useMemo } from "react";
import { findNode, getBreadcrumb } from "@backend/services/studies/study-tree-engine";
import type { LuminaDerivedState } from "@/src/components/lumina/types";
import type { LuminaState } from "@backend/types/lumina";

export function useLuminaDerivedState(state: LuminaState): LuminaDerivedState {
  const activeStudy = useMemo(
    () => state.studies.find((study) => study.id === state.activeStudyId) ?? state.studies[0],
    [state.activeStudyId, state.studies],
  );

  const activeNode = useMemo(
    () =>
      findNode(state.nodes, state.activeNodeId) ??
      findNode(state.nodes, activeStudy?.rootNodeId ?? "") ??
      undefined,
    [activeStudy?.rootNodeId, state.activeNodeId, state.nodes],
  );

  const breadcrumb = useMemo(
    () => (activeNode ? getBreadcrumb(state.nodes, activeNode.id) : []),
    [activeNode, state.nodes],
  );

  const activeMessages = useMemo(
    () =>
      state.messages
        .filter((message) => message.nodeId === activeNode?.id || message.nodeId === activeStudy?.rootNodeId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [activeNode?.id, activeStudy?.rootNodeId, state.messages],
  );

  return {
    activeMessages,
    activeNode,
    activeStudy,
    breadcrumb,
  };
}
