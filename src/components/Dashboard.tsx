/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { QuizAttempt, CategoryType } from '../types';
import { QUESTIONS_DATA } from '../questions';
import { 
  Play, 
  Sparkles, 
  History, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Lightbulb, 
  Brain, 
  BarChart2, 
  GraduationCap, 
  CheckCircle,
  Clock,
  Briefcase
} from 'lucide-react';

interface DashboardProps {
  attempts: QuizAttempt[];
  activeSubject: 'Comportamento Humano nas Organizações' | 'Métodos e Inovação Científica';
  onStartQuiz: (mode: 'complete' | 'quick' | 'themed', count?: number, category?: CategoryType) => void;
  onViewStats: () => void;
  onViewLastReview: (attempt: QuizAttempt) => void;
}

export function Dashboard({ attempts, activeSubject, onStartQuiz, onViewStats, onViewLastReview }: DashboardProps) {
  const [selectedTheme, setSelectedTheme] = useState<CategoryType | 'all'>('all');

  // Identificar qual matéria pertence a tentativa (compatível retroativamente)
  const getAttemptSubject = (attempt: QuizAttempt) => {
    if (attempt.category) {
      return attempt.category === 'Métodos e Inovação Científica' 
        ? 'Métodos e Inovação Científica' 
        : 'Comportamento Humano nas Organizações';
    }
    if (attempt.answers.length > 0) {
      const qId = attempt.answers[0].questionId;
      const q = QUESTIONS_DATA.find(item => item.id === qId);
      if (q) {
        return q.category === 'Métodos e Inovação Científica' 
          ? 'Métodos e Inovação Científica' 
          : 'Comportamento Humano nas Organizações';
      }
    }
    return 'Comportamento Humano nas Organizações';
  };

  // Filtrar tentativas baseadas na matéria ativa
  const filteredAttempts = attempts.filter(att => getAttemptSubject(att) === activeSubject);

  // Determinar recorde do usuário para esta matéria
  const bestAttempt = filteredAttempts.length > 0 
    ? [...filteredAttempts].sort((a, b) => (b.score / b.totalQuestions) - (a.score / a.totalQuestions))[0]
    : null;

  const totalAnswered = filteredAttempts.reduce((acc, curr) => acc + curr.totalQuestions, 0);
  const totalCorrect = filteredAttempts.reduce((acc, curr) => acc + curr.score, 0);
  const actualOverallRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Filtrar categorias específicas da matéria de modo dinâmico
  const categories: CategoryType[] = activeSubject === 'Comportamento Humano nas Organizações'
    ? [
        'Liderança e Poder',
        'Cultura e Clima',
        'Gestão Estratégica & CRM',
        'Inteligência Emocional'
      ]
    : [
        'Métodos e Inovação Científica'
      ];

  const getCategoryCount = (cat: CategoryType) => {
    return QUESTIONS_DATA.filter(q => q.category === cat).length;
  };

  // Filtrar o total de questões disponíveis para a matéria ativa
  const subjectTotalQuestions = QUESTIONS_DATA.filter(q => {
    if (activeSubject === 'Comportamento Humano nas Organizações') {
      return q.category !== 'Métodos e Inovação Científica';
    } else {
      return q.category === 'Métodos e Inovação Científica';
    }
  }).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Banner de Boas-Vindas */}
      <div className="relative overflow-hidden bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <div className="space-y-3 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-400 text-xs font-bold font-mono tracking-wide uppercase border border-white/15 shadow-sm">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            {activeSubject}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {activeSubject === 'Comportamento Humano nas Organizações' 
              ? 'Portal de Treinamento e Quiz Interativo' 
              : 'Metodologia Científica e Normatização'}
          </h1>
          <p className="text-white/70 text-xs sm:text-sm max-w-xl leading-relaxed">
            {activeSubject === 'Comportamento Humano nas Organizações'
              ? 'Domine os conceitos de Liderança, Clima, Cultura, Teorias de Tomada de Decisão e Inteligência Emocional com base em testes acadêmicos oficiais e explicações científicas detalhadas.'
              : 'Aprimore seus conhecimentos em tipos de pesquisas, citações diretas/indiretas, normas ABNT de artigos e projetos, e metodologias de análise qualitativa/quantitativa.'}
          </p>
        </div>

        {/* Resumo Rápido Lateral (Frosted glass) */}
        <div className="w-full md:w-auto shrink-0 bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl flex flex-row md:flex-col justify-around gap-4 min-w-[200px] z-10 shadow-lg">
          <div className="text-center md:text-left">
            <span className="text-white/50 text-[10px] uppercase font-semibold font-mono tracking-wider">Resolvidas</span>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{totalAnswered} questões</div>
          </div>
          <div className="h-[1px] w-full bg-white/10 hidden md:block" />
          <div className="text-center md:text-left">
            <span className="text-white/50 text-[10px] uppercase font-semibold font-mono tracking-wider">Assertividade</span>
            <div className="text-lg font-bold text-blue-400 font-mono mt-0.5">{actualOverallRate}%</div>
          </div>
        </div>
      </div>

      {/* Grid de Opções de Jogos / Simulados */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Painel de Modos de Treino */}
        <div className="md:col-span-8 space-y-6">
          <h2 className="text-base font-bold text-white/80 tracking-wider uppercase flex items-center gap-2">
            <Briefcase className="w-4.5 h-4.5 text-blue-400" />
            Escolha seu Modelo de Treino
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Modo Completo */}
            <div className="p-6 bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:bg-white/[0.06] hover:border-white/15 rounded-2xl shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-blue-400 shadow-md">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Simulado Completo</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Avalie-se respondendo todas as {subjectTotalQuestions} perguntas oficiais desta matéria. Perfeito para simular a prova real.
                </p>
              </div>
              <button
                onClick={() => onStartQuiz('complete')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-450 hover:to-purple-550 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                Iniciar Simulado ({subjectTotalQuestions} Q)
              </button>
            </div>

            {/* Simulado Rápido */}
            <div className="p-6 bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:bg-white/[0.06] hover:border-white/15 rounded-2xl shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-purple-400 shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Treino Rápido</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Sem tempo para o simulado completo? Responda 5 questões sorteadas do banco exclusivo desta matéria.
                </p>
              </div>
              <button
                onClick={() => onStartQuiz('quick', 5)}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                Treino Rápido (5 Q)
              </button>
            </div>

          </div>

          {/* Treinamento Focado - Segmentação por Categoria */}
          <div className="p-6 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl space-y-5">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Estudo Temático Segmentado</h3>
              <p className="text-white/60 text-xs leading-relaxed">Deseja focar em um tópico específico de {activeSubject === 'Comportamento Humano nas Organizações' ? 'Comportamento Humano' : 'Metodologia'}? Selecione abaixo:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const count = getCategoryCount(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => onStartQuiz('themed', count, cat)}
                    className="p-4 bg-white/5 hover:bg-white/10 hover:border-white/25 border border-white/10 rounded-xl text-left transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer group"
                  >
                    <span className="text-white/90 text-xs font-bold leading-tight group-hover:text-blue-400 transition-colors">{cat}</span>
                    <span className="text-[10px] font-mono text-white/40 group-hover:text-white/50 transition-colors">{count} questões disponíveis</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Barra Lateral de Progresso e Conquistas */}
        <div className="md:col-span-4 space-y-6">
          <h2 className="text-base font-bold text-white/80 tracking-wider uppercase flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-blue-400" />
            Progresso & Histórico
          </h2>

          {/* Card Recorde */}
          <div className="p-6 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white/90 flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5 text-yellow-500" />
              Melhor Desempenho
            </h3>

            {bestAttempt ? (
              <div className="space-y-3">
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-extrabold text-white">{bestAttempt.score}</span>
                  <span className="text-white/40 text-sm">/ {bestAttempt.totalQuestions}</span>
                  <span className="text-blue-400 text-xs font-bold ml-2">
                    ({Math.round((bestAttempt.score / bestAttempt.totalQuestions) * 100)}%)
                  </span>
                </div>
                <p className="text-white/40 text-[10px] font-mono">
                  Conquistado em: {new Date(bestAttempt.date).toLocaleDateString('pt-BR')}
                </p>
                <div className="flex gap-2 pt-1.5">
                  <button
                    onClick={() => onViewLastReview(bestAttempt)}
                    className="flex-1 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-2xs font-semibold text-center transition cursor-pointer"
                  >
                    Revisar Gabarito
                  </button>
                  <button
                    onClick={onViewStats}
                    className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 text-2xs font-semibold text-center transition cursor-pointer"
                  >
                    Estatísticas
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-2.5">
                <Brain className="w-10 h-10 mx-auto text-white/20 animate-pulse" />
                <p className="text-white/40 text-xs leading-relaxed">
                  Não há tentativas nesta matéria. Seu recorde aparecerá aqui assim que concluir um simulado.
                </p>
              </div>
            )}
          </div>

          {/* Histórico Consolidado Rápido */}
          <div className="p-6 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white/90 flex items-center gap-1.5">
                <History className="w-4.5 h-4.5 text-blue-400" />
                Atividades Recentes
              </h3>
              {filteredAttempts.length > 0 && (
                <button 
                  onClick={onViewStats}
                  className="text-blue-400 hover:text-blue-300 text-3xs font-mono uppercase tracking-wider cursor-pointer font-bold"
                >
                  Ver Tudo
                </button>
              )}
            </div>

            {filteredAttempts.length > 0 ? (
              <div className="space-y-3.5 max-h-[190px] overflow-y-auto pr-1">
                {filteredAttempts.slice(0, 3).map((att) => {
                  const pct = Math.round((att.score / att.totalQuestions) * 100);
                  return (
                    <div 
                      key={att.id} 
                      onClick={() => onViewLastReview(att)}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl flex items-center justify-between gap-3 transition-all cursor-pointer shadow-sm group"
                    >
                      <div className="space-y-0.5">
                        <span className="text-white/80 group-hover:text-white text-3xs font-extrabold block leading-none transition-colors">
                          Modo {att.mode === 'complete' ? 'Completo' : att.mode === 'quick' ? 'Rápido' : 'Segmentado'}
                        </span>
                        <span className="text-[9px] font-mono text-white/40">
                          {new Date(att.date).toLocaleDateString('pt-BR')} | {Math.floor(att.timeSpent / 60)}m {att.timeSpent % 60}s
                        </span>
                      </div>
                      <span className={`font-mono text-xs font-bold ${pct >= 75 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {att.score}/{att.totalQuestions}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-white/40 text-xs leading-relaxed text-center py-4">
                Nenhum registro nesta matéria ainda.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
