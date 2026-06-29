import { Icon } from "@/src/components/common/Icon";
import { formatDate, getInitials } from "@/src/components/profile/profileUtils";
import type { User, UserSettings } from "@backend/types/lumina";

type ProfileHeroProps = {
  settings: UserSettings;
  user: User;
  onLogout: () => void;
  onOpenSettings: () => void;
};

export function ProfileHero({ settings, user, onLogout, onOpenSettings }: ProfileHeroProps) {
  return (
    <section className="profile-hero" aria-labelledby="profile-title">
      <div className="profile-avatar" aria-hidden="true">
        {getInitials(user.name)}
      </div>
      <div className="profile-identity">
        <span className="profile-kicker">Conta Lumina</span>
        <h2 id="profile-title">{user.name}</h2>
        <p>{user.email}</p>
        <div className="profile-badges">
          <span>Autenticado</span>
          <span>{settings.preferredTranslation}</span>
          <span>{formatDate(user.createdAt)}</span>
        </div>
      </div>
      <div className="profile-actions">
        <button className="secondary-button" onClick={onOpenSettings}>
          <Icon name="settings" />
          Configurar
        </button>
        <button className="ghost-button" onClick={onLogout}>
          Sair
        </button>
      </div>
    </section>
  );
}
