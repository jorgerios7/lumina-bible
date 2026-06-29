"use client";

import { Icon } from "@/src/components/common/Icon";
import { AuthBrand } from "@/src/components/lumina/auth/AuthBrand";
import { AuthForm } from "@/src/components/lumina/auth/AuthForm";
import { AuthModeToggle } from "@/src/components/lumina/auth/AuthModeToggle";
import { useLoginForm } from "@/src/components/lumina/auth/useLoginForm";
import type { User } from "@backend/types/lumina";

export function LoginScreen({
  onAuthenticated,
}: {
  onAuthenticated: (user: User) => void;
}) {
  const form = useLoginForm(onAuthenticated);

  return (
    <main className="auth-screen">
      <section className="auth-panel" aria-labelledby="login-title">
        <AuthBrand />
        <div className="form-stack">
          <AuthModeToggle mode={form.mode} isSubmitting={form.isSubmitting} onSelectMode={form.setMode} />
          <button className="secondary-button" disabled={form.isSubmitting} onClick={form.loginWithGoogle}>
            <Icon name="user" />
            Entrar com Google
          </button>
          <AuthForm controller={form} />
          <button className="ghost-button" disabled={form.isSubmitting} onClick={form.recoverPassword}>
            Recuperar senha
          </button>
        </div>
      </section>
    </main>
  );
}
