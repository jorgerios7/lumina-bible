import { Breadcrumb } from "@/src/components/lumina/tree/Breadcrumb";
import { ChatInput } from "@/src/components/lumina/views/chat/ChatInput";
import { ChatReferenceGrid } from "@/src/components/lumina/views/chat/ChatReferenceGrid";
import { ChatStream } from "@/src/components/lumina/views/chat/ChatStream";
import { matchesSearchQuery } from "@/src/components/lumina/utils/search";
import { getChildren } from "@backend/services/studies/study-tree-engine";
import type { ChatViewProps } from "@/src/components/lumina/views/chat/types";

export function ChatView({
  activeNode,
  breadcrumb,
  draft,
  query,
  messages,
  nodes,
  onChangeDraft,
  onOpenBible,
  onSend,
}: ChatViewProps) {
  const references = [activeNode, ...getChildren(nodes, activeNode.id)].filter((node) => node.bibleReference);
  const filteredMessages = messages.filter((message) => matchesSearchQuery(query, [message.content, message.role]));
  const filteredReferences = references.filter((node) =>
    matchesSearchQuery(query, [node.title, node.description, node.aiSummary, node.aiExplanation]),
  );

  return (
    <div className="chat-layout">
      <Breadcrumb nodes={breadcrumb} onSelect={() => undefined} />
      <ChatStream messages={filteredMessages} />
      <ChatReferenceGrid references={filteredReferences} onOpenBible={onOpenBible} />
      <ChatInput draft={draft} onChangeDraft={onChangeDraft} onSend={onSend} />
    </div>
  );
}
