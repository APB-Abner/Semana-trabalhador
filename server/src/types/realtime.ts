import type {
  AggregatedResult,
  LeaderboardEntry,
  LiveAnswerPayload,
  LivePlayer,
  LiveQuestion,
  MatchGame,
  PriorityOrderScenario,
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
  PriorityOrderAnswerSummary,
  PriorityOrderItem,
  PriorityOrderReveal,
  PriorityOrderRevealItem,
  PriorityOrderScenario,
  PublicPriorityOrderItem,
  PublicPriorityOrderScenario,
  PublicLiveQuestion,
  PublicMatchRound,
  PublicWorkSituation,
  RoomCreateAck,
  RoomJoinAck,
  RoomJoinPayload,
  RoomLeavePayload,
  RoomViewPayload,
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

export type PriorityOrderMatchRound = {
  id: string;
  gameType: 'priority_order';
  scenario: PriorityOrderScenario;
  publicItems: Array<Pick<PriorityOrderScenario['items'][number], 'id' | 'text'>>;
};

export type MatchRoundInternal = QuickQuizMatchRound | WorkSituationMatchRound | PriorityOrderMatchRound;

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
