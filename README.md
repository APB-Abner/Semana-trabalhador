# Semana do Jovem Trabalhador

Aplicacao educativa em React para apresentar conteudos, dicas e experiencias interativas sobre mercado de trabalho, aprendizagem profissional e orientacao de carreira.

## Stack

- React 19
- Vite
- React Router
- Tailwind CSS 4
- Headless UI e Heroicons
- Leaflet / React Leaflet
- Howler e canvas-confetti
- TypeScript incremental para logica e dados
- Vitest para testes unitarios
- Playwright para testes E2E

## Como rodar

```bash
npm install
npm run dev
```

URL local padrao:

```txt
http://127.0.0.1:5173/
```

## Scripts

```bash
npm run dev        # servidor Vite
npm run build      # build de producao
npm run preview    # preview do build
npm run lint       # ESLint
npm run typecheck  # TypeScript sem emitir arquivos
npm run test:unit  # testes unitarios com Vitest
npm run test:e2e   # testes E2E com Playwright
npm run test       # unitarios + E2E
```

## Estrutura

```txt
src/
  app/          # providers, layout e router
  components/   # componentes legados e widgets visuais existentes
  content/      # perguntas, textos, dicas, cartas e dados editoriais
  entities/     # regras de entidades reutilizaveis
  features/     # logica por funcionalidade
  pages/        # telas roteadas
  shared/       # tipos e componentes UI reutilizaveis
```

## Arquitetura atual

- `app/router` centraliza rotas e aplica code splitting nas rotas interativas.
- `app/providers` centraliza tema e providers globais.
- `content` guarda dados editoriais e conteudo estruturado.
- `features` concentra regras, hooks e persistencia por fluxo.
- `shared/ui` guarda componentes visuais reutilizaveis como `ProgressBar`, `Badge`, `ResultPanel`, `FeedbackNotice` e `CtaButtonRow`.
- `shared/types` concentra os tipos ricos usados pela camada de logica/dados migrada para TypeScript.

## Funcionalidades

- Home com linha do tempo e atalhos para as experiencias.
- Pagina de historias com conteudo educativo e curiosidades.
- Pagina de dicas com sidebar e ScrollSpy.
- Teste vocacional com ranking top 3, percentuais, historico local e proximos passos.
- Quiz com feedback por resposta, explicacao, revisao final e resumo salvo localmente.
- Jogo da memoria com niveis de dificuldade, previa inicial, recordes locais e resultado proprio.
- Mapa de unidades com filtros por estado e cidade.
- Tema claro/escuro persistido no navegador.
- Telemetria local em desenvolvimento via `window.__stwDebugStats`.

## Persistencia local

Os fluxos principais usam `localStorage` por meio de `features/persistence`:

- `stw.v1.quiz`: ultimo score, melhor sequencia, quantidade de erros e data de conclusao.
- `stw.v1.memory`: recorde por dificuldade (`facil`, `medio`, `dificil`).
- `stw.v1.vocational`: ultimo ranking vocacional top 3.
- `stw.v1.analytics`: contadores locais de debug em ambiente de desenvolvimento.

Dados ausentes ou invalidos caem em estado vazio sem quebrar a UI.

## Roadmap curto

- Ampliar a migracao TypeScript para hooks e componentes de maior risco.
- Evoluir mais componentes legados para `widgets/` e `shared/ui/`.
- Consolidar acessibilidade fina em todos os controles interativos.
- Avaliar persistencia sincronizada ou backend somente se o produto precisar de historico multi-dispositivo.
