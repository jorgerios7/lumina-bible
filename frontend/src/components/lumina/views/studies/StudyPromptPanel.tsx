import { Icon } from "@/src/components/common/Icon";

type StudyPromptPanelProps = {
  prompt: string;
  onCreateStudy: (prompt: string) => void;
  onPromptChange: (value: string) => void;
};

export function StudyPromptPanel({
  prompt,
  onCreateStudy,
  onPromptChange,
}: StudyPromptPanelProps) {
  return (
    <section className="home-prompt">
      <div className="section-header">
        <div>
          <h2>O que deseja estudar hoje?</h2>
          <span className="muted">Tema, pergunta, duvida, versiculo ou capitulo.</span>
        </div>
      </div>
      <div className="prompt-row">
        <div className="search-field">
          <Icon name="search" />
          <input
            className="text-field"
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Ex.: Quero estudar fe"
          />
        </div>
        <button className="primary-button" onClick={() => onCreateStudy(prompt)}>
          <Icon name="plus" />
          Criar estudo
        </button>
      </div>
    </section>
  );
}
