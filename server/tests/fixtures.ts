import type { LiveQuestion } from '../src/types/realtime.ts';

export const liveQuestionsFixture: LiveQuestion[] = [
  {
    id: 'q1',
    type: 'multiple_choice',
    topic: 'Direitos',
    text: 'Qual é um direito do jovem aprendiz?',
    options: [
      { id: 'q1-a', text: 'Férias' },
      { id: 'q1-b', text: 'Trabalho voluntário obrigatório' },
    ],
    correctOptionId: 'q1-a',
    explanation: 'O contrato formal garante férias.',
  },
  {
    id: 'q2',
    type: 'true_false',
    topic: 'Jornada',
    text: 'O jovem aprendiz pode responder apenas uma vez por rodada.',
    options: [
      { id: 'q2-a', text: 'Verdadeiro' },
      { id: 'q2-b', text: 'Falso' },
    ],
    correctOptionId: 'q2-a',
    explanation: 'O servidor bloqueia submissões duplicadas.',
  },
  {
    id: 'q3',
    type: 'multiple_select',
    topic: 'Direitos',
    text: 'Quais itens são direitos do jovem aprendiz?',
    options: [
      { id: 'q3-a', text: 'Carteira assinada' },
      { id: 'q3-b', text: '13º salário' },
      { id: 'q3-c', text: 'Trabalho voluntário obrigatório' },
      { id: 'q3-d', text: 'Férias' },
    ],
    correctOptionIds: ['q3-a', 'q3-b', 'q3-d'],
    explanation: 'O contrato de aprendizagem garante registro, 13º salário e férias.',
  },
];
