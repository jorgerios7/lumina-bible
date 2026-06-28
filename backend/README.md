# Lumina Bible - Demonstrativo do Backend

Este documento descreve o backend idealizado para servir o frontend atual do Lumina Bible e orientar a construcao da API real.

O objetivo e substituir as partes locais do MVP por servicos persistentes, mantendo os contratos que o frontend ja espera:

- Firebase Auth como identidade.
- Firestore como banco principal do usuario.
- API de Biblia em `NEXT_PUBLIC_API_URL`.
- Cloud Functions ou backend server-side para IA.
- Gemini protegido no backend, nunca chamado diretamente pelo frontend.

## 1. Visao geral

```txt
Frontend Next.js (`frontend/`)
  |
  | Firebase Auth token
  v
Backend API / Cloud Functions
  |
  |-- Firestore: usuarios, estudos, nodes, mensagens, favoritos, notas, ajustes
  |-- Bible datastore: livros, capitulos e versiculos
  |-- Gemini: geracao de estudos, aprofundamentos e explicacoes
```

## 2. Responsabilidades do backend

O backend deve:

- autenticar requisicoes privadas por Firebase ID Token;
- persistir dados do usuario no Firestore;
- entregar conteudo biblico por livro, capitulo e busca;
- validar referencias biblicas antes de salvar dados de IA;
- executar prompts no Gemini com rate limit e auditoria;
- salvar estudos, nodes e mensagens de forma atomica;
- retornar erros previsiveis para o frontend.

O backend nao deve:

- expor `GEMINI_API_KEY`;
- confiar em `userId` enviado pelo cliente sem validar token;
- permitir acesso entre usuarios;
- salvar resposta de IA sem validar estrutura e referencias;
- alterar texto biblico vindo da base oficial.

## 3. Variaveis de ambiente

Frontend:

```txt
NEXT_PUBLIC_API_URL=https://sua-api.com
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```

Backend:

```txt
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
GEMINI_API_KEY=
AI_DAILY_LIMIT=50
BIBLE_DATA_SOURCE=firestore|json|database
```

## 4. Autenticacao

Rotas publicas:

- `GET /api/health`
- `GET /api/bible/books`
- `GET /api/bible/:book?type=acf`
- `GET /api/bible/:book/:chapter?type=acf`

Rotas privadas:

- todas as rotas de usuario, estudos, nodes, mensagens, favoritos, notas, ajustes e IA.

Header esperado:

```http
Authorization: Bearer <firebase_id_token>
```

Middleware conceitual:

```ts
async function requireUser(request) {
  const token = getBearerToken(request);
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);

  return {
    userId: decoded.uid,
    email: decoded.email,
    name: decoded.name,
  };
}
```

Regra central:

```txt
request.auth.uid deve ser igual ao userId do documento.
```

## 5. Modelo de dados principal

### User

```ts
type User = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
};
```

Firestore:

```txt
users/{userId}
```

### Study

```ts
type Study = {
  id: string;
  userId: string;
  title: string;
  theme: string;
  rootNodeId: string;
  summary?: string;
  totalNodes: number;
  completedNodes: number;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
};
```

Firestore:

```txt
studies/{studyId}
```

### StudyNode

```ts
type StudyNode = {
  id: string;
  userId: string;
  studyId: string;
  parentId: string | null;
  rootNodeId: string;
  type:
    | "root"
    | "branch"
    | "verse"
    | "chapter"
    | "question"
    | "explanation"
    | "application"
    | "cross_reference"
    | "note";
  title: string;
  description?: string;
  bibleReference?: BibleReference;
  aiExplanation?: string;
  aiSummary?: string;
  childrenIds: string[];
  depth: number;
  path: string[];
  status: "not_started" | "in_progress" | "completed";
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
};
```

Firestore:

```txt
studyNodes/{nodeId}
```

### Message

```ts
type Message = {
  id: string;
  studyId: string;
  nodeId: string;
  userId: string;
  role: "user" | "assistant" | "system";
  content: string;
  generatedNodeIds?: string[];
  references?: BibleReference[];
  createdAt: string;
};
```

Firestore:

```txt
messages/{messageId}
```

### BibleReference

```ts
type BibleReference = {
  book: string;
  bookId?: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  translation?: string;
};
```

### Favorite, Note e Settings

Firestore:

```txt
favorites/{favoriteId}
notes/{noteId}
settings/{userId}
```

Esses documentos tambem devem conter `userId`.

## 6. API de Biblia

O frontend atual chama:

```txt
GET {NEXT_PUBLIC_API_URL}/api/bible/{book}?type={translation}
```

Exemplo:

```txt
GET /api/bible/1ch?type=acf
```

Resposta minima obrigatoria:

```json
{
  "book": "1CH",
  "abbrev": "1ch",
  "chapters": {
    "1": {
      "verse": {
        "1": "Adao, Sete, Enos,",
        "2": "Caina, Maalalel, Jarede,"
      }
    }
  }
}
```

Esse formato e importante porque `backend/src/services/bible/bible-service.ts` transforma essa resposta em:

```ts
type BibleBookData = BibleBook & {
  chapters: number[];
  versesByChapter: Record<number, BibleVerse[]>;
};
```

Endpoints recomendados:

```txt
GET /api/bible/books
GET /api/bible/:book?type=acf
GET /api/bible/:book/:chapter?type=acf
GET /api/bible/search?q=fe&book=heb&chapter=11&type=acf
```

### GET /api/bible/books

Retorna catalogo canonico dos 66 livros.

```json
[
  {
    "id": "gen",
    "name": "Genesis",
    "abbreviation": "Gn",
    "testament": "old",
    "order": 1
  }
]
```

### GET /api/bible/:book/:chapter

Opcional para evolucao. Retorna somente um capitulo.

```json
{
  "book": "heb",
  "chapter": 11,
  "verses": [
    {
      "verse": 1,
      "text": "..."
    }
  ]
}
```

### Regras da Biblia

- `book` deve ser um id conhecido do catalogo: `gen`, `exo`, `1ch`, `heb`, etc.
- `type` deve informar a traducao da Biblia, como `acf`.
- se `type` nao vier, o backend pode rejeitar a requisicao ou assumir `acf`, mas o frontend sempre deve enviar.
- `chapter` deve existir no livro.
- texto biblico deve ser somente leitura para o usuario comum.
- resposta pode ser cacheada com `Cache-Control`.
- o frontend ainda pode salvar cache em IndexedDB.

## 7. API de usuario

### GET /api/me

Privada. Cria ou retorna o perfil do usuario autenticado.

Resposta:

```json
{
  "id": "firebaseUid",
  "name": "Usuario",
  "email": "usuario@email.com",
  "photoURL": null,
  "createdAt": "2026-06-27T00:00:00.000Z",
  "updatedAt": "2026-06-27T00:00:00.000Z"
}
```

### PATCH /api/me

Atualiza nome e foto.

```json
{
  "name": "Novo nome",
  "photoURL": "https://..."
}
```

## 8. API de estudos

### GET /api/studies

Lista estudos do usuario autenticado.

Query opcional:

```txt
status=active|completed|archived
limit=20
cursor=<createdAt ou documentId>
```

Resposta:

```json
{
  "items": [],
  "nextCursor": null
}
```

### POST /api/studies

Cria estudo com IA.

Request:

```json
{
  "prompt": "Quero estudar fe",
  "explanationLevel": "beginner"
}
```

Fluxo:

```txt
1. validar token
2. validar prompt
3. buscar referencias biblicas relevantes
4. montar prompt de IA
5. chamar Gemini
6. validar JSON
7. criar Study
8. criar StudyNode root
9. criar StudyNodes filhos
10. criar Message inicial
11. retornar bundle
```

Resposta recomendada:

```json
{
  "study": {
    "id": "study_123",
    "title": "Fe",
    "theme": "Fe",
    "rootNodeId": "node_root"
  },
  "nodes": [],
  "messages": []
}
```

### GET /api/studies/:studyId

Retorna estudo se pertencer ao usuario.

### PATCH /api/studies/:studyId

Atualiza metadados simples.

Campos permitidos:

```json
{
  "title": "Novo titulo",
  "status": "archived"
}
```

### DELETE /api/studies/:studyId

Arquiva ou remove estudo.

Recomendacao: usar soft delete no inicio:

```json
{
  "status": "archived"
}
```

## 9. API da arvore de estudo

### GET /api/studies/:studyId/tree

Retorna nodes do estudo.

Query opcional:

```txt
rootNodeId=<nodeId>
depth=2
```

Resposta:

```json
{
  "studyId": "study_123",
  "nodes": []
}
```

### GET /api/studies/:studyId/nodes/:nodeId

Retorna um node e filhos imediatos.

```json
{
  "node": {},
  "children": [],
  "breadcrumb": []
}
```

### PATCH /api/studies/:studyId/nodes/:nodeId

Atualiza status, favorito ou pin.

```json
{
  "status": "completed",
  "isPinned": true
}
```

### POST /api/studies/:studyId/nodes/:nodeId/deepen

Cria nova branch a partir de uma pergunta.

Request:

```json
{
  "question": "O que significa certeza em Hebreus 11:1?",
  "explanationLevel": "intermediate"
}
```

Fluxo:

```txt
1. validar usuario e ownership do node
2. carregar estudo, node atual, breadcrumb e referencias
3. chamar Gemini
4. validar resposta
5. criar node question
6. criar node explanation
7. atualizar childrenIds do parent
8. criar mensagens user/assistant
9. retornar nodes gerados e mensagens
```

Resposta:

```json
{
  "generatedNodes": [],
  "messages": []
}
```

## 10. API de mensagens

### GET /api/studies/:studyId/nodes/:nodeId/messages

Lista mensagens do node.

### POST /api/studies/:studyId/nodes/:nodeId/messages

Pode ser usado para chat simples ou para delegar ao endpoint `deepen`.

Request:

```json
{
  "content": "Explique este trecho",
  "mode": "answer_only"
}
```

Resposta:

```json
{
  "message": {
    "role": "assistant",
    "content": "..."
  }
}
```

## 11. API de IA

### POST /api/ai/explain-verse

Request:

```json
{
  "reference": {
    "book": "Hebreus",
    "bookId": "heb",
    "chapter": 11,
    "verseStart": 1,
    "translation": "acf"
  },
  "verseText": "...",
  "level": "beginner"
}
```

Resposta:

```json
{
  "content": "Explicacao...",
  "references": [
    {
      "book": "Hebreus",
      "bookId": "heb",
      "chapter": 11,
      "verseStart": 1
    }
  ]
}
```

### POST /api/ai/cross-references

Request:

```json
{
  "reference": {
    "bookId": "heb",
    "chapter": 11,
    "verseStart": 1
  },
  "theme": "Fe"
}
```

Resposta:

```json
{
  "items": [
    {
      "targetReference": {
        "book": "Romanos",
        "bookId": "rom",
        "chapter": 10,
        "verseStart": 17
      },
      "reason": "Conecta fe com ouvir a Palavra."
    }
  ]
}
```

## 12. Favoritos

### GET /api/favorites

Lista favoritos do usuario.

### POST /api/favorites

Request:

```json
{
  "type": "verse",
  "title": "Hebreus 11:1",
  "studyId": "study_123",
  "nodeId": "node_123",
  "bibleReference": {
    "book": "Hebreus",
    "bookId": "heb",
    "chapter": 11,
    "verseStart": 1
  }
}
```

### DELETE /api/favorites/:favoriteId

Remove favorito.

## 13. Notas

### GET /api/notes

Query:

```txt
studyId=
nodeId=
```

### POST /api/notes

Request:

```json
{
  "studyId": "study_123",
  "nodeId": "node_123",
  "title": "Minha anotacao",
  "content": "Texto da nota",
  "bibleReference": {
    "book": "Hebreus",
    "bookId": "heb",
    "chapter": 11,
    "verseStart": 1
  }
}
```

### PATCH /api/notes/:noteId

Atualiza `title` e `content`.

### DELETE /api/notes/:noteId

Remove nota.

## 14. Ajustes

### GET /api/settings

Retorna ajustes do usuario.

### PUT /api/settings

Request:

```json
{
  "theme": "system",
  "fontSize": "medium",
  "explanationLevel": "beginner",
  "preferredTranslation": "acf"
}
```

## 15. Firestore recomendado

Colecoes:

```txt
users
studies
studyNodes
messages
favorites
notes
settings
aiUsage
aiAudits
```

Indices recomendados:

```txt
studies: userId ASC, createdAt DESC
studyNodes: userId ASC, studyId ASC, parentId ASC
studyNodes: userId ASC, studyId ASC, path ASC
messages: userId ASC, studyId ASC, nodeId ASC, createdAt ASC
favorites: userId ASC, createdAt DESC
notes: userId ASC, studyId ASC, nodeId ASC, updatedAt DESC
aiUsage: userId ASC, day ASC
```

## 16. Escrita atomica

Operacoes que devem usar batch/transaction:

- criar estudo com nodes e mensagem inicial;
- criar aprofundamento com pergunta, explicacao, mensagens e update do parent;
- deletar ou arquivar estudo e seus nodes;
- favoritar/desfavoritar node e atualizar `isFavorite`;
- atualizar progresso do estudo quando node muda de status.

Exemplo conceitual:

```ts
await db.runTransaction(async (tx) => {
  tx.create(studyRef, study);
  tx.create(rootNodeRef, rootNode);
  generatedNodes.forEach((node) => tx.create(nodeRef(node.id), node));
  tx.create(messageRef, initialMessage);
});
```

## 17. Regras da IA

Entrada sempre deve conter:

- usuario;
- prompt/pergunta;
- estudo atual;
- node atual, quando houver;
- breadcrumb;
- referencias biblicas disponiveis;
- nivel de explicacao.

Resposta de criacao de estudo deve ser JSON:

```json
{
  "title": "Fe",
  "summary": "Resumo curto",
  "branches": [
    {
      "title": "O que e fe?",
      "description": "Subtema",
      "verses": [
        {
          "reference": {
            "bookId": "heb",
            "chapter": 11,
            "verseStart": 1
          },
          "explanation": "..."
        }
      ]
    }
  ]
}
```

Antes de salvar:

- validar JSON;
- limitar quantidade de branches;
- limitar quantidade de versos por branch;
- validar `bookId`, `chapter` e `verseStart` na base biblica;
- remover campos inesperados;
- truncar conteudos muito longos;
- registrar auditoria.

## 18. Rate limit e auditoria

Colecao diaria:

```txt
aiUsage/{userId_yyyy-mm-dd}
```

Documento:

```json
{
  "userId": "uid",
  "day": "2026-06-27",
  "count": 3,
  "limit": 50,
  "updatedAt": "..."
}
```

Auditoria:

```txt
aiAudits/{auditId}
```

Documento:

```json
{
  "userId": "uid",
  "action": "createStudyWithAI",
  "studyId": "study_123",
  "nodeId": null,
  "promptHash": "sha256",
  "model": "gemini",
  "inputTokens": 0,
  "outputTokens": 0,
  "durationMs": 1200,
  "status": "success",
  "createdAt": "..."
}
```

## 19. Erros padronizados

Formato:

```json
{
  "error": {
    "code": "BIBLE_BOOK_NOT_FOUND",
    "message": "Livro da Biblia nao encontrado."
  }
}
```

Codigos sugeridos:

```txt
UNAUTHENTICATED
FORBIDDEN
VALIDATION_ERROR
BIBLE_BOOK_NOT_FOUND
BIBLE_CHAPTER_NOT_FOUND
BIBLE_VERSE_NOT_FOUND
STUDY_NOT_FOUND
NODE_NOT_FOUND
AI_RATE_LIMITED
AI_INVALID_RESPONSE
AI_PROVIDER_ERROR
INTERNAL_ERROR
```

## 20. Ordem sugerida de implementacao

1. Criar API de Biblia com `GET /api/bible/:book?type=acf`, mantendo exatamente o formato esperado pelo frontend.
2. Configurar Firebase Admin e middleware `requireUser`.
3. Criar `GET /api/me` para sincronizar perfil.
4. Implementar CRUD de `studies` e `studyNodes` sem IA real.
5. Implementar `messages`, `favorites`, `notes` e `settings`.
6. Migrar `createStudyWithLocalAI` para `POST /api/studies`.
7. Migrar `deepenStudyNode` para `POST /api/studies/:studyId/nodes/:nodeId/deepen`.
8. Migrar `explainVerseWithLocalAI` para `POST /api/ai/explain-verse`.
9. Adicionar rate limit, auditoria e validacao pos-IA.
10. Atualizar frontend para consumir os endpoints privados com Firebase ID Token.

## 21. Contrato minimo para desbloquear o frontend atual

Se a prioridade for apenas fazer a Biblia funcionar com a nova API, implemente primeiro:

```txt
GET /api/bible/:book?type=acf
```

Com resposta:

```json
{
  "book": "HEB",
  "abbrev": "heb",
  "chapters": {
    "11": {
      "verse": {
        "1": "..."
      }
    }
  }
}
```

Depois disso, o frontend ja consegue converter o retorno para capitulos e versiculos exibiveis.

## 22. Criterios de aceite do backend

- `GET /api/bible/1ch?type=acf` retorna o livro inteiro no formato esperado.
- rotas privadas rejeitam request sem token.
- usuario autenticado so acessa documentos com o proprio `userId`.
- criacao de estudo salva `Study`, `StudyNode` root, nodes filhos e mensagem inicial.
- aprofundamento cria nodes novos e mensagens em transacao.
- IA nunca recebe nem salva referencia biblica inexistente.
- falhas do Gemini retornam mensagem amigavel e ficam registradas em auditoria.
- nenhuma chave privada aparece no frontend.
