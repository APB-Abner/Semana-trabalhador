import { useNavigate } from 'react-router-dom';
import usePlayerRoom from '../features/live-quiz/model/usePlayerRoom';
import PlayerJoinForm from '../features/live-quiz/ui/PlayerJoinForm.jsx';
import FeedbackNotice from '../shared/ui/FeedbackNotice.jsx';

export default function CompeticaoEntrar() {
  const navigate = useNavigate();
  const { error, joinRoom } = usePlayerRoom();

  const handleJoin = async ({ roomPin, name }) => {
    const response = await joinRoom({ roomPin, name });

    if (response?.ok) {
      navigate(`/competicao/sala/${response.pin}`);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 text-gray-900 dark:text-white">
      <h1 className="mb-6 text-center text-3xl font-black">Entrar na competição</h1>
      {error && <FeedbackNotice tone="danger" className="mb-4">{error}</FeedbackNotice>}
      <PlayerJoinForm onJoin={handleJoin} />
    </div>
  );
}
