import { FormEvent, useState } from "react";
import {
  createEmailAccount,
  getAuthErrorMessage,
  requestPasswordReset,
  signInWithEmail,
  signInWithGoogle,
} from "@/src/services/firebase/firebase-auth-service";
import type { User } from "@backend/types/lumina";
import type { AuthMode, LoginFormController } from "@/src/components/lumina/auth/types";

export function useLoginForm(onAuthenticated: (user: User) => void): LoginFormController {
  const [mode, setRawMode] = useState<AuthMode>("login");
  const [name, setRawName] = useState("");
  const [email, setRawEmail] = useState("");
  const [password, setRawPassword] = useState("");
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

  function setMode(nextMode: AuthMode) {
    setRawMode(nextMode);
    setError("");
  }

  function setName(value: string) {
    setRawName(value);
    setError("");
  }

  function setEmail(value: string) {
    setRawEmail(value);
    setError("");
    setRecoverySent(false);
  }

  function setPassword(value: string) {
    setRawPassword(value);
    setError("");
  }

  return {
    mode,
    name,
    email,
    password,
    error,
    recoverySent,
    isSubmitting,
    submit,
    recoverPassword,
    loginWithGoogle,
    setMode,
    setName,
    setEmail,
    setPassword,
  };
}
