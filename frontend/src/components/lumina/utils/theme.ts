import type { LuminaState } from "@backend/types/lumina";

export function resolveIsDarkTheme(settings: LuminaState["settings"]) {
  return (
    settings.theme === "dark" ||
    (settings.theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

export function getLuminaRootClassName(settings: LuminaState["settings"], isDark: boolean) {
  return `lumina-root ${isDark ? "theme-dark" : ""} font-${settings.fontSize}`;
}
