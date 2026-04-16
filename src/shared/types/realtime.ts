export type LiveQuestionType = 'multiple_choice' | 'true_false';

export type LiveQuestionOption = {
  id: string;
  text: string;
};

export type LiveQuestion = {
  id: string;
  type: LiveQuestionType;
  topic: string;
  text: string;
  options: LiveQuestionOption[];
  correctOptionId: string;
  explanation: string;
};

export type PublicLiveQuestion = Omit<LiveQuestion, 'correctOptionId' | 'explanation'> & {
  correctOptionId?: string;
  explanation?: string;
};

export type LivePlayer = {
  id: string;
  name: string;
  score: number;
  connected: boolean;
  joinedAt: number;
};

export type LeaderboardEntry = {
  playerId: string;
  name: string;
  score: number;
  roundPoints: number;
  lastAnswerCorrect: boolean;
  responseMs: number | null;
};

export type LiveRoomStatus = 'lobby' | 'question' | 'revealed' | 'finished';

export type RoomState = {
  pin: string;
  status: LiveRoomStatus;
  players: LivePlayer[];
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: PublicLiveQuestion | null;
  startedAt: number | null;
  closesAt: number | null;
  answeredCount: number;
  leaderboard: LeaderboardEntry[];
  finalRanking: LeaderboardEntry[];
};

export type ClientRole = 'host' | 'player';

export type RoomCreateAck =
  | { ok: true; pin: string; hostToken: string; state: RoomState }
  | { ok: false; message: string };

export type RoomJoinPayload = {
  pin: string;
  role: ClientRole;
  name?: string;
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

export type AnswerSubmitPayload = {
  pin: string;
  playerToken: string;
  questionId: string;
  optionId: string;
};

export type RoomLeavePayload = {
  pin: string;
  hostToken?: string;
  playerToken?: string;
};

export type BasicAck =
  | { ok: true; state: RoomState }
  | { ok: false; message: string };
