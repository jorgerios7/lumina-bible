import { getViewTitle } from "@/src/components/lumina/navigation";
import type { AppView } from "@backend/types/lumina";

type TopbarTitleProps = {
  view: AppView;
};

export function TopbarTitle({ view }: TopbarTitleProps) {
  return (
    <div className="topbar-title">
      <h1>{getViewTitle(view)}</h1>
    </div>
  );
}
