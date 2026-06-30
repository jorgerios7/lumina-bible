"use client";

import { useState } from "react";
import { Icon } from "@/src/components/common/Icon";
import { desktopViews, type NavigationViewItem } from "@/src/components/lumina/navigation";
import type { LuminaAppController } from "@/src/components/lumina/types";

type DesktopSidebarProps = {
  controller: LuminaAppController;
};

export function DesktopSidebar({ controller }: DesktopSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const sidebarState = isExpanded ? "expanded" : "collapsed";

  return (
    <aside
      className={`desktop-sidebar ${sidebarState}`}
      aria-label="Navegacao principal"
      data-state={sidebarState}
    >
      <div className="sidebar-header">
        <h1 className="brand-mark" aria-label="Lumina Bible">
          <span className="sidebar-label">Lumina</span>
        </h1>
        <button
          className="sidebar-toggle"
          onClick={() => setIsExpanded((current) => !current)}
          aria-label={isExpanded ? "Recolher navegacao lateral" : "Expandir navegacao lateral"}
          aria-expanded={isExpanded}
          title={isExpanded ? "Recolher navegacao" : "Expandir navegacao"}
          type="button"
        >
          <Icon name="panel" />
        </button>
      </div>
      <nav className="sidebar-nav">
        {desktopViews.map((item, index) => (
          <SidebarNavigationButton
            item={item}
            key={`${item.label}-${index}`}
            isActive={controller.isViewActive(item.view)}
            onClick={() => controller.handleDesktopView(item)}
          />
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-item" onClick={() => controller.setView("settings")}>
          <Icon name="settings" />
          <span className="sidebar-label">Ajustes</span>
        </button>
        <button
          className="sidebar-user"
          onClick={() => controller.setView("profile")}
          aria-label="Abrir perfil do usuario"
        >
          <Icon name="user" />
          <span className="sidebar-user-copy">
            <strong>{controller.state.user?.name}</strong>
            Ver perfil
          </span>
        </button>
      </div>
    </aside>
  );
}

type SidebarNavigationButtonProps = {
  item: NavigationViewItem;
  isActive: boolean;
  onClick: () => void;
};

function SidebarNavigationButton({ item, isActive, onClick }: SidebarNavigationButtonProps) {
  return (
    <button className={`sidebar-item ${isActive ? "active" : ""}`} onClick={onClick}>
      <Icon name={item.icon} />
      <span className="sidebar-label">{item.label}</span>
    </button>
  );
}
