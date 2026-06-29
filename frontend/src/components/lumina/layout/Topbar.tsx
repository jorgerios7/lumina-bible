import { TopbarActions } from "@/src/components/lumina/layout/TopbarActions";
import { TopbarTitle } from "@/src/components/lumina/layout/TopbarTitle";
import type { LuminaAppController } from "@/src/components/lumina/types";

type TopbarProps = {
  controller: LuminaAppController;
};

export function Topbar({ controller }: TopbarProps) {
  const activeStudyTitle = controller.activeStudy?.title;

  return (
    <header className="topbar">
      <TopbarTitle activeStudyTitle={activeStudyTitle} view={controller.view} />
      <TopbarActions
        activeStudyTitle={activeStudyTitle}
        isDark={controller.isDark}
        onShareText={controller.shareText}
        onToggleFavorite={controller.toggleStudyFavorite}
        onUpdateSettings={controller.updateSettings}
      />
    </header>
  );
}
