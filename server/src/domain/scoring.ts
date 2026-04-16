export type ScoreAnswerInput = {
  isCorrect: boolean;
  submittedAt: number;
  startedAt: number;
  limitMs: number;
};

export function calculateLiveScore({
  isCorrect,
  submittedAt,
  startedAt,
  limitMs,
}: ScoreAnswerInput): number {
  if (!isCorrect || limitMs <= 0) {
    return 0;
  }

  const responseMs = Math.max(0, submittedAt - startedAt);
  const speedFactor = Math.max(0, 1 - responseMs / limitMs);
  return Math.round(700 + speedFactor * 800);
}
