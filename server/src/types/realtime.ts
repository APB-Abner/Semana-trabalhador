import type {
  AggregatedResult,
  LeaderboardEntry,
  LiveAnswerPayload,
  LivePlayer,
  LiveQuestion,
  MatchGame,
  PublicMatchRound,
  RoomState,
  WorkSituation,
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
  MatchRoundGameType,
  MatchStatus,
  MiniGameType,
  OnlineMatch,
  PublicLiveQuestion,
  PublicMatchRound,
  PublicWorkSituation,
  RoomCreateAck,
  RoomJoinAck,
  RoomJoinPayload,
  RoomLeavePayload,
  RoomState,
  WorkSituation,
  WorkSituationOption,
  WorkSituationOptionQuality,
  WorkSituationReveal,
  WorkSituationRevealOption,
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

export type QuickQuizMatchRound = {
  id: string;
  gameType: 'quick_quiz';
  question: LiveQuestion;
};

export type WorkSituationMatchRound = {
  id: string;
  gameType: 'work_situation';
  situation: WorkSituation;
};

export type MatchRoundInternal = QuickQuizMatchRound | WorkSituationMatchRound;

export type LiveRoomInternal = {
  pin: string;
  hostToken: string;
  hostConnected: boolean;
  status: RoomState['status'];
  players: Map<string, LivePlayerInternal>;
  questions: LiveQuestion[];
  rounds: MatchRoundInternal[];
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
