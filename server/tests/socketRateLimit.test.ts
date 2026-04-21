import { describe, expect, it } from 'vitest';
import type { Socket } from 'socket.io';
import { createSocketEventRateLimiter, SocketRateLimitError } from '../src/socket/rateLimit.ts';

function createSocket(id: string, address: string) {
  return {
    id,
    handshake: { address },
    conn: { remoteAddress: address },
  } as Socket;
}

describe('socket rate limiter', () => {
  it('limits repeated actions per socket and resets after the window', () => {
    let now = 1_000;
    const limiter = createSocketEventRateLimiter({
      now: () => now,
      rules: {
        'room:create': {
          windowMs: 1_000,
          maxPerSocket: 1,
          maxPerAddress: 10,
          message: 'limitado',
        },
      },
    });
    const socket = createSocket('socket-1', '127.0.0.1');

    limiter.consume(socket, 'room:create');
    expect(() => limiter.consume(socket, 'room:create')).toThrow(SocketRateLimitError);

    now += 1_001;
    expect(() => limiter.consume(socket, 'room:create')).not.toThrow();
  });
});
