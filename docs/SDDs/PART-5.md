# Lumina Bible — Software Design Document (SDD) v2.0

# Parte 5 — Sistema de IA, Study Tree Engine, Fluxos de Estudo e Regras de Negócio

---

# 86. Visão Geral do Sistema de IA

## Objetivo

A Inteligência Artificial é o núcleo do Lumina Bible.

Ela não existe para substituir a Bíblia.

Ela existe para:

```txt id="p1x8kr"
Organizar estudos
Explicar versículos
Criar jornadas de aprendizado
Conectar conceitos
Gerar aprofundamentos
```

---

## Princípio Fundamental

A IA não é um chatbot genérico.

Ela é um:

```txt id="t4m9vz"
Assistente de Estudos Bíblicos
```

---

# 87. Funções da IA

## Funções Permitidas

### Gerar Estudos

Exemplo:

```txt id="v2k7pr"
Tema:
Fé
```

Resultado:

```txt id="u6c4wx"
Estrutura de estudo
Branches
Versículos
Explicações
```

---

### Explicar Versículos

Exemplo:

```txt id="z8p3qn"
Hebreus 11:1
```

---

### Aprofundar Conceitos

Exemplo:

```txt id="y5m1vr"
O que significa certeza?
```

---

### Criar Novas Branches

Exemplo:

```txt id="r7c2pk"
Como fortalecer a fé?
```

---

### Sugerir Referências Cruzadas

Exemplo:

```txt id="e4n8tx"
Hebreus 11:1
↓
Romanos 10:17
```

---

# 88. Funções Proibidas

A IA não poderá:

```txt id="q6j9bw"
Inventar referências
Inventar textos bíblicos
Criar doutrinas próprias
Alterar textos bíblicos
Fingir certeza absoluta quando houver divergências teológicas
```

---

# 89. Filosofia Teológica

## Princípio

O sistema deve ser:

```txt id="h3v8mq"
Respeitoso
Didático
Não sectário
```

---

## Temas Controversos

Quando houver múltiplas interpretações:

A IA deverá responder:

> Existem diferentes interpretações cristãs sobre este tema.

---

## Objetivo

Informar sem impor.

---

# 90. Arquitetura da IA

## Fluxo Geral

```txt id="s2x5nc"
Usuário
↓
Frontend
↓
Cloud Function
↓
Prompt Builder
↓
Gemini
↓
Response Validator
↓
Firestore
↓
Frontend
```

---

# 91. Study Tree Engine

## Definição

O Study Tree Engine é o mecanismo responsável por transformar conversas em árvores de estudo.

---

## Responsabilidades

```txt id="b5m1pr"
Criar nodes
Relacionar nodes
Calcular profundidade
Gerar breadcrumb
Controlar branches
```

---

# 92. Estrutura da Árvore

## Exemplo

```txt id="n4c8tx"
Fé
│
├── O que é fé?
│
├── Fé em dificuldades
│
└── Fé e obras
```

---

## Estrutura Interna

```txt id="k8v3wr"
Root Node
│
├── Branch Node
│
├── Verse Node
│
├── Question Node
│
└── Explanation Node
```

---

# 93. Node Root

Representa:

```txt id="m2p7xy"
Tema principal
```

Exemplo:

```txt id="j9n4vc"
Fé
```

---

# 94. Node Branch

Representa:

```txt id="q1t8wr"
Subtema
```

Exemplo:

```txt id="r3m6px"
O que é fé?
```

---

# 95. Node Verse

Representa:

```txt id="y7k5cn"
Versículo específico
```

Exemplo:

```txt id="g4v8pt"
Hebreus 11:1
```

---

# 96. Node Question

Representa:

```txt id="x9p1mr"
Pergunta do usuário
```

Exemplo:

```txt id="n5k2vt"
O que significa certeza?
```

---

# 97. Node Explanation

Representa:

```txt id="v6m4rx"
Resposta da IA
```

---

# 98. Geração Inicial de Estudo

## Entrada

Usuário:

```txt id="c8n7py"
Quero estudar fé.
```

---

## Fluxo

```txt id="d4k2mw"
Tema
↓
Busca Bíblica
↓
Prompt
↓
Gemini
↓
JSON Estruturado
↓
Study Nodes
```

---

# 99. Estrutura Esperada da Resposta

```json
{
  "title": "Fé",
  "summary": "Estudo introdutório sobre fé.",
  "branches": [
    {
      "title": "O que é fé?",
      "verses": [
        {
          "reference": "Hebreus 11:1",
          "explanation": "..."
        }
      ]
    }
  ]
}
```

---

# 100. Fluxo de Aprofundamento

## Entrada

Usuário:

```txt id="k3m8vy"
O que significa certeza?
```

---

## Sistema

Recupera:

```txt id="w5p2nc"
Tema
Branch
Versículo
Pergunta
```

---

## Contexto enviado

```txt id="z8n1vr"
Fé
↓
O que é fé?
↓
Hebreus 11:1
```

---

## Resultado

```txt id="m7c4px"
Nova resposta
+
Novo Node
```

---

# 101. Context Window

A IA sempre recebe:

## Contexto Global

```txt id="r1k9mw"
Tema principal
```

---

## Contexto Atual

```txt id="y4v6pt"
Node atual
```

---

## Caminho

```txt id="t2n8cx"
Breadcrumb completo
```

---

## Versículos relacionados

```txt id="s7m3vr"
Referências da branch
```

---

# 102. Breadcrumb Inteligente

Exemplo:

```txt id="p8k1wy"
Fé
>
O que é fé?
>
Hebreus 11:1
>
Certeza
```

---

## Utilização

O breadcrumb faz parte do prompt.

---

# 103. Prompt de Criação de Estudo

## Objetivo

Gerar a árvore inicial.

---

## Regras

```txt id="m5t7rx"
Usar apenas referências fornecidas
Gerar branches claras
Explicar versículos
Sugerir aprofundamentos
Retornar JSON
```

---

# 104. Prompt de Explicação

## Entrada

```txt id="d6v9pk"
Versículo
Contexto
Capítulo
```

---

## Saída

```txt id="u2m4cx"
Explicação
Contexto
Aplicação
```

---

# 105. Prompt de Aprofundamento

## Entrada

```txt id="v1n7rw"
Tema
Versículo
Pergunta
Breadcrumb
```

---

## Saída

```txt id="g8m2vx"
Resposta
Aplicação
Novas sugestões
```

---

# 106. Sugestões Inteligentes

Após cada resposta:

A IA deverá sugerir:

```txt id="h7p5kr"
3 aprofundamentos
```

---

## Exemplo

```txt id="b2n8vc"
O que é fé salvadora?

Como fortalecer a fé?

Qual a diferença entre fé e esperança?
```

---

# 107. Geração de Branches

## Regra

Uma nova branch será criada quando:

```txt id="m4v7pt"
Usuário solicitar aprofundamento
```

---

## Exemplo

```txt id="x3n5rw"
Hebreus 11:1
↓
Pergunta
↓
Nova branch
```

---

# 108. Referências Cruzadas

## Objetivo

Conectar estudos.

---

## Exemplo

```txt id="s9m1vx"
Hebreus 11:1
↓
Romanos 10:17
↓
Tiago 2:17
```

---

## Comportamento

Cada referência pode:

```txt id="j8k3pn"
Abrir Bíblia
Criar Branch
Gerar Explicação
```

---

# 109. Linha de Raciocínio

## Objetivo

Mostrar por que determinado versículo apareceu.

---

## Exemplo

```txt id="t5m2vr"
Fé
↓
Confiança
↓
Esperança
↓
Perseverança
```

---

## Benefício

O usuário entende o raciocínio do estudo.

---

# 110. Níveis de Explicação

## Iniciante

Explicações simples.

---

## Intermediário

Inclui:

```txt id="q2m8vc"
Contexto
Aplicação
Referências
```

---

## Avançado

Inclui:

```txt id="x6v4pn"
Contexto histórico
Estrutura literária
Intertextualidade
```

---

# 111. Regras de Criação de Nodes

## Root

Máximo:

```txt id="k1m7rx"
1
```

---

## Branches iniciais

Máximo:

```txt id="r8v3pc"
5
```

---

## Versículos por branch

Máximo:

```txt id="m4n2wy"
5
```

---

## Sugestões por resposta

Máximo:

```txt id="v9p1kr"
3
```

---

# 112. Controle de Crescimento

Objetivo:

Evitar árvores gigantescas.

---

## Estratégia

Carregar apenas:

```txt id="d5m8vx"
Node atual
Filhos imediatos
```

---

## Lazy Loading

Branches profundas serão carregadas sob demanda.

---

# 113. Regras de Negócio

## RN-001

Cada estudo possui apenas um root.

---

## RN-002

Todo node possui um parent, exceto o root.

---

## RN-003

Todo node pertence a um estudo.

---

## RN-004

Toda mensagem pertence a um node.

---

## RN-005

Toda branch deve ser rastreável pelo breadcrumb.

---

## RN-006

O usuário só acessa seus próprios estudos.

---

# 114. Validação de Respostas

Antes de salvar:

```txt id="z7m2pw"
Validar JSON
Validar referências
Validar tamanho
Validar estrutura
```

---

# 115. Tratamento de Erros

## Caso Gemini falhe

Sistema:

```txt id="n1v8kr"
Registrar log
Exibir mensagem amigável
Permitir nova tentativa
```

---

## Mensagem

```txt id="q5m3vx"
Não foi possível gerar o estudo agora.
Tente novamente em alguns instantes.
```

---

# 116. Auditoria

Registrar:

```txt id="t8n4pr"
Prompt
Tempo
Tokens
Usuário
Função utilizada
```

---

## Objetivo

```txt id="u4m7cx"
Controle de custo
Diagnóstico
Melhoria contínua
```

---

# 117. Evolução Futura

A arquitetura permitirá:

```txt id="g9p2vt"
Knowledge Graph
Recomendações personalizadas
Trilhas automáticas
Agente de estudo
```

sem alterar a estrutura central.

---

# 118. Conclusão

O sistema de IA do Lumina Bible não atua apenas como um gerador de respostas.

Ele funciona como um:

```txt id="f6m1wx"
Professor
Guia
Organizador
Construtor de Jornadas
```

transformando perguntas simples em árvores estruturadas de aprendizado bíblico.

---

# Fim da Parte 5

Próxima Parte:

**SDD v2.0 — Parte 6: Roadmap, Backlog, Segurança, Deploy, Monitoramento e Critérios de Aceitação Finais.**
