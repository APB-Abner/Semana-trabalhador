import { describe, expect, it } from 'vitest';
import { memoryGameCards } from '../../src/content/game/cards.ts';
import calculateMemoryScore from '../../src/features/memory-game/lib/calculateMemoryScore.js';
import createMemoryDeck from '../../src/features/memory-game/lib/createMemoryDeck.ts';

describe('calculateMemoryScore', () => {
  it('returns a proportional score', () => {
    expect(calculateMemoryScore(6, 12)).toBe(5);
  });

  it('returns 10 for a complete deck', () => {
    expect(calculateMemoryScore(12, 12)).toBe(10);
  });

  it('returns 0 when there are no cards', () => {
    expect(calculateMemoryScore(0, 0)).toBe(0);
  });
});

describe('createMemoryDeck', () => {
  it('creates a duplicated deck from the selected pairs', () => {
    const deck = createMemoryDeck(memoryGameCards, 4);
    const ids = deck.map((card) => card.id);
    const instanceIds = deck.map((card) => card.instanceId);

    expect(deck).toHaveLength(8);
    expect(new Set(instanceIds)).toHaveLength(8);
    memoryGameCards.slice(0, 4).forEach((card) => {
      expect(ids.filter((id) => id === card.id)).toHaveLength(2);
    });
  });
});
