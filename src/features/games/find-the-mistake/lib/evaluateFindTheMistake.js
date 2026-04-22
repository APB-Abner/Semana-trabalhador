export function evaluateFindTheMistake(caseItem, selectedIds = []) {
  const selectedSet = new Set(selectedIds);
  const mistakes = caseItem.options.filter((option) => option.isMistake);
  const correctMarked = mistakes.filter((option) => selectedSet.has(option.id));
  const missed = mistakes.filter((option) => !selectedSet.has(option.id));
  const falsePositives = caseItem.options.filter((option) => !option.isMistake && selectedSet.has(option.id));
  const rawScore = correctMarked.length - falsePositives.length;
  const score = Math.max(0, rawScore);

  return {
    isCorrect: missed.length === 0 && falsePositives.length === 0,
    score,
    maxScore: mistakes.length,
    correctMarked,
    missed,
    falsePositives,
  };
}
