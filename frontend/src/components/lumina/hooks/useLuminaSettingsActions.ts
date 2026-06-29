import type { Dispatch, SetStateAction } from "react";
import type { LuminaState } from "@backend/types/lumina";

type UseLuminaSettingsActionsProps = {
  setState: Dispatch<SetStateAction<LuminaState>>;
};

export function useLuminaSettingsActions({ setState }: UseLuminaSettingsActionsProps) {
  function updateSettings(partial: Partial<LuminaState["settings"]>) {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...partial,
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  return {
    updateSettings,
  };
}
