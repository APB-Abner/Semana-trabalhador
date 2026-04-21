import type { LiveQuestion, MatchGame, MiniGameType, WorkSituation } from '../../../types/realtime.ts';

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

export type BuildWorkSituationGameOptions = {
  id: string;
  title?: string;
  description?: string;
  situations: WorkSituation[];
};

export type BuiltMatchGame = MatchGame;
