import type { IconName } from "@/src/components/common/Icon";
import type { StudyNode } from "@backend/types/lumina";

export function getNodeIcon(node: StudyNode): IconName {
  if (node.type === "verse" || node.type === "chapter") {
    return "book";
  }

  if (node.type === "question" || node.type === "explanation") {
    return "chat";
  }

  if (node.type === "application" || node.type === "note") {
    return "note";
  }

  if (node.type === "root") {
    return "leaf";
  }

  return "tree";
}
