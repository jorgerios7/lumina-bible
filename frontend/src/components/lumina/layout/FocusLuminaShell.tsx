import { FocusMode } from "@/src/components/lumina/views/FocusMode";
import { LuminaRoot } from "@/src/components/lumina/layout/LuminaRoot";
import type { LuminaAppController } from "@/src/components/lumina/types";

type FocusLuminaShellProps = {
  controller: LuminaAppController;
};

export function FocusLuminaShell({ controller }: FocusLuminaShellProps) {
  if (!controller.activeNode) {
    return null;
  }

  return (
    <LuminaRoot
      isDark={controller.isDark}
      settings={controller.state.settings}
      toast={controller.toast}
    >
      <FocusMode
        node={controller.activeNode}
        onClose={() => controller.setView("tree")}
        onNext={() => controller.setView("chat")}
      />
    </LuminaRoot>
  );
}
