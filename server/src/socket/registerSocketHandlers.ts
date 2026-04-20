import type { Server, Socket } from 'socket.io';
import { ClientEvents, ServerEvents } from './events.ts';
import { RoomStoreError, type RoomStore } from '../domain/roomStore.ts';
import type {
  AnswerSubmitPayload,
  BasicAck,
  HostActionPayload,
  RoomCreateAck,
  RoomJoinAck,
  RoomJoinPayload,
  RoomLeavePayload,
  RoomState,
} from '../types/realtime.ts';

type SocketData = {
  pin?: string;
  hostToken?: string;
  playerToken?: string;
};

type Ack<T> = ((response: T) => void) | undefined;

function ackError<T extends { ok: false; message: string }>(ack: Ack<T>, error: unknown) {
  const message = error instanceof RoomStoreError || error instanceof Error
    ? error.message
    : 'Erro inesperado na sala.';

  ack?.({ ok: false, message } as T);
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

export function registerSocketHandlers(io: Server, store: RoomStore) {
  io.on('connection', (socket) => {
    socket.on(ClientEvents.ROOM_CREATE, (_payload: unknown, ack: Ack<RoomCreateAck>) => {
      try {
        const room = store.createRoom();
        attachSocketToRoom(socket, room.pin, { hostToken: room.hostToken });
        ack?.({ ok: true, pin: room.pin, hostToken: room.hostToken, state: room.state });
        emitRoom(io, room.pin, ServerEvents.ROOM_STATE, room.state);
      } catch (error) {
        ackError(ack, error);
      }
    });

    socket.on(ClientEvents.ROOM_JOIN, (payload: RoomJoinPayload, ack: Ack<RoomJoinAck>) => {
      try {
        if (payload.role === 'host') {
          const state = store.reconnectHost(payload.pin, payload.hostToken ?? '');
          attachSocketToRoom(socket, payload.pin, { hostToken: payload.hostToken });
          ack?.({ ok: true, pin: payload.pin, hostToken: payload.hostToken, state });
          emitRoom(io, payload.pin, ServerEvents.ROOM_STATE, state);
          return;
        }

        if (payload.playerToken) {
          const state = store.reconnectPlayer(payload.pin, payload.playerToken);
          attachSocketToRoom(socket, payload.pin, { playerToken: payload.playerToken });
          ack?.({ ok: true, pin: payload.pin, playerToken: payload.playerToken, state });
          emitRoom(io, payload.pin, ServerEvents.PRESENCE_UPDATE, state);
          return;
        }

        const room = store.joinPlayer(payload.pin, payload.name ?? '', payload.avatar);
        attachSocketToRoom(socket, payload.pin, { playerToken: room.playerToken });
        ack?.({ ok: true, pin: payload.pin, playerToken: room.playerToken, state: room.state });
        emitRoom(io, payload.pin, ServerEvents.PRESENCE_UPDATE, room.state);
      } catch (error) {
        ackError(ack, error);
        socket.emit(ServerEvents.ROOM_ERROR, {
          message: error instanceof Error ? error.message : 'Erro ao entrar na sala.',
        });
      }
    });

    socket.on(ClientEvents.GAME_START, (payload: HostActionPayload, ack: Ack<BasicAck>) => {
      try {
        const state = store.startGame(payload.pin, payload.hostToken);
        ackSuccess(ack, state);
      } catch (error) {
        ackError(ack, error);
      }
    });

    socket.on(ClientEvents.ROUND_NEXT, (payload: HostActionPayload, ack: Ack<BasicAck>) => {
      try {
        const state = store.nextRound(payload.pin, payload.hostToken);
        ackSuccess(ack, state);
      } catch (error) {
        ackError(ack, error);
      }
    });

    socket.on(ClientEvents.ANSWER_SUBMIT, (payload: AnswerSubmitPayload, ack: Ack<BasicAck>) => {
      try {
        const state = store.submitAnswer(
          payload.pin,
          payload.playerToken,
          payload.questionId,
          {
            optionId: payload.optionId,
            optionIds: payload.optionIds,
            text: payload.text,
            value: payload.value,
          },
        );
        ackSuccess(ack, state);

        if (state.status !== 'round_revealed') {
          emitRoom(io, payload.pin, ServerEvents.ROOM_STATE, state);
        }
      } catch (error) {
        ackError(ack, error);
      }
    });

    socket.on(ClientEvents.ROOM_LEAVE, (payload: RoomLeavePayload) => {
      const token = payload.playerToken ?? payload.hostToken;
      const state = store.leaveRoom(payload.pin, token);

      if (state) {
        emitLeaveState(io, payload.pin, state, Boolean(payload.hostToken));
      }

      socket.leave(payload.pin);
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
