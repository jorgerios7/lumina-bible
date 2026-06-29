import type { Dispatch, SetStateAction } from "react";
import { DEMO_USER_ID } from "@/src/data/starter-content";
import { createStudyWithLocalAI } from "@backend/services/ai/lumina-ai-service";
import type { AppView, LuminaState } from "@backend/types/lumina";

type UseLuminaStudyActionsProps = {
  state: LuminaState;
  setState: Dispatch<SetStateAction<LuminaState>>;
  setStudyPrompt: Dispatch<SetStateAction<string>>;
  setToast: Dispatch<SetStateAction<string>>;
  setView: Dispatch<SetStateAction<AppView>>;
};

export function useLuminaStudyActions({
  state,
  setState,
  setStudyPrompt,
  setToast,
  setView,
}: UseLuminaStudyActionsProps) {
  function handleCreateStudy(prompt: string) {
    const value = prompt.trim() || "Fe";
    const bundle = createStudyWithLocalAI(value, state.user?.id ?? DEMO_USER_ID);
    setState((prev) => ({
      ...prev,
      studies: [bundle.study, ...prev.studies],
      nodes: [...prev.nodes, ...bundle.nodes],
      messages: [...prev.messages, ...bundle.messages],
      activeStudyId: bundle.study.id,
      activeNodeId: bundle.study.rootNodeId,
      expandedNodeIds: [
        bundle.study.rootNodeId,
        ...bundle.nodes
          .filter((node) => node.parentId === bundle.study.rootNodeId)
          .slice(0, 1)
          .map((node) => node.id),
      ],
    }));
    setStudyPrompt("");
    setView("tree");
    setToast("Estudo criado.");
  }

  function handleOpenStudy(studyId: string, nextView: AppView = "tree") {
    const study = state.studies.find((item) => item.id === studyId);
    if (!study) {
      return;
    }

    setState((prev) => ({
      ...prev,
      activeStudyId: studyId,
      activeNodeId: study.rootNodeId,
      expandedNodeIds: Array.from(new Set([...prev.expandedNodeIds, study.rootNodeId])),
    }));
    setView(nextView);
  }

  function handleDeleteStudy(studyId: string) {
    const remainingStudies = state.studies.filter((study) => study.id !== studyId);
    const nextStudy = remainingStudies[0];
    setState((prev) => ({
      ...prev,
      studies: remainingStudies,
      nodes: prev.nodes.filter((node) => node.studyId !== studyId),
      messages: prev.messages.filter((message) => message.studyId !== studyId),
      favorites: prev.favorites.filter((favorite) => favorite.studyId !== studyId),
      notes: prev.notes.filter((note) => note.studyId !== studyId),
      activeStudyId: nextStudy?.id ?? "",
      activeNodeId: nextStudy?.rootNodeId ?? "",
      expandedNodeIds: nextStudy ? [nextStudy.rootNodeId] : [],
    }));
    setToast("Estudo excluido.");
  }

  return {
    handleCreateStudy,
    handleDeleteStudy,
    handleOpenStudy,
  };
}
