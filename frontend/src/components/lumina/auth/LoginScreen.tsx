"use client";

import { FormEvent, useState } from "react";
import { Icon } from "@/src/components/common/Icon";
import {
  createEmailAccount,
  getAuthErrorMessage,
  requestPasswordReset,
  signInWithEmail,
  signInWithGoogle,
} from "@/src/services/firebase/firebase-auth-service";
import type { User } from "@backend/types/lumina";

export function LoginScreen({
  onAuthenticated,
}: {
  onAuthenticated: (user: User) => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    if (!normalizedEmail) {
      setError("Informe um e-mail para continuar.");
      return;
    }

    if (mode === "signup" && normalizedName.length < 2) {
      setError("Informe seu nome para criar a conta.");
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setError("");
    setRecoverySent(false);

    try {
      setIsSubmitting(true);
      const authenticatedUser =
        mode === "signup"
          ? await createEmailAccount({
              name: normalizedName,
              email: normalizedEmail,
              password,
            })
          : await signInWithEmail(normalizedEmail, password);

      onAuthenticated(authenticatedUser);
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function recoverPassword() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Informe o e-mail antes de recuperar a senha.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await requestPasswordReset(normalizedEmail);
      setRecoverySent(true);
    } catch (recoverError) {
      setError(getAuthErrorMessage(recoverError));
      setRecoverySent(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function loginWithGoogle() {
    try {
      setIsSubmitting(true);
      setError("");
      setRecoverySent(false);
      const authenticatedUser = await signInWithGoogle();
      onAuthenticated(authenticatedUser);
    } catch (googleError) {
      setError(getAuthErrorMessage(googleError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-panel" aria-labelledby="login-title">
        <span className="brand-mark">
          <Icon name="leaf" />
        </span>
        <h1 className="auth-title" id="login-title">
          Lumina Bible
        </h1>
        <p className="auth-copy">Estudos biblicos guiados em uma arvore de aprendizado.</p>
        <div className="form-stack">
          <div className="auth-mode-toggle" role="tablist" aria-label="Modo de acesso">
            <button
              aria-selected={mode === "login"}
              className={mode === "login" ? "active" : ""}
              disabled={isSubmitting}
              onClick={() => {
                setMode("login");
                setError("");
              }}
              role="tab"
              type="button"
            >
              Entrar
            </button>
            <button
              aria-selected={mode === "signup"}
              className={mode === "signup" ? "active" : ""}
              disabled={isSubmitting}
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              role="tab"
              type="button"
            >
              Criar conta
            </button>
          </div>
          <button className="secondary-button" disabled={isSubmitting} onClick={loginWithGoogle}>
            <Icon name="user" />
            Entrar com Google
          </button>
          <form className="form-stack" onSubmit={submit}>
            {mode === "signup" && (
              <label className="field-label">
                Nome
                <input
                  className="text-field"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                  disabled={isSubmitting}
                  placeholder="Seu nome"
                  required
                />
              </label>
            )}
            <label className="field-label">
              E-mail
              <input
                className="text-field"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                  setRecoverySent(false);
                }}
                disabled={isSubmitting}
                placeholder="voce@email.com"
                required
              />
            </label>
            <label className="field-label">
              Senha
              <input
                className="text-field"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                disabled={isSubmitting}
                minLength={6}
                placeholder="Minimo 6 caracteres"
                required
              />
            </label>
            {error && <p className="auth-alert error">{error}</p>}
            {recoverySent && (
              <p className="auth-alert success">Link de recuperacao enviado para {email.trim()}.</p>
            )}
            <button className="primary-button" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Processando..." : mode === "signup" ? "Criar conta" : "Entrar"}
            </button>
          </form>
          <button className="ghost-button" disabled={isSubmitting} onClick={recoverPassword}>
            Recuperar senha
          </button>
        </div>
      </section>
    </main>
  );
}
