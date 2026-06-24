# Lumina Bible — Software Design Document (SDD) v2.0

# Parte 1 — Visão do Produto e Requisitos

---

# 1. Informações do Documento

## Nome do Produto

**Lumina Bible**

## Versão do Documento

```txt
SDD v2.0
```

## Status

```txt
Em Planejamento
```

## Plataforma

```txt
Web Application
Mobile First
```

## Stack Principal

```txt
Next.js 15
TypeScript
Tailwind CSS
Firebase
Firestore
Gemini
IndexedDB
Vercel
```

---

# 2. Visão do Produto

## 2.1 Resumo

Lumina Bible é uma plataforma de estudos bíblicos orientada por Inteligência Artificial que transforma temas, dúvidas e perguntas em jornadas estruturadas de aprendizado.

Diferentemente de aplicativos bíblicos tradicionais, o Lumina Bible não apresenta apenas versículos ou respostas isoladas.

O sistema cria uma experiência guiada onde cada estudo se transforma em uma árvore navegável de conhecimento.

O usuário pode iniciar um estudo a partir de:

```txt
Um tema
Uma pergunta
Uma dúvida
Um versículo
Um capítulo
```

A IA então:

```txt
Compreende o contexto
Seleciona referências bíblicas relevantes
Cria uma estrutura de estudo
Organiza os conteúdos em branches
Explica cada etapa
Permite aprofundamentos sucessivos
```

---

# 3. Problema que o Produto Resolve

## Problema Atual

Grande parte dos aplicativos bíblicos oferece apenas:

* leitura da Bíblia;
* busca de versículos;
* planos devocionais;
* comentários estáticos.

Essas abordagens apresentam limitações:

### Limitação 1

O usuário recebe informações isoladas.

### Limitação 2

O usuário não possui um caminho estruturado de estudo.

### Limitação 3

Dúvidas geradas durante a leitura não são organizadas.

### Limitação 4

O aprendizado ocorre de forma linear.

### Limitação 5

A relação entre conceitos bíblicos não fica evidente.

---

## Solução Proposta

Lumina Bible oferece:

```txt
Chat Inteligente
+
Bíblia
+
Árvore de Estudos
+
Explicações Contextuais
+
Aprofundamento Progressivo
```

Transformando qualquer tema em uma jornada organizada.

---

# 4. Proposta de Valor

## Diferencial Principal

### Árvore de Estudos Ramificada

Cada estudo gera uma estrutura navegável.

Exemplo:

```txt
Fé
│
├── O que é fé?
│   ├── Hebreus 11:1
│   │   └── O que significa certeza?
│   │       └── Aplicação prática
│   │
│   └── Romanos 10:17
│
├── Fé em momentos difíceis
│
└── Fé e obras
```

Cada nó da árvore possui seu próprio contexto.

---

## Diferencial Secundário

### Chat Contextual

Cada branch pode abrir um chat independente.

Exemplo:

```txt
Tema principal:
Fé

↓

Versículo:
Hebreus 11:1

↓

Dúvida:
O que significa certeza?

↓

Novo chat especializado
```

---

## Diferencial Terciário

### Navegação por Conhecimento

O usuário não navega apenas por livros e capítulos.

Ele navega por:

```txt
Temas
Conceitos
Versículos
Aplicações
Perguntas
Referências cruzadas
```

---

# 5. Objetivos do Produto

## Objetivo Principal

Permitir estudos bíblicos profundos através de uma experiência guiada por IA.

---

## Objetivos Secundários

### O1

Facilitar a compreensão das Escrituras.

### O2

Estimular estudos temáticos.

### O3

Permitir aprofundamentos ilimitados.

### O4

Organizar conhecimento bíblico.

### O5

Criar uma experiência confortável para leitura prolongada.

### O6

Promover retenção de aprendizado.

### O7

Criar um histórico permanente de estudos.

---

# 6. Público-Alvo

## Perfil Principal

Cristãos interessados em estudo bíblico.

---

## Segmentos

### Iniciantes

Necessitam de explicações simples.

### Intermediários

Desejam contexto e aplicações.

### Avançados

Buscam aprofundamento teológico.

### Líderes

Necessitam preparar estudos.

### Professores

Precisam organizar conteúdos.

### Jovens

Desejam respostas rápidas e contextualizadas.

---

# 7. Escopo do MVP

## Funcionalidades Incluídas

### Autenticação

```txt
Login Google
Login E-mail/Senha
```

---

### Chat de Estudos

```txt
Criar estudo por tema
Criar estudo por dúvida
Criar estudo por pergunta
```

---

### Árvore de Estudos

```txt
Criar árvore automaticamente
Expandir nós
Recolher nós
Abrir chats específicos
```

---

### Bíblia

```txt
Selecionar livro
Selecionar capítulo
Ler versículos
Pesquisar versículos
```

---

### IA

```txt
Explicar versículos
Gerar estudos
Aprofundar temas
Gerar novas branches
```

---

### Favoritos

```txt
Salvar versículos
Salvar branches
Salvar estudos
```

---

### Anotações

```txt
Criar notas
Editar notas
Excluir notas
```

---

### Compartilhamento

```txt
Versículos
Explicações
Trechos de estudo
```

---

### Configurações

```txt
Light Mode
Dark Mode
Tamanho da fonte
```

---

# 8. Funcionalidades Fora do MVP

Não serão implementadas inicialmente:

```txt
PWA
Comunidade
Chat entre usuários
Devocionais avançados
Áudio
Reconhecimento de voz
Exportação PDF
Comparação avançada de traduções
Mapa mental visual
Grafo bíblico
```

---

# 9. Casos de Uso

## UC-001

### Criar Estudo

Usuário:

```txt
Quero estudar sobre fé.
```

Sistema:

```txt
Busca referências
Gera estudo
Cria árvore
Abre chat
```

Resultado:

```txt
Estudo criado
```

---

## UC-002

### Aprofundar Versículo

Usuário:

```txt
Seleciona Hebreus 11:1
```

Sistema:

```txt
Abre contexto específico
```

Usuário:

```txt
O que significa certeza?
```

Sistema:

```txt
Responde
Cria nova branch
```

---

## UC-003

### Explicar Versículo

Usuário:

```txt
Pressiona versículo
```

Sistema:

```txt
Mostra opções
```

Usuário:

```txt
Explicar com IA
```

Sistema:

```txt
Gera explicação
```

---

## UC-004

### Favoritar

Usuário:

```txt
Toca em favorito
```

Sistema:

```txt
Salva no Firestore
```

---

## UC-005

### Criar Anotação

Usuário:

```txt
Escreve anotação
```

Sistema:

```txt
Vincula ao versículo
```

---

# 10. Requisitos Funcionais

## RF-001

O sistema deve permitir autenticação via Google.

---

## RF-002

O sistema deve permitir autenticação via e-mail e senha.

---

## RF-003

O sistema deve permitir criar estudos a partir de temas.

---

## RF-004

O sistema deve permitir criar estudos a partir de perguntas.

---

## RF-005

O sistema deve gerar automaticamente uma árvore de estudo.

---

## RF-006

O sistema deve permitir expandir e recolher branches.

---

## RF-007

O sistema deve permitir abrir um chat específico para cada nó.

---

## RF-008

O sistema deve permitir favoritar estudos.

---

## RF-009

O sistema deve permitir favoritar versículos.

---

## RF-010

O sistema deve permitir criar anotações.

---

## RF-011

O sistema deve permitir compartilhar conteúdo.

---

## RF-012

O sistema deve exibir uma Bíblia navegável.

---

## RF-013

O sistema deve permitir busca textual.

---

## RF-014

O sistema deve explicar versículos utilizando IA.

---

## RF-015

O sistema deve gerar novas branches a partir das dúvidas do usuário.

---

## RF-016

O sistema deve exibir breadcrumb navegável.

---

## RF-017

O sistema deve armazenar histórico de estudos.

---

## RF-018

O sistema deve manter contexto entre branches relacionadas.

---

# 11. Requisitos Não Funcionais

## RNF-001

A aplicação deve ser Mobile First.

---

## RNF-002

A aplicação deve ser responsiva.

---

## RNF-003

A aplicação deve funcionar nos navegadores modernos.

```txt
Chrome
Edge
Firefox
Safari
```

---

## RNF-004

O carregamento inicial deve ocorrer em menos de 3 segundos em conexões comuns.

---

## RNF-005

A navegação entre páginas deve ser instantânea após carregamento inicial.

---

## RNF-006

A interface deve suportar Light Mode.

---

## RNF-007

A interface deve suportar Dark Mode.

---

## RNF-008

O sistema deve garantir que usuários acessem apenas seus próprios dados.

---

## RNF-009

Nenhuma chave de IA poderá ficar exposta no frontend.

---

## RNF-010

O sistema deve suportar crescimento para milhares de usuários simultâneos.

---

# 12. Critérios de Sucesso

O MVP será considerado bem-sucedido quando:

### Métrica 1

Usuário consegue criar um estudo em menos de 30 segundos.

### Métrica 2

Usuário consegue aprofundar um versículo em menos de 2 cliques.

### Métrica 3

Usuário consegue localizar um estudo anterior facilmente.

### Métrica 4

A árvore de estudos permanece navegável mesmo após múltiplas branches.

### Métrica 5

O usuário percebe claramente a relação entre tema, versículos e aprofundamentos.

---

# Fim da Parte 1

Próxima Parte:

**SDD v2.0 — Parte 2: Arquitetura Técnica (Next.js, Firebase, Gemini, Firestore, IndexedDB, Vercel e Segurança).**
