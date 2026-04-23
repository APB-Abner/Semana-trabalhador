import type {
  LiveQuestion,
  MatchGame,
  MatchRoundInternal,
  MiniGameType,
  PriorityOrderScenario,
  WorkSituation,
} from '../../types/realtime.ts';
import type { CanOrCantItem } from '../../../../src/content/games/canOrCant.ts';
import type { FindTheMistakeCase } from '../../../../src/content/games/findTheMistake.ts';
import type { ProfessionalCommunicationScenario } from '../../../../src/content/games/professionalCommunication.ts';
import {
  buildCanOrCantGame,
  canOrCantDefinition,
  CAN_OR_CANT_ROUNDS_PER_MATCH,
  getCanOrCantCatalog,
  validateCanOrCantItem,
} from './minigames/canOrCant.ts';
import {
  buildFindTheMistakeGame,
  FIND_THE_MISTAKE_ROUNDS_PER_MATCH,
  findTheMistakeDefinition,
  getFindTheMistakeCatalog,
  validateFindTheMistakeCase,
} from './minigames/findTheMistake.ts';
import {
  buildPriorityOrderGame,
  PRIORITY_ORDER_ROUNDS_PER_MATCH,
  priorityOrderDefinition,
  validatePriorityOrderScenario,
} from './minigames/priorityOrder.ts';
import { getPriorityOrderCatalog } from './minigames/priorityOrderCatalog.ts';
import { buildQuickQuizGame, quickQuizDefinition } from './minigames/quickQuiz.ts';
import {
  buildProfessionalCommunicationGame,
  PROFESSIONAL_COMMUNICATION_ROUNDS_PER_MATCH,
  professionalCommunicationDefinition,
  getProfessionalCommunicationCatalog,
  validateProfessionalCommunicationScenario,
} from './minigames/professionalCommunication.ts';
import {
  buildWorkSituationGame,
  WORK_SITUATION_ROUNDS_PER_MATCH,
  validateWorkSituation,
  workSituationDefinition,
} from './minigames/workSituation.ts';
import { getWorkSituationCatalog } from './minigames/workSituationCatalog.ts';
import {
  orderContentForOpeningVariety,
  selectDiverseContent,
  type MatchContentMetadata,
} from './contentDiversity.ts';

export const MATCH_GAME_COUNT = 3;

const QUICK_QUIZ_ROUNDS_PER_MATCH = 4;
const QUICK_ONLY_SIZES = [4, 3, 3];

export const matchMiniGameDefinitions = [
  quickQuizDefinition,
  workSituationDefinition,
  priorityOrderDefinition,
  canOrCantDefinition,
  professionalCommunicationDefinition,
  findTheMistakeDefinition,
] as const;

export type MatchTemplateId =
  | 'classic_decision_order'
  | 'quiz_posture_communication'
  | 'quiz_decision_mistakes'
  | 'posture_communication_order'
  | 'communication_mistakes_quiz'
  | 'posture_situation_order';

export type MatchTemplate = {
  id: MatchTemplateId;
  games: [MiniGameType, MiniGameType, MiniGameType];
};

export const MATCH_TEMPLATES: MatchTemplate[] = [
  { id: 'classic_decision_order', games: ['quick_quiz', 'work_situation', 'priority_order'] },
  { id: 'quiz_posture_communication', games: ['quick_quiz', 'can_or_cant', 'professional_communication'] },
  { id: 'quiz_decision_mistakes', games: ['quick_quiz', 'work_situation', 'find_the_mistake'] },
  { id: 'posture_communication_order', games: ['can_or_cant', 'professional_communication', 'priority_order'] },
  { id: 'communication_mistakes_quiz', games: ['professional_communication', 'find_the_mistake', 'quick_quiz'] },
  { id: 'posture_situation_order', games: ['can_or_cant', 'work_situation', 'priority_order'] },
];

export type MatchSessionSelectionOptions = {
  questions: LiveQuestion[];
  workSituations?: WorkSituation[];
  priorityOrderScenarios?: PriorityOrderScenario[];
  canOrCantItems?: CanOrCantItem[];
  professionalCommunicationScenarios?: ProfessionalCommunicationScenario[];
  findTheMistakeCases?: FindTheMistakeCase[];
  matchTemplateId?: string;
  randomizeTemplate?: boolean;
  random?: () => number;
};

export type MatchSessionSelection = {
  selectedGames: MatchGame[];
  rounds: MatchRoundInternal[];
};

function toQuickQuizRounds(questions: LiveQuestion[]): MatchRoundInternal[] {
  return questions.map((question) => ({
    id: question.id,
    gameType: 'quick_quiz',
    question,
  }));
}

function toWorkSituationRounds(situations: WorkSituation[]): MatchRoundInternal[] {
  return situations.map((situation) => ({
    id: situation.id,
    gameType: 'work_situation',
    situation,
  }));
}

function shufflePriorityOrderItems(scenario: PriorityOrderScenario) {
  return [...scenario.items]
    .sort(() => Math.random() - 0.5)
    .map(({ id, text }) => ({ id, text }));
}

function toPriorityOrderRounds(scenarios: PriorityOrderScenario[]): MatchRoundInternal[] {
  return scenarios.map((scenario) => ({
    id: scenario.id,
    gameType: 'priority_order',
    scenario,
    publicItems: shufflePriorityOrderItems(scenario),
  }));
}

function toCanOrCantRounds(items: CanOrCantItem[]): MatchRoundInternal[] {
  return items.map((item) => ({
    id: item.id,
    gameType: 'can_or_cant',
    item,
  }));
}

function toProfessionalCommunicationRounds(scenarios: ProfessionalCommunicationScenario[]): MatchRoundInternal[] {
  return scenarios.map((scenario) => ({
    id: scenario.id,
    gameType: 'professional_communication',
    scenario,
  }));
}

function toFindTheMistakeRounds(cases: FindTheMistakeCase[]): MatchRoundInternal[] {
  return cases.map((caseItem) => ({
    id: caseItem.id,
    gameType: 'find_the_mistake',
    caseItem,
  }));
}

function splitQuestionsForQuickOnlyGames(questions: LiveQuestion[]) {
  const chunks: LiveQuestion[][] = [];
  let cursor = 0;

  QUICK_ONLY_SIZES.forEach((size) => {
    const chunk = questions.slice(cursor, cursor + size);
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    cursor += size;
  });

  if (cursor < questions.length && chunks.length > 0) {
    chunks[chunks.length - 1].push(...questions.slice(cursor));
  }

  return chunks;
}

function shuffleWorkSituations(situations: WorkSituation[]) {
  return [...situations].sort(() => Math.random() - 0.5);
}

function shufflePriorityOrderScenarios(scenarios: PriorityOrderScenario[]) {
  return [...scenarios].sort(() => Math.random() - 0.5);
}

function shuffleCanOrCantItems(items: CanOrCantItem[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function shuffleProfessionalCommunicationScenarios(scenarios: ProfessionalCommunicationScenario[]) {
  return [...scenarios].sort(() => Math.random() - 0.5);
}

function shuffleFindTheMistakeCases(cases: FindTheMistakeCase[]) {
  return [...cases].sort(() => Math.random() - 0.5);
}

function isQuickQuizCompetitiveQuestion(question: LiveQuestion) {
  return question.type === 'multiple_choice'
    || question.type === 'true_false'
    || question.type === 'multiple_select';
}

function selectQuickQuizQuestionsForMatch(questions: LiveQuestion[], usedItems: MatchContentMetadata[] = []) {
  const competitiveQuestions = questions.filter(isQuickQuizCompetitiveQuestion);
  const sourceQuestions = competitiveQuestions.length >= QUICK_QUIZ_ROUNDS_PER_MATCH
    ? competitiveQuestions
    : questions;

  return orderContentForOpeningVariety(
    selectDiverseContent({
      items: sourceQuestions,
      count: QUICK_QUIZ_ROUNDS_PER_MATCH,
      usedItems,
    }),
  );
}

function selectWorkSituationsForMatch(situations: WorkSituation[], usedItems: MatchContentMetadata[]) {
  return selectDiverseContent({
    items: shuffleWorkSituations(situations),
    count: WORK_SITUATION_ROUNDS_PER_MATCH,
    usedItems,
  });
}

function selectPriorityOrderScenariosForMatch(
  scenarios: PriorityOrderScenario[],
  usedItems: MatchContentMetadata[],
) {
  return selectDiverseContent({
    items: shufflePriorityOrderScenarios(scenarios),
    count: PRIORITY_ORDER_ROUNDS_PER_MATCH,
    usedItems,
  });
}

function selectCanOrCantItemsForMatch(items: CanOrCantItem[], usedItems: MatchContentMetadata[]) {
  return selectDiverseContent({
    items: shuffleCanOrCantItems(items),
    count: CAN_OR_CANT_ROUNDS_PER_MATCH,
    usedItems,
  });
}

function selectProfessionalCommunicationScenariosForMatch(
  scenarios: ProfessionalCommunicationScenario[],
  usedItems: MatchContentMetadata[],
) {
  return selectDiverseContent({
    items: shuffleProfessionalCommunicationScenarios(scenarios),
    count: PROFESSIONAL_COMMUNICATION_ROUNDS_PER_MATCH,
    usedItems,
  });
}

function selectFindTheMistakeCasesForMatch(cases: FindTheMistakeCase[], usedItems: MatchContentMetadata[]) {
  return selectDiverseContent({
    items: shuffleFindTheMistakeCases(cases),
    count: FIND_THE_MISTAKE_ROUNDS_PER_MATCH,
    usedItems,
  });
}

function selectQuickOnlySession(questions: LiveQuestion[]): MatchSessionSelection {
  const selectedGames = splitQuestionsForQuickOnlyGames(questions).map((chunk, index) =>
    buildQuickQuizGame({
      id: `quick_quiz_${index + 1}`,
      title: `${quickQuizDefinition.title} ${index + 1}`,
      description: index === 0
        ? quickQuizDefinition.description
        : 'Novo bloco de rodadas rápidas mantendo o placar acumulado.',
      questions: chunk,
    }),
  );

  return {
    selectedGames,
    rounds: selectedGames.flatMap((game) => {
      const questionsById = new Map(questions.map((question) => [question.id, question]));
      return game.roundIds
        .map((roundId) => questionsById.get(roundId))
        .filter((question): question is LiveQuestion => Boolean(question))
        .map((question) => ({ id: question.id, gameType: 'quick_quiz', question }));
    }),
  };
}

type ContentPools = {
  questions: LiveQuestion[];
  workSituations: WorkSituation[];
  priorityOrderScenarios: PriorityOrderScenario[];
  canOrCantItems: CanOrCantItem[];
  professionalCommunicationScenarios: ProfessionalCommunicationScenario[];
  findTheMistakeCases: FindTheMistakeCase[];
};

function getAvailableCount(gameType: MiniGameType, pools: ContentPools) {
  if (gameType === 'quick_quiz') {
    return pools.questions.filter(isQuickQuizCompetitiveQuestion).length;
  }

  if (gameType === 'work_situation') {
    return pools.workSituations.length;
  }

  if (gameType === 'priority_order') {
    return pools.priorityOrderScenarios.length;
  }

  if (gameType === 'can_or_cant') {
    return pools.canOrCantItems.length;
  }

  if (gameType === 'professional_communication') {
    return pools.professionalCommunicationScenarios.length;
  }

  return pools.findTheMistakeCases.length;
}

function getRequiredCount(gameType: MiniGameType) {
  if (gameType === 'quick_quiz') {
    return QUICK_QUIZ_ROUNDS_PER_MATCH;
  }

  if (gameType === 'work_situation') {
    return WORK_SITUATION_ROUNDS_PER_MATCH;
  }

  if (gameType === 'priority_order') {
    return PRIORITY_ORDER_ROUNDS_PER_MATCH;
  }

  if (gameType === 'can_or_cant') {
    return CAN_OR_CANT_ROUNDS_PER_MATCH;
  }

  if (gameType === 'professional_communication') {
    return PROFESSIONAL_COMMUNICATION_ROUNDS_PER_MATCH;
  }

  return FIND_THE_MISTAKE_ROUNDS_PER_MATCH;
}

function canUseTemplate(template: MatchTemplate, pools: ContentPools) {
  return template.games.every((gameType) => getAvailableCount(gameType, pools) >= getRequiredCount(gameType));
}

function selectTemplate({
  pools,
  matchTemplateId,
  randomizeTemplate = false,
  random = Math.random,
}: {
  pools: ContentPools;
  matchTemplateId?: string;
  randomizeTemplate?: boolean;
  random?: () => number;
}) {
  const validTemplates = MATCH_TEMPLATES.filter((template) => canUseTemplate(template, pools));

  if (!validTemplates.length) {
    return null;
  }

  if (matchTemplateId) {
    return validTemplates.find((template) => template.id === matchTemplateId)
      ?? validTemplates.find((template) => template.games.join(',') === matchTemplateId)
      ?? validTemplates[0];
  }

  if (!randomizeTemplate) {
    return canUseTemplate(MATCH_TEMPLATES[0], pools) ? MATCH_TEMPLATES[0] : null;
  }

  return validTemplates[Math.floor(random() * validTemplates.length)] ?? validTemplates[0];
}

function buildSelectionForGame({
  gameType,
  index,
  pools,
  usedItems,
}: {
  gameType: MiniGameType;
  index: number;
  pools: ContentPools;
  usedItems: MatchContentMetadata[];
}): { game: MatchGame; rounds: MatchRoundInternal[]; selectedItems: MatchContentMetadata[] } {
  if (gameType === 'quick_quiz') {
    const questions = selectQuickQuizQuestionsForMatch(pools.questions, usedItems);
    return {
      game: buildQuickQuizGame({
        id: `quick_quiz_${index + 1}`,
        title: quickQuizDefinition.title,
        description: quickQuizDefinition.description,
        questions,
      }),
      rounds: toQuickQuizRounds(questions),
      selectedItems: questions,
    };
  }

  if (gameType === 'work_situation') {
    const situations = selectWorkSituationsForMatch(pools.workSituations, usedItems);
    return {
      game: buildWorkSituationGame({
        id: `work_situation_${index + 1}`,
        title: workSituationDefinition.title,
        description: workSituationDefinition.description,
        situations,
      }),
      rounds: toWorkSituationRounds(situations),
      selectedItems: situations,
    };
  }

  if (gameType === 'priority_order') {
    const scenarios = selectPriorityOrderScenariosForMatch(pools.priorityOrderScenarios, usedItems);
    return {
      game: buildPriorityOrderGame({
        id: `priority_order_${index + 1}`,
        title: priorityOrderDefinition.title,
        description: priorityOrderDefinition.description,
        scenarios,
      }),
      rounds: toPriorityOrderRounds(scenarios),
      selectedItems: scenarios,
    };
  }

  if (gameType === 'can_or_cant') {
    const items = selectCanOrCantItemsForMatch(pools.canOrCantItems, usedItems);
    return {
      game: buildCanOrCantGame({
        id: `can_or_cant_${index + 1}`,
        title: canOrCantDefinition.title,
        description: canOrCantDefinition.description,
        items,
      }),
      rounds: toCanOrCantRounds(items),
      selectedItems: items,
    };
  }

  if (gameType === 'professional_communication') {
    const scenarios = selectProfessionalCommunicationScenariosForMatch(
      pools.professionalCommunicationScenarios,
      usedItems,
    );
    return {
      game: buildProfessionalCommunicationGame({
        id: `professional_communication_${index + 1}`,
        title: professionalCommunicationDefinition.title,
        description: professionalCommunicationDefinition.description,
        scenarios,
      }),
      rounds: toProfessionalCommunicationRounds(scenarios),
      selectedItems: scenarios,
    };
  }

  const cases = selectFindTheMistakeCasesForMatch(pools.findTheMistakeCases, usedItems);
  return {
    game: buildFindTheMistakeGame({
      id: `find_the_mistake_${index + 1}`,
      title: findTheMistakeDefinition.title,
      description: findTheMistakeDefinition.description,
      cases,
    }),
    rounds: toFindTheMistakeRounds(cases),
    selectedItems: cases,
  };
}

export function selectMatchSession({
  questions,
  workSituations = getWorkSituationCatalog(),
  priorityOrderScenarios = getPriorityOrderCatalog(),
  canOrCantItems = getCanOrCantCatalog(),
  professionalCommunicationScenarios = getProfessionalCommunicationCatalog(),
  findTheMistakeCases = getFindTheMistakeCatalog(),
  matchTemplateId,
  randomizeTemplate = false,
  random = Math.random,
}: MatchSessionSelectionOptions): MatchSessionSelection {
  if (!questions.length) {
    throw new Error('Não há perguntas para montar o match online.');
  }

  const pools: ContentPools = {
    questions,
    workSituations,
    priorityOrderScenarios,
    canOrCantItems,
    professionalCommunicationScenarios,
    findTheMistakeCases,
  };
  const selectedTemplate = selectTemplate({
    pools,
    matchTemplateId,
    randomizeTemplate,
    random,
  });

  if (!selectedTemplate) {
    return selectQuickOnlySession(questions);
  }

  workSituations.forEach(validateWorkSituation);
  priorityOrderScenarios.forEach(validatePriorityOrderScenario);
  canOrCantItems.forEach(validateCanOrCantItem);
  professionalCommunicationScenarios.forEach(validateProfessionalCommunicationScenario);
  findTheMistakeCases.forEach(validateFindTheMistakeCase);

  const selectedGames: MatchGame[] = [];
  const rounds: MatchRoundInternal[] = [];
  const usedItems: MatchContentMetadata[] = [];

  selectedTemplate.games.forEach((gameType, index) => {
    const selection = buildSelectionForGame({
      gameType,
      index,
      pools,
      usedItems,
    });

    selectedGames.push(selection.game);
    rounds.push(...selection.rounds);
    usedItems.push(...selection.selectedItems);
  });

  return {
    selectedGames,
    rounds,
  };
}

export function selectMatchGamesForSession(questions: LiveQuestion[]): MatchGame[] {
  return selectMatchSession({ questions }).selectedGames;
}

export function findGameIndexByRoundId(selectedGames: MatchGame[], roundId: string) {
  return selectedGames.findIndex((game) => game.roundIds.includes(roundId));
}

export function getCurrentGameForRoundIndex(
  selectedGames: MatchGame[],
  rounds: Array<{ id: string }>,
  roundIndex: number,
) {
  const roundId = rounds[roundIndex]?.id;
  if (!roundId) {
    return {
      currentGame: null,
      currentGameIndex: -1,
      currentGameRoundIndex: -1,
    };
  }

  const currentGameIndex = findGameIndexByRoundId(selectedGames, roundId);
  const currentGame = currentGameIndex >= 0 ? selectedGames[currentGameIndex] : null;

  return {
    currentGame,
    currentGameIndex,
    currentGameRoundIndex: currentGame ? currentGame.roundIds.indexOf(roundId) : -1,
  };
}

export function isFirstRoundOfGame(selectedGames: MatchGame[], roundId: string) {
  return selectedGames.some((game) => game.roundIds[0] === roundId);
}
