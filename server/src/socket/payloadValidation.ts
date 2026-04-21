import type {
  AnswerSubmitPayload,
  HostActionPayload,
  RoomJoinPayload,
  RoomLeavePayload,
} from '../types/realtime.ts';

type PayloadRecord = Record<string, unknown>;

type StringFieldOptions = {
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
  message?: string;
};

export class SocketPayloadError extends Error {
  constructor(message = 'Dados inválidos para esta ação.') {
    super(message);
    this.name = 'SocketPayloadError';
  }
}

const PIN_PATTERN = /^\d{6}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;

function isRecord(value: unknown): value is PayloadRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireRecord(payload: unknown): PayloadRecord {
  if (!isRecord(payload)) {
    throw new SocketPayloadError();
  }

  return payload;
}

function readString(
  payload: PayloadRecord,
  field: string,
  {
    maxLength = 128,
    pattern,
    required = true,
    message = 'Dados inválidos para esta ação.',
  }: StringFieldOptions = {},
) {
  const value = payload[field];

  if (value === undefined || value === null) {
    if (required) {
      throw new SocketPayloadError(message);
    }

    return undefined;
  }

  if (typeof value !== 'string' || !value || value.length > maxLength || (pattern && !pattern.test(value))) {
    throw new SocketPayloadError(message);
  }

  return value;
}

function readRequiredString(payload: PayloadRecord, field: string, options: StringFieldOptions = {}) {
  const value = readString(payload, field, { ...options, required: true });

  if (!value) {
    throw new SocketPayloadError(options.message);
  }

  return value;
}

function readToken(payload: PayloadRecord, field: string) {
  return readRequiredString(payload, field, {
    maxLength: 128,
    pattern: TOKEN_PATTERN,
    message: 'Token inválido para esta sala.',
  });
}

function readOptionalToken(payload: PayloadRecord, field: string) {
  return readString(payload, field, {
    maxLength: 128,
    pattern: TOKEN_PATTERN,
    required: false,
    message: 'Token inválido para esta sala.',
  });
}

function readPin(payload: PayloadRecord) {
  return readRequiredString(payload, 'pin', {
    maxLength: 6,
    pattern: PIN_PATTERN,
    message: 'PIN inválido.',
  });
}

function readStringArray(payload: PayloadRecord, field: string) {
  const value = payload[field];

  if (value === undefined || value === null) {
    return undefined;
  }

  if (!Array.isArray(value) || value.length > 20) {
    throw new SocketPayloadError('Resposta inválida para esta rodada.');
  }

  return value.map((item) => {
    if (typeof item !== 'string' || !item || item.length > 120) {
      throw new SocketPayloadError('Resposta inválida para esta rodada.');
    }

    return item;
  });
}

function readNumber(payload: PayloadRecord, field: string) {
  const value = payload[field];

  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value) > 1_000_000) {
    throw new SocketPayloadError('Resposta inválida para esta rodada.');
  }

  return value;
}

export function validateRoomJoinPayload(payload: unknown): RoomJoinPayload {
  const data = requireRecord(payload);
  const pin = readPin(data);
  const role = readRequiredString(data, 'role', { maxLength: 16 });

  if (role !== 'host' && role !== 'player') {
    throw new SocketPayloadError('Perfil inválido para esta sala.');
  }

  if (role === 'host') {
    return {
      pin,
      role,
      hostToken: readToken(data, 'hostToken'),
    };
  }

  const playerToken = readOptionalToken(data, 'playerToken');

  if (playerToken) {
    return {
      pin,
      role,
      playerToken,
    };
  }

  const name = readRequiredString(data, 'name', {
    maxLength: 64,
    message: 'Informe um nome entre 1 e 32 caracteres.',
  });
  const avatar = isRecord(data.avatar) ? data.avatar as RoomJoinPayload['avatar'] : undefined;

  return {
    pin,
    role,
    name,
    avatar,
  };
}

export function validateHostActionPayload(payload: unknown): HostActionPayload {
  const data = requireRecord(payload);

  return {
    pin: readPin(data),
    hostToken: readToken(data, 'hostToken'),
  };
}

export function validateAnswerSubmitPayload(payload: unknown): AnswerSubmitPayload {
  const data = requireRecord(payload);
  const optionId = readString(data, 'optionId', { maxLength: 120, required: false });
  const optionIds = readStringArray(data, 'optionIds');
  const text = readString(data, 'text', { maxLength: 500, required: false });
  const value = readNumber(data, 'value');

  return {
    pin: readPin(data),
    playerToken: readToken(data, 'playerToken'),
    questionId: readRequiredString(data, 'questionId', {
      maxLength: 120,
      message: 'Rodada inválida para o match atual.',
    }),
    ...(optionId ? { optionId } : {}),
    ...(optionIds ? { optionIds } : {}),
    ...(text ? { text } : {}),
    ...(value !== undefined ? { value } : {}),
  };
}

export function validateRoomLeavePayload(payload: unknown): RoomLeavePayload {
  const data = requireRecord(payload);
  const hostToken = readOptionalToken(data, 'hostToken');
  const playerToken = readOptionalToken(data, 'playerToken');

  if (!hostToken && !playerToken) {
    throw new SocketPayloadError('Token inválido para esta sala.');
  }

  return {
    pin: readPin(data),
    ...(hostToken ? { hostToken } : {}),
    ...(playerToken ? { playerToken } : {}),
  };
}
