import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { getLiveQuestionBank, selectLiveQuestionsForSession } from './domain/questions.ts';
import { createRoomStore, type RoomStore } from './domain/roomStore.ts';
import { registerSocketHandlers } from './socket/registerSocketHandlers.ts';
import type { LiveQuestion, PriorityOrderScenario, RoomEvent, WorkSituation } from './types/realtime.ts';

export type CreateRealtimeAppOptions = {
  clientOrigin?: string;
  questions?: LiveQuestion[];
  workSituations?: WorkSituation[];
  priorityOrderScenarios?: PriorityOrderScenario[];
  matchTemplateId?: string;
  roundMs?: number;
  maxActiveRooms?: number;
  maxPlayersPerRoom?: number;
  roomStore?: RoomStore;
};

function readPositiveIntegerEnv(name: string, fallback: number) {
  const parsed = Number(process.env[name]);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function createRealtimeApp(options: CreateRealtimeAppOptions = {}) {
  const {
    clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
    questions,
    workSituations,
    priorityOrderScenarios,
    matchTemplateId = process.env.LIVE_MATCH_TEMPLATE_ID,
    roundMs = readPositiveIntegerEnv('LIVE_QUIZ_ROUND_MS', 20_000),
    maxActiveRooms = readPositiveIntegerEnv('LIVE_QUIZ_MAX_ACTIVE_ROOMS', 200),
    maxPlayersPerRoom = readPositiveIntegerEnv('LIVE_QUIZ_MAX_PLAYERS_PER_ROOM', 80),
    roomStore,
  } = options;
  let io: Server;
  const app = express();
  const httpServer = createServer(app);
  const questionBank = questions ?? getLiveQuestionBank();
  const store = roomStore ?? createRoomStore({
    questions: questionBank,
    workSituations,
    priorityOrderScenarios,
    maxActiveRooms,
    maxPlayersPerRoom,
    selectQuestions: questions
      ? undefined
      : ({ recentQuestionIds }) => selectLiveQuestionsForSession({ questions: questionBank, recentQuestionIds }),
    matchTemplateId,
    randomizeTemplate: !matchTemplateId && !questions,
    roundMs,
    onRoomEvent: (event: RoomEvent) => {
      io.to(event.pin).emit(event.event, event.state);
    },
  });

  app.disable('x-powered-by');
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(cors({ origin: clientOrigin }));
  app.use(express.json({ limit: process.env.JSON_BODY_LIMIT ?? '32kb' }));

  app.get('/health', (_request, response) => {
    response.json({ ok: true });
  });

  app.use((
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Unhandled Express error:', error instanceof Error ? error.message : 'unknown error');
    }

    response.status(500).json({ ok: false, message: 'Erro interno no servidor.' });
  });

  io = new Server(httpServer, {
    maxHttpBufferSize: readPositiveIntegerEnv('SOCKET_MAX_HTTP_BUFFER_SIZE', 64 * 1024),
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
