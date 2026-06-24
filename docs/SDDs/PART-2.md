# Lumina Bible — Software Design Document (SDD) v2.0

# Parte 2 — Arquitetura Técnica

---

# 13. Visão Geral da Arquitetura

## 13.1 Arquitetura escolhida

O Lumina Bible será uma aplicação:

```txt id="xumk45"
Web
Mobile First
Client + Backend as a Service
AI-first
```

Stack oficial:

```txt id="gg82b2"
Next.js 15
TypeScript
Tailwind CSS
Firebase Auth
Firestore
Firebase Cloud Functions
Gemini
IndexedDB
Vercel
```

---

# 14. Diagrama Geral

```txt id="7tkpsl"
Usuário
  │
  ▼
Navegador Mobile/Desktop
  │
  ▼
Next.js Frontend
  │
  ├── Firebase Auth
  │
  ├── Firestore
  │
  ├── IndexedDB
  │
  └── API Routes / Server Actions
          │
          ▼
Firebase Cloud Functions
          │
          ▼
Gemini API
```

---

# 15. Responsabilidades por Camada

## 15.1 Frontend — Next.js

Responsável por:

```txt id="fr8375"
Renderizar interface
Gerenciar rotas
Controlar estado local
Exibir chat
Exibir Bíblia
Exibir árvore de estudos
Consumir Firebase
Consumir Cloud Functions
Gerenciar IndexedDB
```

---

## 15.2 Firebase Auth

Responsável por:

```txt id="t4bphn"
Login Google
Login E-mail/Senha
Sessão do usuário
Proteção de rotas privadas
Identidade do usuário
```

---

## 15.3 Firestore

Responsável por armazenar:

```txt id="a6idtr"
Usuários
Estudos
Nós da árvore
Mensagens
Favoritos
Anotações
Configurações
```

---

## 15.4 IndexedDB

Responsável por:

```txt id="esqrwj"
Cache da Bíblia
Leitura rápida
Busca local inicial
Redução de chamadas externas
Melhor experiência mobile
```

---

## 15.5 Firebase Cloud Functions

Responsável por:

```txt id="0rxxo2"
Proteger chave do Gemini
Executar prompts
Validar entrada
Controlar custo
Aplicar rate limit
Processar respostas da IA
Validar referências bíblicas
```

---

## 15.6 Gemini API

Responsável por:

```txt id="rkh23m"
Gerar estudos
Explicar versículos
Criar branches
Responder dúvidas
Sugerir aprofundamentos
```

---

## 15.7 Vercel

Responsável por:

```txt id="rz16cw"
Hospedar frontend Next.js
Deploy automático
Preview deployments
CDN global
Variáveis de ambiente do frontend
```

---

# 16. Decisão Arquitetural Principal

## 16.1 Separação entre Frontend e IA

O frontend **não deve chamar o Gemini diretamente**.

Fluxo correto:

```txt id="u73z8g"
Frontend
→ Firebase Cloud Function
→ Gemini
→ Cloud Function
→ Frontend
```

Motivos:

```txt id="1qxg3s"
Proteção da API Key
Controle de custo
Auditoria
Validação
Padronização de prompts
Segurança
```

---

# 17. Estrutura Next.js

## 17.1 App Router

O projeto usará o **App Router** do Next.js.

Estrutura base:

```txt id="2eqjve"
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   ├── studies/
│   ├── bible/
│   ├── profile/
│   ├── settings/
│   └── api/
├── components/
├── services/
├── stores/
├── hooks/
├── types/
├── lib/
├── data/
└── theme/
```

---

## 17.2 Rotas principais

```txt id="7akghn"
/login
/studies
/studies/new
/studies/[studyId]
/studies/[studyId]/tree
/studies/[studyId]/node/[nodeId]
/bible
/bible/[book]
/bible/[book]/[chapter]
/profile
/settings
```

---

# 18. Organização de Pastas

```txt id="8dq3qo"
src/
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── studies/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   ├── [studyId]/
│   │   │   ├── page.tsx
│   │   │   ├── tree/
│   │   │   │   └── page.tsx
│   │   │   └── node/
│   │   │       └── [nodeId]/
│   │   │           └── page.tsx
│   ├── bible/
│   │   ├── page.tsx
│   │   └── [book]/
│   │       └── [chapter]/
│   │           └── page.tsx
│   ├── profile/
│   └── settings/
│
├── components/
│   ├── layout/
│   ├── chat/
│   ├── bible/
│   ├── study-tree/
│   ├── auth/
│   └── common/
│
├── services/
│   ├── firebase/
│   ├── ai/
│   ├── bible/
│   ├── studies/
│   └── users/
│
├── stores/
├── hooks/
├── types/
├── lib/
├── data/
└── theme/
```

---

# 19. Frontend Architecture

## 19.1 Estado local

Estado local recomendado:

```txt id="lnkh37"
Zustand
```

Motivo:

```txt id="maynbv"
Simples
Leve
Boa integração com React
Menos boilerplate
Adequado para apps mobile first
```

Estados globais:

```txt id="buwxkh"
authStore
studyStore
bibleStore
settingsStore
uiStore
```

---

## 19.2 React Query

Para dados assíncronos, recomenda-se:

```txt id="93biqj"
TanStack Query
```

Uso:

```txt id="8wdfkd"
Buscar estudos
Buscar mensagens
Buscar favoritos
Sincronizar Firestore
Cache temporário
Mutations
```

---

## 19.3 Tailwind CSS

Tailwind será usado para:

```txt id="n2v0xg"
Layout mobile first
Tema light/dark
Espaçamento consistente
Componentes responsivos
Design system
```

---

# 20. Backend Architecture

## 20.1 Firebase como Backend Principal

Firebase será usado para:

```txt id="vfe9hg"
Autenticação
Banco de dados
Funções server-side
Storage futuro
Analytics futuro
```

---

## 20.2 Cloud Functions

Funções principais:

```txt id="kl8qej"
createStudyWithAI
deepenStudyNode
explainBibleVerse
generateCrossReferences
validateAIResponse
```

---

## 20.3 Exemplo de fluxo createStudyWithAI

```txt id="ugorkb"
1. Usuário envia tema
2. Frontend chama Cloud Function
3. Function valida usuário
4. Function busca versículos relevantes
5. Function monta prompt
6. Function chama Gemini
7. Function valida resposta
8. Function cria Study
9. Function cria StudyNodes
10. Function retorna studyId
```

---

# 21. Integração Gemini

## 21.1 Camada de serviço

```txt id="volfok"
functions/
├── src/
│   ├── ai/
│   │   ├── gemini.client.ts
│   │   ├── prompts/
│   │   │   ├── createStudy.prompt.ts
│   │   │   ├── deepenNode.prompt.ts
│   │   │   └── explainVerse.prompt.ts
│   │   └── validators/
```

---

## 21.2 Regras da IA

A IA deve:

```txt id="qik064"
Usar apenas contexto fornecido
Não inventar referências
Responder em JSON quando solicitado
Gerar linguagem clara
Indicar incertezas
Evitar tom dogmático em temas controversos
```

---

## 21.3 Validação pós-IA

Antes de salvar resposta:

```txt id="bn7r6y"
Validar JSON
Validar referências bíblicas
Remover referências inválidas
Checar campos obrigatórios
Aplicar limite de tamanho
```

---

# 22. Bíblia Local

## 22.1 Estratégia escolhida

```txt id="66lby7"
JSON local otimizado
+
IndexedDB
```

---

## 22.2 Fluxo

```txt id="p2n9eb"
Primeiro acesso
→ Carrega bible.json
→ Salva no IndexedDB
→ Próximos acessos usam IndexedDB
```

---

## 22.3 Estrutura dos dados bíblicos

```ts id="avxkus"
export type BibleBook = {
  id: string;
  name: string;
  abbreviation: string;
  testament: "old" | "new";
  order: number;
};

export type BibleVerse = {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
};
```

---

## 22.4 IndexedDB

Biblioteca recomendada:

```txt id="odcpqo"
Dexie.js
```

Tabelas:

```txt id="26g7qa"
books
verses
metadata
```

---

# 23. Firestore Architecture

## 23.1 Coleções principais

```txt id="comvwd"
users
studies
studyNodes
messages
favorites
notes
settings
```

---

## 23.2 Princípio de segurança

Cada documento sensível terá:

```txt id="txephn"
userId
```

Isso permite regras como:

```txt id="75mghj"
request.auth.uid == resource.data.userId
```

---

# 24. Segurança

## 24.1 Regras essenciais

```txt id="wztr63"
Usuário autenticado obrigatório
Sem visitante anônimo
Dados isolados por userId
Gemini apenas via Cloud Function
Validação server-side
Rate limit
```

---

## 24.2 Variáveis de ambiente

Frontend:

```txt id="sda0f5"
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

Backend Functions:

```txt id="b9t7yw"
GEMINI_API_KEY
FIREBASE_PROJECT_ID
AI_DAILY_LIMIT
```

---

# 25. Hospedagem

## 25.1 Plataforma escolhida

```txt id="vp5ouz"
Vercel
```

Motivos:

```txt id="bubvde"
Excelente integração com Next.js
Deploy rápido
Preview por branch
CDN global
Configuração simples
```

---

## 25.2 Deploy

Fluxo:

```txt id="w27xop"
GitHub
→ Vercel
→ Preview Deploy
→ Production Deploy
```

---

# 26. Ambientes

## 26.1 Ambientes necessários

```txt id="s61c9n"
development
staging
production
```

---

## 26.2 Firebase Projects

Recomendado:

```txt id="ygng5u"
lumina-bible-dev
lumina-bible-prod
```

Staging pode usar dev inicialmente.

---

# 27. Performance

## 27.1 Estratégias

```txt id="csukc8"
Code splitting
Lazy loading
Cache IndexedDB
Paginação de mensagens
Carregamento sob demanda da árvore
Compressão do JSON bíblico
Debounce na busca
```

---

# 28. Limitações Técnicas do MVP

O MVP não terá:

```txt id="gt6w3h"
PWA
Offline completo
Notificações push
Mapa mental visual
Backend próprio Node separado
Banco SQL
Multi-idioma avançado
```

---

# 29. Conclusão Técnica

A arquitetura escolhida é adequada porque combina:

```txt id="94k4ow"
Rapidez de desenvolvimento
Boa escalabilidade
Baixo custo inicial
Segurança para IA
Experiência mobile first
Deploy simples
```

O Lumina Bible será construído como uma aplicação web moderna, com frontend em Next.js, backend baseado em Firebase e inteligência artificial protegida por Cloud Functions.

---

# Fim da Parte 2

Próxima Parte:

**SDD v2.0 — Parte 3: Modelagem de Dados, Firestore, IndexedDB e Tipos TypeScript.**
