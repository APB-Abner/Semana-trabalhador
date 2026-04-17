import type { LiveAnswerPayload, LiveQuestion } from '../../types/realtime.ts';
import type { NormalizedLiveAnswer, QuestionHandler } from './types.ts';

const SCALE_EPSILON = 1e-9;

function getScaleConfig(question: LiveQuestion) {
  const { scale } = question;

  if (!scale) {
    throw new Error(`Pergunta de escala sem configuracao numerica: ${question.text}`);
  }

  return {
    min: scale.min,
    max: scale.max,
    step: scale.step ?? 1,
  };
}

function roundNumber(value: number) {
  return Number(value.toFixed(2));
}

function roundScaleValue(value: number) {
  return Number(value.toFixed(10));
}

function getScaleValues(question: LiveQuestion) {
  const { min, max, step } = getScaleConfig(question);
  const values: number[] = [];

  for (let value = min; value <= max + SCALE_EPSILON; value += step) {
    values.push(roundScaleValue(value));
  }

  return values;
}

function isStepAligned(question: LiveQuestion, value: number) {
  const { min, step } = getScaleConfig(question);
  const offset = (value - min) / step;

  return Math.abs(offset - Math.round(offset)) <= SCALE_EPSILON;
}

export function normalizeScaleAnswer(question: LiveQuestion, payload: LiveAnswerPayload): NormalizedLiveAnswer {
  const value = payload.value;

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('Informe um valor valido para a escala.');
  }

  const { min, max, step } = getScaleConfig(question);

  if (value < min || value > max) {
    throw new Error(`Valor fora da escala permitida (${min} a ${max}).`);
  }

  if (!isStepAligned(question, value)) {
    throw new Error(`Valor precisa respeitar o intervalo de ${step}.`);
  }

  const normalizedValue = roundScaleValue(min + Math.round((value - min) / step) * step);

  return {
    optionIds: [],
    value: normalizedValue,
  };
}

export const scaleHandler: QuestionHandler = {
  type: 'scale',
  mode: 'participatory',
  validateQuestion(question: LiveQuestion) {
    if (question.options.length > 0) {
      throw new Error(`Pergunta de escala nao deve ter opcoes: ${question.text}`);
    }

    const { min, max, step } = getScaleConfig(question);

    if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
      throw new Error(`Escala precisa ter min e max numericos validos: ${question.text}`);
    }

    if (!Number.isFinite(step) || step <= 0 || step > max - min) {
      throw new Error(`Escala precisa ter step numerico valido: ${question.text}`);
    }

    if (!isStepAligned(question, max)) {
      throw new Error(`Escala precisa terminar em um valor alinhado ao step: ${question.text}`);
    }
  },
  normalizeAnswer: normalizeScaleAnswer,
  aggregateResult(question, answers) {
    const totalResponses = answers.length;
    const values = getScaleValues(question);
    const countsByValue = new Map(values.map((value) => [value, 0]));
    const sum = answers.reduce((total, answer) => {
      if (typeof answer.value !== 'number') {
        return total;
      }

      countsByValue.set(answer.value, (countsByValue.get(answer.value) ?? 0) + 1);
      return total + answer.value;
    }, 0);

    return {
      type: 'scale',
      totalResponses,
      average: totalResponses ? roundNumber(sum / totalResponses) : null,
      distribution: values.map((value) => {
        const count = countsByValue.get(value) ?? 0;

        return {
          value,
          count,
          percentage: totalResponses ? Math.round((count / totalResponses) * 100) : 0,
        };
      }),
    };
  },
};
