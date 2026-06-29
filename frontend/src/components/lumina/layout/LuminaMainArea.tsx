import { ProfileScreen } from "@/src/components/profile/ProfileScreen";
import { BibleView } from "@/src/components/lumina/views/BibleView";
import { ChatView } from "@/src/components/lumina/views/ChatView";
import { FavoritesView } from "@/src/components/lumina/views/FavoritesView";
import { NotesView } from "@/src/components/lumina/views/NotesView";
import { SettingsView } from "@/src/components/lumina/views/SettingsView";
import { StudiesView } from "@/src/components/lumina/views/StudiesView";
import { TreeView } from "@/src/components/lumina/views/TreeView";
import { getFirebaseReadiness } from "@backend/services/firebase/firebase-contracts";
import type { LuminaAppController } from "@/src/components/lumina/types";

type LuminaMainAreaProps = {
  controller: LuminaAppController;
};

export function LuminaMainArea({ controller }: LuminaMainAreaProps) {
  return (
    <main className="main-area">
      {controller.view === "studies" && (
        <StudiesView
          activeStudy={controller.activeStudy}
          studies={controller.state.studies}
          nodes={controller.state.nodes}
          prompt={controller.studyPrompt}
          onPromptChange={controller.setStudyPrompt}
          onCreateStudy={controller.handleCreateStudy}
          onDeleteStudy={controller.handleDeleteStudy}
          onOpenStudy={controller.handleOpenStudy}
        />
      )}
      {controller.view === "tree" && controller.activeStudy && controller.activeNode && (
        <TreeView
          activeNode={controller.activeNode}
          activeStudy={controller.activeStudy}
          breadcrumb={controller.breadcrumb}
          expandedNodeIds={controller.state.expandedNodeIds}
          nodes={controller.state.nodes}
          noteDraft={controller.noteDraft}
          panelTab={controller.panelTab}
          query={controller.treeSearch}
          onAddNote={controller.handleAddNote}
          onAskFromSuggestion={controller.handleAskFromSuggestion}
          onChangeNoteDraft={controller.setNoteDraft}
          onChangePanelTab={controller.setPanelTab}
          onChangeQuery={controller.setTreeSearch}
          onClosePanel={controller.handleClosePanel}
          onCollapseAll={controller.handleCollapseAll}
          onExpandAll={controller.handleExpandAll}
          onFavoriteNode={controller.toggleNodeFavorite}
          onOpenBible={controller.openNodeBible}
          onOpenChat={() => controller.setView("chat")}
          onOpenFocus={() => controller.setView("focus")}
          onSelectNode={controller.handleSelectNode}
          onShare={controller.shareNode}
          onToggleExpanded={controller.toggleExpanded}
          notes={controller.state.notes}
        />
      )}
      {controller.view === "chat" && controller.activeStudy && controller.activeNode && (
        <ChatView
          activeNode={controller.activeNode}
          breadcrumb={controller.breadcrumb}
          draft={controller.chatDraft}
          messages={controller.activeMessages}
          nodes={controller.state.nodes}
          onChangeDraft={controller.setChatDraft}
          onOpenBible={controller.openNodeBible}
          onSend={controller.handleSendMessage}
        />
      )}
      {controller.view === "bible" && (
        <BibleView
          activeStudy={controller.activeStudy}
          bibleBook={controller.bibleBook}
          query={controller.bibleQuery}
          selectedBookId={controller.selectedBookId}
          selectedChapter={controller.selectedChapter}
          onChangeBook={controller.setSelectedBookId}
          onChangeChapter={controller.setSelectedChapter}
          onChangeQuery={controller.setBibleQuery}
          onCreateBranch={controller.createBranchFromVerse}
          onExplainVerse={controller.handleExplainVerse}
          onFavoriteVerse={controller.toggleVerseFavorite}
          onShareVerse={controller.shareVerse}
        />
      )}
      {controller.view === "profile" && controller.state.user && (
        <ProfileScreen
          user={controller.state.user}
          favorites={controller.state.favorites}
          notes={controller.state.notes}
          settings={controller.state.settings}
          studies={controller.state.studies}
          nodes={controller.state.nodes}
          onLogout={controller.handleLogout}
          onOpenFavorites={() => controller.setView("favorites")}
          onOpenNotes={() => controller.setView("notes")}
          onOpenSettings={() => controller.setView("settings")}
          onOpenStudy={(studyId) => controller.handleOpenStudy(studyId, "tree")}
        />
      )}
      {controller.view === "favorites" && (
        <FavoritesView favorites={controller.state.favorites} onOpenFavorite={controller.handleOpenFavorite} />
      )}
      {controller.view === "notes" && (
        <NotesView
          notes={controller.state.notes}
          onDeleteNote={controller.handleDeleteNote}
          onUpdateNote={controller.handleUpdateNote}
        />
      )}
      {controller.view === "settings" && (
        <SettingsView
          firebaseReadiness={getFirebaseReadiness()}
          settings={controller.state.settings}
          onUpdateSettings={controller.updateSettings}
        />
      )}
    </main>
  );
}
