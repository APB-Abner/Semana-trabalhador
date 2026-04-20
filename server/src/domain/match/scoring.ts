import type { LeaderboardEntry } from '../../types/realtime.ts';

export function sortMatchRanking(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort(
    (a, b) =>
      b.score - a.score ||
      b.roundPoints - a.roundPoints ||
      Number(b.lastAnswerCorrect) - Number(a.lastAnswerCorrect) ||
      a.name.localeCompare(b.name),
  );
}

