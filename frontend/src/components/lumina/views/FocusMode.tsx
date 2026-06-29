import { FocusActions } from "@/src/components/lumina/views/focus/FocusActions";
import { FocusContent } from "@/src/components/lumina/views/focus/FocusContent";
import type { StudyNode } from "@backend/types/lumina";

export function FocusMode({
  node,
  onClose,
  onNext,
}: {
  node: StudyNode;
  onClose: () => void;
  onNext: () => void;
}) {
  return (
    <main className="focus-mode">
      <section className="focus-panel">
        <FocusActions onClose={onClose} onNext={onNext} />
        <FocusContent node={node} />
      </section>
    </main>
  );
}
