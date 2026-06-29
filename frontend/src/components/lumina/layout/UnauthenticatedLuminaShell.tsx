import { AuthLoadingScreen } from "@/src/components/lumina/auth/AuthLoadingScreen";
import { LoginScreen } from "@/src/components/lumina/auth/LoginScreen";
import { LuminaRoot } from "@/src/components/lumina/layout/LuminaRoot";
import type { LuminaAppController } from "@/src/components/lumina/types";

type UnauthenticatedLuminaShellProps = {
  controller: LuminaAppController;
};

export function UnauthenticatedLuminaShell({ controller }: UnauthenticatedLuminaShellProps) {
  return (
    <LuminaRoot isDark={controller.isDark} settings={controller.state.settings}>
      {controller.authReady ? (
        <LoginScreen onAuthenticated={controller.handleAuthenticatedUser} />
      ) : (
        <AuthLoadingScreen />
      )}
    </LuminaRoot>
  );
}
