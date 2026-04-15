export default function calculateProfile(answers, results) {
  const scoreByArea = answers.reduce((scores, area) => {
    scores[area] = (scores[area] || 0) + 1;
    return scores;
  }, {});

  const topArea = Object.keys(scoreByArea).reduce(
    (bestArea, area) => (!bestArea || scoreByArea[area] > scoreByArea[bestArea] ? area : bestArea),
    null,
  );

  return topArea ? results[topArea] : '';
}
