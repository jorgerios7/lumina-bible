export const firestoreCollections = [
  "users",
  "studies",
  "studyNodes",
  "messages",
  "favorites",
  "notes",
  "settings",
] as const;

export const frontendEnvironmentVariables = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
] as const;

export const backendEnvironmentVariables = [
  "GEMINI_API_KEY",
  "FIREBASE_PROJECT_ID",
  "AI_DAILY_LIMIT",
] as const;

export function getFirebaseReadiness() {
  const values: Record<(typeof frontendEnvironmentVariables)[number], string | undefined> = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };

  return frontendEnvironmentVariables.map((name) => ({
    name,
    configured: Boolean(values[name]),
  }));
}

export function getMissingFirebaseFrontendVariables() {
  return getFirebaseReadiness()
    .filter((item) => !item.configured)
    .map((item) => item.name);
}
