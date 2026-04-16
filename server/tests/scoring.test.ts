import { describe, expect, it } from 'vitest';
import { calculateLiveScore } from '../src/domain/scoring.ts';

describe('calculateLiveScore', () => {
  it('returns zero for wrong answers', () => {
    expect(calculateLiveScore({
      isCorrect: false,
      startedAt: 1_000,
      submittedAt: 1_100,
      limitMs: 20_000,
    })).toBe(0);
  });

  it('rewards a fast correct answer close to the maximum', () => {
    expect(calculateLiveScore({
      isCorrect: true,
      startedAt: 1_000,
      submittedAt: 1_000,
      limitMs: 20_000,
    })).toBe(1500);
  });

  it('keeps a slow correct answer at the base score', () => {
    expect(calculateLiveScore({
      isCorrect: true,
      startedAt: 1_000,
      submittedAt: 21_000,
      limitMs: 20_000,
    })).toBe(700);
  });

  it('clamps submissions beyond the limit to the base score', () => {
    expect(calculateLiveScore({
      isCorrect: true,
      startedAt: 1_000,
      submittedAt: 40_000,
      limitMs: 20_000,
    })).toBe(700);
  });
});
