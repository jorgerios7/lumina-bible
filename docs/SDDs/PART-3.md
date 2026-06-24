# Lumina Bible — Software Design Document (SDD) v2.0

# Parte 3 — Modelagem de Dados, Firestore, IndexedDB e Tipos TypeScript

---

# 30. Filosofia da Modelagem

A modelagem do Lumina Bible foi projetada para suportar o conceito central do produto:

```txt id="m8e2cw"
Estudos Ramificados
+
Árvore de Conhecimento
+
Chats Contextuais
+
Histórico Persistente
```

O sistema precisa permitir:

* múltiplos estudos por usuário;
* múltiplas branches por estudo;
* múltiplos chats por branch;
* referências bíblicas associadas;
* favoritos;
* anotações;
* evolução futura para grafo bíblico.

---

# 31. Modelo Conceitual

## Entidades Principais

```txt id="p8gtwb"
User
│
├── Studies
│    │
│    └── Study Nodes
│           │
│           ├── Messages
│           ├── Notes
│           └── References
│
├── Favorites
│
└── Settings
```

---

# 32. Usuário

## Descrição

Representa uma conta autenticada.

---

## Interface TypeScript

```ts id="kmx7dw"
export interface User {
  id: string;

  name: string;
  email: string;

  photoURL?: string;

  createdAt: Date;
  updatedAt: Date;
}
```

---

## Firestore

```txt id="f0x7ch"
users/{userId}
```

Documento:

```ts id="9dh6gh"
{
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

# 33. Estudo

## Descrição

Representa um estudo iniciado pelo usuário.

Exemplos:

```txt id="wgx85h"
Fé
Ansiedade
Perdão
Romanos 8
Salvação
```

---

## Interface

```ts id="1pr79n"
export interface Study {
  id: string;

  userId: string;

  title: string;

  theme: string;

  rootNodeId: string;

  summary?: string;

  totalNodes: number;

  completedNodes: number;

  status:
    | "active"
    | "completed"
    | "archived";

  createdAt: Date;
  updatedAt: Date;
}
```

---

## Firestore

```txt id="7g3w0o"
studies/{studyId}
```

---

# 34. Study Node

## Descrição

É a entidade mais importante do sistema.

Cada item da árvore é um node.

Exemplos:

```txt id="jw5q2e"
Tema
Branch
Versículo
Pergunta
Explicação
Aplicação
Referência Cruzada
Anotação
```

---

# 35. Tipos de Nodes

```ts id="9fz6w8"
export type StudyNodeType =
  | "root"
  | "branch"
  | "verse"
  | "chapter"
  | "question"
  | "explanation"
  | "application"
  | "cross_reference"
  | "note";
```

---

## Exemplo

```txt id="fxjlwm"
Fé
└── O que é fé?
     └── Hebreus 11:1
          └── O que significa certeza?
```

Cada item acima é um node.

---

# 36. Interface StudyNode

```ts id="k84jlwm"
export interface StudyNode {
  id: string;

  userId: string;

  studyId: string;

  parentId: string | null;

  rootNodeId: string;

  type: StudyNodeType;

  title: string;

  description?: string;

  bibleReference?: BibleReference;

  aiExplanation?: string;

  aiSummary?: string;

  childrenIds: string[];

  depth: number;

  path: string[];

  status:
    | "not_started"
    | "in_progress"
    | "completed";

  isFavorite: boolean;

  isPinned: boolean;

  createdAt: Date;
  updatedAt: Date;
}
```

---

# 37. Path Hierárquico

## Objetivo

Permitir reconstruir rapidamente o caminho do estudo.

Exemplo:

```txt id="lbodn3"
Fé
→ O que é fé?
→ Hebreus 11:1
→ Certeza
```

---

## Armazenamento

```ts id="4y6z2h"
path: [
  "faith",
  "what-is-faith",
  "hebrews-11-1",
  "certainty"
]
```

---

# 38. Breadcrumb

Gerado através do path.

Exemplo:

```txt id="d88tn5"
Fé > O que é fé? > Hebreus 11:1 > Certeza
```

---

# 39. Mensagens

## Descrição

Representam a conversa entre usuário e IA.

Cada branch possui seu próprio contexto.

---

## Interface

```ts id="1bpjlwm"
export interface Message {
  id: string;

  studyId: string;

  nodeId: string;

  userId: string;

  role:
    | "user"
    | "assistant"
    | "system";

  content: string;

  generatedNodeIds?: string[];

  references?: BibleReference[];

  createdAt: Date;
}
```

---

## Firestore

```txt id="rw2h0v"
messages/{messageId}
```

---

# 40. Referência Bíblica

## Interface

```ts id="okfjs8"
export interface BibleReference {
  book: string;

  chapter: number;

  verseStart: number;

  verseEnd?: number;

  translation?: string;
}
```

---

## Exemplo

```ts id="0tlqmd"
{
  book: "Hebreus",
  chapter: 11,
  verseStart: 1
}
```

---

# 41. Favoritos

## Interface

```ts id="0i2x9f"
export interface Favorite {
  id: string;

  userId: string;

  type:
    | "study"
    | "node"
    | "verse";

  studyId?: string;

  nodeId?: string;

  bibleReference?: BibleReference;

  title: string;

  createdAt: Date;
}
```

---

## Firestore

```txt id="h5ylp8"
favorites/{favoriteId}
```

---

# 42. Anotações

## Interface

```ts id="k1s8eh"
export interface Note {
  id: string;

  userId: string;

  studyId?: string;

  nodeId?: string;

  bibleReference?: BibleReference;

  content: string;

  createdAt: Date;
  updatedAt: Date;
}
```

---

## Firestore

```txt id="67ewqj"
notes/{noteId}
```

---

# 43. Configurações do Usuário

## Interface

```ts id="mf7t74"
export interface UserSettings {
  userId: string;

  theme:
    | "light"
    | "dark"
    | "system";

  fontSize:
    | "small"
    | "medium"
    | "large"
    | "extra_large";

  explanationLevel:
    | "beginner"
    | "intermediate"
    | "advanced";

  preferredTranslation: string;

  createdAt: Date;
  updatedAt: Date;
}
```

---

# 44. Firestore Collections

## Estrutura Completa

```txt id="mccjvp"
users
studies
studyNodes
messages
favorites
notes
settings
```

---

# 45. Estrutura de Documentos

```txt id="7jrx8z"
users/{userId}

studies/{studyId}

studyNodes/{nodeId}

messages/{messageId}

favorites/{favoriteId}

notes/{noteId}

settings/{userId}
```

---

# 46. Índices do Firestore

## Estudos por usuário

```txt id="q47x6v"
userId
createdAt DESC
```

---

## Nodes por estudo

```txt id="8umj4u"
studyId
parentId
```

---

## Mensagens por node

```txt id="njlwm0"
nodeId
createdAt ASC
```

---

## Favoritos

```txt id="5m5cqt"
userId
createdAt DESC
```

---

# 47. Banco Bíblico

## Fonte de Dados

Arquivo:

```txt id="jcnb7u"
bible.json
```

---

## Estrutura

```ts id="zjlwm7"
export interface BibleBook {
  id: string;

  name: string;

  abbreviation: string;

  testament:
    | "old"
    | "new";

  order: number;
}
```

---

## Versículos

```ts id="vjlwm9"
export interface BibleVerse {
  id: string;

  bookId: string;

  bookName: string;

  chapter: number;

  verse: number;

  text: string;

  translation: string;
}
```

---

# 48. IndexedDB

## Biblioteca

```txt id="0yhh8s"
Dexie.js
```

---

## Database

```ts id="pjlwm4"
class LuminaBibleDB extends Dexie {
  books!: Table<BibleBook>;
  verses!: Table<BibleVerse>;
  metadata!: Table<any>;
}
```

---

# 49. Estrutura IndexedDB

## books

```txt id="1fhg2o"
id
name
abbreviation
testament
order
```

---

## verses

```txt id="6jlwm1"
id
bookId
chapter
verse
text
translation
```

---

## metadata

```txt id="lfjlwm"
version
createdAt
```

---

# 50. Fluxo de Carregamento Bíblico

Primeira execução:

```txt id="j0k3u2"
Carrega bible.json
↓
Persiste IndexedDB
↓
Marca versão
↓
Utiliza IndexedDB
```

Próximas execuções:

```txt id="3jlwm2"
IndexedDB
↓
Carregamento instantâneo
```

---

# 51. Estrutura da Árvore

## Exemplo Real

```txt id="kjlwm3"
Study
│
└── Root
     │
     ├── Branch
     │    │
     │    ├── Verse
     │    │    │
     │    │    └── Question
     │    │         │
     │    │         └── Explanation
     │    │
     │    └── Verse
     │
     └── Branch
```

---

# 52. Profundidade

Cada node possui:

```ts id="gjlwm5"
depth: number
```

Exemplo:

```txt id="7l3b4j"
Fé = 0

O que é fé? = 1

Hebreus 11:1 = 2

O que significa certeza? = 3
```

---

# 53. Status de Progresso

## Tipos

```ts id="hjlwm6"
type NodeStatus =
  | "not_started"
  | "in_progress"
  | "completed";
```

---

## Representação

```txt id="jlwm7a"
○ Não iniciado

◔ Em andamento

✓ Concluído
```

---

# 54. Referências Cruzadas

## Estrutura

```ts id="ljlwm8"
export interface CrossReference {
  id: string;

  sourceReference: BibleReference;

  targetReference: BibleReference;

  reason: string;
}
```

---

## Exemplo

```txt id="mjlwm9"
Hebreus 11:1

↓

Romanos 10:17

↓

Tema:
Fé
```

---

# 55. Analytics Futuros

Estrutura prevista:

```ts id="njlwm0"
export interface StudyMetrics {
  studyId: string;

  totalNodes: number;

  totalMessages: number;

  completedNodes: number;

  favoriteCount: number;
}
```

Não será utilizado no MVP.

---

# 56. Preparação para Grafo Bíblico

Mesmo que o MVP utilize árvore vertical, os dados serão compatíveis com um futuro grafo.

Motivo:

```txt id="jlwm1b"
Node
+
Parent
+
Cross References
```

Permite evolução para:

```txt id="qjlwm2"
Knowledge Graph
```

sem refatoração do banco.

---

# 57. Estratégia de Escalabilidade

O modelo foi desenhado para:

```txt id="rjlwm3"
Milhares de usuários
Milhões de mensagens
Grandes árvores
Referências cruzadas
```

sem necessidade de reestruturação.

---

# Conclusão

A modelagem do Lumina Bible foi construída para suportar o conceito central do produto:

```txt id="sjlwm4"
Tema
↓
Árvore
↓
Versículos
↓
Dúvidas
↓
Novas Branches
↓
Conhecimento Organizado
```

O modelo é simples para o MVP, mas suficientemente flexível para suportar futuras evoluções como grafo bíblico, recomendações inteligentes e trilhas personalizadas.

---

# Fim da Parte 3

Próxima Parte:

**SDD v2.0 — Parte 4: UX/UI, Design System, Navegação Mobile First e Wireframes.**
