export function evaluateCanOrCant(item, answer) {
  const isCorrect = answer === item.answer;

  return {
    isCorrect,
    score: isCorrect ? 1 : 0,
    correctAnswer: item.answer,
    explanation: item.explanation,
  };
}
