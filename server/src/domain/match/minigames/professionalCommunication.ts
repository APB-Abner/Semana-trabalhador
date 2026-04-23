import {
  professionalCommunicationScenarios,
  type CommunicationOptionQuality,
  type ProfessionalCommunicationScenario,
} from '../../../../../src/content/games/professionalCommunication.ts';
import type {
  LiveAnswerPayload,
  PlayerAnswer,
  ProfessionalCommunicationReveal,
  PublicProfessionalCommunicationScenario,
} from '../../../types/realtime.ts';
import { normalizeContentKey, type MatchContentMetadata } from '../contentDiversity.ts';
import type { BuildProfessionalCommunicationGameOptions, BuiltMatchGame, MiniGameDefinition } from './types.ts';

export type ProfessionalCommunicationCatalogEntry = ProfessionalCommunicationScenario & MatchContentMetadata;

export const professionalCommunicationDefinition: MiniGameDefinition = {
  type: 'professional_communication',
  title: 'Comunicação Profissional',
  description: 'Escolha a melhor mensagem para resolver situações reais de trabalho.',
  active: true,
};

export const PROFESSIONAL_COMMUNICATION_ROUNDS_PER_MATCH = 3;
export const PROFESSIONAL_COMMUNICATION_SPEED_BONUS = 200;

const qualityBasePoints: Record<CommunicationOptionQuality, number> = {
  best: 1000,
  ok: 600,
  poor: 0,
};

function toCatalogEntry(scenario: ProfessionalCommunicationScenario): ProfessionalCommunicationCatalogEntry {
  const contentGroup = scenario.contentGroup ?? normalizeContentKey(scenario.topic);

  return {
    ...scenario,
    difficulty: scenario.difficulty ?? 'medium',
    contentGroup,
    sessionTags: scenario.sessionTags ?? [contentGroup, normalizeContentKey(scenario.title)],
  };
}

export function getProfessionalCommunicationCatalog(): ProfessionalCommunicationCatalogEntry[] {
  return professionalCommunicationScenarios.map(toCatalogEntry);
}

export function buildProfessionalCommunicationGame({
  id,
  title = professionalCommunicationDefinition.title,
  description = professionalCommunicationDefinition.description,
  scenarios,
}: BuildProfessionalCommunicationGameOptions): BuiltMatchGame {
  return {
    id,
    type: professionalCommunicationDefinition.type,
    title,
    description,
    roundIds: scenarios.map((scenario) => scenario.id),
    roundCount: scenarios.length,
    maxScore: scenarios.length * (1000 + PROFESSIONAL_COMMUNICATION_SPEED_BONUS),
    active: professionalCommunicationDefinition.active,
  };
}

export function validateProfessionalCommunicationScenario(scenario: ProfessionalCommunicationScenario) {
  if (!scenario.id || !scenario.topic || !scenario.title || !scenario.scenario || !scenario.learningPoint) {
    throw new Error(`Cenário de comunicação incompleto: ${scenario.id}`);
  }

  if (scenario.options.length < 3 || scenario.options.length > 4) {
    throw new Error(`Cenário de comunicação precisa ter 3 ou 4 opções: ${scenario.id}`);
  }

  const optionIds = new Set(scenario.options.map((option) => option.id));

  if (optionIds.size !== scenario.options.length) {
    throw new Error(`Cenário de comunicação tem opções duplicadas: ${scenario.id}`);
  }

  if (!optionIds.has(scenario.bestOptionId)) {
    throw new Error(`Cenário de comunicação sem melhor opção válida: ${scenario.id}`);
  }

  if (!scenario.options.some((option) => option.quality === 'best')) {
    throw new Error(`Cenário de comunicação precisa ter uma opção best: ${scenario.id}`);
  }
}

export function getPublicProfessionalCommunicationScenario(
  scenario: ProfessionalCommunicationScenario,
): PublicProfessionalCommunicationScenario {
  return {
    id: scenario.id,
    topic: scenario.topic,
    title: scenario.title,
    scenario: scenario.scenario,
    options: scenario.options.map(({ id, text }) => ({ id, text })),
  };
}

export function normalizeProfessionalCommunicationAnswer(
  scenario: ProfessionalCommunicationScenario,
  payload: LiveAnswerPayload,
) {
  const optionId = payload.optionId ?? payload.optionIds?.[0];

  if (!optionId) {
    throw new Error('Escolha uma resposta para este cenário.');
  }

  const option = scenario.options.find((candidate) => candidate.id === optionId);

  if (!option) {
    throw new Error('Opção inválida para este cenário.');
  }

  return {
    option,
    optionIds: [option.id],
  };
}

export function calculateProfessionalCommunicationScore({
  quality,
  submittedAt,
  startedAt,
  limitMs,
}: {
  quality: CommunicationOptionQuality;
  submittedAt: number;
  startedAt: number;
  limitMs: number;
}) {
  const basePoints = qualityBasePoints[quality] ?? 0;

  if (basePoints <= 0 || limitMs <= 0) {
    return 0;
  }

  const responseMs = Math.max(0, submittedAt - startedAt);
  const speedFactor = Math.max(0, 1 - responseMs / limitMs);

  return basePoints + Math.round(speedFactor * PROFESSIONAL_COMMUNICATION_SPEED_BONUS);
}

export function createProfessionalCommunicationReveal(
  scenario: ProfessionalCommunicationScenario,
  answers: PlayerAnswer[],
): ProfessionalCommunicationReveal {
  const totalResponses = answers.length;

  return {
    bestOptionId: scenario.bestOptionId,
    learningPoint: scenario.learningPoint,
    totalResponses,
    options: scenario.options.map((option) => {
      const count = answers.filter((answer) => answer.optionIds[0] === option.id).length;

      return {
        optionId: option.id,
        text: option.text,
        quality: option.quality,
        basePoints: qualityBasePoints[option.quality] ?? 0,
        feedback: option.feedback,
        count,
        percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0,
      };
    }),
  };
}
