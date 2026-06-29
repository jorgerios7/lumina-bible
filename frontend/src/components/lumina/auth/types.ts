import type { FormEvent } from "react";

export type AuthMode = "login" | "signup";

export type LoginFormController = {
  mode: AuthMode;
  name: string;
  email: string;
  password: string;
  error: string;
  recoverySent: boolean;
  isSubmitting: boolean;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  recoverPassword: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  setMode: (mode: AuthMode) => void;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
};
