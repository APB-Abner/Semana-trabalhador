import { useNavigate, useSearchParams } from 'react-router-dom';
import usePlayerRoom from '../features/live-quiz/model/usePlayerRoom';
import PlayerJoinForm from '../features/live-quiz/ui/PlayerJoinForm.jsx';
import FeedbackNotice from '../shared/ui/FeedbackNotice.jsx';
import PageHeader from '../shared/ui/PageHeader.jsx';
import PageShell from '../shared/ui/PageShell.jsx';

export default function CompeticaoEntrar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { error, joinRoom } = usePlayerRoom();
  const initialPin = (searchParams.get('pin') ?? '').replace(/\D/g, '').slice(0, 6);

  const handleJoin = async ({ roomPin, name, avatar }) => {
    const response = await joinRoom({ roomPin, name, avatar });

    if (response?.ok) {
      navigate(`/competicao/sala/${response.pin}`);
    }
  };

  return (
    <PageShell size="narrow" className="competition-page flex h-full flex-col justify-center overflow-y-auto py-4 text-gray-900 dark:text-white">
      <PageHeader
        eyebrow="Jogador"
        title="Entrar na competição"
        description="Informe seu nome e o PIN da sala."
        align="center"
        className="mb-3 sm:mb-5"
      />
      {error && <FeedbackNotice tone="danger" className="mb-4">{error}</FeedbackNotice>}
      <PlayerJoinForm initialPin={initialPin} onJoin={handleJoin} />
    </PageShell>
  );
}
