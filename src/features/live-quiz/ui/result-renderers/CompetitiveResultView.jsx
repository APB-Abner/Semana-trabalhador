import LeaderboardPanel from '../LeaderboardPanel.jsx';

export default function CompetitiveResultView({
  currentPlayerId,
  entries = [],
  showRoundDetails = true,
  title = 'Placar',
}) {
  return (
    <LeaderboardPanel
      currentPlayerId={currentPlayerId}
      entries={entries}
      showRoundDetails={showRoundDetails}
      title={title}
    />
  );
}
