# Semana do Jovem Trabalhador

Aplicação educativa em React para apresentar conteúdos, dicas e experiências interativas sobre mercado de trabalho, aprendizagem profissional e orientação de carreira.

## Stack

- React 19
- Vite
- React Router
- Tailwind CSS 4
- Headless UI e Heroicons
- Leaflet / React Leaflet
- Howler e canvas-confetti
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

## Scripts

```bash
npm run dev        # servidor Vite
npm run build      # build de produção
npm run preview    # preview do build
npm run lint       # ESLint
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
```

## Funcionalidades

- Home com linha do tempo e atalhos para as experiências.
- Página de histórias com conteúdo educativo e curiosidades.
- Página de dicas com sidebar e ScrollSpy.
- Teste vocacional com ranking top 3, percentuais e próximos passos.
- Quiz com feedback por resposta, explicação e revisão final.
- Jogo da memória com níveis de dificuldade, prévia inicial e resultado próprio.
- Mapa de unidades com filtros por estado e cidade.
- Tema claro/escuro persistido no navegador.

## Roadmap curto

- Migrar gradualmente para TypeScript.
- Evoluir componentes legados para `widgets/` e `shared/ui/`.
- Adicionar persistência local para resultados e recordes.
- Reduzir o chunk principal com code splitting por rota, especialmente mapa e game.
- Ampliar cobertura E2E dos fluxos completos de jogo.
