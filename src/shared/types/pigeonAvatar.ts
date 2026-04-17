export const PIGEON_ACCESSORY_SLOTS = [
  'head',
  'face',
  'neck',
  'body',
  'hand',
  'extra',
] as const;

export type PigeonAccessorySlot = typeof PIGEON_ACCESSORY_SLOTS[number];

export type PigeonBaseId = 'official-pigeon';

export type PigeonExpressionId =
  | 'bright'
  | 'happy'
  | 'focused'
  | 'wink'
  | 'sleepy';

export type PigeonPatternId =
  | 'solid'
  | 'wing-bars'
  | 'speckles'
  | 'chest-dots';

export type PigeonPresetId =
  | 'gamer'
  | 'professor-office'
  | 'fashion-pop'
  | 'pirate'
  | 'explorer'
  | 'gala-social';

export type PigeonAccessoryId = string;

export type PigeonAvatarPalette = {
  primary: string;
  secondary: string;
  chest: string;
  beak: string;
  accent: string;
};

export type EquippedPigeonAccessories = Partial<Record<PigeonAccessorySlot, PigeonAccessoryId | null>>;

export type PigeonAvatarDetails = {
  blush: boolean;
};

export type PigeonUnlockMetadata = {
  unlockedAccessoryIds?: PigeonAccessoryId[];
  unlockedPresetIds?: PigeonPresetId[];
  source?: 'default' | 'progression' | 'event' | 'admin';
};

export type PigeonAvatarState = {
  baseId: PigeonBaseId;
  palette: PigeonAvatarPalette;
  patternId: PigeonPatternId;
  expressionId: PigeonExpressionId;
  equipped: EquippedPigeonAccessories;
  selectedPresetId?: PigeonPresetId | null;
  unlocks?: PigeonUnlockMetadata;
  details: PigeonAvatarDetails;
};

export type PigeonBaseDefinition = {
  id: PigeonBaseId;
  name: string;
  viewBox: string;
  defaultPalette: PigeonAvatarPalette;
  defaultExpressionId: PigeonExpressionId;
  defaultPatternId: PigeonPatternId;
  designRules: string[];
  slotAnchors: Record<PigeonAccessorySlot, { x: number; y: number; width: number; height: number }>;
};

export type PigeonAccessoryDefinition = {
  id: PigeonAccessoryId;
  slot: PigeonAccessorySlot;
  name: string;
  label: string;
  description: string;
  visualWeight: 'light' | 'medium' | 'strong';
  conflictsWith?: PigeonAccessoryId[];
  tags: string[];
};

export type PigeonPresetDefinition = {
  id: PigeonPresetId;
  name: string;
  label: string;
  description: string;
  palette: PigeonAvatarPalette;
  patternId: PigeonPatternId;
  expressionId: PigeonExpressionId;
  equipped: EquippedPigeonAccessories;
  details?: Partial<PigeonAvatarDetails>;
};
