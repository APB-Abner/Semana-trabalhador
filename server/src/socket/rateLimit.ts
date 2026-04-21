import type { Socket } from 'socket.io';

export type SocketRateLimitRule = {
  windowMs: number;
  maxPerSocket: number;
  maxPerAddress: number;
  message: string;
};

export type SocketRateLimitOptions = {
  now?: () => number;
  rules?: Partial<Record<string, Partial<SocketRateLimitRule>>>;
};

export class SocketRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SocketRateLimitError';
  }
}

const DEFAULT_RULE: SocketRateLimitRule = {
  windowMs: 10_000,
  maxPerSocket: 60,
  maxPerAddress: 600,
  message: 'Muitas ações em sequência. Aguarde alguns instantes.',
};

const DEFAULT_RULES: Record<string, SocketRateLimitRule> = {
  'room:create': {
    windowMs: 60_000,
    maxPerSocket: 8,
    maxPerAddress: 40,
    message: 'Muitas salas criadas em sequência. Aguarde alguns instantes.',
  },
  'room:join': {
    windowMs: 60_000,
    maxPerSocket: 40,
    maxPerAddress: 240,
    message: 'Muitas tentativas de entrada em sequência. Aguarde alguns instantes.',
  },
  'game:start': {
    windowMs: 10_000,
    maxPerSocket: 30,
    maxPerAddress: 300,
    message: 'Muitas ações do host em sequência. Aguarde alguns instantes.',
  },
  'round:next': {
    windowMs: 10_000,
    maxPerSocket: 30,
    maxPerAddress: 300,
    message: 'Muitas ações do host em sequência. Aguarde alguns instantes.',
  },
  'answer:submit': {
    windowMs: 10_000,
    maxPerSocket: 80,
    maxPerAddress: 800,
    message: 'Muitas respostas em sequência. Aguarde alguns instantes.',
  },
  'room:leave': {
    windowMs: 10_000,
    maxPerSocket: 30,
    maxPerAddress: 300,
    message: 'Muitas ações em sequência. Aguarde alguns instantes.',
  },
};

function createRule(eventName: string, overrides?: Partial<SocketRateLimitRule>) {
  return {
    ...DEFAULT_RULE,
    ...(DEFAULT_RULES[eventName] ?? {}),
    ...(overrides ?? {}),
  };
}

function getSocketAddress(socket: Socket) {
  return (socket.handshake.address || socket.conn.remoteAddress || 'unknown').replace(/^::ffff:/, '');
}

export function createSocketEventRateLimiter({
  now = () => Date.now(),
  rules = {},
}: SocketRateLimitOptions = {}) {
  const hits = new Map<string, number[]>();

  function consumeKey(key: string, limit: number, rule: SocketRateLimitRule) {
    if (limit <= 0) {
      return;
    }

    const cutoff = now() - rule.windowMs;
    const recentHits = (hits.get(key) ?? []).filter((timestamp) => timestamp > cutoff);

    if (recentHits.length >= limit) {
      hits.set(key, recentHits);
      throw new SocketRateLimitError(rule.message);
    }

    recentHits.push(now());
    hits.set(key, recentHits);
  }

  return {
    consume(socket: Socket, eventName: string) {
      const rule = createRule(eventName, rules[eventName]);
      consumeKey(`socket:${socket.id}:${eventName}`, rule.maxPerSocket, rule);
      consumeKey(`address:${getSocketAddress(socket)}:${eventName}`, rule.maxPerAddress, rule);
    },
    clear() {
      hits.clear();
    },
  };
}

export type SocketEventRateLimiter = ReturnType<typeof createSocketEventRateLimiter>;
