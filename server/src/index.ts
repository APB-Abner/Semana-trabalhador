import { createRealtimeApp } from './app.ts';

const DEFAULT_PORT = 4000;
const port = Number(process.env.PORT ?? DEFAULT_PORT);
const isDevServer = process.env.npm_lifecycle_event === 'dev:server';
const host = process.env.HOST ?? (isDevServer ? '127.0.0.1' : undefined);
const { httpServer } = createRealtimeApp();

function getDisplayHost() {
  return host ?? 'localhost';
}

function listen(targetPort: number, hasRetried = false) {
  const onError = (error: NodeJS.ErrnoException) => {
    const canRetryLocalPort = isDevServer
      && !process.env.PORT
      && !hasRetried
      && (error.code === 'EACCES' || error.code === 'EADDRINUSE');

    if (canRetryLocalPort) {
      const nextPort = targetPort + 1;

      console.warn(
        `Porta ${targetPort} indisponivel (${error.code}). Tentando ${nextPort} para o backend local.`,
      );
      console.warn(`Se o frontend ja estiver aberto, use VITE_SOCKET_URL=http://${getDisplayHost()}:${nextPort}`);
      listen(nextPort, true);
      return;
    }

    console.error(`Nao foi possivel iniciar o backend em ${getDisplayHost()}:${targetPort}.`);
    console.error(error.message);
    process.exit(1);
  };

  const onListening = () => {
    httpServer.off('error', onError);
    console.log(`Live quiz server running on http://${getDisplayHost()}:${targetPort}`);
  };

  httpServer.once('error', onError);

  if (host) {
    httpServer.listen(targetPort, host, onListening);
    return;
  }

  httpServer.listen(targetPort, onListening);
}

listen(port);
