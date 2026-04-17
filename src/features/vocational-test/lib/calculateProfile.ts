import type {
  VocationalDimension,
  VocationalOption,
  VocationalProfile,
  VocationalResult,
} from '../../../shared/types/learning';

const DIMENSION_ORDER: VocationalDimension[] = [
  'analitico',
  'social',
  'criativo',
  'organizacional',
  'pratico',
  'lideranca',
];

const DIMENSION_LABELS: Record<VocationalDimension, string> = {
  analitico: 'Analítico',
  social: 'Social',
  criativo: 'Criativo',
  organizacional: 'Organizacional',
  pratico: 'Prático',
  lideranca: 'Liderança',
};

function createEmptyDimensionScores() {
  return DIMENSION_ORDER.reduce<Record<VocationalDimension, number>>((scores, dimension) => {
    scores[dimension] = 0;
    return scores;
  }, {} as Record<VocationalDimension, number>);
}

function getTopReasonLabels(
  scoreByDimension: Record<VocationalDimension, number>,
  profile: VocationalProfile,
) {
  return DIMENSION_ORDER
    .map((dimension) => ({
      dimension,
      score: (scoreByDimension[dimension] || 0) * (profile.dimensionWeights[dimension] || 0),
      label: DIMENSION_LABELS[dimension],
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label, 'pt-BR'))
    .slice(0, 2)
    .map((entry) => entry.label);
}

export default function calculateProfile(
  answers: VocationalOption[],
  results: Record<string, VocationalProfile>,
): VocationalResult {
  const totalAnswers = answers.length;
  const resultEntries = Object.entries(results);
  const scoreByDimension = createEmptyDimensionScores();

  answers.forEach((answer) => {
    Object.entries(answer.weights || {}).forEach(([dimension, value]) => {
      const typedDimension = dimension as VocationalDimension;
      scoreByDimension[typedDimension] += Number(value) || 0;
    });
  });

  const totalDimensionScore = DIMENSION_ORDER.reduce((sum, dimension) => sum + scoreByDimension[dimension], 0);
  const dimensions = DIMENSION_ORDER
    .map((dimension) => ({
      id: dimension,
      label: DIMENSION_LABELS[dimension],
      score: scoreByDimension[dimension],
      percentage: totalDimensionScore
        ? Math.round((scoreByDimension[dimension] / totalDimensionScore) * 100)
        : 0,
    }))
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label, 'pt-BR'));

  const rawRanking = resultEntries
    .map(([area, profile], order) => {
      const score = DIMENSION_ORDER.reduce(
        (sum, dimension) => sum + (scoreByDimension[dimension] || 0) * (profile.dimensionWeights[dimension] || 0),
        0,
      );

      return {
        area,
        order,
        score,
        percentage: 0,
        reasons: getTopReasonLabels(scoreByDimension, profile),
        ...profile,
      };
    })
    .sort((a, b) => b.score - a.score || a.order - b.order);

  const highestScore = rawRanking[0]?.score ?? 0;
  const ranking = rawRanking
    .map((entry) => ({
      ...entry,
      percentage: highestScore ? Math.round((entry.score / highestScore) * 100) : 0,
    }))
    .slice(0, 3);

  const scoreByArea = rawRanking.reduce<Record<string, number>>((scores, profile) => {
    scores[profile.area] = profile.score;
    return scores;
  }, {});

  const profileBlend = dimensions
    .filter((dimension) => dimension.score > 0)
    .slice(0, 2)
    .map((dimension) => dimension.label);

  return {
    primary: totalAnswers ? ranking[0] || null : null,
    ranking: totalAnswers ? ranking : [],
    scoreByArea,
    scoreByDimension,
    dimensions,
    profileBlend,
    totalAnswers,
  };
}
