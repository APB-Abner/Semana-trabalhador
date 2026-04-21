import { useParams } from 'react-router-dom';
import useDisplayMatch from '../features/live-match/model/useDisplayMatch';
import MatchDisplay from '../features/live-match/ui/display/MatchDisplay.jsx';

export default function CompeticaoExibicao() {
  const { pin = '' } = useParams();
  const { error, state } = useDisplayMatch(pin);

  return <MatchDisplay state={state} error={error} />;
}
