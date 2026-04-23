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
  CanOrCantAnswer,
  CanOrCantReveal,
  CanOrCantRevealOption,
  ClientRole,
  FindTheMistakeReveal,
  FindTheMistakeRevealOption,
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
  ProfessionalCommunicationOptionQuality,
  ProfessionalCommunicationReveal,
  ProfessionalCommunicationRevealOption,
  PublicCanOrCantItem,
  PublicFindTheMistakeCase,
  PublicFindTheMistakeOption,
  PublicPriorityOrderItem,
  PublicPriorityOrderScenario,
  PublicLiveQuestion,
  PublicMatchRound,
  PublicProfessionalCommunicationOption,
  PublicProfessionalCommunicationScenario,
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

export type CanOrCantMatchRound = {
  id: string;
  gameType: 'can_or_cant';
  item: import('../../../src/content/games/canOrCant.ts').CanOrCantItem;
};

export type ProfessionalCommunicationMatchRound = {
  id: string;
  gameType: 'professional_communication';
  scenario: import('../../../src/content/games/professionalCommunication.ts').ProfessionalCommunicationScenario;
};

export type FindTheMistakeMatchRound = {
  id: string;
  gameType: 'find_the_mistake';
  caseItem: import('../../../src/content/games/findTheMistake.ts').FindTheMistakeCase;
};

export type MatchRoundInternal =
  | QuickQuizMatchRound
  | WorkSituationMatchRound
  | PriorityOrderMatchRound
  | CanOrCantMatchRound
  | ProfessionalCommunicationMatchRound
  | FindTheMistakeMatchRound;

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
