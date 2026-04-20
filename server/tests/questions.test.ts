import { describe, expect, it } from 'vitest';
import {
  adaptQuizQuestion,
  adaptQuizQuestions,
  getLiveQuestionBank,
  getLiveQuestions,
  getLiveOnlyQuestions,
  selectLiveQuestionsForSession,
  summarizeLiveQuestionBank,
} from '../src/domain/questions.ts';
import type { QuizQuestion } from '../../src/shared/types/learning.ts';
import type { LiveQuestion } from '../src/types/realtime.ts';

const baseQuestion: QuizQuestion = {
  tema: 'Direitos',
  pergunta: 'Qual e um direito do jovem aprendiz?',
  opcoes: ['Ferias', 'Trabalho voluntario obrigatorio'],
  resposta: 'Ferias',
  explicacao: 'O contrato formal garante ferias.',
};

function countByType(questions: LiveQuestion[] = getLiveQuestionBank()) {
  return questions.reduce<Record<string, number>>((counts, question) => {
    counts[question.type] = (counts[question.type] ?? 0) + 1;
    return counts;
  }, {});
}

function countByBucket(questions: LiveQuestion[] = getLiveQuestionBank()) {
  return questions.reduce<Record<string, number>>((counts, question) => {
    counts[question.bucket ?? 'missing'] = (counts[question.bucket ?? 'missing'] ?? 0) + 1;
    return counts;
  }, {});
}

function countBySessionFit(questions: LiveQuestion[] = getLiveQuestionBank()) {
  return questions.reduce<Record<string, number>>((counts, question) => {
    counts[question.sessionFit ?? 'missing'] = (counts[question.sessionFit ?? 'missing'] ?? 0) + 1;
    return counts;
  }, {});
}

describe('live quiz question adapter and session selector', () => {
  it('preserves multiple choice questions by default with competitive metadata', () => {
    const adapted = adaptQuizQuestion(baseQuestion, 0);

    expect(adapted.type).toBe('multiple_choice');
    expect(adapted.bucket).toBe('competitive');
    expect(adapted.tone).toBe('objective');
    expect(adapted.sessionFit).toBe('competition');
    expect(adapted.correctOptionId).toBe('q1-o1');
    expect(adapted.options).toHaveLength(2);
  });

  it('converts true_false questions with two options', () => {
    const adapted = adaptQuizQuestion({
      ...baseQuestion,
      tipo: 'true_false',
      pergunta: 'Jovem aprendiz tem carteira assinada desde o inicio?',
      opcoes: ['Verdadeiro', 'Falso'],
      resposta: 'Verdadeiro',
    }, 1);

    expect(adapted.type).toBe('true_false');
    expect(adapted.options.map((option) => option.text)).toEqual(['Verdadeiro', 'Falso']);
    expect(adapted.correctOptionId).toBe('q2-o1');
  });

  it('rejects invalid true_false questions without exactly two options', () => {
    expect(() => adaptQuizQuestion({
      ...baseQuestion,
      tipo: 'true_false',
      opcoes: ['Verdadeiro', 'Falso', 'Depende'],
      resposta: 'Verdadeiro',
    }, 0)).toThrow(/exatamente 2/);
  });

  it('rejects questions without a valid correct answer', () => {
    expect(() => adaptQuizQuestion({
      ...baseQuestion,
      tipo: 'true_false',
      opcoes: ['Verdadeiro', 'Falso'],
      resposta: 'Resposta ausente',
    }, 0)).toThrow(/resposta correta/);
  });

  it('keeps normal quiz adaptation competitive and objective', () => {
    const adapted = adaptQuizQuestions();

    expect(adapted.some((question) => question.type === 'true_false')).toBe(true);
    expect(adapted.every((question) => question.bucket === 'competitive')).toBe(true);
    expect(adapted.every((question) => question.tone === 'objective')).toBe(true);
  });

  it('builds a significantly larger live question bank with metadata', () => {
    const bank = getLiveQuestionBank();
    const byType = countByType(bank);
    const byBucket = countByBucket(bank);
    const bySessionFit = countBySessionFit(bank);

    expect(bank.length).toBeGreaterThanOrEqual(60);
    expect(byBucket.competitive).toBeGreaterThanOrEqual(25);
    expect(byBucket.participatory).toBeGreaterThanOrEqual(35);
    expect(byType.multiple_choice).toBeGreaterThanOrEqual(15);
    expect(byType.true_false).toBeGreaterThanOrEqual(5);
    expect(byType.multiple_select).toBeGreaterThanOrEqual(6);
    expect(byType.poll).toBeGreaterThanOrEqual(8);
    expect(byType.word_cloud).toBeGreaterThanOrEqual(8);
    expect(byType.scale).toBeGreaterThanOrEqual(8);
    expect(byType.ranking).toBeGreaterThanOrEqual(8);
    expect(byType.qna).toBeGreaterThanOrEqual(8);
    expect(bySessionFit.competition).toBe(33);
    expect(bySessionFit.workshop).toBe(21);
    expect(bySessionFit.both).toBe(16);
    expect(getLiveOnlyQuestions().length).toBeGreaterThan(40);
  });

  it('does not allow interview-like tone in competitive questions', () => {
    const bank = getLiveQuestionBank();
    const invalidCompetitive = bank.filter((question) => (
      question.bucket === 'competitive' && question.tone !== 'objective'
    ));

    expect(invalidCompetitive).toEqual([]);
    expect(bank.some((question) => question.bucket === 'participatory' && question.tone === 'interview_like')).toBe(true);
  });

  it('selects a balanced 10-question session', () => {
    const session = getLiveQuestions();
    const byType = countByType(session);
    const byBucket = countByBucket(session);

    expect(session).toHaveLength(10);
    expect(byBucket.competitive).toBe(5);
    expect(byBucket.participatory).toBe(5);
    expect(Math.max(...Object.values(byType))).toBeLessThanOrEqual(2);
    expect(byType.qna ?? 0).toBe(0);
    expect(byType.word_cloud ?? 0).toBe(0);
    expect(session.every((question) => question.sessionFit === 'competition' || question.sessionFit === 'both')).toBe(true);
  });

  it('uses the expected first-session rotation order for demonstration flows', () => {
    const session = getLiveQuestions();

    expect(session.map((question) => question.type)).toEqual([
      'multiple_choice',
      'true_false',
      'multiple_select',
      'poll',
      'scale',
      'ranking',
      'multiple_choice',
      'multiple_select',
      'poll',
      'scale',
    ]);
  });

  it('keeps workshop-oriented participatory questions out of the default competition session', () => {
    const sessionIds = new Set(getLiveQuestions().map((question) => question.id));

    [
      'live-poll-interesse',
      'live-word-cloud-carreira',
      'live-qna-primeiro-passo',
    ].forEach((questionId) => {
      expect(sessionIds.has(questionId)).toBe(false);
    });
  });

  it('avoids recent questions before relaxing history constraints when there are enough candidates', () => {
    const firstSession = getLiveQuestions();
    const secondSession = getLiveQuestions(firstSession.map((question) => question.id));
    const repeatedIds = secondSession.filter((question) => firstSession.some((recent) => recent.id === question.id));

    expect(repeatedIds).toHaveLength(1);
    expect(repeatedIds[0].type).toBe('poll');
  });

  it('excludes disabled questions from session selection', () => {
    const bank = getLiveQuestionBank();
    const firstMultipleChoice = bank.find((question) => question.type === 'multiple_choice');

    expect(firstMultipleChoice).toBeTruthy();
    const session = selectLiveQuestionsForSession({
      questions: bank.map((question) => (
        question.id === firstMultipleChoice?.id ? { ...question, enabled: false } : question
      )),
    });

    expect(session.some((question) => question.id === firstMultipleChoice?.id)).toBe(false);
  });

  it('summarizes the live question bank by type and bucket', () => {
    const summary = summarizeLiveQuestionBank();

    expect(summary.total).toBe(getLiveQuestionBank().length);
    expect(summary.byBucket.competitive + summary.byBucket.participatory).toBe(summary.total);
    expect(summary.bySessionFit.competition + summary.bySessionFit.workshop + summary.bySessionFit.both).toBe(summary.total);
    expect(summary.byType.qna).toBeGreaterThanOrEqual(8);
  });
});
