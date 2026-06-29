import { Icon } from "@/src/components/common/Icon";
import { primaryViews } from "@/src/components/lumina/navigation";
import type { LuminaAppController } from "@/src/components/lumina/types";

type BottomNavProps = {
  controller: LuminaAppController;
};

export function BottomNav({ controller }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Navegacao mobile">
      {primaryViews.map((item) => (
        <button
          className={`nav-item ${controller.isViewActive(item.view) ? "active" : ""}`}
          key={item.view}
          onClick={() => controller.setView(item.view)}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
