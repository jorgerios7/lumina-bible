# Lumina Bible — Software Design Document (SDD) v2.0

# Parte 4 — UX/UI, Design System, Navegação Mobile First e Wireframes

---

# 58. Filosofia de UX

## 58.1 Princípio Central

O Lumina Bible não deve parecer:

```txt id="a4p1m8"
Rede Social
Mensageiro comum
Aplicativo de produtividade
```

O Lumina Bible deve transmitir:

```txt id="jb3r9e"
Calma
Reflexão
Aprendizado
Concentração
Descoberta
Clareza
```

---

## 58.2 Objetivo da Experiência

O usuário deve sentir:

> Estou explorando as Escrituras de forma guiada, organizada e profunda.

---

## 58.3 Experiência Desejada

O produto deve parecer uma combinação de:

```txt id="7m0zcv"
Kindle
+
Notion
+
ChatGPT
+
Bíblia de Estudo
```

---

# 59. Estratégia Mobile First

## 59.1 Regra Principal

Todo componente será projetado inicialmente para:

```txt id="a0kl3z"
320px
360px
390px
430px
```

larguras típicas de smartphones.

Somente depois serão criadas adaptações para:

```txt id="w1z6qe"
Tablet
Desktop
```

---

## 59.2 Prioridades Mobile

A interface deve priorizar:

```txt id="6qf9ax"
Toque com polegar
Leitura confortável
Pouca poluição visual
Navegação simples
```

---

# 60. Design System

## 60.1 Identidade Visual

O conceito visual do Lumina Bible é:

```txt id="3g7n5s"
Luz
Sabedoria
Conhecimento
Crescimento
```

---

## 60.2 Personalidade da Interface

Características:

```txt id="u4v8cy"
Minimalista
Elegante
Acolhedora
Leve
Contemplativa
```

---

# 61. Paleta de Cores

## 61.1 Light Mode

### Fundo

```txt id="4v9lyh"
#FAF9F6
```

---

### Surface

```txt id="8r2wdm"
#FFFFFF
```

---

### Texto Principal

```txt id="tm9s7k"
#1F2937
```

---

### Texto Secundário

```txt id="j3l5bn"
#6B7280
```

---

### Cor Primária

```txt id="s5x4qt"
#4F6D5A
```

Verde Sálvia.

---

### Cor de Destaque

```txt id="f2r8va"
#C8A96B
```

Dourado suave.

---

## 61.2 Dark Mode

### Fundo

```txt id="6p4yqt"
#121212
```

---

### Surface

```txt id="o1h6kw"
#1E1E1E
```

---

### Texto Principal

```txt id="b7r3pa"
#EAEAEA
```

---

### Texto Secundário

```txt id="9n4hmu"
#A0A0A0
```

---

### Cor Primária

```txt id="2j5cxt"
#7DAA92
```

---

### Destaque

```txt id="h9v7zl"
#D4B16A
```

---

# 62. Tipografia

## 62.1 Fonte Principal

```txt id="m2q5ne"
Inter
```

---

## 62.2 Fonte Alternativa

```txt id="d6v4pk"
Source Sans 3
```

---

## 62.3 Escala Tipográfica

### Título Principal

```txt id="t3y7ws"
28px
700
```

---

### Título Secundário

```txt id="f8n2cv"
24px
600
```

---

### Título de Card

```txt id="z5q1lr"
20px
600
```

---

### Texto Bíblico

```txt id="x4w6jt"
20px
400
```

---

### Texto IA

```txt id="r8c5vz"
17px
400
```

---

### Texto Secundário

```txt id="l1n4ky"
14px
400
```

---

# 63. Espaçamento

## Sistema Base

```txt id="h7q3vp"
4
8
12
16
24
32
48
64
```

---

## Margens

Mobile:

```txt id="u8z6dm"
16px
```

---

## Espaçamento entre blocos

```txt id="o5w2ta"
24px
```

---

# 64. Navegação Principal

## Estrutura

O sistema possuirá apenas três áreas principais.

```txt id="v7c3pb"
Estudos
Bíblia
Perfil
```

---

## Bottom Navigation

Mobile:

```txt id="7r8jke"
┌─────────────────────┐
│                     │
│     Conteúdo        │
│                     │
├─────────────────────┤
│ Estudos Bíblia Perfil │
└─────────────────────┘
```

---

# 65. Fluxo Principal

## Jornada do Usuário

```txt id="5k2qmv"
Login
↓
Home
↓
Criar Estudo
↓
Chat
↓
Árvore
↓
Aprofundamento
↓
Favoritos
```

---

# 66. Tela Home

## Objetivo

Ser o ponto de entrada principal.

---

## Layout

```txt id="8f6vtr"
Olá, João

O que deseja estudar hoje?

[ Campo ]

──────────────────

Estudos Recentes

[ Card ]
[ Card ]
[ Card ]

──────────────────

Temas sugeridos

[Fé]
[Ansiedade]
[Perdão]
```

---

## Componentes

```txt id="y5j7nc"
Header
Search Input
Recent Studies
Suggested Topics
```

---

# 67. Tela de Chat

## Objetivo

Ser a experiência principal do produto.

---

## Estrutura

```txt id="n3q8vx"
Header
│
Mensagens
│
Versículos
│
Sugestões
│
Input
```

---

## Wireframe

```txt id="k7p5mt"
┌─────────────────────┐
│ Estudo: Fé          │
├─────────────────────┤
│                     │
│ IA                  │
│ Vamos estudar fé... │
│                     │
│ Hebreus 11:1        │
│                     │
│ [Aprofundar]        │
│ [Abrir Bíblia]      │
│                     │
├─────────────────────┤
│ Digite aqui...      │
└─────────────────────┘
```

---

# 68. Cards de Versículo

## Estrutura

```txt id="u9w4by"
Referência

Texto

Explicação curta

Botões
```

---

## Wireframe

```txt id="j8c6fa"
┌───────────────────┐
│ Hebreus 11:1      │
│                   │
│ Ora, a fé é...    │
│                   │
│ Explicação...     │
│                   │
│ [Aprofundar]      │
│ [Bíblia]          │
└───────────────────┘
```

---

# 69. Tela da Árvore

## Objetivo

Visualizar a estrutura do estudo.

---

## Tipo de Visualização

O MVP utilizará:

```txt id="v2j8mw"
Árvore Vertical Recolhível
```

---

## Estrutura

```txt id="c5p9bx"
Root
│
├── Branch
│
├── Verse
│
└── Question
```

---

# 70. Wireframe da Árvore

```txt id="r6k4ne"
┌─────────────────────┐
│ Fé                  │
├─────────────────────┤
│                     │
│ ▼ O que é fé?       │
│   │                 │
│   ├─ Hebreus 11:1   │
│   │  └─ Certeza     │
│   │                 │
│   └─ Romanos 10:17  │
│                     │
│ ▶ Fé e Obras        │
│                     │
│ ▶ Fé em Dificuldades│
│                     │
└─────────────────────┘
```

---

## Estados

Expandido:

```txt id="t4q7xn"
▼
```

---

Recolhido:

```txt id="a9m6pk"
▶
```

---

# 71. Nó da Árvore

## Estrutura

```txt id="x8r2wy"
Ícone
Título
Status
Ações
```

---

## Exemplo

```txt id="j1n5vm"
⭐ Hebreus 11:1
✓ Concluído
```

---

# 72. Breadcrumb

## Objetivo

Evitar que o usuário se perca.

---

## Exemplo

```txt id="m5k2rx"
Fé
>
O que é fé?
>
Hebreus 11:1
>
Certeza
```

---

## Mobile

Scroll horizontal.

---

# 73. Bottom Sheet de Node

Ao tocar em um node:

```txt id="n8p4tz"
Abrir Chat
Abrir Bíblia
Favoritar
Criar Nota
Compartilhar
```

---

## Wireframe

```txt id="s3v7ck"
──────────────

Hebreus 11:1

[Abrir Chat]

[Abrir Bíblia]

[Favoritar]

[Compartilhar]

──────────────
```

---

# 74. Tela da Bíblia

## Objetivo

Leitura tradicional.

---

## Estrutura

```txt id="v9q1nb"
Livro
Capítulo
Versículos
```

---

## Wireframe

```txt id="r4m7kp"
┌─────────────────────┐
│ Hebreus 11          │
├─────────────────────┤
│ 1 Ora, a fé é...    │
│                     │
│ 2 Porque por ela... │
│                     │
│ 3 Pela fé...        │
│                     │
└─────────────────────┘
```

---

# 75. Ações do Versículo

Pressionar versículo:

```txt id="q7n4vc"
Explicar IA
Criar Branch
Favoritar
Compartilhar
Adicionar Nota
```

---

# 76. Tela de Favoritos

## Conteúdo

```txt id="y3p8tm"
Versículos
Branches
Estudos
```

---

## Wireframe

```txt id="e6j1vk"
Favoritos

⭐ Hebreus 11:1

⭐ Estudo: Fé

⭐ Branch: O que é fé?
```

---

# 77. Tela de Anotações

## Objetivo

Guardar reflexões pessoais.

---

## Estrutura

```txt id="u7m2qx"
Título
Referência
Conteúdo
```

---

## Exemplo

```txt id="d4k8pt"
Hebreus 11:1

"Confiar mesmo sem ver."
```

---

# 78. Configurações

## Opções

```txt id="j2w5lr"
Tema
Fonte
Nível da IA
Conta
```

---

## Wireframe

```txt id="x6q3nz"
Configurações

Tema
○ Claro
○ Escuro

Fonte
○ Pequena
○ Média
○ Grande

Nível IA
○ Iniciante
○ Intermediário
○ Avançado
```

---

# 79. Focus Mode

## Objetivo

Eliminar distrações.

---

## Elementos Visíveis

```txt id="v4n7cp"
Versículo
Explicação
Aplicação
```

---

## Elementos Ocultos

```txt id="b9m1kx"
Menu
Tabs
Árvore
Favoritos
```

---

## Wireframe

```txt id="h3q8vr"
Hebreus 11:1

Ora, a fé é...

────────────────

Explicação

────────────────

Aplicação prática

[Próximo]
```

---

# 80. Estados de Carregamento

## Skeleton

Chat:

```txt id="m8j4wy"
██████████

████████

████████████
```

---

## Bíblia

```txt id="g7n3lp"
██████████████

██████████████

██████████████
```

---

# 81. Estados Vazios

## Sem Estudos

```txt id="p5k1cx"
Você ainda não possui estudos.

[ Criar Estudo ]
```

---

## Sem Favoritos

```txt id="f4v9mz"
Nenhum favorito encontrado.
```

---

# 82. Feedback Visual

## Sucesso

```txt id="r8j2nw"
Toast
```

Exemplo:

```txt id="a1k6vx"
Favorito salvo.
```

---

## Erro

```txt id="x7m4cp"
Não foi possível concluir.
```

---

# 83. Responsividade

## Mobile

```txt id="w2j8mq"
Layout principal
```

---

## Tablet

```txt id="v5n3rx"
Layout expandido
```

---

## Desktop

```txt id="s8k4pt"
Sidebar opcional
Painel secundário
```

---

# 84. Acessibilidade

## Requisitos

```txt id="d1q7vw"
Contraste adequado
Suporte teclado
ARIA labels
Leitores de tela
```

---

## Fonte Ajustável

```txt id="t3m9kx"
Pequena
Média
Grande
Extra Grande
```

---

# 85. Conclusão

A UX do Lumina Bible foi projetada para:

```txt id="c4v8pr"
Leitura confortável
Aprendizado profundo
Navegação simples
Experiência contemplativa
```

O foco não está em impressionar visualmente, mas em permitir que o usuário permaneça horas estudando sem fadiga visual e sem se perder dentro das múltiplas branches criadas durante sua jornada de aprendizado.

---

# Fim da Parte 4

Próxima Parte:

**SDD v2.0 — Parte 5: Sistema de IA, Prompts, Study Tree Engine, Fluxos de Estudo e Regras de Negócio.**
