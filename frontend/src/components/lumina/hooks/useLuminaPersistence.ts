import { useEffect, type Dispatch, type SetStateAction } from "react";
import { loadLuminaState, saveLuminaState } from "@/src/services/storage/local-store";
import type { LuminaState } from "@backend/types/lumina";

type UseLuminaPersistenceProps = {
  hydrated: boolean;
  state: LuminaState;
  setHydrated: Dispatch<SetStateAction<boolean>>;
  setState: Dispatch<SetStateAction<LuminaState>>;
};

export function useLuminaPersistence({
  hydrated,
  state,
  setHydrated,
  setState,
}: UseLuminaPersistenceProps) {
  useEffect(() => {
    const savedState = loadLuminaState();
    const timeout = window.setTimeout(() => {
      if (savedState) {
        setState((prev) => ({ ...savedState, user: prev.user }));
      }
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [setHydrated, setState]);

  useEffect(() => {
    if (hydrated) {
      saveLuminaState(state);
    }
  }, [hydrated, state]);
}
