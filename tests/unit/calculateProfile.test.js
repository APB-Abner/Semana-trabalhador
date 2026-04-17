import { describe, expect, it } from 'vitest';
import calculateProfile from '../../src/features/vocational-test/lib/calculateProfile.ts';
import { vocationalResults } from '../../src/content/vocational/results.ts';

describe('calculateProfile', () => {
  it('returns top 3 ranked profiles with dimension-based percentages', () => {
    const result = calculateProfile(
      [
        { id: 'a', texto: 'A', weights: { analitico: 3, pratico: 1 } },
        { id: 'b', texto: 'B', weights: { analitico: 2, organizacional: 2 } },
        { id: 'c', texto: 'C', weights: { analitico: 2, pratico: 2 } },
      ],
      vocationalResults,
    );

    expect(result.primary.area).toBe('tecnologia');
    expect(result.ranking).toHaveLength(3);
    expect(result.dimensions[0].id).toBe('analitico');
    expect(result.profileBlend.length).toBeGreaterThan(0);
  });

  it('keeps result definition order as tie breaker', () => {
    const result = calculateProfile(
      [
        { id: 'a', texto: 'A', weights: { social: 2 } },
        { id: 'b', texto: 'B', weights: { criativo: 2 } },
      ],
      vocationalResults,
    );

    expect(result.ranking[0].area).toBe('artes');
    expect(result.ranking[1].area).toBe('comunicacao');
  });

  it('returns empty ranking when there are no answers', () => {
    const result = calculateProfile([], vocationalResults);

    expect(result.primary).toBeNull();
    expect(result.ranking).toEqual([]);
    expect(result.totalAnswers).toBe(0);
  });
});