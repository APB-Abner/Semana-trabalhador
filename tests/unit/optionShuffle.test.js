import { describe, expect, it } from 'vitest';
import { shuffleOptionsForPlayer } from '../../src/features/live-quiz/lib/optionShuffle.js';

const options = [
  { id: 'a', text: 'A' },
  { id: 'b', text: 'B' },
  { id: 'c', text: 'C' },
  { id: 'd', text: 'D' },
];

describe('shuffleOptionsForPlayer', () => {
  it('keeps the same order for the same player and round seed', () => {
    const first = shuffleOptionsForPlayer(options, 'player-1:q1').map((option) => option.id);
    const second = shuffleOptionsForPlayer(options, 'player-1:q1').map((option) => option.id);

    expect(second).toEqual(first);
  });

  it('changes order for different player seeds without losing options', () => {
    const first = shuffleOptionsForPlayer(options, 'player-1:q1').map((option) => option.id);
    const second = shuffleOptionsForPlayer(options, 'player-2:q1').map((option) => option.id);

    expect(new Set(first)).toEqual(new Set(options.map((option) => option.id)));
    expect(new Set(second)).toEqual(new Set(options.map((option) => option.id)));
    expect(second).not.toEqual(first);
  });
});
