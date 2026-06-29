import type { Dispatch, SetStateAction } from "react";
import { DEMO_USER_ID } from "@/src/data/starter-content";
import { createBibleReferenceFromVerse } from "@/src/components/lumina/utils/bibleReference";
import { explainVerseWithLocalAI, formatReference } from "@backend/services/ai/lumina-ai-service";
import { createSlug, findNode, makeId } from "@backend/services/studies/study-tree-engine";
import type {
  AppView,
  BibleVerse,
  LuminaState,
  Message,
  Study,
  StudyNode,
} from "@backend/types/lumina";

type UseLuminaBibleActionsProps = {
  activeNode?: StudyNode;
  activeStudy?: Study;
  state: LuminaState;
  setChatDraft: Dispatch<SetStateAction<string>>;
  setSelectedBookId: Dispatch<SetStateAction<string>>;
  setSelectedChapter: Dispatch<SetStateAction<number>>;
  setState: Dispatch<SetStateAction<LuminaState>>;
  setToast: Dispatch<SetStateAction<string>>;
  setView: Dispatch<SetStateAction<AppView>>;
};

export function useLuminaBibleActions({
  activeNode,
  activeStudy,
  state,
  setChatDraft,
  setSelectedBookId,
  setSelectedChapter,
  setState,
  setToast,
  setView,
}: UseLuminaBibleActionsProps) {
  function handleExplainVerse(verse: BibleVerse) {
    const reference = createBibleReferenceFromVerse(verse);
    const explanation = explainVerseWithLocalAI(reference, verse.text, state.settings.explanationLevel);
    const now = new Date().toISOString();
    const message: Message = {
      id: makeId("message"),
      studyId: activeStudy?.id ?? "study-bible",
      nodeId: activeNode?.id ?? "bible",
      userId: state.user?.id ?? DEMO_USER_ID,
      role: "assistant",
      content: explanation,
      references: [reference],
      createdAt: now,
    };

    setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
    setChatDraft("");
    setView("chat");
  }

  function createBranchFromVerse(verse: BibleVerse) {
    if (!activeStudy) {
      return;
    }

    const root = findNode(state.nodes, activeStudy.rootNodeId);
    if (!root) {
      return;
    }

    const now = new Date().toISOString();
    const nodeId = makeId("node");
    const reference = createBibleReferenceFromVerse(verse);
    const node: StudyNode = {
      id: nodeId,
      userId: state.user?.id ?? DEMO_USER_ID,
      studyId: activeStudy.id,
      parentId: root.id,
      rootNodeId: activeStudy.rootNodeId,
      type: "verse",
      title: formatReference(reference),
      description: verse.text,
      bibleReference: reference,
      aiExplanation:
        "Branch criada a partir da leitura biblica para permitir aprofundamento contextual.",
      childrenIds: [],
      depth: 1,
      path: [...root.path, createSlug(formatReference(reference))],
      status: "not_started",
      isFavorite: false,
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => ({
      ...prev,
      nodes: [
        ...prev.nodes.map((item) =>
          item.id === root.id ? { ...item, childrenIds: [...item.childrenIds, nodeId] } : item,
        ),
        node,
      ],
      studies: prev.studies.map((study) =>
        study.id === activeStudy.id ? { ...study, totalNodes: study.totalNodes + 1 } : study,
      ),
      activeNodeId: nodeId,
      expandedNodeIds: Array.from(new Set([...prev.expandedNodeIds, root.id])),
    }));
    setView("tree");
    setToast("Branch criada.");
  }

  function openNodeBible() {
    if (activeNode?.bibleReference?.bookId) {
      setSelectedBookId(activeNode.bibleReference.bookId);
      setSelectedChapter(activeNode.bibleReference.chapter);
    }
    setView("bible");
  }

  return {
    createBranchFromVerse,
    handleExplainVerse,
    openNodeBible,
  };
}
