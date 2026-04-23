import { useEffect, useMemo, useState } from 'react';
import Badge from '../../../shared/ui/Badge.jsx';
import FeedbackNotice from '../../../shared/ui/FeedbackNotice.jsx';
import ProgressBar from '../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';
import MultipleChoiceQuestionView from './question-renderers/MultipleChoiceQuestionView.jsx';
import MultipleSelectQuestionView from './question-renderers/MultipleSelectQuestionView.jsx';
import PollQuestionView from './question-renderers/PollQuestionView.jsx';
import QnaQuestionView from './question-renderers/QnaQuestionView.jsx';
import RankingQuestionView from './question-renderers/RankingQuestionView.jsx';
import ScaleQuestionView from './question-renderers/ScaleQuestionView.jsx';
import TrueFalseQuestionView from './question-renderers/TrueFalseQuestionView.jsx';
import WordCloudQuestionView from './question-renderers/WordCloudQuestionView.jsx';
import { shuffleOptionsForPlayer } from '../lib/optionShuffle.js';

function getClockOffset(serverNow) {
  return Number.isFinite(serverNow) ? serverNow - Date.now() : 0;
}

function getCorrectOptionIds(question) {
  return question?.correctOptionIds ?? (question?.correctOptionId ? [question.correctOptionId] : []);
}

function sameOptionSet(left = [], right = []) {
  if (left.length !== right.length) {
    return false;
  }

  const rightSet = new Set(right);
  return left.every((optionId) => rightSet.has(optionId));
}

const typeLabels = {
  multiple_choice: 'Múltipla escolha',
  true_false: 'Verdadeiro ou falso',
  multiple_select: 'Múltipla seleção',
  poll: 'Enquete',
  word_cloud: 'Nuvem de palavras',
  scale: 'Escala',
  ranking: 'Ranking',
  qna: 'Pergunta aberta',
};

const submittedMessages = {
  poll: 'Voto enviado. Aguarde o resultado coletivo.',
  word_cloud: 'Termo enviado. Aguarde a nuvem da rodada.',
  scale: 'Valor enviado. Aguarde o resumo do grupo.',
  ranking: 'Ranking enviado. Aguarde o resultado coletivo.',
  qna: 'Ideia enviada. Aguarde a lista de respostas da rodada.',
};

function getQuestionRenderer(type) {
  if (type === 'multiple_select') {
    return MultipleSelectQuestionView;
  }

  if (type === 'poll') {
    return PollQuestionView;
  }

  if (type === 'word_cloud') {
    return WordCloudQuestionView;
  }

  if (type === 'qna') {
    return QnaQuestionView;
  }

  if (type === 'scale') {
    return ScaleQuestionView;
  }

  if (type === 'ranking') {
    return RankingQuestionView;
  }

  if (type === 'true_false') {
    return TrueFalseQuestionView;
  }

  return MultipleChoiceQuestionView;
}

export default function LiveQuestionCard({
  question,
  startedAt,
  closesAt,
  disabled = false,
  hasSubmitted = false,
  onChange,
  onSubmit,
  optionOrderSeed = '',
  selectedOptionIds = [],
  selectedText = '',
  selectedValue,
  serverNow,
  showAnswer = false,
}) {
  const [clockOffset, setClockOffset] = useState(() => getClockOffset(serverNow));
  const [now, setNow] = useState(() => Date.now() + clockOffset);

  useEffect(() => {
    setClockOffset(getClockOffset(serverNow));
  }, [closesAt, serverNow, startedAt]);

  useEffect(() => {
    const updateNow = () => setNow(Date.now() + clockOffset);

    updateNow();
    const timer = setInterval(updateNow, 250);
    return () => clearInterval(timer);
  }, [clockOffset]);

  const remainingMs = closesAt ? Math.max(0, closesAt - now) : 0;
  const totalMs = useMemo(
    () => (startedAt && closesAt ? Math.max(1, closesAt - startedAt) : 1),
    [closesAt, startedAt],
  );
  const displayedQuestion = useMemo(() => {
    if (!question) {
      return null;
    }

    return {
      ...question,
      options: shuffleOptionsForPlayer(question.options, `${optionOrderSeed}:${question.id}`),
    };
  }, [optionOrderSeed, question]);

  if (!question) {
    return null;
  }

  const correctOptionIds = getCorrectOptionIds(question);
  const hasCorrectAnswer = correctOptionIds.length > 0;
  const selectedIsCorrect = showAnswer && sameOptionSet(selectedOptionIds, correctOptionIds);
  const QuestionRenderer = getQuestionRenderer(question.type);
  const submittedMessage = submittedMessages[question.type] ?? 'Resposta enviada. Aguarde o resultado da rodada.';

  return (
    <ResultPanel>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{question.topic}</Badge>
          <Badge tone="purple">{typeLabels[question.type] ?? question.type}</Badge>
        </div>
        {closesAt && (
          <Badge tone={remainingMs <= 5_000 ? 'red' : 'gray'}>
            {Math.ceil(remainingMs / 1000)}s
          </Badge>
        )}
      </div>

      {closesAt && (
        <ProgressBar
          value={remainingMs}
          max={totalMs}
          className="mt-4 h-2"
          barClassName={remainingMs <= 5_000 ? 'bg-red-500' : 'bg-blue-500'}
        />
      )}

      <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
        {question.text}
      </h3>

      <QuestionRenderer
        correctOptionIds={correctOptionIds}
        disabled={disabled}
        hasSubmitted={hasSubmitted}
        onChange={onChange}
        onSubmit={onSubmit}
        question={displayedQuestion}
        selectedOptionIds={selectedOptionIds}
        selectedText={selectedText}
        selectedValue={selectedValue}
        showAnswer={showAnswer}
      />

      {hasSubmitted && !showAnswer && (
        <FeedbackNotice tone="info" className="mt-4 text-sm">
          {submittedMessage}
        </FeedbackNotice>
      )}

      {showAnswer && hasCorrectAnswer && (
        <FeedbackNotice tone={selectedIsCorrect ? 'success' : 'info'} className="mt-3 text-sm">
          <p className="font-semibold">Explicação</p>
          {question.explanation && <p className="mt-1">{question.explanation}</p>}
        </FeedbackNotice>
      )}

      {showAnswer && !hasCorrectAnswer && question.explanation && (
        <FeedbackNotice tone="info" className="mt-3 text-sm">
          {question.explanation}
        </FeedbackNotice>
      )}
    </ResultPanel>
  );
}
