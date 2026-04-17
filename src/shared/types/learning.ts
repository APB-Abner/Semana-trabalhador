import type { LiveQuestionType } from './realtime';

export type QuizQuestionType = Exclude<LiveQuestionType, 'multiple_select' | 'poll' | 'word_cloud'>;

export type QuizQuestion = {
  tipo?: QuizQuestionType;
  tema: string;
  pergunta: string;
  opcoes: string[];
  resposta: string;
  explicacao: string;
};

export type QuizAnswerReview = {
  question: QuizQuestion;
  selectedAnswer: string;
  isCorrect: boolean;
};

export type VocationalProfile = {
  title: string;
  summary: string;
  strengths: string[];
  environments: string[];
  relatedAreas: string[];
  nextStep: {
    label: string;
    href: string;
  };
};

export type VocationalRankingEntry = VocationalProfile & {
  area: string;
  order: number;
  score: number;
  percentage: number;
};

export type VocationalResult = {
  primary: VocationalRankingEntry | null;
  ranking: VocationalRankingEntry[];
  scoreByArea: Record<string, number>;
  totalAnswers: number;
};

export type MemoryCardPair = {
  id: string;
  label: string;
};

export type MemoryCardInstance = MemoryCardPair & {
  instanceId: string;
};

export type MemoryDifficulty = {
  id: 'facil' | 'medio' | 'dificil';
  label: string;
  pairCount: number;
  timeLimit: number;
  previewSeconds: number;
};
