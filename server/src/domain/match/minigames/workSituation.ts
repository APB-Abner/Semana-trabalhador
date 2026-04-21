import type {
  LiveAnswerPayload,
  PlayerAnswer,
  WorkSituation,
  WorkSituationReveal,
} from '../../../types/realtime.ts';
import type { BuildWorkSituationGameOptions, BuiltMatchGame, MiniGameDefinition } from './types.ts';

export const workSituationDefinition: MiniGameDefinition = {
  type: 'work_situation',
  title: 'Situacao Profissional',
  description: 'Cenas de decisao rapida sobre postura, comunicacao e rotina de trabalho.',
  active: true,
};

export const WORK_SITUATION_ROUNDS_PER_MATCH = 3;
export const WORK_SITUATION_SPEED_BONUS = 200;

export function buildWorkSituationGame({
  id,
  title = workSituationDefinition.title,
  description = workSituationDefinition.description,
  situations,
}: BuildWorkSituationGameOptions): BuiltMatchGame {
  return {
    id,
    type: workSituationDefinition.type,
    title,
    description,
    roundIds: situations.map((situation) => situation.id),
    roundCount: situations.length,
    maxScore: situations.length * (1_000 + WORK_SITUATION_SPEED_BONUS),
    active: workSituationDefinition.active,
  };
}

export function validateWorkSituation(situation: WorkSituation) {
  if (!situation.id || !situation.title || !situation.scenario) {
    throw new Error('Situacao profissional incompleta no catalogo.');
  }

  if (situation.options.length < 3 || situation.options.length > 4) {
    throw new Error(`Situacao profissional precisa ter 3 ou 4 opcoes: ${situation.id}`);
  }

  const optionIds = new Set(situation.options.map((option) => option.id));
  if (optionIds.size !== situation.options.length) {
    throw new Error(`Situacao profissional tem opcoes duplicadas: ${situation.id}`);
  }

  if (!optionIds.has(situation.bestOptionId)) {
    throw new Error(`Situacao profissional sem melhor opcao valida: ${situation.id}`);
  }

  if (!situation.options.some((option) => option.quality === 'best')) {
    throw new Error(`Situacao profissional precisa ter uma opcao best: ${situation.id}`);
  }
}

export function getPublicWorkSituation(situation: WorkSituation) {
  return {
    id: situation.id,
    title: situation.title,
    topic: situation.topic,
    scenario: situation.scenario,
    options: situation.options.map(({ id, text }) => ({ id, text })),
  };
}

export function normalizeWorkSituationAnswer(situation: WorkSituation, payload: LiveAnswerPayload) {
  const optionId = payload.optionId ?? payload.optionIds?.[0];

  if (!optionId) {
    throw new Error('Escolha uma acao para esta situacao.');
  }

  const option = situation.options.find((candidate) => candidate.id === optionId);

  if (!option) {
    throw new Error('Opcao invalida para esta situacao.');
  }

  return {
    option,
    optionIds: [option.id],
  };
}

export function calculateWorkSituationScore({
  basePoints,
  submittedAt,
  startedAt,
  limitMs,
}: {
  basePoints: number;
  submittedAt: number;
  startedAt: number;
  limitMs: number;
}) {
  if (basePoints <= 0) {
    return 0;
  }

  const responseMs = Math.max(0, submittedAt - startedAt);
  const speedFactor = Math.max(0, 1 - responseMs / limitMs);

  return basePoints + Math.round(speedFactor * WORK_SITUATION_SPEED_BONUS);
}

export function createWorkSituationReveal(situation: WorkSituation, answers: PlayerAnswer[]): WorkSituationReveal {
  const totalResponses = answers.length;

  return {
    bestOptionId: situation.bestOptionId,
    explanation: situation.explanation,
    totalResponses,
    options: situation.options.map((option) => {
      const count = answers.filter((answer) => answer.optionIds[0] === option.id).length;

      return {
        optionId: option.id,
        text: option.text,
        quality: option.quality,
        basePoints: option.basePoints,
        feedback: option.feedback,
        count,
        percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0,
      };
    }),
  };
}
