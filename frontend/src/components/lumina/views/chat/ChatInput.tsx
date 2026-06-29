import { Icon } from "@/src/components/common/Icon";

type ChatInputProps = {
  draft: string;
  onChangeDraft: (value: string) => void;
  onSend: () => void;
};

export function ChatInput({ draft, onChangeDraft, onSend }: ChatInputProps) {
  return (
    <div className="chat-input">
      <input
        className="text-field"
        value={draft}
        onChange={(event) => onChangeDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSend();
          }
        }}
        placeholder="Digite sua duvida..."
      />
      <button className="primary-button" onClick={onSend} aria-label="Enviar pergunta">
        <Icon name="send" />
      </button>
    </div>
  );
}
