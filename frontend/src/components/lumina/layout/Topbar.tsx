import { TopbarActions } from "@/src/components/lumina/layout/TopbarActions";
import { TopbarSearch } from "@/src/components/lumina/layout/TopbarSearch";
import { TopbarTitle } from "@/src/components/lumina/layout/TopbarTitle";
import type { LuminaAppController } from "@/src/components/lumina/types";

type TopbarProps = {
  controller: LuminaAppController;
};

export function Topbar({ controller }: TopbarProps) {
  const activeStudyTitle = controller.activeStudy?.title;
  const search = getTopbarSearch(controller);

  return (
    <header className="topbar">
      <TopbarTitle view={controller.view} />
      {search && <TopbarSearch {...search} />}
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

function getTopbarSearch(controller: LuminaAppController) {
  switch (controller.view) {
    case "studies":
      return {
        placeholder: "Buscar estudos...",
        value: controller.studiesQuery,
        onChange: controller.setStudiesQuery,
      };
    case "tree":
      return {
        placeholder: "Buscar na arvore...",
        value: controller.treeSearch,
        onChange: controller.setTreeSearch,
      };
    case "chat":
      return {
        placeholder: "Buscar no chat...",
        value: controller.chatQuery,
        onChange: controller.setChatQuery,
      };
    case "bible":
      return {
        placeholder: "Buscar na Biblia...",
        value: controller.bibleQuery,
        onChange: controller.setBibleQuery,
      };
    case "favorites":
      return {
        placeholder: "Buscar favoritos...",
        value: controller.favoritesQuery,
        onChange: controller.setFavoritesQuery,
      };
    case "notes":
      return {
        placeholder: "Buscar anotacoes...",
        value: controller.notesQuery,
        onChange: controller.setNotesQuery,
      };
    default:
      return null;
  }
}
