export default function calculateProfile(answers, results) {
  const totalAnswers = answers.length;
  const resultEntries = Object.entries(results);
  const scoreByArea = answers.reduce((scores, area) => {
    scores[area] = (scores[area] || 0) + 1;
    return scores;
  }, {});

  const ranking = resultEntries
    .map(([area, profile], order) => ({
      area,
      order,
      score: scoreByArea[area] || 0,
      percentage: totalAnswers ? Math.round(((scoreByArea[area] || 0) / totalAnswers) * 100) : 0,
      ...profile,
    }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, 3);

  return {
    primary: ranking[0] || null,
    ranking,
    scoreByArea,
    totalAnswers,
  };
}
