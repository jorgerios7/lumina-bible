# Lumina Bible — Software Design Document (SDD) v2.0

# Parte 6 — Roadmap, Backlog, Segurança, Deploy, Monitoramento e Critérios de Aceitação

---

# 119. Visão de Entrega

O desenvolvimento do Lumina Bible será dividido em fases para reduzir riscos, acelerar validações com usuários e permitir evolução contínua da plataforma.

Estratégia:

```txt id="a1v9rk"
MVP
↓
V1.1
↓
V1.5
↓
V2.0
↓
V3.0
```

---

# 120. MVP

## Objetivo

Validar o principal diferencial:

```txt id="b2m7vx"
Chat
+
IA
+
Árvore de Estudos
```

---

## Funcionalidades do MVP

### Autenticação

```txt id="c3n8pw"
Login Google
Login E-mail/Senha
Recuperação de senha
Logout
```

---

### Estudos

```txt id="d4p2kr"
Criar estudo por tema
Criar estudo por pergunta
Visualizar estudos
Excluir estudos
Continuar estudo
```

---

### Árvore

```txt id="e5v7mx"
Árvore vertical recolhível
Expandir branches
Recolher branches
Abrir node
Breadcrumb
```

---

### Chat

```txt id="f6m4pt"
Mensagens
Contexto por branch
Aprofundamento
Sugestões
```

---

### Bíblia

```txt id="g7n3vx"
Livros
Capítulos
Versículos
Busca
```

---

### IA

```txt id="h8p1kr"
Gerar estudo
Explicar versículo
Aprofundar estudo
Criar branch
```

---

### Usuário

```txt id="i9v5mx"
Favoritos
Anotações
Configurações
```

---

### Interface

```txt id="j1m8pt"
Light Mode
Dark Mode
Fontes ajustáveis
```

---

# 121. Fora do MVP

Não serão implementados inicialmente.

```txt id="k2n7vx"
PWA
Áudio
Comunidade
Plano Premium
Comparação de traduções
Mapa mental visual
Knowledge Graph
Devocionais
Notificações
```

---

# 122. Versão 1.1

## Objetivo

Melhorar experiência de estudo.

---

## Funcionalidades

```txt id="l3p5kr"
Focus Mode
Referências cruzadas
Histórico avançado
Pesquisa em estudos
Pesquisa em anotações
```

---

# 123. Versão 1.5

## Objetivo

Aumentar retenção.

---

## Funcionalidades

```txt id="m4v8mx"
Progresso de estudo
Metas pessoais
Resumo semanal
Recomendações inteligentes
```

---

# 124. Versão 2.0

## Objetivo

Transformar a árvore em uma rede de conhecimento.

---

## Funcionalidades

```txt id="n5m2pt"
Mapa mental
Knowledge Graph
Visualização expandida
Conexões temáticas
```

---

# 125. Versão 3.0

## Objetivo

Criar um assistente bíblico completo.

---

## Funcionalidades

```txt id="o6n7vx"
Agente de estudo
Trilhas automáticas
Aprendizado personalizado
Perfis de estudo
```

---

# 126. Backlog Priorizado

## Prioridade P0

Obrigatório para lançamento.

```txt id="p7v4kr"
Autenticação
Bíblia
Chat
Gemini
Firestore
Árvore
Favoritos
Anotações
```

---

## Prioridade P1

Primeira atualização.

```txt id="q8m1mx"
Focus Mode
Referências cruzadas
Pesquisa
```

---

## Prioridade P2

Expansão.

```txt id="r9n5pt"
Mapa mental
Knowledge Graph
```

---

# 127. Estratégia de Desenvolvimento

## Metodologia

```txt id="s1v8vx"
Iterativa
Incremental
Orientada a MVP
```

---

## Ciclo

```txt id="t2m4kr"
Planejamento
↓
Implementação
↓
Teste
↓
Feedback
↓
Ajuste
```

---

# 128. Segurança

## Objetivos

Garantir:

```txt id="u3n7mx"
Privacidade
Integridade
Disponibilidade
```

---

# 129. Autenticação

Métodos permitidos:

```txt id="v4p2pt"
Google
E-mail/Senha
```

---

Métodos não permitidos:

```txt id="w5v9vx"
Visitante anônimo
```

---

# 130. Autorização

Todo documento sensível possuirá:

```txt id="x6m1kr"
userId
```

---

Regra:

```txt id="y7n5mx"
Usuário só acessa seus próprios dados
```

---

# 131. Firestore Rules

Exemplo conceitual.

```txt id="z8p4pt"
users
→ somente dono

studies
→ somente dono

studyNodes
→ somente dono

messages
→ somente dono

favorites
→ somente dono

notes
→ somente dono
```

---

# 132. Proteção da IA

## Regra Crítica

A chave Gemini nunca ficará no frontend.

---

Fluxo obrigatório:

```txt id="a9v7vx"
Frontend
↓
Cloud Function
↓
Gemini
```

---

Nunca:

```txt id="b1m2kr"
Frontend
↓
Gemini
```

---

# 133. Rate Limiting

Objetivo:

```txt id="c2n5mx"
Evitar abuso
Reduzir custo
```

---

Exemplo inicial:

```txt id="d3p1pt"
20 estudos por dia
100 perguntas por dia
```

Valores ajustáveis.

---

# 134. Logs

Registrar:

```txt id="e4v8vx"
Usuário
Horário
Função
Tempo de resposta
```

---

# 135. Auditoria da IA

Registrar:

```txt id="f5m4kr"
Prompt
Tokens
Modelo
Tempo
```

---

Objetivo:

```txt id="g6n7mx"
Diagnóstico
Custos
Qualidade
```

---

# 136. Backup

## Firestore

Backup automático.

---

## Frequência

```txt id="h7p2pt"
Diária
```

---

# 137. Recuperação

Objetivo:

```txt id="i8v9vx"
Perda mínima de dados
```

---

# 138. Deploy

## Plataforma

```txt id="j9m1kr"
Vercel
```

---

## Fluxo

```txt id="k1n5mx"
GitHub
↓
Pull Request
↓
Review
↓
Merge
↓
Deploy
```

---

# 139. Branches Git

```txt id="l2p4pt"
main
develop
feature/*
hotfix/*
```

---

# 140. Ambientes

## Development

```txt id="m3v7vx"
Local
```

---

## Staging

```txt id="n4m2kr"
Teste
```

---

## Production

```txt id="o5n8mx"
Usuários finais
```

---

# 141. Variáveis de Ambiente

## Frontend

```txt id="p6p1pt"
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

---

## Backend

```txt id="q7v4vx"
GEMINI_API_KEY
AI_DAILY_LIMIT
```

---

# 142. Monitoramento

## Ferramentas

```txt id="r8m9kr"
Firebase Analytics
Firebase Crashlytics (futuro)
Logs Functions
Vercel Analytics
```

---

# 143. Métricas de Produto

## Métrica 1

Estudos criados.

---

## Métrica 2

Nodes criados.

---

## Métrica 3

Perguntas realizadas.

---

## Métrica 4

Tempo médio de estudo.

---

## Métrica 5

Retenção semanal.

---

# 144. Métricas de IA

## Medir

```txt id="s9n2mx"
Tempo resposta
Tokens
Custo
Erros
```

---

# 145. Performance

## Objetivos

Primeira carga:

```txt id="t1p8pt"
< 3 segundos
```

---

Troca de telas:

```txt id="u2v5vx"
< 1 segundo
```

---

Abertura da Bíblia:

```txt id="v3m1kr"
Instantânea
```

---

# 146. Estratégias de Performance

```txt id="w4n7mx"
Lazy Loading
Code Splitting
Cache
IndexedDB
Paginação
```

---

# 147. Critérios de Aceitação do MVP

## Autenticação

### CA-001

Usuário consegue criar conta.

---

### CA-002

Usuário consegue fazer login.

---

### CA-003

Usuário consegue recuperar senha.

---

# 148. Estudos

### CA-004

Usuário consegue criar estudo.

---

### CA-005

IA gera árvore.

---

### CA-006

Estudo fica salvo.

---

# 149. Árvore

### CA-007

Branches expandem.

---

### CA-008

Branches recolhem.

---

### CA-009

Breadcrumb funciona.

---

### CA-010

Node abre corretamente.

---

# 150. Chat

### CA-011

Mensagens são persistidas.

---

### CA-012

Contexto é preservado.

---

### CA-013

Nova pergunta gera nova branch.

---

# 151. Bíblia

### CA-014

Usuário navega livros.

---

### CA-015

Usuário navega capítulos.

---

### CA-016

Usuário lê versículos.

---

### CA-017

Usuário pesquisa conteúdo.

---

# 152. Favoritos

### CA-018

Versículo pode ser favoritado.

---

### CA-019

Estudo pode ser favoritado.

---

### CA-020

Branch pode ser favoritada.

---

# 153. Anotações

### CA-021

Usuário cria nota.

---

### CA-022

Usuário edita nota.

---

### CA-023

Usuário exclui nota.

---

# 154. IA

### CA-024

IA gera estudo.

---

### CA-025

IA explica versículo.

---

### CA-026

IA gera aprofundamento.

---

### CA-027

IA sugere novas perguntas.

---

# 155. UX

### CA-028

Light Mode funciona.

---

### CA-029

Dark Mode funciona.

---

### CA-030

Fonte ajustável funciona.

---

# 156. Critério Final de Sucesso

O MVP será considerado validado quando usuários conseguirem:

```txt id="x5p4pt"
Criar estudos
Navegar pela árvore
Aprofundar versículos
Retornar posteriormente
Continuar a jornada
```

sem treinamento prévio.

---

# 157. Visão de Longo Prazo

O Lumina Bible nasce como:

```txt id="y6v8vx"
Chat Bíblico
+
Árvore de Estudos
```

Mas sua arquitetura foi planejada para evoluir para:

```txt id="z7m2kr"
Knowledge Graph Bíblico
+
Assistente de Estudo Inteligente
+
Plataforma Completa de Aprendizado das Escrituras
```

---

# Encerramento do SDD v2.0

O Lumina Bible foi concebido como uma plataforma de estudos bíblicos AI-First, focada em transformar perguntas, temas e dúvidas em jornadas estruturadas de aprendizado.

Seu principal diferencial é a combinação de:

```txt id="a8n5mx"
IA Contextual
+
Bíblia Integrada
+
Árvore de Estudos Ramificada
+
Experiência Mobile First
```

criando uma forma organizada, escalável e intuitiva de explorar as Escrituras.

**Status do Documento:** SDD v2.0 Completo.
