/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizAttempt } from '../types';
import { QUESTIONS_DATA } from '../questions';
import { CheckCircle2, XCircle, Lightbulb, GraduationCap, ChevronLeft } from 'lucide-react';

interface QuizReviewProps {
  attempt: QuizAttempt;
  onBackToMenu: () => void;
}

export function QuizReview({ attempt, onBackToMenu }: QuizReviewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 flex items-center gap-2 tracking-tight overflow-hidden">
            <GraduationCap className="w-8 h-8 text-blue-400 shrink-0" />
            Revisão Detalhada das Respostas
          </h2>
          <p className="text-white/60 text-sm">Analise sua performance, identifique erros e leia as fundamentações organizacionais teóricas.</p>
        </div>
        <button
          onClick={onBackToMenu}
          className="self-start sm:self-auto px-4 py-2.5 text-xs font-bold bg-white/5 border border-white/10 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar ao Painel
        </button>
      </div>

      {/* Cartão de Resumo - Glassmorphism */}
      <div className="p-6 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[28px] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        <div className="space-y-1 z-10">
          <span className="text-white/40 text-[10px] font-bold tracking-wider uppercase font-mono">Resumo do Quiz</span>
          <h3 className="text-lg font-bold text-white">
            Modo {attempt.mode === 'complete' ? 'Completo (16 questões)' : attempt.mode === 'quick' ? 'Rápido (5 questões)' : 'Focado por Tema'}
          </h3>
          <p className="text-white/50 text-[11px] font-mono">
            Finalizado em: {new Date(attempt.date).toLocaleString('pt-BR')} | Tempo total de resposta: {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s
          </p>
        </div>
        <div className="flex items-center gap-4 z-10">
          <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
          <div className="text-right">
            <span className="text-white/50 text-[11px] block font-semibold uppercase tracking-wider font-mono">Acertos</span>
            <div className="flex items-baseline gap-1 justify-end font-mono mt-0.5">
              <span className="text-3xl font-extrabold text-blue-400">{attempt.score}</span>
              <span className="text-white/30 text-sm">/ {attempt.totalQuestions}</span>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold font-mono shadow-inner shrink-0">
            {Math.round((attempt.score / attempt.totalQuestions) * 100)}% de acerto
          </div>
        </div>
      </div>

      {/* Lista de Perguntas */}
      <div className="space-y-6">
        {attempt.answers.map((answer, index) => {
          const question = QUESTIONS_DATA.find((q) => q.id === answer.questionId);
          if (!question) return null;

          return (
            <div 
              key={question.id} 
              className={`p-6 sm:p-8 rounded-[28px] border bg-white/[0.04] backdrop-blur-xl transition hover:bg-white/[0.06] shadow-2xl space-y-6 ${
                answer.isCorrect 
                  ? 'border-emerald-500/20 shadow-emerald-500/[0.015]' 
                  : 'border-rose-500/20 shadow-rose-500/[0.015]'
              }`}
            >
              {/* Topo da Questão */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center font-mono text-xs font-bold leading-none py-1.5 px-3 rounded-xl bg-white/10 border border-white/5 text-white/95 shadow-sm">
                    Questão {index + 1}
                  </span>
                  <span className="text-white/40 text-[11px] font-medium font-mono">{question.source}</span>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white/50 text-[10px] font-bold uppercase tracking-wider border border-white/10 shrink-0">
                  {question.category}
                </span>
              </div>

              {/* Título e Texto */}
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white leading-snug">{question.title}</h4>
                <div className="text-white/90 text-xs sm:text-sm leading-relaxed whitespace-pre-line p-4 rounded-xl bg-white/[0.02] border border-white/5 font-sans text-justify shadow-inner">
                  {question.text}
                </div>
              </div>

              {/* Alternativas */}
              <div className="mt-6 space-y-2.5">
                {question.options.map((opt) => {
                  const isUserSelection = opt.letter === answer.selectedAnswer;
                  const isCorrectAnswer = opt.letter === question.correctAnswer;
                  
                  let optStyle = 'border-white/10 bg-white/5 text-white/90 opacity-60 hover:opacity-85 hover:bg-white/10';
                  if (isCorrectAnswer) {
                    optStyle = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-medium opacity-100 shadow-md';
                  } else if (isUserSelection && !answer.isCorrect) {
                    optStyle = 'border-rose-500/30 bg-rose-500/10 text-rose-300 font-medium opacity-100 shadow-md';
                  }

                  return (
                    <div 
                      key={opt.letter} 
                      className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-4 transition duration-200 ${optStyle}`}
                    >
                      <span className={`flex items-center justify-center font-mono font-bold w-6 h-6 rounded-lg text-xs leading-none shrink-0 border ${
                        isCorrectAnswer 
                          ? 'bg-emerald-500 text-slate-950 border-emerald-450 font-extrabold shadow-md' 
                          : isUserSelection && !answer.isCorrect
                            ? 'bg-rose-500 text-white border-rose-450 font-extrabold shadow-md'
                            : 'bg-white/10 text-white/50 border-white/10'
                      }`}>
                        {opt.letter}
                      </span>
                      <div className="flex-1 text-white leading-relaxed font-sans">
                        {opt.text}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {isUserSelection && (
                            <span className="text-[10px] font-bold text-white/40 font-mono tracking-wider uppercase bg-white/10 px-2.5 py-0.5 rounded border border-white/5">
                              Sua Escolha
                            </span>
                          )}
                          {isCorrectAnswer && (
                            <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-wider uppercase flex items-center gap-1 bg-emerald-550/10 border border-emerald-550/20 px-2.5 py-0.5 rounded shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Alternativa Correta
                            </span>
                          )}
                          {isUserSelection && !answer.isCorrect && (
                            <span className="text-[10px] font-bold text-rose-400 font-mono tracking-wider uppercase flex items-center gap-1 bg-rose-550/10 border border-rose-550/20 px-2.5 py-0.5 rounded shadow-sm">
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              Sua Resposta Incorreta
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explicação Teórica Completa */}
              <div className="mt-6 p-4 border border-white/5 bg-white/[0.02] shadow-inner rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs uppercase tracking-wider font-mono">
                  <Lightbulb className="w-4 h-4 text-blue-400 animate-pulse" />
                  Fundamentação Acadêmica e Teórica
                </div>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed text-justify font-sans">
                  {question.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botão de Rodapé */}
      <div className="text-center pt-4">
        <button
          onClick={onBackToMenu}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-450 hover:to-purple-550 text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-xs sm:text-sm"
        >
          Voltar ao menu inicial e treinar novamente
        </button>
      </div>
    </div>
  );
}
