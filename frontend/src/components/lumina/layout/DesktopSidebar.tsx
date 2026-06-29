import { Icon } from "@/src/components/common/Icon";
import { desktopViews } from "@/src/components/lumina/navigation";
import type { LuminaAppController } from "@/src/components/lumina/types";

type DesktopSidebarProps = {
  controller: LuminaAppController;
};

export function DesktopSidebar({ controller }: DesktopSidebarProps) {
  return (
    <aside className="desktop-sidebar" aria-label="Navegacao principal">
      <button className="brand-mark" onClick={() => controller.setView("studies")} aria-label="Lumina Bible">
        <Icon name="leaf" />
      </button>
      <nav className="sidebar-nav">
        {desktopViews.map((item, index) => (
          <button
            className={`sidebar-item ${controller.isViewActive(item.view) ? "active" : ""}`}
            key={`${item.label}-${index}`}
            onClick={() => controller.handleDesktopView(item)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <button className="sidebar-item" onClick={() => controller.setView("settings")}>
        <Icon name="settings" />
        <span>Ajustes</span>
      </button>
      <button
        className="sidebar-user"
        onClick={() => controller.setView("profile")}
        aria-label="Abrir perfil do usuario"
      >
        <strong>{controller.state.user?.name}</strong>
        Ver perfil
      </button>
    </aside>
  );
}
