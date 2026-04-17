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
    () => calculateProfile(respostas.filter(Boolean), results),
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

  const responder = useCallback((option) => {
    setRespostas((currentAnswers) => {
      const nextAnswers = [...currentAnswers];
      nextAnswers[etapa] = option;
      return nextAnswers;
    });

    if (etapa + 1 < questions.length) {
      setEtapa((currentStep) => currentStep + 1);
      return;
    }

    setFinalizado(true);
  }, [etapa, questions.length]);

  const voltar = useCallback(() => {
    if (finalizado) {
      setFinalizado(false);
      setEtapa(Math.max(questions.length - 1, 0));
      savedResultRef.current = false;
      return;
    }

    if (etapa === 0) {
      return;
    }

    setEtapa((currentStep) => currentStep - 1);
  }, [etapa, finalizado, questions.length]);

  const reset = useCallback(() => {
    setEtapa(0);
    setRespostas([]);
    setFinalizado(false);
    savedResultRef.current = false;
  }, []);

  return {
    etapa,
    canGoBack: etapa > 0 && !finalizado,
    finalizado,
    history,
    perguntaAtual: questions[etapa],
    progresso: finalizado ? 100 : Math.round(((etapa + 1) / questions.length) * 100),
    responder,
    respostaAtual: respostas[etapa] ?? null,
    reset,
    resultado,
    totalPerguntas: questions.length,
    voltar,
  };
}