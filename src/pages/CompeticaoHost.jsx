import { useNavigate, useParams } from 'react-router-dom';
import useHostRoom from '../features/live-quiz/model/useHostRoom';
import HostLobby from '../features/live-quiz/ui/HostLobby.jsx';
import WaitingScreen from '../features/live-quiz/ui/WaitingScreen.jsx';
import CtaButtonRow from '../shared/ui/CtaButtonRow.jsx';
import FeedbackNotice from '../shared/ui/FeedbackNotice.jsx';
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
      <div className="mx-auto max-w-3xl px-4 py-10 text-gray-900 dark:text-white">
        <ResultPanel>
          <p className="text-sm uppercase tracking-wide text-blue-600 dark:text-blue-300">Host</p>
          <h1 className="mt-2 text-3xl font-black">Criar competição ao vivo</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            O servidor cria uma sala em memória e retorna um PIN para os jogadores.
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
      </div>
    );
  }

  if (!hasHostToken && !state) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <FeedbackNotice tone="danger">
          Token de host não encontrado nesta aba. Crie uma nova sala para controlar uma partida.
        </FeedbackNotice>
        <CtaButtonRow
          className="mt-6"
          actions={[{ label: 'Criar nova sala', href: '/competicao/host', tone: 'blue' }]}
        />
      </div>
    );
  }

  if (!connected && !state) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <WaitingScreen title="Conectando ao servidor" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-gray-900 dark:text-white">
      <HostLobby
        state={state}
        error={error}
        onStart={startGame}
        onNextRound={nextRound}
      />
    </div>
  );
}
