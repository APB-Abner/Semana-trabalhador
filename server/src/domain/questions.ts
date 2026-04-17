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
  {
    id: 'live-poll-interesse',
    type: 'poll',
    topic: 'Interesses',
    text: 'Qual tema você quer aprofundar depois da competição?',
    options: [
      { id: 'live-poll-interesse-o1', text: 'Currículo' },
      { id: 'live-poll-interesse-o2', text: 'Entrevista' },
      { id: 'live-poll-interesse-o3', text: 'Direitos do aprendiz' },
      { id: 'live-poll-interesse-o4', text: 'Primeiro emprego' },
    ],
    explanation: 'A enquete ajuda o mediador a escolher o próximo assunto da turma.',
  },
  {
    id: 'live-word-cloud-carreira',
    type: 'word_cloud',
    topic: 'Carreira',
    text: 'Em uma palavra ou expressão curta, o que mais importa no primeiro emprego?',
    options: [],
    explanation: 'As respostas semelhantes são agrupadas para mostrar os temas mais lembrados pela turma.',
  },
  {
    id: 'live-scale-confianca',
    type: 'scale',
    topic: 'Autopercepção',
    text: 'De 1 a 5, quão confiante você está para participar de uma entrevista?',
    options: [],
    scale: {
      min: 1,
      max: 5,
      step: 1,
      minLabel: 'Preciso praticar',
      maxLabel: 'Muito confiante',
    },
    explanation: 'A escala mostra a média de confiança do grupo sem alterar o ranking competitivo.',
  },
  {
    id: 'live-ranking-prioridades',
    type: 'ranking',
    topic: 'Prioridades',
    text: 'Ordene o que mais pesa na escolha de uma primeira oportunidade.',
    options: [
      { id: 'live-ranking-prioridades-o1', text: 'Aprendizado' },
      { id: 'live-ranking-prioridades-o2', text: 'Ambiente de trabalho' },
      { id: 'live-ranking-prioridades-o3', text: 'Salário' },
      { id: 'live-ranking-prioridades-o4', text: 'Localização' },
    ],
    explanation: 'O ranking usa contagem Borda simples para revelar as prioridades coletivas da turma.',
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
