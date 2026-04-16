import type {
  LeaderboardEntry,
  LivePlayer,
  LiveQuestion,
  RoomState,
} from '../../../src/shared/types/realtime.ts';

export type {
  AnswerSubmitPayload,
  BasicAck,
  ClientRole,
  HostActionPayload,
  LeaderboardEntry,
  LivePlayer,
  LiveQuestion,
  LiveQuestionOption,
  LiveQuestionType,
  LiveRoomStatus,
  PublicLiveQuestion,
  RoomCreateAck,
  RoomJoinAck,
  RoomJoinPayload,
  RoomLeavePayload,
  RoomState,
} from '../../../src/shared/types/realtime.ts';

export type PlayerAnswer = {
  optionId: string;
  submittedAt: number;
  responseMs: number;
  isCorrect: boolean;
  points: number;
};

export type LivePlayerInternal = LivePlayer & {
  token: string;
};

export type LiveRound = {
  questionId: string;
  startedAt: number;
  closesAt: number;
  answers: Map<string, PlayerAnswer>;
};

export type LiveRoomInternal = {
  pin: string;
  hostToken: string;
  hostConnected: boolean;
  status: RoomState['status'];
  players: Map<string, LivePlayerInternal>;
  questions: LiveQuestion[];
  currentQuestionIndex: number;
  round: LiveRound | null;
  leaderboard: LeaderboardEntry[];
  finalRanking: LeaderboardEntry[];
  roundTimer: NodeJS.Timeout | null;
  lobbyExpirationTimer: NodeJS.Timeout | null;
  finishedExpirationTimer: NodeJS.Timeout | null;
};

export type RoomEventName =
  | 'room:state'
  | 'presence:update'
  | 'round:opened'
  | 'round:revealed'
  | 'leaderboard:update'
  | 'game:finished';

export type RoomEvent = {
  pin: string;
  event: RoomEventName;
  state: RoomState;
};
