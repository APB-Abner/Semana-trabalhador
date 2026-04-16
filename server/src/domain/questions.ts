import { quizQuestions } from '../../../src/content/quiz/questions.ts';
import type { LiveQuestion, LiveQuestionOption } from '../types/realtime.ts';

function toOptionId(questionIndex: number, optionIndex: number): string {
  return `q${questionIndex + 1}-o${optionIndex + 1}`;
}

export function adaptQuizQuestions(): LiveQuestion[] {
  return quizQuestions.map((question, questionIndex) => {
    const options: LiveQuestionOption[] = question.opcoes.map((option: string, optionIndex: number) => ({
      id: toOptionId(questionIndex, optionIndex),
      text: option,
    }));

    const correctOption = options.find((option) => option.text === question.resposta);

    if (!correctOption) {
      throw new Error(`Pergunta sem resposta correta nas opções: ${question.pergunta}`);
    }

    return {
      id: `quiz-${questionIndex + 1}`,
      type: 'multiple_choice',
      topic: question.tema,
      text: question.pergunta,
      options,
      correctOptionId: correctOption.id,
      explanation: question.explicacao,
    };
  });
}
