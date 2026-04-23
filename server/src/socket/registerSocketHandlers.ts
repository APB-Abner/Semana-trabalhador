import type { Server, Socket } from 'socket.io';
import { ClientEvents, ServerEvents } from './events.ts';
import {
  createSocketEventRateLimiter,
  SocketRateLimitError,
  type SocketEventRateLimiter,
} from './rateLimit.ts';
import {
  SocketPayloadError,
  validateAnswerSubmitPayload,
  validateHostActionPayload,
  validateRoomJoinPayload,
  validateRoomLeavePayload,
  validateRoomViewPayload,
} from './payloadValidation.ts';
import { RoomStoreError, type RoomStore } from '../domain/roomStore.ts';
import type {
  BasicAck,
  RoomCreateAck,
  RoomJoinAck,
  RoomState,
} from '../types/realtime.ts';

type SocketData = {
  pin?: string;
  hostToken?: string;
  playerToken?: string;
};

type Ack<T> = ((response: T) => void) | undefined;

type RegisterSocketHandlersOptions = {
  rateLimiter?: SocketEventRateLimiter;
};

function getPublicErrorMessage(error: unknown) {
  if (
    error instanceof RoomStoreError ||
    error instanceof SocketPayloadError ||
    error instanceof SocketRateLimitError
  ) {
    return error.message;
  }

  return 'Erro inesperado na sala.';
}

function ackError<T extends { ok: false; message: string }>(ack: Ack<T>, error: unknown) {
  ack?.({ ok: false, message: getPublicErrorMessage(error) } as T);
}

function ackSuccess(ack: Ack<BasicAck>, state: RoomState) {
  ack?.({ ok: true, state });
}

function emitRoom(io: Server, pin: string, event: string, state: RoomState) {
  io.to(pin).emit(event, state);
}

function attachSocketToRoom(socket: Socket, pin: string, data: SocketData) {
  socket.join(pin);
  socket.data.pin = pin;
  socket.data.hostToken = data.hostToken;
  socket.data.playerToken = data.playerToken;
}

function emitLeaveState(io: Server, pin: string, state: RoomState, isHost: boolean) {
  emitRoom(io, pin, isHost ? ServerEvents.ROOM_STATE : ServerEvents.PRESENCE_UPDATE, state);
}

export function registerSocketHandlers(
  io: Server,
  store: RoomStore,
  { rateLimiter = createSocketEventRateLimiter() }: RegisterSocketHandlersOptions = {},
) {
  io.on('connection', (socket) => {
    socket.on(ClientEvents.ROOM_CREATE, (_payload: unknown, ack: Ack<RoomCreateAck>) => {
      try {
        rateLimiter.consume(socket, ClientEvents.ROOM_CREATE);
        const room = store.createRoom();
        attachSocketToRoom(socket, room.pin, { hostToken: room.hostToken });
        ack?.({ ok: true, pin: room.pin, hostToken: room.hostToken, state: room.state });
        emitRoom(io, room.pin, ServerEvents.ROOM_STATE, room.state);
      } catch (error) {
        ackError(ack, error);
      }
    });

    socket.on(ClientEvents.ROOM_JOIN, (payload: unknown, ack: Ack<RoomJoinAck>) => {
      try {
        rateLimiter.consume(socket, ClientEvents.ROOM_JOIN);
        const cleanPayload = validateRoomJoinPayload(payload);

        if (cleanPayload.role === 'host') {
          const state = store.reconnectHost(cleanPayload.pin, cleanPayload.hostToken ?? '');
          attachSocketToRoom(socket, cleanPayload.pin, { hostToken: cleanPayload.hostToken });
          ack?.({ ok: true, pin: cleanPayload.pin, hostToken: cleanPayload.hostToken, state });
          emitRoom(io, cleanPayload.pin, ServerEvents.ROOM_STATE, state);
          return;
        }

        if (cleanPayload.playerToken) {
          const reconnect = store.reconnectPlayer(cleanPayload.pin, cleanPayload.playerToken);
          attachSocketToRoom(socket, cleanPayload.pin, { playerToken: cleanPayload.playerToken });
          ack?.({
            ok: true,
            pin: cleanPayload.pin,
            playerId: reconnect.playerId,
            playerToken: cleanPayload.playerToken,
            state: reconnect.state,
          });
          emitRoom(io, cleanPayload.pin, ServerEvents.PRESENCE_UPDATE, reconnect.state);
          return;
        }

        const room = store.joinPlayer(cleanPayload.pin, cleanPayload.name ?? '', cleanPayload.avatar);
        attachSocketToRoom(socket, cleanPayload.pin, { playerToken: room.playerToken });
        ack?.({
          ok: true,
          pin: cleanPayload.pin,
          playerId: room.playerId,
          playerToken: room.playerToken,
          state: room.state,
        });
        emitRoom(io, cleanPayload.pin, ServerEvents.PRESENCE_UPDATE, room.state);
      } catch (error) {
        ackError(ack, error);
        socket.emit(ServerEvents.ROOM_ERROR, {
          message: getPublicErrorMessage(error),
        });
      }
    });

    socket.on(ClientEvents.ROOM_VIEW, (payload: unknown, ack: Ack<BasicAck>) => {
      try {
        rateLimiter.consume(socket, ClientEvents.ROOM_VIEW);
        const cleanPayload = validateRoomViewPayload(payload);
        const state = store.getState(cleanPayload.pin);
        attachSocketToRoom(socket, cleanPayload.pin, {});
        ackSuccess(ack, state);
      } catch (error) {
        ackError(ack, error);
        socket.emit(ServerEvents.ROOM_ERROR, {
          message: getPublicErrorMessage(error),
        });
      }
    });

    socket.on(ClientEvents.GAME_START, (payload: unknown, ack: Ack<BasicAck>) => {
      try {
        rateLimiter.consume(socket, ClientEvents.GAME_START);
        const cleanPayload = validateHostActionPayload(payload);
        const state = store.startGame(cleanPayload.pin, cleanPayload.hostToken);
        ackSuccess(ack, state);
      } catch (error) {
        ackError(ack, error);
      }
    });

    socket.on(ClientEvents.ROUND_NEXT, (payload: unknown, ack: Ack<BasicAck>) => {
      try {
        rateLimiter.consume(socket, ClientEvents.ROUND_NEXT);
        const cleanPayload = validateHostActionPayload(payload);
        const state = store.nextRound(cleanPayload.pin, cleanPayload.hostToken);
        ackSuccess(ack, state);
      } catch (error) {
        ackError(ack, error);
      }
    });

    socket.on(ClientEvents.ANSWER_SUBMIT, (payload: unknown, ack: Ack<BasicAck>) => {
      try {
        rateLimiter.consume(socket, ClientEvents.ANSWER_SUBMIT);
        const cleanPayload = validateAnswerSubmitPayload(payload);
        const state = store.submitAnswer(
          cleanPayload.pin,
          cleanPayload.playerToken,
          cleanPayload.questionId,
          {
            optionId: cleanPayload.optionId,
            optionIds: cleanPayload.optionIds,
            text: cleanPayload.text,
            value: cleanPayload.value,
          },
        );
        ackSuccess(ack, state);

        if (state.status !== 'round_revealed') {
          emitRoom(io, cleanPayload.pin, ServerEvents.ROOM_STATE, state);
        }
      } catch (error) {
        ackError(ack, error);
      }
    });

    socket.on(ClientEvents.ROOM_LEAVE, (payload: unknown) => {
      try {
        rateLimiter.consume(socket, ClientEvents.ROOM_LEAVE);
        const cleanPayload = validateRoomLeavePayload(payload);
        const token = cleanPayload.playerToken ?? cleanPayload.hostToken;
        const state = store.leaveRoom(cleanPayload.pin, token);

        if (state) {
          emitLeaveState(io, cleanPayload.pin, state, Boolean(cleanPayload.hostToken));
        }

        socket.leave(cleanPayload.pin);
      } catch (error) {
        socket.emit(ServerEvents.ROOM_ERROR, {
          message: getPublicErrorMessage(error),
        });
      }
    });

    socket.on('disconnect', () => {
      const { pin, hostToken, playerToken } = socket.data as SocketData;
      const token = playerToken ?? hostToken;

      if (!pin || !token) {
        return;
      }

      const state = store.leaveRoom(pin, token);

      if (state) {
        emitLeaveState(io, pin, state, Boolean(hostToken));
      }
    });
  });
}
