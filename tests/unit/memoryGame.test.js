import { describe, expect, it } from 'vitest';
import calculateMemoryScore from '../../src/features/memory-game/lib/calculateMemoryScore.js';

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
