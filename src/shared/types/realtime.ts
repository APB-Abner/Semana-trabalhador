import type { PigeonAvatarState } from './pigeonAvatar';

export type LiveQuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'multiple_select'
  | 'poll'
  | 'word_cloud'
  | 'scale'
  | 'ranking'
  | 'qna';

export type LiveQuestionBucket = 'competitive' | 'participatory';

export type LiveQuestionTone = 'objective' | 'reflective' | 'interview_like';

export type LiveQuestionDifficulty = 'easy' | 'medium' | 'hard';

export type LiveQuestionSessionFit = 'competition' | 'workshop' | 'both';

export type MiniGameType =
  | 'quick_quiz'
  | 'work_situation'
  | 'priority_order'
  | 'can_or_cant'
  | 'professional_communication'
  | 'find_the_mistake';

export type MatchStatus =
  | 'lobby'
  | 'game_intro'
  | 'round_open'
  | 'round_revealed'
  | 'between_games'
  | 'finished';

export type MatchGame = {
  id: string;
  type: MiniGameType;
  title: string;
  description: string;
  roundIds: string[];
  roundCount: number;
  maxScore: number;
  active: boolean;
};

export type MatchRoundGameType = MiniGameType;

export type OnlineMatch = {
  selectedGames: MatchGame[];
  currentGameIndex: number;
  currentRoundIndex: number;
  status: MatchStatus;
};

export type LiveQuestionOption = {
  id: string;
  text: string;
};

export type LiveQuestionOptionStat = {
  optionId: string;
  text: string;
  count: number;
  percentage: number;
};

export type LiveScaleConfig = {
  min: number;
  max: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
};

export type LiveQuestion = {
  id: string;
  type: LiveQuestionType;
  bucket?: LiveQuestionBucket;
  tone?: LiveQuestionTone;
  topic: string;
  difficulty?: LiveQuestionDifficulty;
  sessionFit?: LiveQuestionSessionFit;
  enabled?: boolean;
  text: string;
  options: LiveQuestionOption[];
  correctOptionId?: string;
  correctOptionIds?: string[];
  scale?: LiveScaleConfig;
  explanation: string;
};

export type PublicLiveQuestion = Omit<LiveQuestion, 'correctOptionId' | 'correctOptionIds' | 'explanation'> & {
  correctOptionId?: string;
  correctOptionIds?: string[];
  explanation?: string;
  optionStats?: LiveQuestionOptionStat[];
};

export type WorkSituationOptionQuality = 'best' | 'ok' | 'poor';

export type WorkSituationOption = {
  id: string;
  text: string;
  quality: WorkSituationOptionQuality;
  basePoints: number;
  feedback: string;
};

export type WorkSituation = {
  id: string;
  title: string;
  topic: string;
  scenario: string;
  options: WorkSituationOption[];
  bestOptionId: string;
  explanation: string;
};

export type PublicWorkSituation = Omit<WorkSituation, 'options' | 'bestOptionId' | 'explanation'> & {
  options: Array<Pick<WorkSituationOption, 'id' | 'text'>>;
};

export type WorkSituationRevealOption = {
  optionId: string;
  text: string;
  quality: WorkSituationOptionQuality;
  basePoints: number;
  feedback: string;
  count: number;
  percentage: number;
};

export type WorkSituationReveal = {
  bestOptionId: string;
  explanation: string;
  totalResponses: number;
  options: WorkSituationRevealOption[];
};

export type PriorityOrderItem = {
  id: string;
  text: string;
  idealPosition: number;
  explanation?: string;
};

export type PriorityOrderScenario = {
  id: string;
  title: string;
  topic: string;
  scenario: string;
  items: PriorityOrderItem[];
  explanation: string;
};

export type PublicPriorityOrderItem = Pick<PriorityOrderItem, 'id' | 'text'>;

export type PublicPriorityOrderScenario = Omit<PriorityOrderScenario, 'items' | 'explanation'> & {
  items: PublicPriorityOrderItem[];
};

export type PriorityOrderRevealItem = {
  itemId: string;
  text: string;
  idealPosition: number;
  explanation?: string;
};

export type PriorityOrderAnswerSummary = {
  optionIds: string[];
  correctPositionCount: number;
  totalDistance: number;
  maxDistance: number;
  basePoints: number;
  speedBonus: number;
  points: number;
};

export type PriorityOrderReveal = {
  explanation: string;
  idealOrder: PriorityOrderRevealItem[];
  totalResponses: number;
  answerSummaries: PriorityOrderAnswerSummary[];
};

export type CanOrCantAnswer = 'can' | 'cant';

export type PublicCanOrCantItem = {
  id: string;
  topic: string;
  title: string;
  situation: string;
  options: Array<{
    id: CanOrCantAnswer;
    text: string;
  }>;
};

export type CanOrCantRevealOption = {
  optionId: CanOrCantAnswer;
  text: string;
  count: number;
  percentage: number;
};

export type CanOrCantReveal = {
  correctAnswer: CanOrCantAnswer;
  explanation: string;
  totalResponses: number;
  options: CanOrCantRevealOption[];
};

export type ProfessionalCommunicationOptionQuality = 'best' | 'ok' | 'poor';

export type PublicProfessionalCommunicationOption = {
  id: string;
  text: string;
};

export type PublicProfessionalCommunicationScenario = {
  id: string;
  topic: string;
  title: string;
  scenario: string;
  options: PublicProfessionalCommunicationOption[];
};

export type ProfessionalCommunicationRevealOption = {
  optionId: string;
  text: string;
  quality: ProfessionalCommunicationOptionQuality;
  basePoints: number;
  feedback: string;
  count: number;
  percentage: number;
};

export type ProfessionalCommunicationReveal = {
  bestOptionId: string;
  learningPoint: string;
  totalResponses: number;
  options: ProfessionalCommunicationRevealOption[];
};

export type PublicFindTheMistakeOption = {
  id: string;
  label: string;
};

export type PublicFindTheMistakeCase = {
  id: string;
  topic: string;
  title: string;
  prompt: string;
  sample: string;
  options: PublicFindTheMistakeOption[];
};

export type FindTheMistakeRevealOption = {
  optionId: string;
  label: string;
  isMistake: boolean;
  explanation: string;
  count: number;
  percentage: number;
};

export type FindTheMistakeReveal = {
  totalResponses: number;
  mistakeCount: number;
  options: FindTheMistakeRevealOption[];
};

export type PublicMatchRound =
  | {
      id: string;
      gameType: 'quick_quiz';
      question: PublicLiveQuestion | null;
    }
  | {
      id: string;
      gameType: 'work_situation';
      situation: PublicWorkSituation;
      reveal?: WorkSituationReveal;
    }
  | {
      id: string;
      gameType: 'priority_order';
      scenario: PublicPriorityOrderScenario;
      reveal?: PriorityOrderReveal;
    }
  | {
      id: string;
      gameType: 'can_or_cant';
      item: PublicCanOrCantItem;
      reveal?: CanOrCantReveal;
    }
  | {
      id: string;
      gameType: 'professional_communication';
      scenario: PublicProfessionalCommunicationScenario;
      reveal?: ProfessionalCommunicationReveal;
    }
  | {
      id: string;
      gameType: 'find_the_mistake';
      case: PublicFindTheMistakeCase;
      reveal?: FindTheMistakeReveal;
    };

export type LivePlayer = {
  id: string;
  name: string;
  avatar: PigeonAvatarState;
  score: number;
  gameScores: Record<string, number>;
  connected: boolean;
  joinedAt: number;
};

export type LeaderboardEntry = {
  playerId: string;
  name: string;
  avatar: PigeonAvatarState;
  score: number;
  gameScore: number;
  gameScores: Record<string, number>;
  roundPoints: number;
  lastAnswerCorrect: boolean;
  responseMs: number | null;
};

export type PollAggregatedOption = {
  optionId: string;
  text: string;
  count: number;
  percentage: number;
};

export type WordCloudAggregatedEntry = {
  text: string;
  normalizedText: string;
  count: number;
};

export type QnaAggregatedEntry = {
  text: string;
  normalizedText: string;
  count: number;
};

export type ScaleDistributionEntry = {
  value: number;
  count: number;
  percentage: number;
};

export type RankingAggregatedItem = {
  optionId: string;
  text: string;
  totalPoints: number;
  averagePosition: number | null;
  firstPlaceVotes: number;
};

export type AggregatedResult =
  | {
      type: 'poll';
      totalResponses: number;
      options: PollAggregatedOption[];
    }
  | {
      type: 'word_cloud';
      totalResponses: number;
      entries: WordCloudAggregatedEntry[];
    }
  | {
      type: 'qna';
      totalResponses: number;
      entries: QnaAggregatedEntry[];
    }
  | {
      type: 'scale';
      totalResponses: number;
      average: number | null;
      distribution: ScaleDistributionEntry[];
    }
  | {
      type: 'ranking';
      totalResponses: number;
      items: RankingAggregatedItem[];
    };

export type LiveRoomStatus = MatchStatus;

export type RoomState = {
  pin: string;
  status: LiveRoomStatus;
  match: OnlineMatch;
  selectedGames: MatchGame[];
  currentGame: MatchGame | null;
  currentGameIndex: number;
  currentGameRoundIndex: number;
  currentRound: PublicMatchRound | null;
  hostConnected: boolean;
  serverNow: number;
  players: LivePlayer[];
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: PublicLiveQuestion | null;
  startedAt: number | null;
  closesAt: number | null;
  answeredCount: number;
  leaderboard: LeaderboardEntry[];
  finalRanking: LeaderboardEntry[];
  aggregatedResult: AggregatedResult | null;
};

export type ClientRole = 'host' | 'player';

export type RoomCreateAck =
  | { ok: true; pin: string; hostToken: string; state: RoomState }
  | { ok: false; message: string };

export type RoomJoinPayload = {
  pin: string;
  role: ClientRole;
  name?: string;
  avatar?: PigeonAvatarState;
  playerToken?: string;
  hostToken?: string;
};

export type RoomJoinAck =
  | { ok: true; pin: string; playerToken?: string; playerId?: string; hostToken?: string; state: RoomState }
  | { ok: false; message: string };

export type RoomViewPayload = {
  pin: string;
};

export type HostActionPayload = {
  pin: string;
  hostToken: string;
};

export type LiveAnswerPayload = {
  optionId?: string;
  optionIds?: string[];
  text?: string;
  value?: number;
};

export type AnswerSubmitPayload = LiveAnswerPayload & {
  pin: string;
  playerToken: string;
  questionId: string;
};

export type RoomLeavePayload = {
  pin: string;
  hostToken?: string;
  playerToken?: string;
};

export type BasicAck =
  | { ok: true; state: RoomState }
  | { ok: false; message: string };
