import type { AuthMode } from "@/src/components/lumina/auth/types";

type AuthModeToggleProps = {
  mode: AuthMode;
  isSubmitting: boolean;
  onSelectMode: (mode: AuthMode) => void;
};

export function AuthModeToggle({ mode, isSubmitting, onSelectMode }: AuthModeToggleProps) {
  return (
    <div className="auth-mode-toggle" role="tablist" aria-label="Modo de acesso">
      <button
        aria-selected={mode === "login"}
        className={mode === "login" ? "active" : ""}
        disabled={isSubmitting}
        onClick={() => onSelectMode("login")}
        role="tab"
        type="button"
      >
        Entrar
      </button>
      <button
        aria-selected={mode === "signup"}
        className={mode === "signup" ? "active" : ""}
        disabled={isSubmitting}
        onClick={() => onSelectMode("signup")}
        role="tab"
        type="button"
      >
        Criar conta
      </button>
    </div>
  );
}
