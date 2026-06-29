import { useEffect, type Dispatch, type SetStateAction } from "react";
import { watchAuthenticatedUser } from "@/src/services/firebase/firebase-auth-service";
import type { LuminaState } from "@backend/types/lumina";

type UseLuminaAuthWatcherProps = {
  setAuthReady: Dispatch<SetStateAction<boolean>>;
  setState: Dispatch<SetStateAction<LuminaState>>;
};

export function useLuminaAuthWatcher({ setAuthReady, setState }: UseLuminaAuthWatcherProps) {
  useEffect(() => {
    return watchAuthenticatedUser((user) => {
      setState((prev) => ({ ...prev, user }));
      setAuthReady(true);
    });
  }, [setAuthReady, setState]);
}
