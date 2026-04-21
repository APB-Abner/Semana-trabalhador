import type { BuiltMatchGame, BuildMatchGameOptions, MiniGameDefinition } from './types.ts';
import { LIVE_SCORE_MAX_POINTS } from '../../scoring.ts';

export const quickQuizDefinition: MiniGameDefinition = {
  type: 'quick_quiz',
  title: 'Quiz Relâmpago',
  description: 'Rodadas rápidas com perguntas objetivas e participativas de leitura imediata.',
  active: true,
};

export function buildQuickQuizGame({
  id,
  title = quickQuizDefinition.title,
  description = quickQuizDefinition.description,
  questions,
}: BuildMatchGameOptions): BuiltMatchGame {
  return {
    id,
    type: quickQuizDefinition.type,
    title,
    description,
    roundIds: questions.map((question) => question.id),
    roundCount: questions.length,
    maxScore: questions.length * LIVE_SCORE_MAX_POINTS,
    active: quickQuizDefinition.active,
  };
}
