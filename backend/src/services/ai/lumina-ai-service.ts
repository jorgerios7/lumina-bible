import type {
  BibleReference,
  ExplanationLevel,
  Study,
  StudyBundle,
  StudyNode,
} from "@backend/types/lumina";
import { createSlug, makeId } from "@backend/services/studies/study-tree-engine";

type TopicPreset = {
  title: string;
  summary: string;
  references: BibleReference[];
  branches: Array<{
    title: string;
    description: string;
    reference: BibleReference;
  }>;
};

const presets: TopicPreset[] = [
  {
    title: "Ansiedade",
    summary:
      "Um estudo sobre entregar preocupacoes a Deus, cultivar oracao e buscar descanso em Cristo.",
    references: [
      { book: "Filipenses", bookId: "phi", chapter: 4, verseStart: 6 },
      { book: "1 Pedro", bookId: "1pe", chapter: 5, verseStart: 7 },
    ],
    branches: [
      {
        title: "Oracao em meio a preocupacao",
        description: "Como a oracao reorganiza o coracao ansioso.",
        reference: { book: "Filipenses", bookId: "phi", chapter: 4, verseStart: 6 },
      },
      {
        title: "Lancando ansiedades sobre Deus",
        description: "O cuidado de Deus como base para descanso.",
        reference: { book: "1 Pedro", bookId: "1pe", chapter: 5, verseStart: 7 },
      },
    ],
  },
  {
    title: "Perdao",
    summary:
      "Uma jornada sobre misericordia recebida, perdao oferecido e reconciliacao pratica.",
    references: [
      { book: "Efesios", bookId: "eph", chapter: 4, verseStart: 32 },
      { book: "Mateus", bookId: "mat", chapter: 6, verseStart: 14 },
    ],
    branches: [
      {
        title: "Perdoar como fomos perdoados",
        description: "A misericordia de Deus moldando relacoes humanas.",
        reference: { book: "Efesios", bookId: "eph", chapter: 4, verseStart: 32 },
      },
      {
        title: "Perdao e vida de oracao",
        description: "Jesus conecta perdao, adoracao e vida diante do Pai.",
        reference: { book: "Mateus", bookId: "mat", chapter: 6, verseStart: 14 },
      },
    ],
  },
  {
    title: "Sabedoria",
    summary:
      "Um estudo sobre buscar discernimento em Deus e praticar escolhas maduras.",
    references: [
      { book: "Tiago", bookId: "jam", chapter: 1, verseStart: 5 },
      { book: "Proverbios", bookId: "pro", chapter: 3, verseStart: 5 },
    ],
    branches: [
      {
        title: "Pedir sabedoria a Deus",
        description: "Dependencia humilde diante de decisoes.",
        reference: { book: "Tiago", bookId: "jam", chapter: 1, verseStart: 5 },
      },
      {
        title: "Confiar no Senhor",
        description: "Discernimento que nasce de confianca e obediencia.",
        reference: { book: "Proverbios", bookId: "pro", chapter: 3, verseStart: 5 },
      },
    ],
  },
];

const defaultPreset: TopicPreset = {
  title: "Fe",
  summary:
    "Um estudo introdutorio sobre fe, escuta da Palavra e pratica obediente.",
  references: [
    { book: "Hebreus", bookId: "heb", chapter: 11, verseStart: 1 },
    { book: "Romanos", bookId: "rom", chapter: 10, verseStart: 17 },
    { book: "Tiago", bookId: "jam", chapter: 2, verseStart: 17 },
  ],
  branches: [
    {
      title: "O que e fe?",
      description: "Entendendo o conceito biblico de fe.",
      reference: { book: "Hebreus", bookId: "heb", chapter: 11, verseStart: 1 },
    },
    {
      title: "Fe em momentos dificeis",
      description: "Versiculos que fortalecem nossa fe nas provacoes.",
      reference: { book: "Romanos", bookId: "rom", chapter: 10, verseStart: 17 },
    },
    {
      title: "Fe e obras",
      description: "A relacao entre fe verdadeira e atitudes.",
      reference: { book: "Tiago", bookId: "jam", chapter: 2, verseStart: 17 },
    },
  ],
};

function resolvePreset(prompt: string) {
  const normalized = prompt
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return (
    presets.find((preset) =>
      normalized.includes(
        preset.title
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase(),
      ),
    ) ?? {
      ...defaultPreset,
      title: prompt.trim().length > 2 ? prompt.trim().slice(0, 52) : defaultPreset.title,
      summary:
        prompt.trim().length > 2
          ? `Uma jornada organizada para estudar ${prompt.trim()} com referencias, perguntas e aplicacoes.`
          : defaultPreset.summary,
    }
  );
}

export function createStudyWithLocalAI(prompt: string, userId: string): StudyBundle {
  const preset = resolvePreset(prompt);
  const now = new Date().toISOString();
  const studyId = makeId("study");
  const rootNodeId = makeId("node");
  const rootPath = createSlug(preset.title) || "estudo";

  const study: Study = {
    id: studyId,
    userId,
    title: preset.title,
    theme: preset.title,
    rootNodeId,
    summary: preset.summary,
    totalNodes: 1,
    completedNodes: 0,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  const branchNodes: StudyNode[] = preset.branches.slice(0, 5).flatMap((branch, index) => {
    const branchId = makeId("node");
    const verseId = makeId("node");
    const branchPath = [rootPath, createSlug(branch.title) || `branch-${index + 1}`];
    const referenceTitle = formatReference(branch.reference);

    return [
      {
        id: branchId,
        userId,
        studyId,
        parentId: rootNodeId,
        rootNodeId,
        type: "branch",
        title: branch.title,
        description: branch.description,
        aiSummary: `Este ramo conecta ${preset.title} com ${referenceTitle}.`,
        childrenIds: [verseId],
        depth: 1,
        path: branchPath,
        status: index === 0 ? "in_progress" : "not_started",
        isFavorite: false,
        isPinned: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: verseId,
        userId,
        studyId,
        parentId: branchId,
        rootNodeId,
        type: "verse",
        title: referenceTitle,
        description: `Referencia central para estudar ${branch.title.toLowerCase()}.`,
        bibleReference: {
          ...branch.reference,
          translation: "acf",
        },
        aiExplanation:
          "Esta referencia foi selecionada por sua ligacao direta com o tema e deve ser lida no contexto do capitulo.",
        childrenIds: [],
        depth: 2,
        path: [...branchPath, createSlug(referenceTitle) || `versiculo-${index + 1}`],
        status: "not_started",
        isFavorite: false,
        isPinned: false,
        createdAt: now,
        updatedAt: now,
      },
    ];
  });

  const rootNode: StudyNode = {
    id: rootNodeId,
    userId,
    studyId,
    parentId: null,
    rootNodeId,
    type: "root",
    title: preset.title,
    description: preset.summary,
    aiSummary:
      "A arvore inicial organiza o tema em branches claras, referencias validadas e caminhos para aprofundamento.",
    childrenIds: branchNodes
      .filter((node) => node.parentId === rootNodeId)
      .map((node) => node.id),
    depth: 0,
    path: [rootPath],
    status: "in_progress",
    isFavorite: false,
    isPinned: true,
    createdAt: now,
    updatedAt: now,
  };

  const nodes = [rootNode, ...branchNodes];

  return {
    study: {
      ...study,
      totalNodes: nodes.length,
    },
    nodes,
    messages: [
      {
        id: makeId("message"),
        studyId,
        nodeId: rootNodeId,
        userId,
        role: "assistant",
        content: `${preset.summary} Comece pelo primeiro ramo e avance por perguntas pequenas.`,
        references: preset.references,
        generatedNodeIds: nodes.slice(1).map((node) => node.id),
        createdAt: now,
      },
    ],
  };
}

export function deepenStudyNode(
  question: string,
  breadcrumb: string,
  activeReference?: BibleReference,
) {
  const referenceText = activeReference ? ` em ${formatReference(activeReference)}` : "";

  return {
    answer:
      `Considerando o caminho ${breadcrumb}${referenceText}, a pergunta deve ser tratada com calma: comece pelo contexto imediato, observe as palavras-chave e transforme a conclusao em uma pratica concreta. ` +
      "Quando houver mais de uma interpretacao cristã responsavel, a resposta deve reconhecer essa diversidade sem impor uma leitura unica.",
    application:
      "Anote uma decisao simples para hoje e vincule essa decisao ao versiculo estudado.",
    suggestions: [
      "Qual palavra-chave orienta este texto?",
      "Como este versiculo se conecta com Cristo?",
      "Que pratica nasce desta explicacao?",
    ],
    title: `Duvida: ${question.trim().replace(/[?!.]+$/, "")}?`,
  };
}

export function explainVerseWithLocalAI(
  reference: BibleReference,
  verseText: string,
  level: ExplanationLevel,
) {
  const levelCopy = {
    beginner: "Em linguagem simples",
    intermediate: "Com contexto e aplicacao",
    advanced: "Com contexto literario e conexoes biblicas",
  }[level];

  return `${levelCopy}, ${formatReference(reference)} mostra: "${verseText}". A explicacao deve partir do texto, evitar referencias inventadas e indicar uma aplicacao fiel ao contexto.`;
}

export function formatReference(reference: BibleReference) {
  const end = reference.verseEnd ? `-${reference.verseEnd}` : "";
  return `${reference.book} ${reference.chapter}:${reference.verseStart}${end}`;
}
