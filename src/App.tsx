/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { QUESTIONS_DATA } from './questions';
import { QuizAttempt, CategoryType, Question } from './types';
import { getAttempts, saveAttempt, clearHistory } from './lib/storage';
import { Dashboard } from './components/Dashboard';
import { QuizCard } from './components/QuizCard';
import { StatsView } from './components/StatsView';
import { QuizReview } from './components/QuizReview';
import { 
  GraduationCap, 
  Trophy, 
  TrendingUp, 
  BookOpen, 
  Share2, 
  RotateCcw,
  Menu,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'dashboard' | 'quiz' | 'stats' | 'review'>('dashboard');
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [activeMode, setActiveMode] = useState<'complete' | 'quick' | 'themed'>('complete');
  const [activeCategory, setActiveCategory] = useState<CategoryType | undefined>(undefined);
  const [reviewAttempt, setReviewAttempt] = useState<QuizAttempt | null>(null);

  // Carregar dados iniciais de histórico salvos
  useEffect(() => {
    setAttempts(getAttempts());
  }, []);

  // Iniciar Quiz
  const handleStartQuiz = (mode: 'complete' | 'quick' | 'themed', count?: number, category?: CategoryType) => {
    setActiveMode(mode);
    setActiveCategory(category);

    let selectedQuestions = [...QUESTIONS_DATA];

    if (mode === 'themed' && category) {
      // Filtrar perguntas da categoria
      selectedQuestions = selectedQuestions.filter((q) => q.category === category);
    }

    // Embaralhar as perguntas
    selectedQuestions = selectedQuestions.sort(() => 0.5 - Math.random());

    if (mode === 'quick' && count) {
      // Limitar perguntas para o modo rápido (ex: 5)
      selectedQuestions = selectedQuestions.slice(0, count);
    }

    setActiveQuestions(selectedQuestions);
    setView('quiz');
  };

  // Finalizar Quiz
  const handleFinishQuiz = (attempt: QuizAttempt) => {
    const updatedAttempts = saveAttempt(attempt);
    setAttempts(updatedAttempts);
    setReviewAttempt(attempt);
    setView('review'); // Ir direto para a avaliação detalhada das respostas
  };

  // Limpar Histórico
  const handleClearHistory = () => {
    clearHistory();
    setAttempts([]);
  };

  // Visualizar histórico de revisão específico
  const handleViewLastReview = (attempt: QuizAttempt) => {
    setReviewAttempt(attempt);
    setView('review');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans select-none antialiased relative overflow-hidden">
      
      {/* Mesh Gradient Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[25%] right-[10%] w-[40%] h-[35%] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Barra de Navegação Corporativa */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2.5 text-left bg-transparent border-0 cursor-pointer text-white focus:outline-none focus:ring-0 group"
          >
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-lg text-white transition group-hover:scale-105">
              <GraduationCap className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight block text-white group-hover:text-blue-400 transition-colors">
                QUIZ ORGANIZACIONAL
              </span>
              <span className="text-[10px] text-white/50 font-medium font-mono uppercase block -mt-0.5">
                Comportamento Humano e Liderança
              </span>
            </div>
          </button>

          {/* Atalhos Rápidos */}
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer ${
                view === 'dashboard' 
                  ? 'bg-white/10 text-white border border-white/20 shadow-md' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => setView('stats')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer ${
                view === 'stats' 
                  ? 'bg-white/10 text-white border border-white/20 shadow-md' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Estatísticas
            </button>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 relative z-10">
        {view === 'dashboard' && (
          <Dashboard
            attempts={attempts}
            onStartQuiz={handleStartQuiz}
            onViewStats={() => setView('stats')}
            onViewLastReview={handleViewLastReview}
          />
        )}

        {view === 'quiz' && (
          <QuizCard
            questions={activeQuestions}
            mode={activeMode}
            category={activeCategory}
            onFinishQuiz={handleFinishQuiz}
            onBackToMenu={() => setView('dashboard')}
          />
        )}

        {view === 'stats' && (
          <StatsView
            attempts={attempts}
            onClearHistory={handleClearHistory}
            onBackToMenu={() => setView('dashboard')}
          />
        )}

        {view === 'review' && reviewAttempt && (
          <QuizReview
            attempt={reviewAttempt}
            onBackToMenu={() => setView('dashboard')}
          />
        )}
      </main>

      {/* Rodapé Sóbrio */}
      <footer className="border-t border-white/5 py-6 bg-white/[0.02] backdrop-blur-sm relative z-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-mono">
          <div>
            &copy; 2026 Quiz de Comportamento Humano nas Organizações.
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              16 Questões Preparatórias
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              Gabaritos Fundamentados
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
