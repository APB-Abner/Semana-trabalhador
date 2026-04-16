import LeaderboardPanel from '../LeaderboardPanel.jsx';

export default function CompetitiveResultView({ entries = [], title = 'Leaderboard' }) {
  return <LeaderboardPanel entries={entries} title={title} />;
}
