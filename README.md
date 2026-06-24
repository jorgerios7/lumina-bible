# Lumina Bible

Lumina Bible e uma plataforma web mobile first para estudos biblicos guiados por IA. O MVP segue os SDDs em `docs/SDDs` e combina estudos ramificados, Biblia navegavel, chat contextual, favoritos, anotacoes e configuracoes de leitura.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Estado atual

- A experiencia funciona localmente com persistencia no navegador.
- A Biblia usa os arquivos JSON locais em `app/data/bible` e cache IndexedDB quando disponivel.
- A IA do MVP e deterministica e fica isolada em `src/services/ai/lumina-ai-service.ts`.
- A chave Gemini nao e exposta no frontend; a integracao real deve acontecer via Cloud Function.
- As regras conceituais do Firestore estao em `firestore.rules`.

## Ambiente futuro

Variaveis publicas do frontend:

```txt
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
