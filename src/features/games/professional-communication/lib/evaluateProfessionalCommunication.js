const qualityScore = {
  best: 1,
  ok: 0.5,
  poor: 0,
};

export function evaluateProfessionalCommunication(scenario, selectedOptionId) {
  const selectedOption = scenario.options.find((option) => option.id === selectedOptionId);
  const bestOption = scenario.options.find((option) => option.id === scenario.bestOptionId);

  if (!selectedOption || !bestOption) {
    return {
      isCorrect: false,
      score: 0,
      selectedOption: null,
      bestOption,
      tone: 'danger',
      feedback: 'Escolha inválida para este cenário.',
      learningPoint: scenario.learningPoint,
    };
  }

  return {
    isCorrect: selectedOption.id === scenario.bestOptionId,
    score: qualityScore[selectedOption.quality] ?? 0,
    selectedOption,
    bestOption,
    tone: selectedOption.quality === 'best' ? 'success' : selectedOption.quality === 'ok' ? 'info' : 'danger',
    feedback: selectedOption.feedback,
    learningPoint: scenario.learningPoint,
  };
}
