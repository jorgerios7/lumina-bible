"use client";

import { AccountDetailsPanel } from "@/src/components/profile/components/AccountDetailsPanel";
import { CurrentJourneyPanel } from "@/src/components/profile/components/CurrentJourneyPanel";
import { PersonalLibraryPanel } from "@/src/components/profile/components/PersonalLibraryPanel";
import { ProfileHero } from "@/src/components/profile/components/ProfileHero";
import { ProfileMetricsGrid } from "@/src/components/profile/components/ProfileMetricsGrid";
import { RecentStudiesPanel } from "@/src/components/profile/components/RecentStudiesPanel";
import { computeStudyProgress } from "@backend/services/studies/study-tree-engine";
import type { ProfileScreenProps } from "@/src/components/profile/types";

export function ProfileScreen({
  user,
  studies,
  nodes,
  favorites,
  notes,
  settings,
  onLogout,
  onOpenFavorites,
  onOpenNotes,
  onOpenSettings,
  onOpenStudy,
}: ProfileScreenProps) {
  const activeStudies = studies.filter((study) => study.status === "active");
  const completedNodes = nodes.filter((node) => node.status === "completed").length;
  const inProgressNodes = nodes.filter((node) => node.status === "in_progress").length;
  const recentStudies = [...studies]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3);
  const primaryStudy = recentStudies[0];
  const primaryProgress = primaryStudy
    ? computeStudyProgress(primaryStudy, nodes)
    : { completedNodes: 0, percentage: 0, totalNodes: 0 };

  return (
    <div className="profile-screen">
      <ProfileHero
        settings={settings}
        user={user}
        onLogout={onLogout}
        onOpenSettings={onOpenSettings}
      />

      <ProfileMetricsGrid
        activeStudiesCount={activeStudies.length}
        completedNodesCount={completedNodes}
        favoritesCount={favorites.length}
        inProgressNodesCount={inProgressNodes}
      />

      <section className="profile-content-grid">
        <CurrentJourneyPanel
          primaryProgress={primaryProgress}
          primaryStudy={primaryStudy}
          onOpenStudy={onOpenStudy}
        />
        <PersonalLibraryPanel
          favoritesCount={favorites.length}
          notesCount={notes.length}
          settings={settings}
          onOpenFavorites={onOpenFavorites}
          onOpenNotes={onOpenNotes}
          onOpenSettings={onOpenSettings}
        />
        <RecentStudiesPanel nodes={nodes} recentStudies={recentStudies} onOpenStudy={onOpenStudy} />
        <AccountDetailsPanel settings={settings} user={user} />
      </section>
    </div>
  );
}
