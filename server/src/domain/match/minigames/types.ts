import type { LiveQuestion, MatchGame, MiniGameType } from '../../../types/realtime.ts';

export type MiniGameDefinition = {
  type: MiniGameType;
  title: string;
  description: string;
  active: boolean;
};

export type BuildMatchGameOptions = {
  id: string;
  title?: string;
  description?: string;
  questions: LiveQuestion[];
};

export type BuiltMatchGame = MatchGame;

