import { FirebaseReadinessCard } from "@/src/components/lumina/views/settings/FirebaseReadinessCard";
import { SettingsOptionCard } from "@/src/components/lumina/views/settings/SettingsOptionCard";
import {
  EXPLANATION_LEVEL_OPTIONS,
  FONT_SIZE_OPTIONS,
  THEME_OPTIONS,
} from "@/src/components/lumina/views/settings/settingsOptions";
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
      <SettingsOptionCard
        title="Tema"
        activeValue={settings.theme}
        values={THEME_OPTIONS}
        onSelect={(theme) => onUpdateSettings({ theme })}
      />
      <SettingsOptionCard
        title="Fonte"
        activeValue={settings.fontSize}
        values={FONT_SIZE_OPTIONS}
        onSelect={(fontSize) => onUpdateSettings({ fontSize })}
      />
      <SettingsOptionCard
        title="Nivel IA"
        activeValue={settings.explanationLevel}
        values={EXPLANATION_LEVEL_OPTIONS}
        onSelect={(explanationLevel) => onUpdateSettings({ explanationLevel })}
      />
      <FirebaseReadinessCard firebaseReadiness={firebaseReadiness} />
    </div>
  );
}
