import LeaderboardPanel from '../LeaderboardPanel.jsx';

export default function CompetitiveResultView({ entries = [], showRoundDetails = true, title = 'Placar' }) {
  return <LeaderboardPanel entries={entries} showRoundDetails={showRoundDetails} title={title} />;
}
