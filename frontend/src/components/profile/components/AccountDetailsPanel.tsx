import type { User, UserSettings } from "@backend/types/lumina";

type AccountDetailsPanelProps = {
  settings: UserSettings;
  user: User;
};

export function AccountDetailsPanel({ settings, user }: AccountDetailsPanelProps) {
  return (
    <article className="profile-panel">
      <div className="section-header">
        <h3>Conta e leitura</h3>
      </div>
      <dl className="profile-details">
        <div>
          <dt>Tema</dt>
          <dd>{settings.theme}</dd>
        </div>
        <div>
          <dt>Fonte</dt>
          <dd>{settings.fontSize}</dd>
        </div>
        <div>
          <dt>Nivel IA</dt>
          <dd>{settings.explanationLevel}</dd>
        </div>
        <div>
          <dt>ID</dt>
          <dd>{user.id}</dd>
        </div>
      </dl>
    </article>
  );
}
