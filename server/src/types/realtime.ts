import type {
  AggregatedResult,
  LeaderboardEntry,
  LiveAnswerPayload,
  LivePlayer,
  LiveQuestion,
  MatchGame,
  RoomState,
} from '../../../src/shared/types/realtime.ts';

export type {
  AnswerSubmitPayload,
  AggregatedResult,
  BasicAck,
  ClientRole,
  HostActionPayload,
  LeaderboardEntry,
  LiveAnswerPayload,
  LivePlayer,
  LiveQuestion,
  LiveQuestionBucket,
  LiveQuestionDifficulty,
  LiveQuestionOption,
  LiveQuestionSessionFit,
  LiveQuestionTone,
  LiveQuestionType,
  LiveScaleConfig,
  LiveRoomStatus,
  MatchGame,
  MatchStatus,
  MiniGameType,
  OnlineMatch,
  PublicLiveQuestion,
  RoomCreateAck,
  RoomJoinAck,
  RoomJoinPayload,
  RoomLeavePayload,
  RoomState,
} from '../../../src/shared/types/realtime.ts';

export type PlayerAnswer = {
  optionId?: string;
  optionIds: string[];
  text?: string;
  normalizedText?: string;
  displayText?: string;
  value?: number;
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
  selectedGames: MatchGame[];
  currentGameIndex: number;
  currentGameRoundIndex: number;
  currentQuestionIndex: number;
  round: LiveRound | null;
  leaderboard: LeaderboardEntry[];
  finalRanking: LeaderboardEntry[];
  aggregatedResult: AggregatedResult | null;
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
