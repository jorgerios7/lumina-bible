import { Icon } from "@/src/components/common/Icon";
import { getViewTitle } from "@/src/components/lumina/navigation";
import type { LuminaAppController } from "@/src/components/lumina/types";

type TopbarProps = {
  controller: LuminaAppController;
};

export function Topbar({ controller }: TopbarProps) {
  return (
    <header className="topbar">
      <button className="icon-button" aria-label="Voltar para estudos" onClick={() => controller.setView("studies")}>
        <Icon name="menu" />
      </button>
      <div className="topbar-title">
        <h1>{getViewTitle(controller.view)}</h1>
        <span>{controller.activeStudy ? `Estudo: ${controller.activeStudy.title}` : "Lumina Bible"}</span>
      </div>
      <div className="topbar-actions">
        <button
          className="icon-button"
          aria-label="Alternar tema"
          onClick={() => controller.updateSettings({ theme: controller.isDark ? "light" : "dark" })}
        >
          <Icon name={controller.isDark ? "sun" : "moon"} />
        </button>
        <button className="icon-button" aria-label="Favoritar estudo" onClick={controller.toggleStudyFavorite}>
          <Icon name="bookmark" />
        </button>
        <button
          className="icon-button"
          aria-label="Compartilhar estudo"
          onClick={() => controller.shareText(controller.activeStudy?.title ?? "Lumina Bible")}
        >
          <Icon name="share" />
        </button>
      </div>
    </header>
  );
}
