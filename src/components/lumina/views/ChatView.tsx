import { Icon } from "@/src/components/common/Icon";
import { Breadcrumb } from "@/src/components/lumina/tree/Breadcrumb";
import { formatReference } from "@/src/services/ai/lumina-ai-service";
import { getChildren } from "@/src/services/studies/study-tree-engine";
import type { Message, StudyNode } from "@/src/types/lumina";

export function ChatView({
  activeNode,
  breadcrumb,
  draft,
  messages,
  nodes,
  onChangeDraft,
  onOpenBible,
  onSend,
}: {
  activeNode: StudyNode;
  breadcrumb: StudyNode[];
  draft: string;
  messages: Message[];
  nodes: StudyNode[];
  onChangeDraft: (value: string) => void;
  onOpenBible: () => void;
  onSend: () => void;
}) {
  const references = [activeNode, ...getChildren(nodes, activeNode.id)].filter((node) => node.bibleReference);

  return (
    <div className="chat-layout">
      <Breadcrumb nodes={breadcrumb} onSelect={() => undefined} />
      <section className="chat-stream">
        {messages.map((message) => (
          <article className={`chat-bubble ${message.role}`} key={message.id}>
            <strong>{message.role === "user" ? "Voce" : "IA de estudos"}</strong>
            <p>{message.content}</p>
          </article>
        ))}
      </section>
      <div className="reference-grid">
        {references.map((node) => (
          <article className="verse-card" key={node.id}>
            <h3>{node.bibleReference ? formatReference(node.bibleReference) : node.title}</h3>
            <p>{node.description}</p>
            <div className="button-row">
              <button className="secondary-button" onClick={onOpenBible}>
                <Icon name="book" />
                Abrir Biblia
              </button>
            </div>
          </article>
        ))}
      </div>
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
    </div>
  );
}
