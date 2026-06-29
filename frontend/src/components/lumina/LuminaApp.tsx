"use client";

import { AuthenticatedLuminaShell } from "@/src/components/lumina/layout/AuthenticatedLuminaShell";
import { FocusLuminaShell } from "@/src/components/lumina/layout/FocusLuminaShell";
import { UnauthenticatedLuminaShell } from "@/src/components/lumina/layout/UnauthenticatedLuminaShell";
import { useLuminaAppController } from "@/src/components/lumina/hooks/useLuminaAppController";
import type { LuminaAppProps } from "@/src/components/lumina/types";

export function LuminaApp({ initialView = "studies" }: LuminaAppProps) {
  const controller = useLuminaAppController(initialView);

  if (!controller.state.user) {
    return <UnauthenticatedLuminaShell controller={controller} />;
  }

  if (controller.view === "focus" && controller.activeNode) {
    return <FocusLuminaShell controller={controller} />;
  }

  return <AuthenticatedLuminaShell controller={controller} />;
}
