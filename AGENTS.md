# Objetivo

Este projeto utiliza agentes de IA para auxiliar no desenvolvimento. As regras abaixo priorizam:

- produtividade;
- baixo consumo de tokens;
- redução de erros de ambiente (Windows/Sandbox);
- histórico Git limpo e rastreável;
- segurança do repositório.

---

# Regra de Commits

Cada **unidade lógica de alteração** deve gerar um commit atômico após validação proporcional bem-sucedida.

Não é obrigatório criar um commit para cada pequena edição de arquivo.

Exemplos de unidade lógica:

- correção de um bug;
- criação de um componente;
- atualização de documentação;
- implementação de uma funcionalidade;
- refatoração isolada.

Exemplos que NÃO exigem commits separados:

- ajuste de imports;
- pequenas correções intermediárias;
- renomeações locais relacionadas à mesma alteração;
- alterações temporárias durante a implementação.

---

# Regra de Atomicidade

Cada commit deve representar uma única intenção de mudança.

Exemplos:

- Uma correção de bug → 1 commit.
- Uma alteração de documentação → 1 commit.
- Uma refatoração → 1 commit.
- Uma funcionalidade grande → vários commits pequenos e independentes.

É proibido:

- misturar alterações não relacionadas;
- criar commits genéricos;
- criar commits "WIP";
- agrupar correções distintas no mesmo commit.

Exemplos:

```bash
git commit -m "fix: corrige cálculo do odômetro"
git commit -m "feat: adiciona copiloto de projetos"
git commit -m "docs: atualiza SDD da arquitetura AI First"
git commit -m "refactor: extrai serviço de navegação do copiloto"
```

---

# Responsabilidade do Agente

O agente é responsável por:

- criar commits das alterações realizadas por ele;
- identificar alterações relacionadas à tarefa atual;
- preservar alterações pré-existentes do desenvolvedor;
- evitar operações desnecessárias no repositório;
- minimizar comandos custosos.

O agente NÃO deve:

- modificar alterações do desenvolvedor sem necessidade;
- commitar alterações pré-existentes sem autorização;
- tentar corrigir automaticamente mudanças não relacionadas;
- insistir em comandos que falharam por limitação do ambiente.

---

# Alterações Pré-existentes

Antes de iniciar uma tarefa:

```bash
git status --porcelain
```

Se houver alterações:

1. identificar se são relacionadas à tarefa atual;
2. preservar alterações não relacionadas;
3. evitar modificar arquivos já alterados pelo desenvolvedor, quando possível;
4. commitar apenas alterações necessárias para a tarefa.

Não é obrigatório deixar o repositório completamente limpo quando existirem alterações pré-existentes do desenvolvedor.

O agente é responsável apenas pelas alterações relacionadas à tarefa executada.

---

# Validação Proporcional

Não executar todas as validações para toda alteração.

Executar somente as validações necessárias.

## Documentação

Exemplos:

- README
- CHANGELOG
- AGENTS.md
- comentários

Validação:

Nenhuma.

---

## Ajustes visuais pequenos

Exemplos:

- CSS;
- estilos;
- layout;
- textos.

Validação:

```bash
npm run lint
```

quando aplicável.

---

## Alterações TypeScript e lógica simples

Validação:

```bash
npm run typecheck
```

ou equivalente.

---

## Alterações de regra de negócio

Validação:

```bash
npm run typecheck
npm test
```

ou testes relacionados.

---

## Alterações estruturais

Exemplos:

- dependências;
- configuração;
- build;
- arquitetura;
- CI/CD.

Validação:

```bash
npm run lint
npm run typecheck
npm test
```

quando disponíveis.

---

# Regra de Modularidade Extrema

Todos os componentes, serviços, hooks, utilitários e estruturas criadas pelo agente devem ser desenvolvidos de forma **extremamente modular**, priorizando:

- baixo acoplamento;
- alta coesão;
- responsabilidade única;
- reutilização;
- legibilidade;
- facilidade de teste;
- facilidade de manutenção;
- substituição simples de partes do sistema.

O agente deve evitar:

- componentes grandes demais;
- arquivos com múltiplas responsabilidades;
- lógica de negócio dentro de componentes visuais;
- duplicação de código;
- funções longas e difíceis de testar;
- dependências desnecessárias entre módulos;
- acoplamento direto entre UI, API, estado global e persistência.

Sempre que aplicável:

- separar componentes visuais de lógica;
- extrair hooks reutilizáveis;
- extrair serviços para chamadas externas;
- extrair helpers/utilitários puros;
- manter tipos/interfaces em arquivos apropriados;
- criar módulos pequenos com nomes claros;
- preferir composição em vez de componentes monolíticos.

Exemplo recomendado:

```
/components
  /BibleVerseCard
    BibleVerseCard.tsx
    BibleVerseCard.types.ts
    BibleVerseCard.styles.ts

/hooks
  useBibleSearch.ts

/services
  bibleService.ts

/utils
  formatVerseReference.ts
```

Cada módulo deve ter uma intenção clara e previsível.

A modularidade não deve gerar complexidade desnecessária.

Para funcionalidades simples, manter a solução pequena, mas ainda organizada.

# Fluxo de Commit

Executar apenas o necessário:

```bash
git status
git diff
```

Após validação proporcional:

```bash
git add <arquivos-específicos>
git commit -m "<tipo>: <descrição objetiva>"
git rev-parse --short HEAD
```

Evitar:

```bash
git add .
```

quando existirem alterações não relacionadas.

---

# Modo Rápido

Para alterações de baixo risco:

- documentação;
- textos;
- comentários;
- pequenos ajustes visuais;
- renomeações locais;
- ajustes simples.

O agente deve:

1. modificar apenas os arquivos necessários;
2. evitar varreduras extensas no projeto;
3. executar validação mínima;
4. criar um commit atômico único.

---

# Política de Push

Commits atômicos são obrigatórios.

Push NÃO é automático.

O agente nunca deve executar:

```bash
git push
```

sem autorização explícita do desenvolvedor.

O agente pode apenas sugerir o push quando:

- uma funcionalidade estiver concluída;
- um conjunto coeso de commits estiver finalizado;
- houver risco de perda de trabalho local.

---

# Ambiente Windows e Sandbox

Preferir comandos simples e compatíveis com PowerShell.

Evitar:

- grep
- sed
- awk
- xargs
- pipelines Unix complexos
- comandos dependentes de Bash

Se um comando falhar por limitação do ambiente:

1. não repetir indefinidamente;
2. explicar a limitação;
3. propor alternativa compatível com PowerShell;
4. prosseguir com a tarefa quando possível.

Após uma falha de ambiente, evitar novas tentativas idênticas.

---

# Regra de Segurança

Nunca:

- expor senhas;
- expor tokens;
- expor chaves privadas;
- expor credenciais;
- commitar arquivos de ambiente.

Nunca commitar:

```
.env
.env.*
node_modules/
.expo/
dist/
build/
coverage/
```

Respeitar sempre o `.gitignore` do projeto.

Adicionar novos itens ao `.gitignore` quando necessário.

---

# Documentação

Atualizar documentação somente quando a alteração impactar:

- instalação;
- configuração;
- arquitetura;
- APIs públicas;
- funcionalidades visíveis ao usuário.

Pequenas alterações internas não exigem atualização de documentação.

---

# Princípio Geral

Priorizar:

1. menor quantidade de comandos;
2. menor consumo de tokens;
3. menor número de validações necessárias;
4. commits pequenos e rastreáveis;
5. compatibilidade com Windows;
6. preservação das alterações do desenvolvedor.