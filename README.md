# Semana do Jovem Trabalhador

Aplicação educativa em React para apresentar conteúdos, dicas e experiências interativas sobre mercado de trabalho, aprendizagem profissional e orientação de carreira.

## Stack

- React 19
- Vite
- React Router
- Tailwind CSS 4
- Headless UI e Heroicons
- Leaflet / React Leaflet
- Express + Socket.IO para o modo de competição ao vivo
- Howler e canvas-confetti
- TypeScript incremental para lógica e dados
- Vitest para testes unitários
- Playwright para testes E2E

## Como rodar

```bash
npm install
npm run dev
```

URL local padrão:

```txt
http://127.0.0.1:5173/
```

Para o modo de competição ao vivo, rode também o backend em outro terminal:

```bash
npm run dev:server
```

Backend local padrão:

```txt
http://localhost:4000/
```

## Scripts

```bash
npm run dev        # servidor Vite
npm run dev:server # servidor Express + Socket.IO
npm run build      # build de produção
npm run preview    # preview do build
npm run start:server # inicia o backend sem watch
npm run lint       # ESLint
npm run typecheck  # TypeScript sem emitir arquivos
npm run test:unit  # testes unitários com Vitest
npm run test:e2e   # testes E2E com Playwright
npm run test       # unitários + E2E
```

## Estrutura

```txt
src/
  app/          # providers, layout e router
  components/   # componentes legados e widgets visuais existentes
  content/      # perguntas, textos, dicas, cartas e dados editoriais
  entities/     # regras de entidades reutilizáveis
  features/     # lógica por funcionalidade
  pages/        # telas roteadas
  shared/       # tipos e componentes UI reutilizáveis

server/
  src/          # Express, Socket.IO e domínio das salas ao vivo
  tests/        # testes unitários e de fluxo socket
```

## Arquitetura atual

- `app/router` centraliza rotas e aplica code splitting nas rotas interativas.
- `app/providers` centraliza tema e providers globais.
- `content` guarda dados editoriais e conteúdo estruturado.
- `features` concentra regras, hooks e persistência por fluxo.
- `shared/ui` guarda componentes visuais reutilizáveis como `ProgressBar`, `Badge`, `ResultPanel`, `FeedbackNotice` e `CtaButtonRow`.
- `shared/types` concentra os tipos ricos usados pela camada de lógica/dados migrada para TypeScript.

## Funcionalidades

- Home com linha do tempo e atalhos para as experiências.
- Página de histórias com conteúdo educativo e curiosidades.
- Página de dicas com sidebar e ScrollSpy.
- Teste vocacional com ranking top 3, percentuais, histórico local e próximos passos.
- Quiz com feedback por resposta, explicação, revisão final e resumo salvo localmente.
- Jogo da memória com níveis de dificuldade, prévia inicial, recordes locais e resultado próprio.
- Competição ao vivo com sala por PIN, lobby em tempo real, host, jogadores, leaderboard e ranking final.
- Mapa de unidades com filtros por estado e cidade.
- Tema claro/escuro persistido no navegador.
- Telemetria local em desenvolvimento via `window.__stwDebugStats`.

## Competição Ao Vivo

O modo ao vivo usa `Node + Express + Socket.IO` com estado em memória. Reiniciar o backend apaga as salas abertas.

Rotas principais:

- `/competicao`: entrada do modo ao vivo.
- `/competicao/host`: cria uma sala e gera PIN.
- `/competicao/host/:pin`: painel do host.
- `/competicao/entrar`: formulário de jogador.
- `/competicao/sala/:pin`: sala do jogador.

Variáveis opcionais:

- `PORT`: porta do backend, padrão `4000`.
- `CLIENT_ORIGIN`: origem permitida no CORS, padrão `http://localhost:5173`.
- `LIVE_QUIZ_ROUND_MS`: duração da rodada em milissegundos, padrão `20000`.
- `VITE_SOCKET_URL`: URL do Socket.IO no frontend, padrão `http://localhost:4000`.

## Persistência Local

Os fluxos principais usam `localStorage` por meio de `features/persistence`:

- `stw.v1.quiz`: último score, melhor sequência, quantidade de erros e data de conclusão.
- `stw.v1.memory`: recorde por dificuldade (`facil`, `medio`, `dificil`).
- `stw.v1.vocational`: último ranking vocacional top 3.
- `stw.v1.analytics`: contadores locais de debug em ambiente de desenvolvimento.

Dados ausentes ou inválidos caem em estado vazio sem quebrar a UI.

## Roadmap curto

- Ampliar a migração TypeScript para hooks e componentes de maior risco.
- Evoluir mais componentes legados para `widgets/` e `shared/ui/`.
- Consolidar acessibilidade fina em todos os controles interativos.
- Avaliar persistência sincronizada ou backend somente se o produto precisar de histórico multi-dispositivo.
