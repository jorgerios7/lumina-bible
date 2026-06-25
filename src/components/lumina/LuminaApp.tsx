"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Icon, type IconName } from "@/src/components/common/Icon";
import { ProfileScreen } from "@/src/components/profile/ProfileScreen";
import { DEMO_USER_ID, createInitialState, suggestedTopics } from "@/src/data/starter-content";
import {
  createStudyWithLocalAI,
  deepenStudyNode,
  explainVerseWithLocalAI,
  formatReference,
} from "@/src/services/ai/lumina-ai-service";
import {
  bibleCatalog,
  filterVerses,
  getBibleBookData,
  type BibleBookData,
} from "@/src/services/bible/bible-service";
import { getFirebaseReadiness } from "@/src/services/firebase/firebase-contracts";
import {
  createEmailAccount,
  getAuthErrorMessage,
  requestPasswordReset,
  signInWithEmail,
  signInWithGoogle,
  signOutAuthenticatedUser,
  watchAuthenticatedUser,
} from "@/src/services/firebase/firebase-auth-service";
import { cacheBibleBook } from "@/src/services/storage/indexed-bible-cache";
import { loadLuminaState, saveLuminaState } from "@/src/services/storage/local-store";
import {
  computeStudyProgress,
  createSlug,
  findNode,
  getBreadcrumb,
  getChildren,
  getNodeStatusLabel,
  getVisibleRows,
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
  Study,
  StudyNode,
  User,
} from "@/src/types/lumina";

type LuminaAppProps = {
  initialView?: AppView;
};

const primaryViews: Array<{ view: AppView; label: string; icon: IconName }> = [
  { view: "studies", label: "Estudos", icon: "home" },
  { view: "bible", label: "Biblia", icon: "book" },
  { view: "profile", label: "Perfil", icon: "user" },
];

const desktopViews: Array<{ view: AppView; label: string; icon: IconName }> = [
  { view: "studies", label: "Estudos", icon: "home" },
  { view: "studies", label: "Novo", icon: "plus" },
  { view: "tree", label: "Arvore", icon: "tree" },
  { view: "studies", label: "Recentes", icon: "clock" },
  { view: "favorites", label: "Favoritos", icon: "star" },
  { view: "notes", label: "Anotacoes", icon: "note" },
];

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

  function handleDesktopView(item: { view: AppView; label: string }) {
    if (item.label === "Novo") {
      setStudyPrompt("");
      setView("studies");
      return;
    }

    setView(item.view);
  }
}

function AuthLoadingScreen() {
  return (
    <main className="auth-screen">
      <section className="auth-panel" aria-live="polite">
        <span className="brand-mark">
          <Icon name="leaf" />
        </span>
        <h1 className="auth-title">Lumina Bible</h1>
        <p className="auth-copy">Verificando sessao do Firebase...</p>
      </section>
    </main>
  );
}

function LoginScreen({
  onAuthenticated,
}: {
  onAuthenticated: (user: User) => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    if (!normalizedEmail) {
      setError("Informe um e-mail para continuar.");
      return;
    }

    if (mode === "signup" && normalizedName.length < 2) {
      setError("Informe seu nome para criar a conta.");
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setError("");
    setRecoverySent(false);

    try {
      setIsSubmitting(true);
      const authenticatedUser =
        mode === "signup"
          ? await createEmailAccount({
              name: normalizedName,
              email: normalizedEmail,
              password,
            })
          : await signInWithEmail(normalizedEmail, password);

      onAuthenticated(authenticatedUser);
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function recoverPassword() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Informe o e-mail antes de recuperar a senha.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await requestPasswordReset(normalizedEmail);
      setRecoverySent(true);
    } catch (recoverError) {
      setError(getAuthErrorMessage(recoverError));
      setRecoverySent(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function loginWithGoogle() {
    try {
      setIsSubmitting(true);
      setError("");
      setRecoverySent(false);
      const authenticatedUser = await signInWithGoogle();
      onAuthenticated(authenticatedUser);
    } catch (googleError) {
      setError(getAuthErrorMessage(googleError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-panel" aria-labelledby="login-title">
        <span className="brand-mark">
          <Icon name="leaf" />
        </span>
        <h1 className="auth-title" id="login-title">
          Lumina Bible
        </h1>
        <p className="auth-copy">Estudos biblicos guiados em uma arvore de aprendizado.</p>
        <div className="form-stack">
          <div className="auth-mode-toggle" role="tablist" aria-label="Modo de acesso">
            <button
              aria-selected={mode === "login"}
              className={mode === "login" ? "active" : ""}
              disabled={isSubmitting}
              onClick={() => {
                setMode("login");
                setError("");
              }}
              role="tab"
              type="button"
            >
              Entrar
            </button>
            <button
              aria-selected={mode === "signup"}
              className={mode === "signup" ? "active" : ""}
              disabled={isSubmitting}
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              role="tab"
              type="button"
            >
              Criar conta
            </button>
          </div>
          <button className="secondary-button" disabled={isSubmitting} onClick={loginWithGoogle}>
            <Icon name="user" />
            Entrar com Google
          </button>
          <form className="form-stack" onSubmit={submit}>
            {mode === "signup" && (
              <label className="field-label">
                Nome
                <input
                  className="text-field"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                  disabled={isSubmitting}
                  placeholder="Seu nome"
                  required
                />
              </label>
            )}
            <label className="field-label">
              E-mail
              <input
                className="text-field"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                  setRecoverySent(false);
                }}
                disabled={isSubmitting}
                placeholder="voce@email.com"
                required
              />
            </label>
            <label className="field-label">
              Senha
              <input
                className="text-field"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                disabled={isSubmitting}
                minLength={6}
                placeholder="Minimo 6 caracteres"
                required
              />
            </label>
            {error && <p className="auth-alert error">{error}</p>}
            {recoverySent && (
              <p className="auth-alert success">Link de recuperacao enviado para {email.trim()}.</p>
            )}
            <button className="primary-button" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Processando..." : mode === "signup" ? "Criar conta" : "Entrar"}
            </button>
          </form>
          <button className="ghost-button" disabled={isSubmitting} onClick={recoverPassword}>
            Recuperar senha
          </button>
        </div>
      </section>
    </main>
  );
}

function StudiesView({
  activeStudy,
  studies,
  nodes,
  prompt,
  onPromptChange,
  onCreateStudy,
  onDeleteStudy,
  onOpenStudy,
}: {
  activeStudy?: Study;
  studies: Study[];
  nodes: StudyNode[];
  prompt: string;
  onPromptChange: (value: string) => void;
  onCreateStudy: (prompt: string) => void;
  onDeleteStudy: (studyId: string) => void;
  onOpenStudy: (studyId: string, view?: AppView) => void;
}) {
  return (
    <div className="view-stack">
      <section className="home-prompt">
        <div className="section-header">
          <div>
            <h2>O que deseja estudar hoje?</h2>
            <span className="muted">Tema, pergunta, duvida, versiculo ou capitulo.</span>
          </div>
        </div>
        <div className="prompt-row">
          <div className="search-field">
            <Icon name="search" />
            <input
              className="text-field"
              value={prompt}
              onChange={(event) => onPromptChange(event.target.value)}
              placeholder="Ex.: Quero estudar fe"
            />
          </div>
          <button className="primary-button" onClick={() => onCreateStudy(prompt)}>
            <Icon name="plus" />
            Criar estudo
          </button>
        </div>
      </section>

      <section className="view-stack">
        <div className="section-header">
          <h3>Estudos recentes</h3>
        </div>
        <div className="study-grid">
          {studies.map((study) => {
            const progress = computeStudyProgress(study, nodes);
            return (
              <article className="study-card" key={study.id}>
                <div className="study-card-header">
                  <span className="brand-mark">
                    <Icon name="leaf" />
                  </span>
                  <span
                    className="progress-ring"
                    style={{ "--progress": `${progress.percentage}%` } as CSSProperties}
                  >
                    {progress.percentage}%
                  </span>
                </div>
                <div>
                  <h3>{study.title}</h3>
                  <p className="muted">{study.summary}</p>
                </div>
                <div className="progress-line">
                  <span style={{ width: `${progress.percentage}%` }} />
                </div>
                <div className="button-row">
                  <button className="secondary-button" onClick={() => onOpenStudy(study.id, "tree")}>
                    <Icon name="tree" />
                    Arvore
                  </button>
                  <button className="secondary-button" onClick={() => onOpenStudy(study.id, "chat")}>
                    <Icon name="chat" />
                    Continuar
                  </button>
                  {study.id !== activeStudy?.id && (
                    <button className="ghost-button" onClick={() => onDeleteStudy(study.id)}>
                      <Icon name="trash" />
                      Excluir
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="view-stack">
        <div className="section-header">
          <h3>Temas sugeridos</h3>
        </div>
        <div className="topic-grid">
          {suggestedTopics.map((topic) => (
            <button className="chip-button" key={topic} onClick={() => onCreateStudy(topic)}>
              {topic}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function TreeView({
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
}: {
  activeStudy: Study;
  activeNode: StudyNode;
  breadcrumb: StudyNode[];
  expandedNodeIds: string[];
  nodes: StudyNode[];
  query: string;
  panelTab: "summary" | "verses" | "notes";
  noteDraft: string;
  notes: Note[];
  onAddNote: (nodeId: string) => void;
  onAskFromSuggestion: (question: string) => void;
  onChangeNoteDraft: (value: string) => void;
  onChangePanelTab: (tab: "summary" | "verses" | "notes") => void;
  onChangeQuery: (value: string) => void;
  onClosePanel: () => void;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  onFavoriteNode: (nodeId: string) => void;
  onOpenBible: () => void;
  onOpenChat: () => void;
  onOpenFocus: () => void;
  onSelectNode: (nodeId: string) => void;
  onShare: () => void;
  onToggleExpanded: (nodeId: string) => void;
}) {
  const rows = getVisibleRows(nodes, activeStudy.rootNodeId, expandedNodeIds, query);
  const progress = computeStudyProgress(activeStudy, nodes);
  const nodeNotes = notes.filter((note) => note.nodeId === activeNode.id);

  return (
    <div className="tree-layout">
      <section className="tree-main">
        <Breadcrumb nodes={breadcrumb} onSelect={onSelectNode} />
        <div className="tree-toolbar">
          <div className="search-field">
            <Icon name="search" />
            <input
              className="text-field"
              placeholder="Buscar na arvore..."
              value={query}
              onChange={(event) => onChangeQuery(event.target.value)}
            />
          </div>
          <div className="button-row">
            <button className="secondary-button" onClick={onExpandAll}>
              <Icon name="plus" />
              Expandir tudo
            </button>
            <button className="secondary-button" onClick={onCollapseAll}>
              <Icon name="chevron" />
              Recolher
            </button>
          </div>
        </div>

        <article className="tree-hero">
          <span className="hero-icon">
            <Icon name="leaf" />
          </span>
          <div>
            <h2>{activeStudy.title}</h2>
            <p>{activeStudy.summary}</p>
          </div>
          <span
            className="progress-ring"
            style={{ "--progress": `${progress.percentage}%` } as CSSProperties}
          >
            {progress.percentage}%
          </span>
        </article>

        <div className="legend">
          <span>
            <i className="status-dot" />
            Nao iniciado
          </span>
          <span>
            <i className="status-dot in_progress" />
            Em andamento
          </span>
          <span>
            <i className="status-dot completed" />
            Concluido
          </span>
          <span>
            <Icon name="star" />
            Favorito
          </span>
        </div>

        <div className="tree-list">
          {rows.map((row, index) => (
            <TreeNodeRow
              activeNodeId={activeNode.id}
              key={row.node.id}
              row={row}
              tone={index % 3 === 1 ? "branch-blue" : index % 3 === 2 ? "branch-purple" : ""}
              onFavoriteNode={onFavoriteNode}
              onSelectNode={onSelectNode}
              onToggleExpanded={onToggleExpanded}
            />
          ))}
        </div>
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

function Breadcrumb({ nodes, onSelect }: { nodes: StudyNode[]; onSelect: (nodeId: string) => void }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {nodes.map((node, index) => (
        <span key={node.id}>
          {index > 0 && <span aria-hidden="true"> &gt; </span>}
          <button onClick={() => onSelect(node.id)}>{node.title}</button>
        </span>
      ))}
    </nav>
  );
}

function TreeNodeRow({
  row,
  activeNodeId,
  tone,
  onFavoriteNode,
  onSelectNode,
  onToggleExpanded,
}: {
  row: ReturnType<typeof getVisibleRows>[number];
  activeNodeId: string;
  tone: string;
  onFavoriteNode: (nodeId: string) => void;
  onSelectNode: (nodeId: string) => void;
  onToggleExpanded: (nodeId: string) => void;
}) {
  return (
    <div className="tree-row" style={{ "--depth": row.depth } as CSSProperties}>
      <button
        className={`tree-node ${activeNodeId === row.node.id ? "current" : ""} ${tone}`}
        onClick={() => onSelectNode(row.node.id)}
      >
        <span className="node-icon">
          <Icon name={getNodeIcon(row.node)} />
        </span>
        <span className="node-copy">
          <h3>{row.node.title}</h3>
          <p>{row.node.description ?? row.node.aiSummary}</p>
        </span>
        <span className="node-meta">
          <span>{getNodeStatusLabel(row.node.status)}</span>
          <span className="tiny-actions">
            {row.node.isFavorite && <Icon name="star" />}
            {row.hasChildren && (
              <span
                aria-label={row.isExpanded ? "Recolher node" : "Expandir node"}
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleExpanded(row.node.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.stopPropagation();
                    onToggleExpanded(row.node.id);
                  }
                }}
              >
                <Icon name="chevron" style={{ transform: row.isExpanded ? "rotate(180deg)" : undefined }} />
              </span>
            )}
            <span
              aria-label="Favoritar node"
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                onFavoriteNode(row.node.id);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.stopPropagation();
                  onFavoriteNode(row.node.id);
                }
              }}
            >
              <Icon name="bookmark" />
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}

function NodePanel({
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
}: {
  node: StudyNode;
  panelTab: "summary" | "verses" | "notes";
  nodeNotes: Note[];
  noteDraft: string;
  onAddNote: (nodeId: string) => void;
  onAskFromSuggestion: (question: string) => void;
  onChangeNoteDraft: (value: string) => void;
  onChangePanelTab: (tab: "summary" | "verses" | "notes") => void;
  onClosePanel: () => void;
  onFavoriteNode: (nodeId: string) => void;
  onOpenBible: () => void;
  onOpenChat: () => void;
  onOpenFocus: () => void;
  onShare: () => void;
}) {
  const suggestions = [
    "Como este texto aponta para Cristo?",
    "Qual aplicacao pratica nasce daqui?",
    "Que referencia cruzada ajuda neste tema?",
  ];

  return (
    <aside className="node-detail-panel" aria-label="Detalhes do node">
      <div className="panel-header">
        <span className="node-icon">
          <Icon name={getNodeIcon(node)} />
        </span>
        <div>
          <h2>{node.title}</h2>
          <span className="muted">{getNodeStatusLabel(node.status)}</span>
        </div>
        <button className="icon-button" aria-label="Fechar painel" onClick={onClosePanel}>
          <Icon name="close" />
        </button>
      </div>
      <div className="panel-tabs">
        <button className={panelTab === "summary" ? "active" : ""} onClick={() => onChangePanelTab("summary")}>
          Resumo
        </button>
        <button className={panelTab === "verses" ? "active" : ""} onClick={() => onChangePanelTab("verses")}>
          Versiculos
        </button>
        <button className={panelTab === "notes" ? "active" : ""} onClick={() => onChangePanelTab("notes")}>
          Anotacoes ({nodeNotes.length})
        </button>
      </div>
      {panelTab === "summary" && (
        <div className="view-stack">
          <p>{node.aiExplanation ?? node.aiSummary ?? node.description}</p>
          <div className="view-stack">
            <strong>Proximo passo sugerido</strong>
            {suggestions.map((suggestion) => (
              <button className="secondary-button" key={suggestion} onClick={() => onAskFromSuggestion(suggestion)}>
                <Icon name="chat" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      {panelTab === "verses" && (
        <div className="view-stack">
          {node.bibleReference ? (
            <article className="verse-card">
              <h3>{formatReference(node.bibleReference)}</h3>
              <p className="muted">{node.description}</p>
              <button className="secondary-button" onClick={onOpenBible}>
                <Icon name="book" />
                Abrir na Biblia
              </button>
            </article>
          ) : (
            <p className="muted">Nenhum versiculo vinculado a este node.</p>
          )}
        </div>
      )}
      {panelTab === "notes" && (
        <div className="view-stack">
          {nodeNotes.map((note) => (
            <article className="note-card" key={note.id}>
              <strong>{note.title}</strong>
              <p>{note.content}</p>
            </article>
          ))}
          <textarea
            className="textarea-field"
            value={noteDraft}
            onChange={(event) => onChangeNoteDraft(event.target.value)}
            placeholder="Escreva uma anotacao..."
          />
          <button className="primary-button" onClick={() => onAddNote(node.id)}>
            <Icon name="note" />
            Salvar anotacao
          </button>
        </div>
      )}
      <div className="action-list">
        <button className="secondary-button" onClick={onOpenChat}>
          <Icon name="chat" />
          Abrir chat deste node
        </button>
        <button className="secondary-button" onClick={onOpenFocus}>
          <Icon name="book" />
          Modo foco
        </button>
        <button className="secondary-button" onClick={() => onFavoriteNode(node.id)}>
          <Icon name="star" />
          Marcar como favorito
        </button>
        <button className="secondary-button" onClick={onShare}>
          <Icon name="share" />
          Compartilhar este node
        </button>
      </div>
    </aside>
  );
}

function ChatView({
  activeNode,
  breadcrumb,
  draft,
  messages,
  nodes,
  onChangeDraft,
  onOpenBible,
  onSend,
}: {
  activeNode: StudyNode;
  breadcrumb: StudyNode[];
  draft: string;
  messages: Message[];
  nodes: StudyNode[];
  onChangeDraft: (value: string) => void;
  onOpenBible: () => void;
  onSend: () => void;
}) {
  const references = [activeNode, ...getChildren(nodes, activeNode.id)].filter((node) => node.bibleReference);

  return (
    <div className="chat-layout">
      <Breadcrumb nodes={breadcrumb} onSelect={() => undefined} />
      <section className="chat-stream">
        {messages.map((message) => (
          <article className={`chat-bubble ${message.role}`} key={message.id}>
            <strong>{message.role === "user" ? "Voce" : "IA de estudos"}</strong>
            <p>{message.content}</p>
          </article>
        ))}
      </section>
      <div className="reference-grid">
        {references.map((node) => (
          <article className="verse-card" key={node.id}>
            <h3>{node.bibleReference ? formatReference(node.bibleReference) : node.title}</h3>
            <p>{node.description}</p>
            <div className="button-row">
              <button className="secondary-button" onClick={onOpenBible}>
                <Icon name="book" />
                Abrir Biblia
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="chat-input">
        <input
          className="text-field"
          value={draft}
          onChange={(event) => onChangeDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSend();
            }
          }}
          placeholder="Digite sua duvida..."
        />
        <button className="primary-button" onClick={onSend} aria-label="Enviar pergunta">
          <Icon name="send" />
        </button>
      </div>
    </div>
  );
}

function BibleView({
  activeStudy,
  bibleBook,
  selectedBookId,
  selectedChapter,
  query,
  onChangeBook,
  onChangeChapter,
  onChangeQuery,
  onCreateBranch,
  onExplainVerse,
  onFavoriteVerse,
  onShareVerse,
}: {
  activeStudy?: Study;
  bibleBook: BibleBookData | null;
  selectedBookId: string;
  selectedChapter: number;
  query: string;
  onChangeBook: (bookId: string) => void;
  onChangeChapter: (chapter: number) => void;
  onChangeQuery: (value: string) => void;
  onCreateBranch: (verse: BibleVerse) => void;
  onExplainVerse: (verse: BibleVerse) => void;
  onFavoriteVerse: (verse: BibleVerse) => void;
  onShareVerse: (verse: BibleVerse) => void;
}) {
  const verses = bibleBook?.versesByChapter[selectedChapter] ?? [];
  const filteredVerses = filterVerses(verses, query);

  return (
    <div className="bible-layout">
      <div className="section-header">
        <div>
          <h2>
            {bibleBook?.name ?? "Biblia"} {selectedChapter}
          </h2>
          <span className="muted">{activeStudy ? `Vinculado a ${activeStudy.title}` : "Leitura local"}</span>
        </div>
      </div>
      <div className="bible-controls">
        <select className="select-field" value={selectedBookId} onChange={(event) => onChangeBook(event.target.value)}>
          {bibleCatalog.map((book) => (
            <option key={book.id} value={book.id}>
              {book.name}
            </option>
          ))}
        </select>
        <select
          className="select-field"
          value={selectedChapter}
          onChange={(event) => onChangeChapter(Number(event.target.value))}
        >
          {(bibleBook?.chapters ?? [selectedChapter]).map((chapter) => (
            <option key={chapter} value={chapter}>
              Capitulo {chapter}
            </option>
          ))}
        </select>
      </div>
      <div className="search-field">
        <Icon name="search" />
        <input
          className="text-field"
          value={query}
          onChange={(event) => onChangeQuery(event.target.value)}
          placeholder="Pesquisar neste capitulo..."
        />
      </div>
      <section className="verse-list">
        {filteredVerses.map((verse) => (
          <article className="verse-row" key={verse.id}>
            <span className="verse-number">{verse.verse}</span>
            <div>
              <p className="verse-text">{verse.text}</p>
              <div className="verse-actions">
                <button className="chip-button" onClick={() => onExplainVerse(verse)}>
                  <Icon name="chat" />
                  Explicar IA
                </button>
                <button className="chip-button" onClick={() => onCreateBranch(verse)}>
                  <Icon name="tree" />
                  Criar branch
                </button>
                <button className="chip-button" onClick={() => onFavoriteVerse(verse)}>
                  <Icon name="star" />
                  Favoritar
                </button>
                <button className="chip-button" onClick={() => onShareVerse(verse)}>
                  <Icon name="share" />
                  Compartilhar
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function FavoritesView({
  favorites,
  onOpenFavorite,
}: {
  favorites: Favorite[];
  onOpenFavorite: (favorite: Favorite) => void;
}) {
  return (
    <div className="view-stack">
      <div className="section-header">
        <h2>Favoritos</h2>
      </div>
      {favorites.length === 0 ? (
        <p className="muted">Nenhum favorito encontrado.</p>
      ) : (
        <div className="cards-grid">
          {favorites.map((favorite) => (
            <button className="favorite-card" key={favorite.id} onClick={() => onOpenFavorite(favorite)}>
              <Icon name="star" />
              <h3>{favorite.title}</h3>
              <p className="muted">{favorite.type}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotesView({
  notes,
  onDeleteNote,
  onUpdateNote,
}: {
  notes: Note[];
  onDeleteNote: (noteId: string) => void;
  onUpdateNote: (noteId: string, content: string) => void;
}) {
  return (
    <div className="view-stack">
      <div className="section-header">
        <h2>Anotacoes</h2>
      </div>
      {notes.length === 0 ? (
        <p className="muted">Nenhuma anotacao encontrada.</p>
      ) : (
        <div className="cards-grid">
          {notes.map((note) => (
            <article className="note-card" key={note.id}>
              <div className="inline-between">
                <strong>{note.title}</strong>
                <button className="icon-button" onClick={() => onDeleteNote(note.id)} aria-label="Excluir anotacao">
                  <Icon name="trash" />
                </button>
              </div>
              <textarea
                className="textarea-field"
                value={note.content}
                onChange={(event) => onUpdateNote(note.id, event.target.value)}
              />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsView({
  settings,
  firebaseReadiness,
  onUpdateSettings,
}: {
  settings: LuminaState["settings"];
  firebaseReadiness: Array<{ name: string; configured: boolean }>;
  onUpdateSettings: (partial: Partial<LuminaState["settings"]>) => void;
}) {
  return (
    <div className="settings-grid">
      <article className="settings-card">
        <h3>Tema</h3>
        <div className="form-stack">
          {(["light", "dark", "system"] as const).map((theme) => (
            <button className="secondary-button" key={theme} onClick={() => onUpdateSettings({ theme })}>
              {settings.theme === theme ? "Selecionado" : "Usar"} {theme}
            </button>
          ))}
        </div>
      </article>
      <article className="settings-card">
        <h3>Fonte</h3>
        <div className="form-stack">
          {(["small", "medium", "large", "extra_large"] as const).map((fontSize) => (
            <button className="secondary-button" key={fontSize} onClick={() => onUpdateSettings({ fontSize })}>
              {settings.fontSize === fontSize ? "Selecionado" : "Usar"} {fontSize}
            </button>
          ))}
        </div>
      </article>
      <article className="settings-card">
        <h3>Nivel IA</h3>
        <div className="form-stack">
          {(["beginner", "intermediate", "advanced"] as const).map((explanationLevel) => (
            <button className="secondary-button" key={explanationLevel} onClick={() => onUpdateSettings({ explanationLevel })}>
              {settings.explanationLevel === explanationLevel ? "Selecionado" : "Usar"} {explanationLevel}
            </button>
          ))}
        </div>
      </article>
      <article className="settings-card">
        <h3>Firebase</h3>
        <div className="form-stack">
          {firebaseReadiness.map((item) => (
            <span className="muted" key={item.name}>
              {item.name}: {item.configured ? "configurado" : "pendente"}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}

function FocusMode({
  node,
  onClose,
  onNext,
}: {
  node: StudyNode;
  onClose: () => void;
  onNext: () => void;
}) {
  return (
    <main className="focus-mode">
      <section className="focus-panel">
        <div className="inline-between">
          <button className="secondary-button" onClick={onClose}>
            Voltar
          </button>
          <button className="primary-button" onClick={onNext}>
            Proximo
          </button>
        </div>
        <span className="muted">{node.title}</span>
        <blockquote>{node.description ?? node.aiSummary ?? node.title}</blockquote>
        <article className="summary-card">
          <h3>Explicacao</h3>
          <p>{node.aiExplanation ?? "Retorne ao chat para aprofundar este node."}</p>
        </article>
        <article className="summary-card">
          <h3>Aplicacao pratica</h3>
          <p>Escolha uma acao pequena, registre uma anotacao e avance para a proxima pergunta.</p>
        </article>
      </section>
    </main>
  );
}

function getNodeIcon(node: StudyNode): IconName {
  if (node.type === "verse" || node.type === "chapter") {
    return "book";
  }

  if (node.type === "question" || node.type === "explanation") {
    return "chat";
  }

  if (node.type === "application" || node.type === "note") {
    return "note";
  }

  if (node.type === "root") {
    return "leaf";
  }

  return "tree";
}

function getViewTitle(view: AppView) {
  const titles: Record<AppView, string> = {
    studies: "Estudos",
    tree: "Arvore de Estudos",
    chat: "Chat de Estudos",
    bible: "Biblia",
    profile: "Perfil",
    settings: "Configuracoes",
    favorites: "Favoritos",
    notes: "Anotacoes",
    focus: "Modo Foco",
  };

  return titles[view];
}
