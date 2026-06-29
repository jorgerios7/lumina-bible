import type { Dispatch, SetStateAction } from "react";
import { signOutAuthenticatedUser } from "@/src/services/firebase/firebase-auth-service";
import type { AppView, LuminaState, User } from "@backend/types/lumina";

type UseLuminaAuthActionsProps = {
  setState: Dispatch<SetStateAction<LuminaState>>;
  setToast: Dispatch<SetStateAction<string>>;
  setView: Dispatch<SetStateAction<AppView>>;
};

export function useLuminaAuthActions({
  setState,
  setToast,
  setView,
}: UseLuminaAuthActionsProps) {
  function handleAuthenticatedUser(user: User) {
    setState((prev) => ({
      ...prev,
      user,
    }));
  }

  function handleLogout() {
    signOutAuthenticatedUser().catch(() => {
      setToast("Nao foi possivel encerrar a sessao no Firebase.");
    });
    setState((prev) => ({ ...prev, user: null }));
    setView("studies");
  }

  return {
    handleAuthenticatedUser,
    handleLogout,
  };
}
