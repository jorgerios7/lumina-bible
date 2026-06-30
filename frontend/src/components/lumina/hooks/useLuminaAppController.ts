"use client";

import { useState } from "react";
import { createInitialState } from "@/src/data/starter-content";
import { useBibleBookCache } from "@/src/components/lumina/hooks/useBibleBookCache";
import { useLuminaAuthActions } from "@/src/components/lumina/hooks/useLuminaAuthActions";
import { useLuminaAuthWatcher } from "@/src/components/lumina/hooks/useLuminaAuthWatcher";
import { useLuminaBibleActions } from "@/src/components/lumina/hooks/useLuminaBibleActions";
import { useLuminaChatActions } from "@/src/components/lumina/hooks/useLuminaChatActions";
import { useLuminaDerivedState } from "@/src/components/lumina/hooks/useLuminaDerivedState";
import { useLuminaFavoriteActions } from "@/src/components/lumina/hooks/useLuminaFavoriteActions";
import { useLuminaNavigationActions } from "@/src/components/lumina/hooks/useLuminaNavigationActions";
import { useLuminaNoteActions } from "@/src/components/lumina/hooks/useLuminaNoteActions";
import { useLuminaPersistence } from "@/src/components/lumina/hooks/useLuminaPersistence";
import { useLuminaSettingsActions } from "@/src/components/lumina/hooks/useLuminaSettingsActions";
import { useLuminaShareActions } from "@/src/components/lumina/hooks/useLuminaShareActions";
import { useLuminaStudyActions } from "@/src/components/lumina/hooks/useLuminaStudyActions";
import { useLuminaTreeActions } from "@/src/components/lumina/hooks/useLuminaTreeActions";
import { useToastAutoDismiss } from "@/src/components/lumina/hooks/useToastAutoDismiss";
import { resolveIsDarkTheme } from "@/src/components/lumina/utils/theme";
import type { LuminaAppController } from "@/src/components/lumina/types";
import type { NodePanelTab } from "@/src/components/lumina/tree/types";
import type { AppView } from "@backend/types/lumina";
import type { BibleBookData } from "@backend/services/bible/bible-service";

export function useLuminaAppController(initialView: AppView): LuminaAppController {
  const [state, setState] = useState(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [view, setView] = useState<AppView>(initialView);
  const [studyPrompt, setStudyPrompt] = useState("");
  const [studiesQuery, setStudiesQuery] = useState("");
  const [treeSearch, setTreeSearch] = useState("");
  const [chatDraft, setChatDraft] = useState("");
  const [chatQuery, setChatQuery] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [notesQuery, setNotesQuery] = useState("");
  const [favoritesQuery, setFavoritesQuery] = useState("");
  const [toast, setToast] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("heb");
  const [selectedChapter, setSelectedChapter] = useState(11);
  const [bibleBook, setBibleBook] = useState<BibleBookData | null>(null);
  const [bibleQuery, setBibleQuery] = useState("");
  const [panelTab, setPanelTab] = useState<NodePanelTab>("summary");
  const [isNodePanelOpen, setNodePanelOpen] = useState(false);

  useLuminaPersistence({ hydrated, state, setHydrated, setState });
  useLuminaAuthWatcher({ setAuthReady, setState });
  useBibleBookCache({ selectedBookId, selectedChapter, setBibleBook, setSelectedChapter });
  useToastAutoDismiss({ toast, setToast });

  const derived = useLuminaDerivedState(state);
  const isDark = resolveIsDarkTheme(state.settings);

  const authActions = useLuminaAuthActions({ setState, setToast, setView });
  const studyActions = useLuminaStudyActions({
    state,
    setState,
    setStudyPrompt,
    setToast,
    setView,
  });
  const treeActions = useLuminaTreeActions({
    activeStudy: derived.activeStudy,
    setNodePanelOpen,
    setPanelTab,
    setState,
  });
  const favoriteActions = useLuminaFavoriteActions({
    activeStudy: derived.activeStudy,
    state,
    setSelectedBookId,
    setSelectedChapter,
    setState,
    setToast,
    setView,
  });
  const chatActions = useLuminaChatActions({
    activeNode: derived.activeNode,
    activeStudy: derived.activeStudy,
    breadcrumb: derived.breadcrumb,
    chatDraft,
    state,
    setChatDraft,
    setState,
    setToast,
    setView,
  });
  const noteActions = useLuminaNoteActions({
    noteDraft,
    state,
    setNoteDraft,
    setState,
    setToast,
  });
  const bibleActions = useLuminaBibleActions({
    activeNode: derived.activeNode,
    activeStudy: derived.activeStudy,
    state,
    setChatDraft,
    setSelectedBookId,
    setSelectedChapter,
    setState,
    setToast,
    setView,
  });
  const shareActions = useLuminaShareActions({
    activeNode: derived.activeNode,
    activeStudy: derived.activeStudy,
    setToast,
  });
  const settingsActions = useLuminaSettingsActions({ setState });
  const navigationActions = useLuminaNavigationActions({ view, setStudyPrompt, setView });

  return {
    state,
    authReady,
    view,
    setView,
    studyPrompt,
    setStudyPrompt,
    studiesQuery,
    setStudiesQuery,
    treeSearch,
    setTreeSearch,
    chatDraft,
    setChatDraft,
    chatQuery,
    setChatQuery,
    noteDraft,
    setNoteDraft,
    notesQuery,
    setNotesQuery,
    favoritesQuery,
    setFavoritesQuery,
    toast,
    setToast,
    selectedBookId,
    setSelectedBookId,
    selectedChapter,
    setSelectedChapter,
    bibleBook,
    bibleQuery,
    setBibleQuery,
    panelTab,
    setPanelTab,
    isNodePanelOpen,
    setNodePanelOpen,
    isDark,
    ...derived,
    ...authActions,
    ...studyActions,
    ...treeActions,
    ...favoriteActions,
    ...chatActions,
    ...noteActions,
    ...bibleActions,
    shareNode: shareActions.shareNode,
    shareText: shareActions.shareText,
    shareVerse: shareActions.shareVerse,
    ...settingsActions,
    ...navigationActions,
  };
}
