export function getRoundProgressLabel(state, { includePrefix = true } = {}) {
  const game = state?.currentGame;

  if (!game) {
    return includePrefix ? 'Rodada 0/0' : '0/0';
  }

  const roundNumber = state.status === 'game_intro' || state.status === 'between_games'
    ? 0
    : Math.min(game.roundCount, Math.max(0, state.currentGameRoundIndex ?? -1) + 1);
  const label = `${roundNumber}/${game.roundCount}`;

  return includePrefix ? `Rodada ${label}` : label;
}

export function getMatchStepLabel(state) {
  const totalGames = state?.selectedGames?.length ?? 0;
  const gameIndex = state?.currentGameIndex ?? -1;
  const current = gameIndex >= 0 ? Math.min(totalGames, gameIndex + 1) : 0;

  return `${current}/${totalGames}`;
}
