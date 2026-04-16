import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export function useRoomSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(socketUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const emitWithAck = useCallback(<TResponse, TPayload = unknown>(
    event: string,
    payload?: TPayload,
  ) => new Promise<TResponse>((resolve) => {
    socketRef.current?.emit(event, payload ?? {}, resolve);
  }), []);

  return {
    connected,
    emitWithAck,
    socket: socketRef.current,
  };
}
