import { Icon } from "@/src/components/common/Icon";
import type { LuminaState } from "@backend/types/lumina";

type TopbarActionsProps = {
  activeStudyTitle?: string;
  isDark: boolean;
  onShareText: (text: string) => void;
  onToggleFavorite: () => void;
  onUpdateSettings: (partial: Partial<LuminaState["settings"]>) => void;
};

export function TopbarActions({
  activeStudyTitle,
  isDark,
  onShareText,
  onToggleFavorite,
  onUpdateSettings,
}: TopbarActionsProps) {
  return (
    <div className="topbar-actions">
      <button
        className="icon-button"
        aria-label="Alternar tema"
        onClick={() => onUpdateSettings({ theme: isDark ? "light" : "dark" })}
      >
        <Icon name={isDark ? "sun" : "moon"} />
      </button>
      <button className="icon-button" aria-label="Favoritar estudo" onClick={onToggleFavorite}>
        <Icon name="bookmark" />
      </button>
      <button
        className="icon-button"
        aria-label="Compartilhar estudo"
        onClick={() => onShareText(activeStudyTitle ?? "Lumina Bible")}
      >
        <Icon name="share" />
      </button>
    </div>
  );
}
