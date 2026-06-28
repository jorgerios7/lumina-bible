# Lumina Bible

Lumina Bible e uma plataforma web mobile first para estudos biblicos guiados por IA. O MVP segue os SDDs em `docs/SDDs` e combina estudos ramificados, Biblia navegavel, chat contextual, favoritos, anotacoes e configuracoes de leitura.

## Estrutura

```txt
frontend/
  app/        # rotas, layout e estilos do Next.js
  src/        # componentes, estado inicial e adaptadores de navegador
  public/     # assets publicos do frontend

backend/
  src/        # contratos, tipos e servicos de dominio/API
  firebase/   # regras e configuracoes conceituais do Firebase
```

Os scripts continuam sendo executados pela raiz do repositorio e delegam para o app em `frontend/`.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Estado atual

- A experiencia funciona localmente com persistencia no navegador.
- Login, cadastro e recuperacao de senha usam Firebase Authentication quando as variaveis publicas abaixo estao configuradas.
- A Biblia consome a API configurada em `NEXT_PUBLIC_API_URL` e mantem cache IndexedDB no frontend quando disponivel.
- A IA do MVP e deterministica e fica isolada em `backend/src/services/ai/lumina-ai-service.ts`.
- A chave Gemini nao e exposta no frontend; a integracao real deve acontecer via Cloud Function.
- As regras conceituais do Firestore estao em `backend/firebase/firestore.rules`.

## Ambiente

Variaveis publicas do frontend:

```txt
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

Variaveis privadas do backend/functions:

```txt
GEMINI_API_KEY
FIREBASE_PROJECT_ID
AI_DAILY_LIMIT
```
