import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { getLiveQuestions } from './domain/questions.ts';
import { createRoomStore, type RoomStore } from './domain/roomStore.ts';
import { registerSocketHandlers } from './socket/registerSocketHandlers.ts';
import type { LiveQuestion, RoomEvent } from './types/realtime.ts';

export type CreateRealtimeAppOptions = {
  clientOrigin?: string;
  questions?: LiveQuestion[];
  roundMs?: number;
  roomStore?: RoomStore;
};

export function createRealtimeApp({
  clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  questions = getLiveQuestions(),
  roundMs = Number(process.env.LIVE_QUIZ_ROUND_MS ?? 20_000),
  roomStore,
}: CreateRealtimeAppOptions = {}) {
  let io: Server;
  const app = express();
  const httpServer = createServer(app);
  const store = roomStore ?? createRoomStore({
    questions,
    roundMs,
    onRoomEvent: (event: RoomEvent) => {
      io.to(event.pin).emit(event.event, event.state);
    },
  });

  app.use(cors({ origin: clientOrigin }));
  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.json({ ok: true });
  });

  io = new Server(httpServer, {
    cors: {
      origin: clientOrigin,
      methods: ['GET', 'POST'],
    },
  });

  registerSocketHandlers(io, store);

  return {
    app,
    httpServer,
    io,
    roomStore: store,
  };
}
