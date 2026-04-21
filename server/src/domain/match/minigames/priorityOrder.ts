import type {
  LiveAnswerPayload,
  PlayerAnswer,
  PriorityOrderAnswerSummary,
  PriorityOrderScenario,
  PriorityOrderReveal,
} from '../../../types/realtime.ts';
import type { BuildPriorityOrderGameOptions, BuiltMatchGame, MiniGameDefinition } from './types.ts';

export const priorityOrderDefinition: MiniGameDefinition = {
  type: 'priority_order',
  title: 'Ordem de Prioridade',
  description: 'Ordene acoes profissionais da mais urgente para a menos prioritaria.',
  active: true,
};

export const PRIORITY_ORDER_ROUNDS_PER_MATCH = 3;
export const PRIORITY_ORDER_SPEED_BONUS = 200;
export const PRIORITY_ORDER_MAX_BASE_POINTS = 1_000;

export function buildPriorityOrderGame({
  id,
  title = priorityOrderDefinition.title,
  description = priorityOrderDefinition.description,
  scenarios,
}: BuildPriorityOrderGameOptions): BuiltMatchGame {
  return {
    id,
    type: priorityOrderDefinition.type,
    title,
    description,
    roundIds: scenarios.map((scenario) => scenario.id),
    roundCount: scenarios.length,
    maxScore: scenarios.length * (PRIORITY_ORDER_MAX_BASE_POINTS + PRIORITY_ORDER_SPEED_BONUS),
    active: priorityOrderDefinition.active,
  };
}

export function getPriorityOrderMaxDistance(itemCount: number) {
  return Math.floor((itemCount * itemCount) / 2);
}

export function validatePriorityOrderScenario(scenario: PriorityOrderScenario) {
  if (!scenario.id || !scenario.title || !scenario.topic || !scenario.scenario || !scenario.explanation) {
    throw new Error('Cenario de ordem de prioridade incompleto no catalogo.');
  }

  if (scenario.items.length < 3 || scenario.items.length > 4) {
    throw new Error(`Cenario de ordem de prioridade precisa ter 3 ou 4 itens: ${scenario.id}`);
  }

  const itemIds = new Set(scenario.items.map((item) => item.id));
  if (itemIds.size !== scenario.items.length) {
    throw new Error(`Cenario de ordem de prioridade tem itens duplicados: ${scenario.id}`);
  }

  const idealPositions = new Set(scenario.items.map((item) => item.idealPosition));
  if (idealPositions.size !== scenario.items.length) {
    throw new Error(`Cenario de ordem de prioridade tem posicoes ideais duplicadas: ${scenario.id}`);
  }

  for (let position = 1; position <= scenario.items.length; position += 1) {
    if (!idealPositions.has(position)) {
      throw new Error(`Cenario de ordem de prioridade precisa usar posicoes de 1 a ${scenario.items.length}: ${scenario.id}`);
    }
  }
}

export function getPublicPriorityOrderScenario(
  scenario: PriorityOrderScenario,
  publicItems: Array<Pick<PriorityOrderScenario['items'][number], 'id' | 'text'>>,
) {
  return {
    id: scenario.id,
    title: scenario.title,
    topic: scenario.topic,
    scenario: scenario.scenario,
    items: publicItems,
  };
}

export function normalizePriorityOrderAnswer(scenario: PriorityOrderScenario, payload: LiveAnswerPayload) {
  const optionIds = payload.optionIds ?? [];
  const expectedIds = new Set(scenario.items.map((item) => item.id));
  const submittedIds = new Set(optionIds);

  if (optionIds.length !== scenario.items.length) {
    throw new Error('Ordene todos os itens antes de confirmar.');
  }

  if (submittedIds.size !== optionIds.length) {
    throw new Error('A ordem enviada tem itens repetidos.');
  }

  const hasOnlyScenarioItems = optionIds.every((optionId) => expectedIds.has(optionId));
  if (!hasOnlyScenarioItems || submittedIds.size !== expectedIds.size) {
    throw new Error('A ordem enviada precisa conter exatamente os itens do cenario.');
  }

  return {
    optionIds,
  };
}

export function calculatePriorityOrderScore({
  optionIds,
  scenario,
  responseMs,
  limitMs,
}: {
  optionIds: string[];
  scenario: PriorityOrderScenario;
  responseMs: number;
  limitMs: number;
}): PriorityOrderAnswerSummary {
  const idealPositionsById = new Map(scenario.items.map((item) => [item.id, item.idealPosition]));
  const maxDistance = getPriorityOrderMaxDistance(scenario.items.length);
  const totalDistance = optionIds.reduce((sum, optionId, index) => {
    const submittedPosition = index + 1;
    const idealPosition = idealPositionsById.get(optionId) ?? submittedPosition;
    return sum + Math.abs(submittedPosition - idealPosition);
  }, 0);
  const correctPositionCount = optionIds.filter((optionId, index) => idealPositionsById.get(optionId) === index + 1).length;
  const qualityFactor = maxDistance > 0 ? Math.max(0, 1 - totalDistance / maxDistance) : 1;
  const basePoints = Math.round(PRIORITY_ORDER_MAX_BASE_POINTS * qualityFactor);
  const speedFactor = Math.max(0, 1 - Math.max(0, responseMs) / limitMs);
  const speedBonus = basePoints > 0 ? Math.round(speedFactor * PRIORITY_ORDER_SPEED_BONUS) : 0;

  return {
    optionIds,
    correctPositionCount,
    totalDistance,
    maxDistance,
    basePoints,
    speedBonus,
    points: basePoints + speedBonus,
  };
}

export function createPriorityOrderReveal(
  scenario: PriorityOrderScenario,
  answers: PlayerAnswer[],
  limitMs: number,
): PriorityOrderReveal {
  return {
    explanation: scenario.explanation,
    idealOrder: [...scenario.items]
      .sort((a, b) => a.idealPosition - b.idealPosition)
      .map((item) => ({
        itemId: item.id,
        text: item.text,
        idealPosition: item.idealPosition,
        explanation: item.explanation,
      })),
    totalResponses: answers.length,
    answerSummaries: answers.map((answer) =>
      calculatePriorityOrderScore({
        optionIds: answer.optionIds,
        scenario,
        responseMs: answer.responseMs,
        limitMs,
      }),
    ),
  };
}
