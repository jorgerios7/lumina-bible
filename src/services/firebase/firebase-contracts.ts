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
  return frontendEnvironmentVariables.map((name) => ({
    name,
    configured: Boolean(process.env[name]),
  }));
}
