import PollResultView from './PollResultView.jsx';
import RankingResultView from './RankingResultView.jsx';
import ScaleResultView from './ScaleResultView.jsx';
import WordCloudResultView from './WordCloudResultView.jsx';

export default function ParticipatoryResultView({ result }) {
  if (!result) {
    return null;
  }

  if (result.type === 'poll') {
    return <PollResultView result={result} />;
  }

  if (result.type === 'word_cloud') {
    return <WordCloudResultView result={result} />;
  }

  if (result.type === 'scale') {
    return <ScaleResultView result={result} />;
  }

  if (result.type === 'ranking') {
    return <RankingResultView result={result} />;
  }

  return null;
}
