import { getViewTitle } from "@/src/components/lumina/navigation";
import type { AppView } from "@backend/types/lumina";

type TopbarTitleProps = {
  activeStudyTitle?: string;
  view: AppView;
};

export function TopbarTitle({ activeStudyTitle, view }: TopbarTitleProps) {
  return (
    <div className="topbar-title">
      <h1>{getViewTitle(view)}</h1>
      <span>{activeStudyTitle ? `Estudo: ${activeStudyTitle}` : "Lumina Bible"}</span>
    </div>
  );
}
