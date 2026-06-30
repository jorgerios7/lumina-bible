import type { IconName } from "@/src/components/common/Icon";
import type { AppView } from "@backend/types/lumina";

export type NavigationViewItem = { view: AppView; label: string; icon: IconName };

export const primaryViews: NavigationViewItem[] = [
  { view: "studies", label: "Estudos", icon: "home" },
  { view: "bible", label: "Biblia", icon: "book" },
  { view: "profile", label: "Perfil", icon: "user" },
];

export const desktopViews: NavigationViewItem[] = [
  { view: "studies", label: "Estudos", icon: "home" },
  { view: "tree", label: "Arvore", icon: "tree" },
  { view: "bible", label: "Biblia", icon: "book" },
  { view: "favorites", label: "Favoritos", icon: "star" },
  { view: "notes", label: "Anotacoes", icon: "note" },
];

export function getViewTitle(view: AppView) {
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
