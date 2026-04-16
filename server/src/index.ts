import { createRealtimeApp } from './app.ts';

const port = Number(process.env.PORT ?? 4000);
const { httpServer } = createRealtimeApp();

httpServer.listen(port, () => {
  console.log(`Live quiz server running on http://localhost:${port}`);
});
