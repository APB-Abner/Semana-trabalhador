import type { LiveQuestionType } from './realtime';

export type QuizQuestionType = Exclude<
  LiveQuestionType,
  'multiple_select' | 'poll' | 'word_cloud' | 'scale' | 'ranking' | 'qna'
>;

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

export type VocationalDimension =
  | 'analitico'
  | 'social'
  | 'criativo'
  | 'organizacional'
  | 'pratico'
  | 'lideranca';

export type VocationalOption = {
  id: string;
  texto: string;
  weights: Partial<Record<VocationalDimension, number>>;
};

export type VocationalQuestion = {
  id: string;
  texto: string;
  contexto?: string;
  opcoes: VocationalOption[];
};

export type VocationalProfile = {
  title: string;
  summary: string;
  strengths: string[];
  environments: string[];
  relatedAreas: string[];
  fitSummary: string;
  idealWorkStyles: string[];
  suggestedActions: string[];
  dimensionWeights: Partial<Record<VocationalDimension, number>>;
  nextStep: {
    label: string;
    href: string;
  };
};

export type VocationalDimensionScore = {
  id: VocationalDimension;
  label: string;
  score: number;
  percentage: number;
};

export type VocationalRankingEntry = VocationalProfile & {
  area: string;
  order: number;
  score: number;
  percentage: number;
  reasons: string[];
};

export type VocationalResult = {
  primary: VocationalRankingEntry | null;
  ranking: VocationalRankingEntry[];
  scoreByArea: Record<string, number>;
  scoreByDimension: Record<VocationalDimension, number>;
  dimensions: VocationalDimensionScore[];
  profileBlend: string[];
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
