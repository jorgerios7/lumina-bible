"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/src/components/common/Icon";
import { ProfileScreen } from "@/src/components/profile/ProfileScreen";
import { AuthLoadingScreen } from "@/src/components/lumina/auth/AuthLoadingScreen";
import { LoginScreen } from "@/src/components/lumina/auth/LoginScreen";
import { desktopViews, getViewTitle, primaryViews, type NavigationViewItem } from "@/src/components/lumina/navigation";
import { BibleView } from "@/src/components/lumina/views/BibleView";
import { ChatView } from "@/src/components/lumina/views/ChatView";
import { FavoritesView } from "@/src/components/lumina/views/FavoritesView";
import { FocusMode } from "@/src/components/lumina/views/FocusMode";
import { NotesView } from "@/src/components/lumina/views/NotesView";
import { SettingsView } from "@/src/components/lumina/views/SettingsView";
import { StudiesView } from "@/src/components/lumina/views/StudiesView";
import { TreeView } from "@/src/components/lumina/views/TreeView";
import { DEMO_USER_ID, createInitialState } from "@/src/data/starter-content";
import {
  createStudyWithLocalAI,
  deepenStudyNode,
  explainVerseWithLocalAI,
  formatReference,
} from "@/src/services/ai/lumina-ai-service";
import { getBibleBookData, type BibleBookData } from "@/src/services/bible/bible-service";
import { getFirebaseReadiness } from "@/src/services/firebase/firebase-contracts";
import {
  signOutAuthenticatedUser,
  watchAuthenticatedUser,
} from "@/src/services/firebase/firebase-auth-service";
import { cacheBibleBook } from "@/src/services/storage/indexed-bible-cache";
import { loadLuminaState, saveLuminaState } from "@/src/services/storage/local-store";
import {
  createSlug,
  findNode,
  getBreadcrumb,
  makeId,
} from "@/src/services/studies/study-tree-engine";
import type {
  AppView,
  BibleReference,
  BibleVerse,
  Favorite,
  LuminaState,
  Message,
  Note,
  StudyNode,
  User,
} from "@/src/types/lumina";

type LuminaAppProps = {
  initialView?: AppView;
};

export function LuminaApp({ initialView = "studies" }: LuminaAppProps) {
  const [state, setState] = useState<LuminaState>(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [view, setView] = useState<AppView>(initialView);
  const [studyPrompt, setStudyPrompt] = useState("");
  const [treeSearch, setTreeSearch] = useState("");
  const [chatDraft, setChatDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [toast, setToast] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("heb");
  const [selectedChapter, setSelectedChapter] = useState(11);
  const [bibleBook, setBibleBook] = useState<BibleBookData | null>(null);
  const [bibleQuery, setBibleQuery] = useState("");
  const [panelTab, setPanelTab] = useState<"summary" | "verses" | "notes">("summary");

  useEffect(() => {
    const savedState = loadLuminaState();
    const timeout = window.setTimeout(() => {
      if (savedState) {
        setState((prev) => ({ ...savedState, user: prev.user }));
      }
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    return watchAuthenticatedUser((user) => {
      setState((prev) => ({ ...prev, user }));
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveLuminaState(state);
    }
  }, [hydrated, state]);

  useEffect(() => {
    let active = true;
    getBibleBookData(selectedBookId).then((book) => {
      if (!active) {
        return;
      }

      setBibleBook(book);
      const nextChapter = book.chapters.includes(selectedChapter)
        ? selectedChapter
        : book.chapters[0] ?? 1;
      setSelectedChapter(nextChapter);
      cacheBibleBook(
        book,
        Object.values(book.versesByChapter).flat(),
      );
    });

    return () => {
      active = false;
    };
  }, [selectedBookId, selectedChapter]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const activeStudy = useMemo(
    () => state.studies.find((study) => study.id === state.activeStudyId) ?? state.studies[0],
    [state.activeStudyId, state.studies],
  );

  const activeNode = useMemo(
    () => findNode(state.nodes, state.activeNodeId) ?? findNode(state.nodes, activeStudy?.rootNodeId ?? ""),
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

  const isDark =
    state.settings.theme === "dark" ||
    (state.settings.theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (!state.user) {
    return (
      <div className={`lumina-root ${isDark ? "theme-dark" : ""} font-${state.settings.fontSize}`}>
        {authReady ? <LoginScreen onAuthenticated={handleAuthenticatedUser} /> : <AuthLoadingScreen />}
      </div>
    );
  }

  if (view === "focus" && activeNode) {
    return (
      <div className={`lumina-root ${isDark ? "theme-dark" : ""} font-${state.settings.fontSize}`}>
        <FocusMode
          node={activeNode}
          onClose={() => setView("tree")}
          onNext={() => setView("chat")}
        />
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  return (
    <div className={`lumina-root ${isDark ? "theme-dark" : ""} font-${state.settings.fontSize}`}>
      <div className="app-shell">
        <aside className="desktop-sidebar" aria-label="Navegacao principal">
          <button className="brand-mark" onClick={() => setView("studies")} aria-label="Lumina Bible">
            <Icon name="leaf" />
          </button>
          <nav className="sidebar-nav">
            {desktopViews.map((item, index) => (
              <button
                className={`sidebar-item ${isViewActive(item.view) ? "active" : ""}`}
                key={`${item.label}-${index}`}
                onClick={() => handleDesktopView(item)}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <button className="sidebar-item" onClick={() => setView("settings")}>
            <Icon name="settings" />
            <span>Ajustes</span>
          </button>
          <button
            className="sidebar-user"
            onClick={() => setView("profile")}
            aria-label="Abrir perfil do usuario"
          >
            <strong>{state.user.name}</strong>
            Ver perfil
          </button>
        </aside>

        <header className="topbar">
          <button className="icon-button" aria-label="Voltar para estudos" onClick={() => setView("studies")}>
            <Icon name="menu" />
          </button>
          <div className="topbar-title">
            <h1>{getViewTitle(view)}</h1>
            <span>{activeStudy ? `Estudo: ${activeStudy.title}` : "Lumina Bible"}</span>
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button"
              aria-label="Alternar tema"
              onClick={() => updateSettings({ theme: isDark ? "light" : "dark" })}
            >
              <Icon name={isDark ? "sun" : "moon"} />
            </button>
            <button className="icon-button" aria-label="Favoritar estudo" onClick={toggleStudyFavorite}>
              <Icon name="bookmark" />
            </button>
            <button
              className="icon-button"
              aria-label="Compartilhar estudo"
              onClick={() => shareText(activeStudy?.title ?? "Lumina Bible")}
            >
              <Icon name="share" />
            </button>
          </div>
        </header>

        <main className="main-area">
          {view === "studies" && (
            <StudiesView
              activeStudy={activeStudy}
              studies={state.studies}
              nodes={state.nodes}
              prompt={studyPrompt}
              onPromptChange={setStudyPrompt}
              onCreateStudy={handleCreateStudy}
              onDeleteStudy={handleDeleteStudy}
              onOpenStudy={handleOpenStudy}
            />
          )}
          {view === "tree" && activeStudy && activeNode && (
            <TreeView
              activeNode={activeNode}
              activeStudy={activeStudy}
              breadcrumb={breadcrumb}
              expandedNodeIds={state.expandedNodeIds}
              nodes={state.nodes}
              noteDraft={noteDraft}
              panelTab={panelTab}
              query={treeSearch}
              onAddNote={handleAddNote}
              onAskFromSuggestion={handleAskFromSuggestion}
              onChangeNoteDraft={setNoteDraft}
              onChangePanelTab={setPanelTab}
              onChangeQuery={setTreeSearch}
              onClosePanel={() => setState((prev) => ({ ...prev, activeNodeId: activeStudy.rootNodeId }))}
              onCollapseAll={handleCollapseAll}
              onExpandAll={handleExpandAll}
              onFavoriteNode={toggleNodeFavorite}
              onOpenBible={openNodeBible}
              onOpenChat={() => setView("chat")}
              onOpenFocus={() => setView("focus")}
              onSelectNode={handleSelectNode}
              onShare={shareNode}
              onToggleExpanded={toggleExpanded}
              notes={state.notes}
            />
          )}
          {view === "chat" && activeStudy && activeNode && (
            <ChatView
              activeNode={activeNode}
              breadcrumb={breadcrumb}
              draft={chatDraft}
              messages={activeMessages}
              nodes={state.nodes}
              onChangeDraft={setChatDraft}
              onOpenBible={openNodeBible}
              onSend={handleSendMessage}
            />
          )}
          {view === "bible" && (
            <BibleView
              activeStudy={activeStudy}
              bibleBook={bibleBook}
              query={bibleQuery}
              selectedBookId={selectedBookId}
              selectedChapter={selectedChapter}
              onChangeBook={setSelectedBookId}
              onChangeChapter={setSelectedChapter}
              onChangeQuery={setBibleQuery}
              onCreateBranch={createBranchFromVerse}
              onExplainVerse={handleExplainVerse}
              onFavoriteVerse={toggleVerseFavorite}
              onShareVerse={shareVerse}
            />
          )}
          {view === "profile" && (
            <ProfileScreen
              user={state.user}
              favorites={state.favorites}
              notes={state.notes}
              settings={state.settings}
              studies={state.studies}
              nodes={state.nodes}
              onLogout={handleLogout}
              onOpenFavorites={() => setView("favorites")}
              onOpenNotes={() => setView("notes")}
              onOpenSettings={() => setView("settings")}
              onOpenStudy={(studyId) => handleOpenStudy(studyId, "tree")}
            />
          )}
          {view === "favorites" && (
            <FavoritesView favorites={state.favorites} onOpenFavorite={handleOpenFavorite} />
          )}
          {view === "notes" && (
            <NotesView notes={state.notes} onDeleteNote={handleDeleteNote} onUpdateNote={handleUpdateNote} />
          )}
          {view === "settings" && (
            <SettingsView
              firebaseReadiness={getFirebaseReadiness()}
              settings={state.settings}
              onUpdateSettings={updateSettings}
            />
          )}
        </main>

        <nav className="bottom-nav" aria-label="Navegacao mobile">
          {primaryViews.map((item) => (
            <button
              className={`nav-item ${isViewActive(item.view) ? "active" : ""}`}
              key={item.view}
              onClick={() => setView(item.view)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );

  function handleAuthenticatedUser(user: User) {
    setState((prev) => ({
      ...prev,
      user,
    }));
  }

  function handleLogout() {
    signOutAuthenticatedUser().catch(() => {
      setToast("Nao foi possivel encerrar a sessao no Firebase.");
    });
    setState((prev) => ({ ...prev, user: null }));
    setView("studies");
  }

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

  function handleSelectNode(nodeId: string) {
    setState((prev) => ({ ...prev, activeNodeId: nodeId }));
    setPanelTab("summary");
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
    const reference: BibleReference = {
      book: verse.bookName,
      bookId: verse.bookId,
      chapter: verse.chapter,
      verseStart: verse.verse,
      translation: verse.translation,
    };

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

  function handleAddNote(nodeId: string) {
    const node = findNode(state.nodes, nodeId);
    const content = noteDraft.trim();
    if (!node || !content) {
      return;
    }

    const now = new Date().toISOString();
    const note: Note = {
      id: makeId("note"),
      userId: state.user?.id ?? DEMO_USER_ID,
      studyId: node.studyId,
      nodeId: node.id,
      bibleReference: node.bibleReference,
      title: node.title,
      content,
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => ({ ...prev, notes: [note, ...prev.notes] }));
    setNoteDraft("");
    setToast("Anotacao salva.");
  }

  function handleUpdateNote(noteId: string, content: string) {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((note) =>
        note.id === noteId ? { ...note, content, updatedAt: now } : note,
      ),
    }));
  }

  function handleDeleteNote(noteId: string) {
    setState((prev) => ({ ...prev, notes: prev.notes.filter((note) => note.id !== noteId) }));
    setToast("Anotacao excluida.");
  }

  function handleExplainVerse(verse: BibleVerse) {
    const reference: BibleReference = {
      book: verse.bookName,
      bookId: verse.bookId,
      chapter: verse.chapter,
      verseStart: verse.verse,
      translation: verse.translation,
    };
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
    const reference: BibleReference = {
      book: verse.bookName,
      bookId: verse.bookId,
      chapter: verse.chapter,
      verseStart: verse.verse,
      translation: verse.translation,
    };
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

  function shareNode() {
    if (activeNode) {
      shareText(`${activeNode.title}\n${activeNode.aiExplanation ?? activeNode.description ?? ""}`);
    }
  }

  function shareVerse(verse: BibleVerse) {
    shareText(`${verse.bookName} ${verse.chapter}:${verse.verse}\n${verse.text}`);
  }

  function shareText(text: string) {
    type ShareCapableNavigator = Navigator & {
      share?: (data: ShareData) => Promise<void>;
      clipboard?: Clipboard;
    };
    const browserNavigator =
      typeof window === "undefined"
        ? undefined
        : (window.navigator as ShareCapableNavigator);

    if (typeof browserNavigator?.share === "function") {
      browserNavigator.share({ text }).catch(() => undefined);
    } else if (browserNavigator?.clipboard) {
      browserNavigator.clipboard.writeText(text).catch(() => undefined);
    }
    setToast("Conteudo pronto para compartilhar.");
  }

  function handleOpenFavorite(favorite: Favorite) {
    if (favorite.nodeId) {
      const node = findNode(state.nodes, favorite.nodeId);
      if (node) {
        setState((prev) => ({
          ...prev,
          activeStudyId: node.studyId,
          activeNodeId: node.id,
          expandedNodeIds: Array.from(new Set([...prev.expandedNodeIds, ...(getBreadcrumb(prev.nodes, node.id).map((item) => item.id))])),
        }));
        setView("tree");
      }
    } else if (favorite.studyId) {
      handleOpenStudy(favorite.studyId);
    } else if (favorite.bibleReference?.bookId) {
      setSelectedBookId(favorite.bibleReference.bookId);
      setSelectedChapter(favorite.bibleReference.chapter);
      setView("bible");
    }
  }

  function updateSettings(partial: Partial<LuminaState["settings"]>) {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...partial,
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  function isViewActive(itemView: AppView) {
    if (itemView === "studies") {
      return view === "studies" || view === "chat";
    }
    return view === itemView;
  }

  function handleDesktopView(item: NavigationViewItem) {
    if (item.label === "Novo") {
      setStudyPrompt("");
      setView("studies");
      return;
    }

    setView(item.view);
  }
}
