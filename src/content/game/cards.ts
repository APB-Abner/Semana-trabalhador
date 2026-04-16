import type { MemoryCardPair, MemoryDifficulty } from '../../shared/types/learning';

export const memoryGameCards: MemoryCardPair[] = [
  { id: 'estoquista', label: '📦 Estoquista' },
  { id: 'sac', label: '💬 Atendente de SAC' },
  { id: 'administrativo', label: '🧑‍💼 Assistente Administrativo' },
  { id: 'cozinha', label: '🧑‍🍳 Auxiliar de Cozinha' },
  { id: 'suporte', label: '👨‍💻 Suporte Técnico' },
  { id: 'manutencao', label: '🧑‍🔧 Auxiliar de Manutenção' },
  { id: 'logistica', label: '🚚 Apoio em Logística' },
  { id: 'marketing', label: '📣 Assistente de Marketing' },
];

export const memoryGameDifficulties: Record<MemoryDifficulty['id'], MemoryDifficulty> = {
  facil: {
    id: 'facil',
    label: 'Fácil',
    pairCount: 4,
    timeLimit: 75,
    previewSeconds: 3,
  },
  medio: {
    id: 'medio',
    label: 'Médio',
    pairCount: 6,
    timeLimit: 60,
    previewSeconds: 3,
  },
  dificil: {
    id: 'dificil',
    label: 'Difícil',
    pairCount: 8,
    timeLimit: 45,
    previewSeconds: 2,
  },
};
