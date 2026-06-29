import type { Dispatch, SetStateAction } from "react";
import { DEMO_USER_ID } from "@/src/data/starter-content";
import { deepenStudyNode } from "@backend/services/ai/lumina-ai-service";
import { createSlug, makeId } from "@backend/services/studies/study-tree-engine";
import type { AppView, LuminaState, Message, Study, StudyNode } from "@backend/types/lumina";

type UseLuminaChatActionsProps = {
  activeNode?: StudyNode;
  activeStudy?: Study;
  breadcrumb: StudyNode[];
  chatDraft: string;
  state: LuminaState;
  setChatDraft: Dispatch<SetStateAction<string>>;
  setState: Dispatch<SetStateAction<LuminaState>>;
  setToast: Dispatch<SetStateAction<string>>;
  setView: Dispatch<SetStateAction<AppView>>;
};

export function useLuminaChatActions({
  activeNode,
  activeStudy,
  breadcrumb,
  chatDraft,
  state,
  setChatDraft,
  setState,
  setToast,
  setView,
}: UseLuminaChatActionsProps) {
  function handleSendMessage() {
    const question = chatDraft.trim();
    if (!question || !activeStudy || !activeNode) {
      return;
    }

    const now = new Date().toISOString();
    const result = deepenStudyNode(
      question,
      breadcrumb.map((item) => item.title).join(" > "),
      activeNode.bibleReference,
    );
    const questionId = makeId("node");
    const explanationId = makeId("node");
    const questionPath = [...activeNode.path, createSlug(question) || "pergunta"];
    const questionNode: StudyNode = {
      id: questionId,
      userId: state.user?.id ?? DEMO_USER_ID,
      studyId: activeStudy.id,
      parentId: activeNode.id,
      rootNodeId: activeStudy.rootNodeId,
      type: "question",
      title: result.title,
      description: question,
      aiExplanation: result.answer,
      childrenIds: [explanationId],
      depth: activeNode.depth + 1,
      path: questionPath,
      status: "in_progress",
      isFavorite: false,
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    };
    const explanationNode: StudyNode = {
      id: explanationId,
      userId: state.user?.id ?? DEMO_USER_ID,
      studyId: activeStudy.id,
      parentId: questionId,
      rootNodeId: activeStudy.rootNodeId,
      type: "explanation",
      title: "Explicacao",
      description: result.answer,
      aiExplanation: `${result.answer}\n\nAplicacao: ${result.application}`,
      childrenIds: [],
      depth: activeNode.depth + 2,
      path: [...questionPath, "explicacao"],
      status: "not_started",
      isFavorite: false,
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    };

    const newMessages: Message[] = [
      {
        id: makeId("message"),
        studyId: activeStudy.id,
        nodeId: questionId,
        userId: state.user?.id ?? DEMO_USER_ID,
        role: "user",
        content: question,
        createdAt: now,
      },
      {
        id: makeId("message"),
        studyId: activeStudy.id,
        nodeId: questionId,
        userId: state.user?.id ?? DEMO_USER_ID,
        role: "assistant",
        content: `${result.answer}\n\nProximos aprofundamentos: ${result.suggestions.join("; ")}.`,
        references: activeNode.bibleReference ? [activeNode.bibleReference] : undefined,
        generatedNodeIds: [questionId, explanationId],
        createdAt: now,
      },
    ];

    setState((prev) => ({
      ...prev,
      nodes: [
        ...prev.nodes.map((node) =>
          node.id === activeNode.id
            ? {
                ...node,
                childrenIds: [...node.childrenIds, questionId],
                updatedAt: now,
              }
            : node,
        ),
        questionNode,
        explanationNode,
      ],
      messages: [...prev.messages, ...newMessages],
      studies: prev.studies.map((study) =>
        study.id === activeStudy.id
          ? {
              ...study,
              totalNodes: study.totalNodes + 2,
              updatedAt: now,
            }
          : study,
      ),
      activeNodeId: questionId,
      expandedNodeIds: Array.from(new Set([...prev.expandedNodeIds, activeNode.id, questionId])),
    }));
    setChatDraft("");
    setView("tree");
    setToast("Nova branch criada.");
  }

  function handleAskFromSuggestion(question: string) {
    setChatDraft(question);
    setView("chat");
  }

  return {
    handleAskFromSuggestion,
    handleSendMessage,
  };
}
