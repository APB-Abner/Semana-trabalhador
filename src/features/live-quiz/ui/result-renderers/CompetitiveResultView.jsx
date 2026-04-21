import LeaderboardPanel from '../LeaderboardPanel.jsx';

export default function CompetitiveResultView({ entries = [], title = 'Placar' }) {
  return <LeaderboardPanel entries={entries} title={title} />;
}
