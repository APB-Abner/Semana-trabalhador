export default function calculateMemoryScore(completedCardsCount, totalCardsCount) {
  if (!totalCardsCount) {
    return 0;
  }

  return Math.round((completedCardsCount / totalCardsCount) * 10);
}
