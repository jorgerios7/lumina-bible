import type { Dispatch, SetStateAction } from "react";
import type { NavigationViewItem } from "@/src/components/lumina/navigation";
import type { AppView } from "@backend/types/lumina";

type UseLuminaNavigationActionsProps = {
  view: AppView;
  setStudyPrompt: Dispatch<SetStateAction<string>>;
  setView: Dispatch<SetStateAction<AppView>>;
};

export function useLuminaNavigationActions({
  view,
  setStudyPrompt,
  setView,
}: UseLuminaNavigationActionsProps) {
  function isViewActive(itemView: AppView) {
    if (itemView === "studies") {
      return view === "studies" || view === "chat";
    }
    return view === itemView;
  }

  function handleDesktopView(item: NavigationViewItem) {
    if (item.label === "Novo") {
      setStudyPrompt("");
      setView("studies");
      return;
    }

    setView(item.view);
  }

  return {
    handleDesktopView,
    isViewActive,
  };
}
