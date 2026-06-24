import type { LuminaState } from "@/src/types/lumina";

const STORAGE_KEY = "lumina-bible:v2-state";

export function loadLuminaState() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawState = window.localStorage.getItem(STORAGE_KEY);
  if (!rawState) {
    return null;
  }

  try {
    return JSON.parse(rawState) as LuminaState;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveLuminaState(state: LuminaState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearLuminaState() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
