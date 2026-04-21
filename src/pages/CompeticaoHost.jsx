import { useNavigate, useParams } from 'react-router-dom';
import useHostRoom from '../features/live-match/model/useHostMatch';
import HostLobby from '../features/live-quiz/ui/HostLobby.jsx';
import WaitingScreen from '../features/live-quiz/ui/WaitingScreen.jsx';
import CtaButtonRow from '../shared/ui/CtaButtonRow.jsx';
import FeedbackNotice from '../shared/ui/FeedbackNotice.jsx';
import PageHeader from '../shared/ui/PageHeader.jsx';
import PageShell from '../shared/ui/PageShell.jsx';
import ResultPanel from '../shared/ui/ResultPanel.jsx';

export default function CompeticaoHost() {
  const { pin } = useParams();
  const navigate = useNavigate();
  const {
    busy,
    connected,
    createRoom,
    error,
    hasHostToken,
    nextRound,
    startGame,
    state,
  } = useHostRoom(pin);

  const handleCreateRoom = async () => {
    const response = await createRoom();

    if (response?.ok) {
      navigate(`/competicao/host/${response.pin}`);
    }
  };

  if (!pin) {
    return (
      <PageShell size="narrow" className="text-gray-900 dark:text-white">
        <PageHeader
          eyebrow="Host"
          title="Criar competição ao vivo"
          description="Crie uma sala, compartilhe o PIN e conduza a partida."
        />
        <ResultPanel>
          <p className="text-gray-600 dark:text-gray-300">
            Esta tela é o controle do mediador. Depois de criar a sala, abra a exibição em outra aba ou projetor.
          </p>
          {error && <FeedbackNotice tone="danger" className="mt-4">{error}</FeedbackNotice>}
          <CtaButtonRow
            className="mt-6 justify-start"
            actions={[{
              label: busy ? 'Criando...' : 'Criar sala',
              onClick: handleCreateRoom,
              tone: 'green',
            }]}
          />
        </ResultPanel>
      </PageShell>
    );
  }

  if (!hasHostToken && !state) {
    return (
      <PageShell size="narrow">
        <FeedbackNotice tone="danger">
          Token de host não encontrado nesta aba. Crie uma nova sala para controlar uma partida.
        </FeedbackNotice>
        <CtaButtonRow
          className="mt-6"
          actions={[{ label: 'Criar nova sala', href: '/competicao/host', tone: 'blue' }]}
        />
      </PageShell>
    );
  }

  if (!connected && !state) {
    return (
      <PageShell size="narrow">
        <WaitingScreen title="Conectando à sala" />
      </PageShell>
    );
  }

  return (
    <PageShell size="wide" className="text-gray-900 dark:text-white">
      <PageHeader
        eyebrow="Host controle"
        title={pin ? `Sala ${pin}` : 'Sala ao vivo'}
      />
      <HostLobby
        state={state}
        displayHref={pin ? `/competicao/exibicao/${pin}` : undefined}
        error={error}
        onStart={startGame}
        onNextRound={nextRound}
      />
    </PageShell>
  );
}
