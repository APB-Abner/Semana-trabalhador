import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { trackVocationalProfile } from '../../analytics/lib/analytics.js';
import { readVocationalHistory, saveVocationalHistory } from '../../persistence/lib/vocationalHistory.js';
import calculateProfile from '../lib/calculateProfile.ts';

export default function useVocationalTest(questions, results) {
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [finalizado, setFinalizado] = useState(false);
  const [history, setHistory] = useState(() => readVocationalHistory());
  const savedResultRef = useRef(false);

  const resultado = useMemo(
    () => calculateProfile(respostas, results),
    [respostas, results],
  );

  useEffect(() => {
    if (!finalizado || !resultado.primary || savedResultRef.current) {
      return;
    }

    const nextHistory = saveVocationalHistory(resultado);
    setHistory(nextHistory);
    trackVocationalProfile(resultado.primary.area);
    savedResultRef.current = true;
  }, [finalizado, resultado]);

  const responder = useCallback((areas) => {
    setRespostas((currentAnswers) => [...currentAnswers, ...areas]);

    if (etapa + 1 < questions.length) {
      setEtapa((currentStep) => currentStep + 1);
      return;
    }

    setFinalizado(true);
  }, [etapa, questions.length]);

  const reset = useCallback(() => {
    setEtapa(0);
    setRespostas([]);
    setFinalizado(false);
    savedResultRef.current = false;
  }, []);

  return {
    etapa,
    finalizado,
    history,
    perguntaAtual: questions[etapa],
    progresso: Math.round(((etapa + 1) / questions.length) * 100),
    responder,
    reset,
    resultado,
    totalPerguntas: questions.length,
  };
}
