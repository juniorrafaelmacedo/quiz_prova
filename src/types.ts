/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryType = 
  | 'Liderança e Poder'
  | 'Cultura e Clima'
  | 'Gestão Estratégica & CRM'
  | 'Inteligência Emocional';

export interface Question {
  id: number;
  category: CategoryType;
  title: string;
  source: string;
  text: string;
  options: {
    letter: string;
    text: string;
  }[];
  correctAnswer: string; // 'A', 'B', 'C', 'D' ou 'E'
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  date: string;
  score: number; // quantidade de acertos
  totalQuestions: number;
  timeSpent: number; // em segundos
  mode: 'complete' | 'quick' | 'themed';
  category?: CategoryType;
  answers: {
    questionId: number;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface CategoryStats {
  category: CategoryType;
  totalAnswered: number;
  correctAnswers: number;
}
