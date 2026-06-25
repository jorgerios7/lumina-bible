import { FirebaseError, getApp, getApps, initializeApp } from "firebase/app";
import type { FirebaseOptions } from "firebase/app";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  getAdditionalUserInfo,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  getMissingFirebaseFrontendVariables,
  frontendEnvironmentVariables,
} from "@/src/services/firebase/firebase-contracts";
import type { User } from "@/src/types/lumina";

type CreateEmailAccountInput = {
  name: string;
  email: string;
  password: string;
};

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

let persistenceReady: Promise<void> | null = null;

export async function createEmailAccount(input: CreateEmailAccountInput) {
  const auth = await getConfiguredAuth();
  const credentials = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password,
  );

  if (input.name.trim()) {
    await updateProfile(credentials.user, { displayName: input.name.trim() });
  }

  return mapFirebaseUser(auth.currentUser ?? credentials.user);
}

export async function signInWithEmail(email: string, password: string) {
  const auth = await getConfiguredAuth();
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(credentials.user);
}

export async function signInWithGoogle() {
  const auth = await getConfiguredAuth();
  const provider = new GoogleAuthProvider();
  const credentials = await signInWithPopup(auth, provider);
  const additionalUserInfo = getAdditionalUserInfo(credentials);

  if (additionalUserInfo?.isNewUser) {
    await deleteUser(credentials.user).catch(() => signOut(auth).catch(() => undefined));
    throw new FirebaseError(
      "auth/user-not-found",
      "Conta Google nao cadastrada.",
    );
  }

  return mapFirebaseUser(credentials.user);
}

export async function requestPasswordReset(email: string) {
  const auth = await getConfiguredAuth();
  await sendPasswordResetEmail(auth, email);
}

export async function signOutAuthenticatedUser() {
  const auth = await getConfiguredAuth();
  await signOut(auth);
}

export function watchAuthenticatedUser(onChange: (user: User | null) => void) {
  if (!isFirebaseAuthConfigured()) {
    onChange(null);
    return () => undefined;
  }

  const auth = getAuth(getConfiguredApp());
  return onAuthStateChanged(auth, (firebaseUser) => {
    onChange(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
  });
}

export function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "Nao foi possivel autenticar agora. Tente novamente.";
  }

  const messages: Record<string, string> = {
    "auth/email-already-in-use": "Este e-mail ja esta cadastrado. Entre com sua senha.",
    "auth/invalid-credential": "E-mail ou senha invalidos. Crie uma conta antes de entrar.",
    "auth/invalid-email": "Informe um e-mail valido.",
    "auth/missing-client-config": "Configure as variaveis publicas do Firebase antes de usar login e cadastro.",
    "auth/missing-password": "Informe sua senha.",
    "auth/network-request-failed": "Sem conexao com o Firebase. Verifique sua internet.",
    "auth/operation-not-allowed": "Ative o metodo E-mail/Senha no Firebase Authentication.",
    "auth/popup-closed-by-user": "Login com Google cancelado antes de concluir.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente novamente.",
    "auth/user-not-found": "Conta nao encontrada. Crie uma conta antes de entrar.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/wrong-password": "E-mail ou senha invalidos.",
  };

  return messages[error.code] ?? "Nao foi possivel autenticar agora. Verifique os dados e tente novamente.";
}

function isFirebaseAuthConfigured() {
  return getMissingFirebaseFrontendVariables().length === 0;
}

async function getConfiguredAuth() {
  const missingVariables = getMissingFirebaseFrontendVariables();

  if (missingVariables.length > 0) {
    throw new FirebaseError(
      "auth/missing-client-config",
      `Configure ${frontendEnvironmentVariables.join(", ")} para usar Firebase Authentication.`,
    );
  }

  const auth = getAuth(getConfiguredApp());
  persistenceReady ??= setPersistence(auth, browserLocalPersistence);
  await persistenceReady;
  return auth;
}

function getConfiguredApp() {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  const now = new Date().toISOString();
  const createdAt = firebaseUser.metadata.creationTime
    ? new Date(firebaseUser.metadata.creationTime).toISOString()
    : now;
  const updatedAt = firebaseUser.metadata.lastSignInTime
    ? new Date(firebaseUser.metadata.lastSignInTime).toISOString()
    : now;

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuario",
    email: firebaseUser.email ?? "",
    photoURL: firebaseUser.photoURL ?? undefined,
    createdAt,
    updatedAt,
  };
}
