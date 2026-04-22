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
      <PageShell size="narrow" className="competition-page flex h-full flex-col justify-center overflow-hidden text-gray-900 dark:text-white">
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
      <PageShell size="narrow" className="competition-page flex h-full flex-col justify-center overflow-hidden">
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
      <PageShell size="narrow" className="competition-page flex h-full flex-col justify-center overflow-hidden">
        <WaitingScreen title="Conectando à sala" />
      </PageShell>
    );
  }

  return (
    <PageShell size="full" className="competition-page flex h-full flex-col overflow-hidden text-gray-900 dark:text-white">
      <header className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
            Host controle
          </span>
          <h1 className="font-display mt-2 text-2xl font-bold leading-tight text-gray-950 dark:text-white sm:text-3xl">
            {pin ? `Sala ${pin}` : 'Sala ao vivo'}
          </h1>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden">
        <HostLobby
          state={state}
          displayHref={pin ? `/competicao/exibicao/${pin}` : undefined}
          error={error}
          onStart={startGame}
          onNextRound={nextRound}
        />
      </div>
    </PageShell>
  );
}
