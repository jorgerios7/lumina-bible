import type { Dispatch, SetStateAction } from "react";
import { DEMO_USER_ID } from "@/src/data/starter-content";
import { createBibleReferenceFromVerse } from "@/src/components/lumina/utils/bibleReference";
import { formatReference } from "@backend/services/ai/lumina-ai-service";
import { findNode, getBreadcrumb } from "@backend/services/studies/study-tree-engine";
import type { AppView, BibleVerse, Favorite, LuminaState, Study } from "@backend/types/lumina";

type UseLuminaFavoriteActionsProps = {
  activeStudy?: Study;
  state: LuminaState;
  setSelectedBookId: Dispatch<SetStateAction<string>>;
  setSelectedChapter: Dispatch<SetStateAction<number>>;
  setState: Dispatch<SetStateAction<LuminaState>>;
  setToast: Dispatch<SetStateAction<string>>;
  setView: Dispatch<SetStateAction<AppView>>;
};

export function useLuminaFavoriteActions({
  activeStudy,
  state,
  setSelectedBookId,
  setSelectedChapter,
  setState,
  setToast,
  setView,
}: UseLuminaFavoriteActionsProps) {
  function toggleStudyFavorite() {
    if (!activeStudy) {
      return;
    }

    const favoriteId = `favorite-study-${activeStudy.id}`;
    setState((prev) => {
      const exists = prev.favorites.some((favorite) => favorite.id === favoriteId);
      return {
        ...prev,
        favorites: exists
          ? prev.favorites.filter((favorite) => favorite.id !== favoriteId)
          : [
              ...prev.favorites,
              {
                id: favoriteId,
                userId: state.user?.id ?? DEMO_USER_ID,
                type: "study",
                studyId: activeStudy.id,
                title: `Estudo: ${activeStudy.title}`,
                createdAt: new Date().toISOString(),
              },
            ],
      };
    });
    setToast("Favorito atualizado.");
  }

  function toggleNodeFavorite(nodeId: string) {
    const node = findNode(state.nodes, nodeId);
    if (!node) {
      return;
    }

    const favoriteId = `favorite-node-${nodeId}`;
    setState((prev) => {
      const exists = prev.favorites.some((favorite) => favorite.id === favoriteId);
      return {
        ...prev,
        nodes: prev.nodes.map((item) =>
          item.id === nodeId ? { ...item, isFavorite: !exists } : item,
        ),
        favorites: exists
          ? prev.favorites.filter((favorite) => favorite.id !== favoriteId)
          : [
              ...prev.favorites,
              {
                id: favoriteId,
                userId: state.user?.id ?? DEMO_USER_ID,
                type: "node",
                studyId: node.studyId,
                nodeId: node.id,
                title: node.title,
                createdAt: new Date().toISOString(),
              },
            ],
      };
    });
    setToast("Favorito atualizado.");
  }

  function toggleVerseFavorite(verse: BibleVerse) {
    const favoriteId = `favorite-verse-${verse.id}`;
    const reference = createBibleReferenceFromVerse(verse);

    setState((prev) => {
      const exists = prev.favorites.some((favorite) => favorite.id === favoriteId);
      return {
        ...prev,
        favorites: exists
          ? prev.favorites.filter((favorite) => favorite.id !== favoriteId)
          : [
              ...prev.favorites,
              {
                id: favoriteId,
                userId: state.user?.id ?? DEMO_USER_ID,
                type: "verse",
                bibleReference: reference,
                title: formatReference(reference),
                createdAt: new Date().toISOString(),
              },
            ],
      };
    });
    setToast("Versiculo favoritado.");
  }

  function handleOpenFavorite(favorite: Favorite) {
    if (favorite.nodeId) {
      openNodeFavorite(favorite.nodeId);
    } else if (favorite.studyId) {
      openStudyFavorite(favorite.studyId);
    } else if (favorite.bibleReference?.bookId) {
      setSelectedBookId(favorite.bibleReference.bookId);
      setSelectedChapter(favorite.bibleReference.chapter);
      setView("bible");
    }
  }

  function openNodeFavorite(nodeId: string) {
    const node = findNode(state.nodes, nodeId);
    if (!node) {
      return;
    }

    setState((prev) => ({
      ...prev,
      activeStudyId: node.studyId,
      activeNodeId: node.id,
      expandedNodeIds: Array.from(new Set([
        ...prev.expandedNodeIds,
        ...getBreadcrumb(prev.nodes, node.id).map((item) => item.id),
      ])),
    }));
    setView("tree");
  }

  function openStudyFavorite(studyId: string) {
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
    setView("tree");
  }

  return {
    handleOpenFavorite,
    toggleNodeFavorite,
    toggleStudyFavorite,
    toggleVerseFavorite,
  };
}
