import { describe, expect, it } from 'vitest';
import {
  orderContentForOpeningVariety,
  selectDiverseContent,
  type MatchContentMetadata,
} from '../src/domain/match/contentDiversity.ts';

type TestContent = MatchContentMetadata & {
  id: string;
};

describe('match content diversity', () => {
  it('prefers unused content groups when enough candidates exist', () => {
    const items: TestContent[] = [
      { id: 'a', topic: 'Comunicacao', contentGroup: 'comunicacao', difficulty: 'easy' },
      { id: 'b', topic: 'Prioridade', contentGroup: 'prioridade', difficulty: 'medium' },
      { id: 'c', topic: 'Etica', contentGroup: 'etica', difficulty: 'hard' },
    ];

    const selected = selectDiverseContent({
      items,
      count: 2,
      usedItems: [{ topic: 'Comunicacao', contentGroup: 'comunicacao' }],
    });

    expect(selected.map((item) => item.id)).toEqual(['b', 'c']);
  });

  it('relaxes diversity constraints instead of returning an incomplete selection', () => {
    const items: TestContent[] = [
      { id: 'a', topic: 'Comunicacao', contentGroup: 'comunicacao', difficulty: 'easy' },
      { id: 'b', topic: 'Comunicacao', contentGroup: 'comunicacao', difficulty: 'medium' },
    ];

    const selected = selectDiverseContent({
      items,
      count: 2,
      usedItems: [{ topic: 'Comunicacao', contentGroup: 'comunicacao' }],
    });

    expect(selected.map((item) => item.id)).toEqual(['a', 'b']);
  });

  it('reorders quick quiz opening content to avoid adjacent topic and difficulty when possible', () => {
    const ordered = orderContentForOpeningVariety<TestContent>([
      { id: 'a', topic: 'Direitos', difficulty: 'easy' },
      { id: 'b', topic: 'Direitos', difficulty: 'easy' },
      { id: 'c', topic: 'Comunicacao', difficulty: 'medium' },
    ]);

    expect(ordered.map((item) => item.id)).toEqual(['a', 'c', 'b']);
  });
});
