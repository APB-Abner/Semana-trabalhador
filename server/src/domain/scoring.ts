export type ScoreAnswerInput = {
  isCorrect: boolean;
  submittedAt: number;
  startedAt: number;
  limitMs: number;
};

export const LIVE_SCORE_BASE_POINTS = 700;
export const LIVE_SCORE_SPEED_BONUS = 200;
export const LIVE_SCORE_MAX_POINTS = LIVE_SCORE_BASE_POINTS + LIVE_SCORE_SPEED_BONUS;

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
  return Math.round(LIVE_SCORE_BASE_POINTS + speedFactor * LIVE_SCORE_SPEED_BONUS);
}
