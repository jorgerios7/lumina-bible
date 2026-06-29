import type { Message } from "@backend/types/lumina";

type ChatStreamProps = {
  messages: Message[];
};

export function ChatStream({ messages }: ChatStreamProps) {
  return (
    <section className="chat-stream">
      {messages.map((message) => (
        <article className={`chat-bubble ${message.role}`} key={message.id}>
          <strong>{message.role === "user" ? "Voce" : "IA de estudos"}</strong>
          <p>{message.content}</p>
        </article>
      ))}
    </section>
  );
}
