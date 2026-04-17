# Relatório de Segurança

## Resumo Executivo

Analisei o estado atual do repositório `Semana-trabalhador`, uma aplicação React/Vite com backend Express + Socket.IO para competição ao vivo. Os pontos de maior risco estão no backend em tempo real: tokens de sala gerados com `Math.random`, eventos Socket.IO públicos sem limite de abuso, e ausência de validação runtime para payloads recebidos do cliente. Também há dependências com advisories de alta severidade reportadas por `npm audit`.

Não encontrei evidência de segredos commitados, uso de `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `child_process` em código de produção, cookies de sessão ou rotas Express sensíveis além de `/health`. O CORS do backend está configurado para uma origem explícita via `CLIENT_ORIGIN`, o que é um ponto positivo.

Escopo observado: havia alterações locais não commitadas em arquivos do modo ao vivo. A análise considera o working tree atual.

## Achados Críticos

Nenhum achado crítico confirmado.

## Achados de Alta Severidade

### S-001: Tokens de host/jogador usam gerador pseudoaleatório não criptográfico

- **Regra:** uso de identificadores de autorização imprevisíveis / `EXPRESS-INPUT-001` e princípio geral de tokens seguros.
- **Severidade:** Alta.
- **Local:** `server/src/domain/pin.ts:15`, `server/src/domain/pin.ts:16`, `server/src/domain/pin.ts:17`; uso em `server/src/domain/roomStore.ts:335`, `server/src/domain/roomStore.ts:379`, `server/src/domain/roomStore.ts:380`.
- **Evidência:**

```ts
export function createToken(random = Math.random): string {
  const randomPart = Math.floor(random() * Number.MAX_SAFE_INTEGER).toString(36);
  return `${Date.now().toString(36)}-${randomPart}`;
}
```

- **Impacto:** `hostToken` e `playerToken` funcionam como credenciais bearer para controlar sala, reconectar host/jogador e enviar ações. `Math.random()` e timestamp não são adequados para segredo de autorização; se um token for previsto, inferido ou vazado parcialmente, um atacante pode assumir o papel de host ou jogador em sala ativa.
- **Correção:** trocar para CSPRNG do Node, por exemplo `crypto.randomUUID()` ou `randomBytes(32).toString('base64url')`. Para PINs humanos, usar `crypto.randomInt(100000, 1000000)` em vez de `Math.random()`.
- **Mitigação:** tornar tokens curtos de vida, invalidar tokens ao finalizar sala, registrar tentativas inválidas e combinar com rate limit por IP/socket.
- **Falso positivo / observação:** o PIN de 6 dígitos é um código de entrada humano e não precisa ter a mesma força de um token secreto, mas ainda deve usar aleatoriedade criptográfica e rate limiting porque libera entrada de jogadores.

### S-002: Eventos Socket.IO públicos permitem criação/entrada ilimitada em salas

- **Regra:** `EXPRESS-AUTH-001`, `EXPRESS-DOS-001`, controles de abuso em endpoints públicos.
- **Severidade:** Alta.
- **Local:** `server/src/socket/registerSocketHandlers.ts:52`, `server/src/socket/registerSocketHandlers.ts:63`, `server/src/domain/roomStore.ts:333`, `server/src/domain/roomStore.ts:353`, `server/src/domain/roomStore.ts:363`, `server/src/domain/roomStore.ts:381`.
- **Evidência:**

```ts
socket.on(ClientEvents.ROOM_CREATE, (_payload: unknown, ack: Ack<RoomCreateAck>) => {
  const room = store.createRoom();
```

```ts
socket.on(ClientEvents.ROOM_JOIN, (payload: RoomJoinPayload, ack: Ack<RoomJoinAck>) => {
  const room = store.joinPlayer(payload.pin, payload.name ?? '');
```

```ts
rooms.set(pin, room);
room.players.set(playerId, {
```

- **Impacto:** qualquer cliente conectado pode criar salas sem autenticação, limite por IP, limite global ou limite de jogadores por sala. Isso permite exaustão de memória/temporizadores, poluição de lobbies, tentativa massiva contra PINs de 6 dígitos e interrupção de atividades ao vivo.
- **Correção:** adicionar controles no handshake/eventos Socket.IO: limite por IP e por socket, limite global de salas, limite de salas por IP/janela de tempo, limite de jogadores por sala, cooldown para PINs inválidos e backoff. Bibliotecas como `rate-limiter-flexible` podem ser aplicadas no middleware do Socket.IO.
- **Mitigação:** configurar proteção no edge/proxy quando disponível, métricas de taxa de criação/entrada, TTL para lobbies mesmo com host conectado, e recusa de novas salas quando a capacidade em memória passar de um teto definido.
- **Falso positivo / observação:** para uso em sala de aula fechada o risco operacional é menor, mas o README documenta deploy público em Render/Vercel; nesse cenário, os eventos ficam alcançáveis pela internet.

### S-003: Dependências diretas com advisories de alta severidade

- **Regra:** `REACT-SUPPLY-001`, `EXPRESS-DEPS-001`.
- **Severidade:** Alta.
- **Local:** `package.json:32`, `package.json:53`; lockfile em `package-lock.json:5147` e `package-lock.json:6361`.
- **Evidência:** `npm ls` mostrou `react-router-dom@7.4.1`, `react-router@7.4.1` e `vite@6.3.2`. `npm audit --omit=dev --json` reportou 3 vulnerabilidades de alta severidade em produção:
  - `react-router` / `react-router-dom`: advisories de XSS, open redirect, CSRF/processamento de actions, DoS e spoofing em modos específicos.
  - `vite <=6.4.1`: advisories de path traversal/arbitrary file read no dev server.
- **Impacto:** `react-router-dom` é dependência de runtime do frontend, então deve ser corrigida mesmo que alguns advisories dependam de modo SSR/framework que este app aparentemente não usa. `vite` é ferramenta de build/dev; o risco é maior se o dev server ou preview forem expostos em rede.
- **Correção:** atualizar dependências e lockfile com revisão de compatibilidade. O dry-run de `npm audit fix --omit=dev` sugeriu `react-router-dom 7.14.1`, `react-router 7.14.1` e `vite 6.4.2`.
- **Mitigação:** não expor `npm run dev`/`vite preview` publicamente; adicionar rotina de SCA em CI, por exemplo `npm audit --omit=dev` para produção e triagem separada para devDependencies.
- **Falso positivo / observação:** parte dos advisories de React Router cita SSR/framework mode; o app usa `createBrowserRouter` e rotas SPA, mas manter a versão vulnerável ainda deixa o projeto dependente de análise manual contínua.

## Achados de Média Severidade

### S-004: Payloads Socket.IO não têm validação runtime e erros internos são devolvidos ao cliente

- **Regra:** `EXPRESS-INPUT-001`, `EXPRESS-ERROR-001`.
- **Severidade:** Média.
- **Local:** `server/src/socket/registerSocketHandlers.ts:23`, `server/src/socket/registerSocketHandlers.ts:25`, `server/src/socket/registerSocketHandlers.ts:65`, `server/src/socket/registerSocketHandlers.ts:81`, `server/src/socket/registerSocketHandlers.ts:95`, `server/src/socket/registerSocketHandlers.ts:114`, `server/src/socket/registerSocketHandlers.ts:133`.
- **Evidência:**

```ts
function ackError<T extends { ok: false; message: string }>(ack: Ack<T>, error: unknown) {
  const message = error instanceof RoomStoreError || error instanceof Error
    ? error.message
    : 'Erro inesperado na sala.';
```

```ts
if (payload.role === 'host') {
  const state = store.reconnectHost(payload.pin, payload.hostToken ?? '');
```

```ts
socket.on(ClientEvents.ROOM_LEAVE, (payload: RoomLeavePayload) => {
  const token = payload.playerToken ?? payload.hostToken;
```

- **Impacto:** tipos TypeScript não protegem eventos recebidos de clientes em runtime. Um cliente pode enviar `null`, arrays ou objetos com campos inesperados, causando `TypeError`, respostas com mensagens internas como `Cannot read properties...` e possível instabilidade no handler `ROOM_LEAVE`, que não está em `try/catch`.
- **Correção:** validar cada payload na borda com schema runtime (`zod`, `valibot`, `joi` ou funções próprias estritas) antes de acessar propriedades. Padronizar respostas públicas genéricas e logar detalhes apenas no servidor.
- **Mitigação:** envolver todos os handlers em wrapper comum `try/catch`, recusar eventos sem `ack` quando necessário e desconectar sockets que enviem payloads inválidos repetidamente.
- **Falso positivo / observação:** as regras de domínio validam alguns campos depois da entrada, como nome e opções, mas isso não substitui validação de forma/tipo no handler Socket.IO.

### S-005: Headers de segurança não estão visíveis no backend nem no deploy estático

- **Regra:** `EXPRESS-HEADERS-001`, `EXPRESS-FINGERPRINT-001`, `REACT-HEADERS-001`, `REACT-CSP-001`.
- **Severidade:** Média.
- **Local:** `server/src/app.ts:34`, `server/src/app.ts:35`, `vercel.json:3`, `index.html:5`.
- **Evidência:**

```ts
app.use(cors({ origin: clientOrigin }));
app.use(express.json());
```

```json
"rewrites": [
```

- **Impacto:** não há `helmet()`, `app.disable('x-powered-by')`, CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` ou defesa contra clickjacking visíveis no repositório. Isso reduz defesa em profundidade contra XSS, MIME sniffing e framing indevido. Se esses headers forem definidos pela Vercel/Render ou outro edge, isso precisa ser verificado em runtime.
- **Correção:** no backend, adicionar `helmet()` com política compatível e `app.disable('x-powered-by')`, além de 404/error handlers próprios. No frontend estático, configurar headers no `vercel.json`, preferindo CSP por header HTTP.
- **Mitigação:** começar com CSP em `Content-Security-Policy-Report-Only` no edge se houver risco de quebra, depois aplicar em modo enforce.
- **Falso positivo / observação:** como o app React não mostrou sinks perigosos de XSS na varredura, este achado é defesa em profundidade, não exploração direta confirmada.

## Achados de Baixa Severidade

### S-006: Parser JSON global sem limite explícito

- **Regra:** `EXPRESS-DOS-001`.
- **Severidade:** Baixa.
- **Local:** `server/src/app.ts:35`.
- **Evidência:**

```ts
app.use(express.json());
```

- **Impacto:** o Express tem limite padrão, mas ele não está documentado no código e o parser roda globalmente antes de cair no 404 padrão. Requisições JSON grandes ou muitas requisições simultâneas aumentam pressão de CPU/memória.
- **Correção:** usar limite explícito, por exemplo `express.json({ limit: '32kb' })`, adequado ao payload real. Se não houver rotas JSON além de health check, considerar remover o parser até ser necessário.
- **Mitigação:** combinar com limites de body no proxy/edge.

### S-007: Tokens de sala ficam em `sessionStorage`

- **Regra:** `JS-STORAGE-001`, `REACT-CONFIG-001`.
- **Severidade:** Baixa.
- **Local:** `src/features/live-quiz/model/useHostRoom.ts:23`, `src/features/live-quiz/model/useHostRoom.ts:28`, `src/features/live-quiz/model/usePlayerRoom.ts:28`, `src/features/live-quiz/model/usePlayerRoom.ts:33`.
- **Evidência:**

```ts
window.sessionStorage.setItem(hostTokenKey(pin), token);
window.sessionStorage.setItem(playerTokenKey(pin), token);
```

- **Impacto:** `sessionStorage` é acessível por JavaScript. Um XSS, extensão maliciosa ou execução de terceiro na origem poderia roubar `hostToken`/`playerToken` e assumir a sala. Como não encontrei sinks diretos de XSS, isto fica como risco de endurecimento.
- **Correção:** se a competição passar a ter maior sensibilidade, considerar tokens curtos, renovação, invalidação por aba, ou sessão server-side com cookie `HttpOnly`/`SameSite` quando houver autenticação real.
- **Mitigação:** corrigir S-001 e S-005, e evitar qualquer script de terceiros na mesma origem.

## Observações Positivas

- Não encontrei `dangerouslySetInnerHTML`, `innerHTML`, `document.write`, `eval`, `new Function`, `child_process`, `res.redirect`, `sendFile`, `postMessage` ou cookies de sessão em código de produção.
- O CORS do Express e do Socket.IO usa origem explícita (`CLIENT_ORIGIN`) em vez de `*`.
- Respostas de word cloud/poll são renderizadas por JSX normal, aproveitando escape padrão do React.
- Dados persistidos em `localStorage` parecem ser estado local não sensível de quiz/memória/vocacional.

## Verificação Executada

- `rg` para sinks de XSS, execução dinâmica, navegação dinâmica, storage, cookies, redirects, arquivos, subprocessos, headers e segredos.
- `npm audit --json`.
- `npm audit --omit=dev --json`.
- `npm audit fix --dry-run --omit=dev` apenas para identificar versões sugeridas, sem aplicar alterações.
- `npm ls react-router-dom react-router vite express socket.io cors --depth=0`.
- `npm run typecheck`.

## Limitações

- `npm run typecheck` falhou antes de qualquer alteração minha: `server/src/types/realtime.ts(64,21): error TS2304: Cannot find name 'AggregatedResult'.` Isso reduz a confiança em checagens estáticas até o tipo ser importado/definido corretamente no arquivo do servidor.
- Não validei headers em runtime nas URLs de produção; o relatório considera apenas controles visíveis no repositório.
- Não executei testes E2E porque a solicitação foi análise, e o typecheck já falhou em estado atual.

## Prioridade Recomendada

1. Trocar geração de tokens/PIN para `node:crypto`.
2. Adicionar rate limits, quotas e limites de jogadores/salas no Socket.IO.
3. Atualizar `react-router-dom`, `react-router` e `vite` conforme dry-run do audit, depois rodar build/testes.
4. Adicionar validação runtime nos payloads de eventos Socket.IO e sanitizar erros enviados ao cliente.
5. Configurar headers de segurança no backend e no deploy Vercel/edge.
