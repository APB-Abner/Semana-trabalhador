import type { PigeonAvatarState } from './pigeonAvatar';

export type LiveQuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'multiple_select'
  | 'poll'
  | 'word_cloud'
  | 'scale'
  | 'ranking';

export type LiveQuestionOption = {
  id: string;
  text: string;
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
  topic: string;
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
};

export type LivePlayer = {
  id: string;
  name: string;
  avatar: PigeonAvatarState;
  score: number;
  connected: boolean;
  joinedAt: number;
};

export type LeaderboardEntry = {
  playerId: string;
  name: string;
  avatar: PigeonAvatarState;
  score: number;
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

export type LiveRoomStatus = 'lobby' | 'question' | 'revealed' | 'finished';

export type RoomState = {
  pin: string;
  status: LiveRoomStatus;
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
  | { ok: true; pin: string; playerToken?: string; hostToken?: string; state: RoomState }
  | { ok: false; message: string };

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
