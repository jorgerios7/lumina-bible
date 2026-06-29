import { suggestedTopics } from "@/src/data/starter-content";

type SuggestedTopicsPanelProps = {
  onCreateStudy: (prompt: string) => void;
};

export function SuggestedTopicsPanel({ onCreateStudy }: SuggestedTopicsPanelProps) {
  return (
    <section className="view-stack">
      <div className="section-header">
        <h3>Temas sugeridos</h3>
      </div>
      <div className="topic-grid">
        {suggestedTopics.map((topic) => (
          <button className="chip-button" key={topic} onClick={() => onCreateStudy(topic)}>
            {topic}
          </button>
        ))}
      </div>
    </section>
  );
}
