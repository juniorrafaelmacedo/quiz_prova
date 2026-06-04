/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizAttempt, CategoryStats, CategoryType } from '../types';

const STORAGE_KEY = 'human_behavior_quiz_attempts';

export function getAttempts(): QuizAttempt[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao ler tentativas do localStorage', error);
    return [];
  }
}

export function saveAttempt(attempt: QuizAttempt): QuizAttempt[] {
  try {
    const current = getAttempts();
    const updated = [attempt, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Erro ao gravar tentativa no localStorage', error);
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar histórico do localStorage', error);
  }
}

export function calculateStats(attempts: QuizAttempt[]) {
  const totalAttempts = attempts.length;
  if (totalAttempts === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      averageTime: 0,
      correctRate: 0,
      byCategory: [] as { category: CategoryType; answered: number; correct: number; rate: number }[],
    };
  }

  let totalQuestionsAnswered = 0;
  let totalCorrect = 0;
  let totalSpentTime = 0;

  attempts.forEach((a) => {
    totalQuestionsAnswered += a.totalQuestions;
    totalSpentTime += a.timeSpent;
    totalCorrect += a.score;
  });

  const categories: CategoryType[] = [
    'Liderança e Poder',
    'Cultura e Clima',
    'Gestão Estratégica & CRM',
    'Inteligência Emocional',
  ];

  const byCategory = categories.map((cat) => {
    let catAnswered = 0;
    let catCorrect = 0;

    attempts.forEach((attempt) => {
      attempt.answers.forEach((ans) => {
        // Encontrar a pergunta e cruzar a categoria
        // Por simplificação técnica, passamos na resposta a categoria se quisermos, de outra forma cruzamos os dados no componente de estatística
      });
    });

    return {
      category: cat,
      answered: 0,
      correct: 0,
      rate: 0,
    };
  });

  return {
    totalAttempts,
    averageScore: Number((totalCorrect / totalAttempts).toFixed(1)),
    averageTime: Math.round(totalSpentTime / totalAttempts),
    correctRate: Math.round((totalCorrect / totalQuestionsAnswered) * 100) || 0,
  };
}
