import { BottomNav } from "@/src/components/lumina/layout/BottomNav";
import { DesktopSidebar } from "@/src/components/lumina/layout/DesktopSidebar";
import { LuminaMainArea } from "@/src/components/lumina/layout/LuminaMainArea";
import { LuminaRoot } from "@/src/components/lumina/layout/LuminaRoot";
import { Topbar } from "@/src/components/lumina/layout/Topbar";
import type { LuminaAppController } from "@/src/components/lumina/types";

type AuthenticatedLuminaShellProps = {
  controller: LuminaAppController;
};

export function AuthenticatedLuminaShell({ controller }: AuthenticatedLuminaShellProps) {
  return (
    <LuminaRoot
      isDark={controller.isDark}
      settings={controller.state.settings}
      toast={controller.toast}
    >
      <div className="app-shell">
        <DesktopSidebar controller={controller} />
        <Topbar controller={controller} />
        <LuminaMainArea controller={controller} />
        <BottomNav controller={controller} />
      </div>
    </LuminaRoot>
  );
}
