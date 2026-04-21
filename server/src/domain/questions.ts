import { quizQuestions } from '../../../src/content/quiz/questions.ts';
import type { QuizQuestion } from '../../../src/shared/types/learning.ts';
import type { LiveQuestion, LiveQuestionOption } from '../types/realtime.ts';
import {
  liveOnlyQuestions,
  validateLiveQuestionMetadata,
  type LiveQuestionCatalogEntry,
} from './live-question-catalog.ts';
import { normalizeContentKey } from './match/contentDiversity.ts';
import {
  selectLiveSessionQuestions,
  summarizeLiveQuestions,
  type LiveSessionSelectionOptions,
} from './live-session-selector.ts';

function toOptionId(questionIndex: number, optionIndex: number): string {
  return `q${questionIndex + 1}-o${optionIndex + 1}`;
}

function getAdaptedDifficulty(questionIndex: number) {
  if (questionIndex <= 2) {
    return 'easy' as const;
  }

  if (questionIndex <= 7) {
    return 'medium' as const;
  }

  return 'hard' as const;
}

export function adaptQuizQuestion(question: QuizQuestion, questionIndex: number): LiveQuestionCatalogEntry {
  const type = question.tipo ?? 'multiple_choice';
  const options: LiveQuestionOption[] = question.opcoes.map((option: string, optionIndex: number) => ({
    id: toOptionId(questionIndex, optionIndex),
    text: option,
  }));

  if (type === 'true_false' && options.length !== 2) {
    throw new Error(`Pergunta verdadeiro/falso precisa ter exatamente 2 opcoes: ${question.pergunta}`);
  }

  const correctOption = options.find((option) => option.text === question.resposta);

  if (!correctOption) {
    throw new Error(`Pergunta sem resposta correta nas opcoes: ${question.pergunta}`);
  }

  return {
    id: `quiz-${questionIndex + 1}`,
    type,
    bucket: 'competitive',
    tone: 'objective',
    sessionFit: 'competition',
    topic: question.tema,
    difficulty: getAdaptedDifficulty(questionIndex),
    contentGroup: normalizeContentKey(question.tema),
    sessionTags: [normalizeContentKey(question.tema), type],
    text: question.pergunta,
    options,
    correctOptionId: correctOption.id,
    explanation: question.explicacao,
  };
}

export function adaptQuizQuestions(questions: QuizQuestion[] = quizQuestions): LiveQuestionCatalogEntry[] {
  return questions.map((question, questionIndex) => adaptQuizQuestion(question, questionIndex));
}

export function getLiveQuestionBank(): LiveQuestionCatalogEntry[] {
  const bank = [
    ...adaptQuizQuestions(),
    ...liveOnlyQuestions,
  ];

  bank.forEach(validateLiveQuestionMetadata);
  return bank;
}

export function getLiveQuestions(recentQuestionIds: string[] = []): LiveQuestion[] {
  return selectLiveSessionQuestions({
    questions: getLiveQuestionBank(),
    recentQuestionIds,
  });
}

export function getLiveOnlyQuestions(): LiveQuestionCatalogEntry[] {
  return liveOnlyQuestions;
}

export function selectLiveQuestionsForSession(
  options: Omit<LiveSessionSelectionOptions, 'questions'> & { questions?: LiveQuestion[] } = {},
): LiveQuestion[] {
  return selectLiveSessionQuestions({
    questions: options.questions ?? getLiveQuestionBank(),
    recentQuestionIds: options.recentQuestionIds,
    sessionTemplate: options.sessionTemplate,
  });
}

export function summarizeLiveQuestionBank(questions: LiveQuestion[] = getLiveQuestionBank()) {
  return summarizeLiveQuestions(questions);
}
