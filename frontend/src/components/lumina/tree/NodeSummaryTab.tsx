import { Icon } from "@/src/components/common/Icon";
import type { StudyNode } from "@backend/types/lumina";

const SUGGESTIONS = [
  "Como este texto aponta para Cristo?",
  "Qual aplicacao pratica nasce daqui?",
  "Que referencia cruzada ajuda neste tema?",
];

type NodeSummaryTabProps = {
  node: StudyNode;
  onAskFromSuggestion: (question: string) => void;
};

export function NodeSummaryTab({ node, onAskFromSuggestion }: NodeSummaryTabProps) {
  return (
    <div className="view-stack">
      <p>{node.aiExplanation ?? node.aiSummary ?? node.description}</p>
      <div className="view-stack">
        <strong>Proximo passo sugerido</strong>
        {SUGGESTIONS.map((suggestion) => (
          <button className="secondary-button" key={suggestion} onClick={() => onAskFromSuggestion(suggestion)}>
            <Icon name="chat" />
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
