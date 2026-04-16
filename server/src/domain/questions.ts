import { quizQuestions } from '../../../src/content/quiz/questions.ts';
import type { QuizQuestion } from '../../../src/shared/types/learning.ts';
import type { LiveQuestion, LiveQuestionOption } from '../types/realtime.ts';

const liveOnlyQuestions: LiveQuestion[] = [
  {
    id: 'live-ms-direitos-trabalhistas',
    type: 'multiple_select',
    topic: 'Direitos',
    text: 'Quais direitos fazem parte de um contrato formal de jovem aprendiz?',
    options: [
      { id: 'live-ms-direitos-trabalhistas-o1', text: 'Carteira assinada' },
      { id: 'live-ms-direitos-trabalhistas-o2', text: '13º salário' },
      { id: 'live-ms-direitos-trabalhistas-o3', text: 'Férias' },
      { id: 'live-ms-direitos-trabalhistas-o4', text: 'Trabalho voluntário obrigatório' },
    ],
    correctOptionIds: [
      'live-ms-direitos-trabalhistas-o1',
      'live-ms-direitos-trabalhistas-o2',
      'live-ms-direitos-trabalhistas-o3',
    ],
    explanation: 'O contrato de aprendizagem é formal e garante registro, férias, 13º salário e outros direitos trabalhistas.',
  },
];

function toOptionId(questionIndex: number, optionIndex: number): string {
  return `q${questionIndex + 1}-o${optionIndex + 1}`;
}

function orderedLiveQuestions(adaptedQuestions: LiveQuestion[]): LiveQuestion[] {
  const firstMultipleChoice = adaptedQuestions.find((question) => question.type === 'multiple_choice');
  const firstTrueFalse = adaptedQuestions.find((question) => question.type === 'true_false');
  const featuredIds = new Set([
    firstMultipleChoice?.id,
    firstTrueFalse?.id,
    ...liveOnlyQuestions.map((question) => question.id),
  ]);
  const rest = adaptedQuestions.filter((question) => !featuredIds.has(question.id));

  return [
    firstMultipleChoice,
    firstTrueFalse,
    ...liveOnlyQuestions,
    ...rest,
  ].filter((question): question is LiveQuestion => Boolean(question));
}

export function adaptQuizQuestion(question: QuizQuestion, questionIndex: number): LiveQuestion {
  const type = question.tipo ?? 'multiple_choice';
  const options: LiveQuestionOption[] = question.opcoes.map((option: string, optionIndex: number) => ({
    id: toOptionId(questionIndex, optionIndex),
    text: option,
  }));

  if (type === 'true_false' && options.length !== 2) {
    throw new Error(`Pergunta verdadeiro/falso precisa ter exatamente 2 opções: ${question.pergunta}`);
  }

  const correctOption = options.find((option) => option.text === question.resposta);

  if (!correctOption) {
    throw new Error(`Pergunta sem resposta correta nas opções: ${question.pergunta}`);
  }

  return {
    id: `quiz-${questionIndex + 1}`,
    type,
    topic: question.tema,
    text: question.pergunta,
    options,
    correctOptionId: correctOption.id,
    explanation: question.explicacao,
  };
}

export function adaptQuizQuestions(questions: QuizQuestion[] = quizQuestions): LiveQuestion[] {
  return questions.map((question, questionIndex) => adaptQuizQuestion(question, questionIndex));
}

export function getLiveQuestions(): LiveQuestion[] {
  return orderedLiveQuestions(adaptQuizQuestions());
}

export function getLiveOnlyQuestions(): LiveQuestion[] {
  return liveOnlyQuestions;
}
