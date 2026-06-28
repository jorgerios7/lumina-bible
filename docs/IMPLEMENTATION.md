# Lumina Bible - Implementacao do MVP

Este documento registra como a implementacao atual cobre o SDD v2.0 existente em `docs/SDDs`.

## Entregue

- Aplicacao Next.js em `frontend/` com App Router e rotas principais: `/login`, `/studies`, `/studies/new`, `/studies/[studyId]`, `/studies/[studyId]/tree`, `/studies/[studyId]/node/[nodeId]`, `/bible`, `/bible/[book]/[chapter]`, `/profile` e `/settings`.
- Experiencia mobile first com bottom navigation, sidebar desktop, arvore vertical recolhivel, breadcrumb, painel de node e modo foco.
- Autenticacao via Firebase Auth para Google e e-mail/senha, incluindo cadastro e recuperacao de senha.
- Criacao de estudos por tema/pergunta com IA local deterministica, sem chamada direta ao Gemini no frontend.
- Chat contextual por node com criacao de novas branches a partir de perguntas.
- Biblia navegavel por livros e capitulos usando a API configurada em `NEXT_PUBLIC_API_URL`, com busca no capitulo e cache IndexedDB quando disponivel.
- Favoritos para estudos, nodes e versiculos.
- Anotacoes criaveis, editaveis e excluiveis.
- Configuracoes de tema, tamanho de fonte e nivel de explicacao da IA.
- Regras conceituais do Firestore em `backend/firebase/firestore.rules`, garantindo isolamento por `userId`.

## Limites atuais

- Firestore, Cloud Functions e Gemini ainda dependem das variaveis de ambiente e credenciais do projeto para integracao real.
- A camada de IA esta isolada em `backend/src/services/ai/lumina-ai-service.ts` para facilitar a substituicao futura por Cloud Function.
- Nenhuma chave de IA e usada ou exposta no frontend.
