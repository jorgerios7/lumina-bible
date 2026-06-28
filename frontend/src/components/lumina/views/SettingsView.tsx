import type { LuminaState } from "@backend/types/lumina";

export function SettingsView({
  settings,
  firebaseReadiness,
  onUpdateSettings,
}: {
  settings: LuminaState["settings"];
  firebaseReadiness: Array<{ name: string; configured: boolean }>;
  onUpdateSettings: (partial: Partial<LuminaState["settings"]>) => void;
}) {
  return (
    <div className="settings-grid">
      <article className="settings-card">
        <h3>Tema</h3>
        <div className="form-stack">
          {(["light", "dark", "system"] as const).map((theme) => (
            <button className="secondary-button" key={theme} onClick={() => onUpdateSettings({ theme })}>
              {settings.theme === theme ? "Selecionado" : "Usar"} {theme}
            </button>
          ))}
        </div>
      </article>
      <article className="settings-card">
        <h3>Fonte</h3>
        <div className="form-stack">
          {(["small", "medium", "large", "extra_large"] as const).map((fontSize) => (
            <button className="secondary-button" key={fontSize} onClick={() => onUpdateSettings({ fontSize })}>
              {settings.fontSize === fontSize ? "Selecionado" : "Usar"} {fontSize}
            </button>
          ))}
        </div>
      </article>
      <article className="settings-card">
        <h3>Nivel IA</h3>
        <div className="form-stack">
          {(["beginner", "intermediate", "advanced"] as const).map((explanationLevel) => (
            <button className="secondary-button" key={explanationLevel} onClick={() => onUpdateSettings({ explanationLevel })}>
              {settings.explanationLevel === explanationLevel ? "Selecionado" : "Usar"} {explanationLevel}
            </button>
          ))}
        </div>
      </article>
      <article className="settings-card">
        <h3>Firebase</h3>
        <div className="form-stack">
          {firebaseReadiness.map((item) => (
            <span className="muted" key={item.name}>
              {item.name}: {item.configured ? "configurado" : "pendente"}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}
