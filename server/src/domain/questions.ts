import { quizQuestions } from '../../../src/content/quiz/questions.ts';
import type { QuizQuestion } from '../../../src/shared/types/learning.ts';
import type { LiveQuestion, LiveQuestionOption } from '../types/realtime.ts';

function toOptionId(questionIndex: number, optionIndex: number): string {
  return `q${questionIndex + 1}-o${optionIndex + 1}`;
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
