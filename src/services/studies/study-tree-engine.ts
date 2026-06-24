import type { NodeStatus, Study, StudyNode, TreeRow } from "@/src/types/lumina";

export function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

export function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 44);
}

export function findNode(nodes: StudyNode[], nodeId: string) {
  return nodes.find((node) => node.id === nodeId) ?? null;
}

export function getChildren(nodes: StudyNode[], parentId: string) {
  const parent = findNode(nodes, parentId);
  if (!parent) {
    return [];
  }

  return parent.childrenIds
    .map((childId) => findNode(nodes, childId))
    .filter((node): node is StudyNode => Boolean(node));
}

export function getBreadcrumb(nodes: StudyNode[], nodeId: string) {
  const current = findNode(nodes, nodeId);
  if (!current) {
    return [];
  }

  return current.path
    .map((_, index) =>
      nodes.find((node) => node.path.join("/") === current.path.slice(0, index + 1).join("/")),
    )
    .filter((node): node is StudyNode => Boolean(node));
}

export function getVisibleRows(
  nodes: StudyNode[],
  rootNodeId: string,
  expandedNodeIds: string[],
  query: string,
) {
  const rows: TreeRow[] = [];
  const normalizedQuery = query.trim().toLowerCase();

  function walk(nodeId: string, depth: number) {
    const node = findNode(nodes, nodeId);
    if (!node) {
      return;
    }

    const children = getChildren(nodes, node.id);
    const matches =
      normalizedQuery.length === 0 ||
      node.title.toLowerCase().includes(normalizedQuery) ||
      node.description?.toLowerCase().includes(normalizedQuery) ||
      node.aiExplanation?.toLowerCase().includes(normalizedQuery);

    if (matches || normalizedQuery.length === 0) {
      rows.push({
        node,
        depth,
        hasChildren: children.length > 0,
        isExpanded: expandedNodeIds.includes(node.id),
      });
    }

    if (expandedNodeIds.includes(node.id) || normalizedQuery.length > 0) {
      children.forEach((child) => walk(child.id, depth + 1));
    }
  }

  walk(rootNodeId, 0);
  return rows;
}

export function computeStudyProgress(study: Study, nodes: StudyNode[]) {
  const studyNodes = nodes.filter((node) => node.studyId === study.id);
  const completedNodes = studyNodes.filter((node) => node.status === "completed").length;

  return {
    totalNodes: studyNodes.length,
    completedNodes,
    percentage:
      studyNodes.length === 0 ? 0 : Math.round((completedNodes / studyNodes.length) * 100),
  };
}

export function getNodeStatusLabel(status: NodeStatus) {
  if (status === "completed") {
    return "Concluido";
  }

  if (status === "in_progress") {
    return "Em andamento";
  }

  return "Nao iniciado";
}
