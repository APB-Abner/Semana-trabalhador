import { quizQuestions } from '../../../src/content/quiz/questions.ts';
import type { QuizQuestion } from '../../../src/shared/types/learning.ts';
import type { LiveQuestion, LiveQuestionOption } from '../types/realtime.ts';

const competitiveLiveQuestions: LiveQuestion[] = [
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
    id: 'live-ms-postura-profissional',
    type: 'multiple_select',
    topic: 'Postura',
    text: 'Quais atitudes ajudam a causar boa impressão nos primeiros dias de trabalho?',
    options: [
      { id: 'live-ms-postura-profissional-o1', text: 'Chegar no horário combinado' },
      { id: 'live-ms-postura-profissional-o2', text: 'Perguntar quando tiver dúvida' },
      { id: 'live-ms-postura-profissional-o3', text: 'Ignorar orientações para parecer independente' },
      { id: 'live-ms-postura-profissional-o4', text: 'Manter comunicação respeitosa' },
    ],
    correctOptionIds: [
      'live-ms-postura-profissional-o1',
      'live-ms-postura-profissional-o2',
      'live-ms-postura-profissional-o4',
    ],
    explanation: 'Pontualidade, respeito e abertura para aprender fortalecem a adaptação profissional.',
  },
  {
    id: 'live-ms-entrevista-preparacao',
    type: 'multiple_select',
    topic: 'Entrevista',
    text: 'O que vale preparar antes de uma entrevista?',
    options: [
      { id: 'live-ms-entrevista-preparacao-o1', text: 'Pesquisar a empresa' },
      { id: 'live-ms-entrevista-preparacao-o2', text: 'Revisar experiências e projetos' },
      { id: 'live-ms-entrevista-preparacao-o3', text: 'Decorar respostas falsas' },
      { id: 'live-ms-entrevista-preparacao-o4', text: 'Separar documentos e rota de chegada' },
    ],
    correctOptionIds: [
      'live-ms-entrevista-preparacao-o1',
      'live-ms-entrevista-preparacao-o2',
      'live-ms-entrevista-preparacao-o4',
    ],
    explanation: 'Preparação ajuda a reduzir ansiedade e evita improvisos desnecessários.',
  },
  {
    id: 'live-ms-comunicacao-equipe',
    type: 'multiple_select',
    topic: 'Comunicação',
    text: 'Quais práticas melhoram a comunicação em equipe?',
    options: [
      { id: 'live-ms-comunicacao-equipe-o1', text: 'Ouvir antes de responder' },
      { id: 'live-ms-comunicacao-equipe-o2', text: 'Confirmar combinados por escrito quando necessário' },
      { id: 'live-ms-comunicacao-equipe-o3', text: 'Falar por cima de colegas' },
      { id: 'live-ms-comunicacao-equipe-o4', text: 'Pedir feedback de forma objetiva' },
    ],
    correctOptionIds: [
      'live-ms-comunicacao-equipe-o1',
      'live-ms-comunicacao-equipe-o2',
      'live-ms-comunicacao-equipe-o4',
    ],
    explanation: 'Comunicação profissional depende de escuta, clareza e alinhamento.',
  },
  {
    id: 'live-tf-feedback',
    type: 'true_false',
    topic: 'Desenvolvimento',
    text: 'Receber feedback faz parte do processo de aprendizagem profissional.',
    options: [
      { id: 'live-tf-feedback-o1', text: 'Verdadeiro' },
      { id: 'live-tf-feedback-o2', text: 'Falso' },
    ],
    correctOptionId: 'live-tf-feedback-o1',
    explanation: 'Feedback orienta ajustes e acelera o desenvolvimento quando é recebido com abertura.',
  },
  {
    id: 'live-tf-duvida',
    type: 'true_false',
    topic: 'Rotina',
    text: 'Perguntar quando há dúvida é sinal de falta de interesse.',
    options: [
      { id: 'live-tf-duvida-o1', text: 'Verdadeiro' },
      { id: 'live-tf-duvida-o2', text: 'Falso' },
    ],
    correctOptionId: 'live-tf-duvida-o2',
    explanation: 'Perguntas bem colocadas mostram responsabilidade e vontade de aprender.',
  },
];

const participatoryLiveQuestions: LiveQuestion[] = [
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
    id: 'live-poll-desafio',
    type: 'poll',
    topic: 'Desafios',
    text: 'Qual parte do primeiro emprego parece mais desafiadora?',
    options: [
      { id: 'live-poll-desafio-o1', text: 'Entender a rotina' },
      { id: 'live-poll-desafio-o2', text: 'Falar com pessoas novas' },
      { id: 'live-poll-desafio-o3', text: 'Organizar horários' },
      { id: 'live-poll-desafio-o4', text: 'Aprender ferramentas' },
    ],
    explanation: 'O resultado mostra onde o grupo precisa de mais apoio.',
  },
  {
    id: 'live-poll-canal-aprendizado',
    type: 'poll',
    topic: 'Aprendizagem',
    text: 'Como você prefere aprender algo novo no trabalho?',
    options: [
      { id: 'live-poll-canal-aprendizado-o1', text: 'Observando alguém fazer' },
      { id: 'live-poll-canal-aprendizado-o2', text: 'Recebendo passo a passo' },
      { id: 'live-poll-canal-aprendizado-o3', text: 'Praticando com supervisão' },
      { id: 'live-poll-canal-aprendizado-o4', text: 'Lendo materiais curtos' },
    ],
    explanation: 'Preferências de aprendizagem ajudam a ajustar a condução da atividade.',
  },
  {
    id: 'live-poll-curriculo',
    type: 'poll',
    topic: 'Currículo',
    text: 'Qual informação você sente mais dificuldade de colocar no currículo?',
    options: [
      { id: 'live-poll-curriculo-o1', text: 'Objetivo profissional' },
      { id: 'live-poll-curriculo-o2', text: 'Experiências escolares' },
      { id: 'live-poll-curriculo-o3', text: 'Cursos e habilidades' },
      { id: 'live-poll-curriculo-o4', text: 'Contato e apresentação' },
    ],
    explanation: 'A resposta coletiva ajuda a priorizar orientações práticas.',
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
    id: 'live-word-cloud-soft-skill',
    type: 'word_cloud',
    topic: 'Soft skills',
    text: 'Qual habilidade comportamental você quer desenvolver?',
    options: [],
    explanation: 'A nuvem destaca habilidades citadas com mais frequência.',
  },
  {
    id: 'live-word-cloud-entrevista',
    type: 'word_cloud',
    topic: 'Entrevista',
    text: 'Que palavra resume uma boa entrevista?',
    options: [],
    explanation: 'Termos parecidos são agrupados para revelar a percepção do grupo.',
  },
  {
    id: 'live-word-cloud-trabalho',
    type: 'word_cloud',
    topic: 'Rotina',
    text: 'Qual palavra combina com uma boa rotina profissional?',
    options: [],
    explanation: 'A nuvem ajuda a visualizar valores associados ao trabalho.',
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
    id: 'live-scale-comunicacao',
    type: 'scale',
    topic: 'Comunicação',
    text: 'De 1 a 5, como você avalia sua clareza ao explicar uma ideia?',
    options: [],
    scale: {
      min: 1,
      max: 5,
      step: 1,
      minLabel: 'Ainda difícil',
      maxLabel: 'Muito clara',
    },
    explanation: 'A média ajuda o grupo a perceber confiança comunicativa.',
  },
  {
    id: 'live-scale-organizacao',
    type: 'scale',
    topic: 'Organização',
    text: 'De 1 a 5, quão preparado você se sente para organizar escola, curso e trabalho?',
    options: [],
    scale: {
      min: 1,
      max: 5,
      step: 1,
      minLabel: 'Pouco preparado',
      maxLabel: 'Muito preparado',
    },
    explanation: 'A distribuição mostra se o tema precisa de apoio extra.',
  },
  {
    id: 'live-scale-conhecimento-direitos',
    type: 'scale',
    topic: 'Direitos',
    text: 'De 1 a 5, quanto você conhece sobre direitos do jovem aprendiz?',
    options: [],
    scale: {
      min: 1,
      max: 5,
      step: 1,
      minLabel: 'Conheço pouco',
      maxLabel: 'Conheço bem',
    },
    explanation: 'A escala identifica o nível de familiaridade do grupo.',
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
  {
    id: 'live-ranking-soft-skills',
    type: 'ranking',
    topic: 'Soft skills',
    text: 'Ordene as habilidades mais importantes para começar bem.',
    options: [
      { id: 'live-ranking-soft-skills-o1', text: 'Comunicação' },
      { id: 'live-ranking-soft-skills-o2', text: 'Pontualidade' },
      { id: 'live-ranking-soft-skills-o3', text: 'Colaboração' },
      { id: 'live-ranking-soft-skills-o4', text: 'Curiosidade para aprender' },
    ],
    explanation: 'A agregação mostra quais habilidades o grupo mais valoriza.',
  },
  {
    id: 'live-ranking-preparacao',
    type: 'ranking',
    topic: 'Preparação',
    text: 'Ordene as ações mais úteis antes de uma entrevista.',
    options: [
      { id: 'live-ranking-preparacao-o1', text: 'Pesquisar a empresa' },
      { id: 'live-ranking-preparacao-o2', text: 'Treinar apresentação pessoal' },
      { id: 'live-ranking-preparacao-o3', text: 'Separar documentos' },
      { id: 'live-ranking-preparacao-o4', text: 'Planejar deslocamento' },
    ],
    explanation: 'A ordem coletiva ajuda a discutir prioridades práticas.',
  },
  {
    id: 'live-ranking-aprendizagem',
    type: 'ranking',
    topic: 'Aprendizagem',
    text: 'Ordene o que mais ajuda você a aprender no trabalho.',
    options: [
      { id: 'live-ranking-aprendizagem-o1', text: 'Feedback frequente' },
      { id: 'live-ranking-aprendizagem-o2', text: 'Exemplos práticos' },
      { id: 'live-ranking-aprendizagem-o3', text: 'Tempo para praticar' },
      { id: 'live-ranking-aprendizagem-o4', text: 'Checklist de tarefas' },
    ],
    explanation: 'O ranking evidencia preferências de suporte ao aprendizado.',
  },
  {
    id: 'live-qna-primeiro-passo',
    type: 'qna',
    topic: 'Reflexão',
    text: 'Qual primeiro passo você pode dar esta semana para se aproximar de uma oportunidade?',
    options: [],
    explanation: 'As respostas abertas ajudam a transformar intenção em ação concreta.',
  },
  {
    id: 'live-qna-duvida',
    type: 'qna',
    topic: 'Dúvidas',
    text: 'Qual dúvida sobre jovem aprendiz você gostaria de ver respondida?',
    options: [],
    explanation: 'Dúvidas semelhantes são agrupadas para orientar a conversa.',
  },
  {
    id: 'live-qna-feedback',
    type: 'qna',
    topic: 'Desenvolvimento',
    text: 'Como você reagiria a um feedback que discorda da sua percepção?',
    options: [],
    explanation: 'A lista de respostas abre espaço para discutir postura profissional.',
  },
  {
    id: 'live-qna-comunicacao',
    type: 'qna',
    topic: 'Comunicação',
    text: 'Escreva uma frase curta que você usaria para pedir ajuda no trabalho.',
    options: [],
    explanation: 'As respostas podem virar exemplos práticos para a turma.',
  },
];

const liveOnlyQuestions = [
  ...competitiveLiveQuestions,
  ...participatoryLiveQuestions,
];

const featuredLiveQuestionIds = [
  'live-ms-direitos-trabalhistas',
  'live-poll-interesse',
  'live-word-cloud-carreira',
  'live-scale-confianca',
  'live-ranking-prioridades',
  'live-qna-primeiro-passo',
];

function toOptionId(questionIndex: number, optionIndex: number): string {
  return `q${questionIndex + 1}-o${optionIndex + 1}`;
}

function orderedLiveQuestions(adaptedQuestions: LiveQuestion[]): LiveQuestion[] {
  const firstMultipleChoice = adaptedQuestions.find((question) => question.type === 'multiple_choice');
  const firstTrueFalse = adaptedQuestions.find((question) => question.type === 'true_false');
  const featuredLiveQuestions = featuredLiveQuestionIds
    .map((questionId) => liveOnlyQuestions.find((question) => question.id === questionId))
    .filter((question): question is LiveQuestion => Boolean(question));
  const featuredIds = new Set([
    firstMultipleChoice?.id,
    firstTrueFalse?.id,
    ...featuredLiveQuestionIds,
  ]);
  const remainingLiveQuestions = liveOnlyQuestions.filter((question) => !featuredIds.has(question.id));
  const rest = adaptedQuestions.filter((question) => !featuredIds.has(question.id));

  return [
    firstMultipleChoice,
    firstTrueFalse,
    ...featuredLiveQuestions,
    ...remainingLiveQuestions,
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
