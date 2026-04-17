import { useNavigate } from 'react-router-dom';
import usePlayerRoom from '../features/live-quiz/model/usePlayerRoom';
import PlayerJoinForm from '../features/live-quiz/ui/PlayerJoinForm.jsx';
import FeedbackNotice from '../shared/ui/FeedbackNotice.jsx';
import PageHeader from '../shared/ui/PageHeader.jsx';
import PageShell from '../shared/ui/PageShell.jsx';

export default function CompeticaoEntrar() {
  const navigate = useNavigate();
  const { error, joinRoom } = usePlayerRoom();

  const handleJoin = async ({ roomPin, name, avatar }) => {
    const response = await joinRoom({ roomPin, name, avatar });

    if (response?.ok) {
      navigate(`/competicao/sala/${response.pin}`);
    }
  };

  return (
    <PageShell size="narrow" className="text-gray-900 dark:text-white">
      <PageHeader
        eyebrow="Jogador"
        title="Entrar na competição"
        description="Digite seu nome e o PIN informado pelo host para entrar no lobby em tempo real."
        align="center"
      />
      {error && <FeedbackNotice tone="danger" className="mb-4">{error}</FeedbackNotice>}
      <PlayerJoinForm onJoin={handleJoin} />
    </PageShell>
  );
}
