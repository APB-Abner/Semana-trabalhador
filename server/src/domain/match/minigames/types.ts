import type {
  LiveQuestion,
  MatchGame,
  MiniGameType,
  PriorityOrderScenario,
  WorkSituation,
} from '../../../types/realtime.ts';
import type { CanOrCantItem } from '../../../../../src/content/games/canOrCant.ts';
import type { FindTheMistakeCase } from '../../../../../src/content/games/findTheMistake.ts';
import type { ProfessionalCommunicationScenario } from '../../../../../src/content/games/professionalCommunication.ts';

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

export type BuildPriorityOrderGameOptions = {
  id: string;
  title?: string;
  description?: string;
  scenarios: PriorityOrderScenario[];
};

export type BuildCanOrCantGameOptions = {
  id: string;
  title?: string;
  description?: string;
  items: CanOrCantItem[];
};

export type BuildProfessionalCommunicationGameOptions = {
  id: string;
  title?: string;
  description?: string;
  scenarios: ProfessionalCommunicationScenario[];
};

export type BuildFindTheMistakeGameOptions = {
  id: string;
  title?: string;
  description?: string;
  cases: FindTheMistakeCase[];
};

export type BuiltMatchGame = MatchGame;
