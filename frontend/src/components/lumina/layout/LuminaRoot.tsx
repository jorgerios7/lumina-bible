import type { ReactNode } from "react";
import { Toast } from "@/src/components/lumina/layout/Toast";
import { getLuminaRootClassName } from "@/src/components/lumina/utils/theme";
import type { LuminaState } from "@backend/types/lumina";

type LuminaRootProps = {
  children: ReactNode;
  isDark: boolean;
  settings: LuminaState["settings"];
  toast?: string;
};

export function LuminaRoot({ children, isDark, settings, toast }: LuminaRootProps) {
  return (
    <div className={getLuminaRootClassName(settings, isDark)}>
      {children}
      {toast && <Toast message={toast} />}
    </div>
  );
}
