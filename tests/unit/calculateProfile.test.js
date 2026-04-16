import { describe, expect, it } from 'vitest';
import calculateProfile from '../../src/features/vocational-test/lib/calculateProfile.ts';
import { vocationalResults } from '../../src/content/vocational/results.ts';

describe('calculateProfile', () => {
  it('returns top 3 ranked profiles with percentages', () => {
    const result = calculateProfile(
      ['tecnologia', 'tecnologia', 'exatas', 'administracao', 'tecnologia'],
      vocationalResults,
    );

    expect(result.primary.area).toBe('tecnologia');
    expect(result.primary.percentage).toBe(60);
    expect(result.ranking).toHaveLength(3);
    expect(result.ranking.map((profile) => profile.area)).toEqual(['tecnologia', 'exatas', 'administracao']);
  });

  it('keeps result definition order as tie breaker', () => {
    const result = calculateProfile(['artes', 'saude'], vocationalResults);

    expect(result.ranking[0].area).toBe('saude');
    expect(result.ranking[1].area).toBe('artes');
  });
});
