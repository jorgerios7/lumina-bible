"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/src/components/common/Icon";
import { desktopViews, type NavigationViewItem } from "@/src/components/lumina/navigation";
import type { LuminaAppController } from "@/src/components/lumina/types";

const SIDEBAR_TEXT_FADE_MS = 140;
const SIDEBAR_WIDTH_TRANSITION_MS = 180;

type SidebarTransitionState = "collapsed" | "collapsing" | "expanded" | "expanding";

type DesktopSidebarProps = {
  controller: LuminaAppController;
};

export function DesktopSidebar({ controller }: DesktopSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [transitionState, setTransitionState] = useState<SidebarTransitionState>("collapsed");
  const transitionTimerRef = useRef<number | null>(null);
  const sidebarState = isExpanded ? "expanded" : "collapsed";

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  function clearTransitionTimer() {
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }

  function handleToggleSidebar() {
    clearTransitionTimer();

    if (isExpanded) {
      setTransitionState("collapsing");
      transitionTimerRef.current = window.setTimeout(() => {
        setIsExpanded(false);
        setTransitionState("collapsed");
        transitionTimerRef.current = null;
      }, SIDEBAR_TEXT_FADE_MS);
      return;
    }

    setIsExpanded(true);
    setTransitionState("expanding");
    transitionTimerRef.current = window.setTimeout(() => {
      setTransitionState("expanded");
      transitionTimerRef.current = null;
    }, SIDEBAR_WIDTH_TRANSITION_MS);
  }

  return (
    <aside
      className={`desktop-sidebar ${sidebarState}`}
      aria-label="Navegacao principal"
      data-state={sidebarState}
      data-transition={transitionState}
    >
      <SidebarControls
        expanded={isExpanded}
        onClick={handleToggleSidebar}
      />

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
        <SidebarNavigationButton
          item={{ view: "settings", label: "Ajustes", icon: "settings" }}
          isActive={controller.isViewActive("settings")}
          onClick={() => controller.handleDesktopView({ view: "settings", label: "Ajustes", icon: "settings" })}
        />

        <SidebarNavigationButton
          item={{ view: "profile", label: "Perfil", icon: "user" }}
          controller={controller}
          isActive={controller.isViewActive("profile")}
          onClick={() => controller.handleDesktopView({ view: "profile", label: "Profile", icon: "user" })}
        />
      </div>
    </aside>
  );
}

type SidebarNavigationButtonProps = {
  item: NavigationViewItem;
  isActive: boolean;
  controller?: LuminaAppController;
  onClick: () => void;
};

function SidebarNavigationButton({ item, isActive, controller, onClick }: SidebarNavigationButtonProps) {
  return (
    <>
      {item.view !== "profile" && (
        <button className={`sidebar-item ${isActive ? "active" : ""}`} onClick={onClick}>
          <Icon name={item.icon} className={"sidebar-icon"} />
          <span className="sidebar-label">{item.label}</span>
        </button>
      )}

      {item.view === "profile" && controller && (
        <button
          className="sidebar-user"
          onClick={() => controller.setView("profile")}
          aria-label="Abrir perfil do usuario"
        >
          <Icon name="user" className={"sidebar-icon"} />
          <span className="sidebar-user-copy">
            <strong>{controller.state.user?.name}</strong>
            Ver perfil
          </span>
        </button>
      )}
    </>
  );
}

type SidebarControlsProps = {
  expanded: boolean;
  onClick: () => void;
};

function SidebarControls({ expanded, onClick }: SidebarControlsProps) {
  return (
    <div className="sidebar-header">
      <h1 className="brand-mark" aria-label="Lumina Bible">
        <span className="sidebar-label">Lumina</span>
      </h1>
      <button
        className="sidebar-toggle"
        onClick={onClick}
        aria-label={expanded ? "Recolher navegacao lateral" : "Expandir navegacao lateral"}
        aria-expanded={expanded}
        title={expanded ? "Recolher navegacao" : "Expandir navegacao"}
        type="button"
      >
        <Icon name="panel" className={expanded ? "sidebar-toggle-icon" : "sidebar-toggle-icon-collapsed"} />
      </button>
    </div>
  );
}
