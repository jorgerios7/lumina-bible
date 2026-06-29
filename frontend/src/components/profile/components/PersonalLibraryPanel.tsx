import { Icon } from "@/src/components/common/Icon";
import type { UserSettings } from "@backend/types/lumina";

type PersonalLibraryPanelProps = {
  favoritesCount: number;
  notesCount: number;
  settings: UserSettings;
  onOpenFavorites: () => void;
  onOpenNotes: () => void;
  onOpenSettings: () => void;
};

export function PersonalLibraryPanel({
  favoritesCount,
  notesCount,
  settings,
  onOpenFavorites,
  onOpenNotes,
  onOpenSettings,
}: PersonalLibraryPanelProps) {
  return (
    <article className="profile-panel">
      <div className="section-header">
        <h3>Biblioteca pessoal</h3>
      </div>
      <div className="profile-shortcut-list">
        <button onClick={onOpenFavorites}>
          <span>
            <Icon name="star" />
            Favoritos
          </span>
          <strong>{favoritesCount}</strong>
        </button>
        <button onClick={onOpenNotes}>
          <span>
            <Icon name="note" />
            Anotacoes
          </span>
          <strong>{notesCount}</strong>
        </button>
        <button onClick={onOpenSettings}>
          <span>
            <Icon name="settings" />
            Preferencias
          </span>
          <strong>{settings.explanationLevel}</strong>
        </button>
      </div>
    </article>
  );
}
