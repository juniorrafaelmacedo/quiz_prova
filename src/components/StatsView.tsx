/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { QuizAttempt, CategoryType } from '../types';
import { QUESTIONS_DATA } from '../questions';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  BarChart3, 
  Trash2,
  TrendingUp,
  Brain,
  HelpCircle,
  TrendingDown
} from 'lucide-react';

interface StatsViewProps {
  attempts: QuizAttempt[];
  activeSubject: 'Comportamento Humano nas Organizações' | 'Métodos e Inovação Científica';
  onClearHistory: () => void;
  onBackToMenu: () => void;
}

export function StatsView({ attempts, activeSubject, onClearHistory, onBackToMenu }: StatsViewProps) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

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

  // Se não houver tentativas para esta matéria
  if (filteredAttempts.length === 0) {
    return (
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 text-white p-8 rounded-3xl max-w-2xl mx-auto shadow-2xl text-center space-y-6">
        <Trophy className="w-16 h-16 mx-auto text-yellow-500/20 animate-pulse" />
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Sem histórico para {activeSubject === 'Comportamento Humano nas Organizações' ? 'Comportamento Humano' : 'Inovação Científica'}</h2>
        <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
          Você ainda não realizou nenhuma tentativa de quiz nesta matéria. Suas estatísticas de desempenho detalhado, gráficos de acertos e relatórios de progresso aparecerão aqui assim que completar a primeira rodada.
        </p>
        <button
          onClick={onBackToMenu}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-450 hover:to-purple-550 text-white font-bold text-xs transition duration-300 shadow-lg hover:scale-[1.02] cursor-pointer"
        >
          Ir para o painel principal
        </button>
      </div>
    );
  }

  // Cálculos consolidados para as tentativas filtradas
  const totalAttempts = filteredAttempts.length;
  let totalMinutes = 0;
  let totalCorrect = 0;
  let totalAnswered = 0;

  // Mapear acertos por categorias da matéria ativa
  const categoriesList = activeSubject === 'Comportamento Humano nas Organizações'
    ? ['Liderança e Poder', 'Cultura e Clima', 'Gestão Estratégica & CRM', 'Inteligência Emocional'] as CategoryType[]
    : ['Métodos e Inovação Científica'] as CategoryType[];

  const catStats = {} as Record<CategoryType, { answered: number; correct: number }>;
  categoriesList.forEach((cat) => {
    catStats[cat] = { answered: 0, correct: 0 };
  });

  filteredAttempts.forEach((att) => {
    totalMinutes += att.timeSpent;
    totalCorrect += att.score;
    totalAnswered += att.totalQuestions;

    att.answers.forEach((ans) => {
      const q = QUESTIONS_DATA.find((item) => item.id === ans.questionId);
      if (q && categoriesList.includes(q.category)) {
        catStats[q.category].answered += 1;
        if (ans.isCorrect) {
          catStats[q.category].correct += 1;
        }
      }
    });
  });

  const averageCorrectRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const averageSpentTime = Math.round(totalMinutes / totalAttempts);

  // Encontrar ponto forte e ponto fraco
  const performanceByCategory = categoriesList.map((cat) => {
    const stats = catStats[cat];
    const rate = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;
    return { category: cat, ...stats, rate };
  });

  // Ordenar por percentual de acerto para achar o forte/fraco
  const sortedByPerf = [...performanceByCategory].sort((a, b) => b.rate - a.rate);
  const strongestCategory = sortedByPerf[0]?.answered > 0 ? sortedByPerf[0] : null;
  const weakestCategory = sortedByPerf[sortedByPerf.length - 1]?.answered > 0 ? sortedByPerf[sortedByPerf.length - 1] : null;

  // Formatar tempo (ex: 1m 24s)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">Seu Desempenho</h2>
          <p className="text-white/60 text-sm">Acompanhe sua performance analítica e o domínio das táticas organizacionais.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToMenu}
            className="px-4 py-2 text-xs font-bold border border-white/10 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            Voltar ao Menu
          </button>
          <button
            onClick={() => setShowConfirmClear(true)}
            className="px-4 py-2 text-xs font-bold border border-rose-500/20 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 bg-rose-500/5 backdrop-blur-md rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Limpar Histórico
          </button>
        </div>
      </div>

      {/* Confirmar exclusão */}
      {showConfirmClear && (
        <div className="p-5 border border-rose-500/20 bg-rose-500/10 backdrop-blur-md rounded-2xl animate-in fade-in zoom-in duration-200">
          <h4 className="text-rose-250 font-bold mb-1 col">Tem certeza que deseja limpar todo o histórico?</h4>
          <p className="text-rose-350 text-xs mb-4">Esta ação é irreversível e excluirá o registro de todas as suas rodadas anteriores e estatísticas salvos no navegador.</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onClearHistory();
                setShowConfirmClear(false);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
            >
              Sim, Apagar Histórico
            </button>
            <button
              onClick={() => setShowConfirmClear(false)}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 font-bold text-xs transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Grid de Métricas Principais (Bento-style Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-blue-450 mb-4">
            <Trophy className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-white/50 text-xs font-semibold block mb-1">Tentativas</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white font-mono">{totalAttempts}</span>
            <span className="text-white/40 text-xs font-mono">rodadas</span>
          </div>
        </div>

        <div className="p-5 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-purple-450 mb-4 font-mono font-bold text-sm">
            <span className="text-purple-400">%</span>
          </div>
          <span className="text-white/50 text-xs font-semibold block mb-1">Assertividade</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white font-mono">{averageCorrectRate}%</span>
            <span className="text-white/40 text-xs font-mono">média</span>
          </div>
        </div>

        <div className="p-5 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-emerald-400 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-white/50 text-xs font-semibold block mb-1">Respostas Certas</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white font-mono">{totalCorrect}</span>
            <span className="text-white/40 text-xs font-mono">/ {totalAnswered} total</span>
          </div>
        </div>

        <div className="p-5 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-amber-400 mb-4">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-white/50 text-xs font-semibold block mb-1">Tempo Médio</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white font-mono">{formatTime(averageSpentTime)}</span>
            <span className="text-white/40 text-xs font-mono">por quiz</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Gráfico de Barras SVG por categoria */}
        <div className="md:col-span-8 p-6 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <BarChart3 className="w-4.5 h-4.5 text-blue-400" />
              Taxa de Acertos por Tema
            </h3>
            <p className="text-white/60 text-xs">Percentual de assertividade segmentado pelas grandes áreas do estudo organizativo.</p>
          </div>

          <div className="space-y-5">
            {performanceByCategory.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white/90">{item.category}</span>
                  <span className="text-white/60 font-mono">
                    {item.answered > 0 ? `${item.rate}% (${item.correct}/${item.answered})` : 'Sem respostas'}
                  </span>
                </div>
                {/* Barra de progresso */}
                <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden flex border border-white/5">
                  {item.answered > 0 ? (
                    <>
                      <div 
                        className="h-full bg-gradient-to-r from-blue-450 to-purple-500 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${item.rate}%` }}
                      />
                      <div 
                        className="h-full bg-rose-500/20 rounded-r-full transition-all duration-500 ease-out" 
                        style={{ width: `${100 - item.rate}%` }}
                      />
                    </>
                  ) : (
                    <div className="h-full w-full bg-white/5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights de Performance */}
        <div className="md:col-span-4 p-6 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Brain className="w-4.5 h-4.5 text-blue-400" />
              Insights Cognitivos
            </h3>
            <p className="text-white/60 text-xs leading-relaxed">Diagnóstico automático gerado com base no seu histórico acumulado de estudos.</p>
          </div>

          <div className="space-y-4 flex-1">
            {/* Ponto Forte */}
            {strongestCategory && strongestCategory.rate > 0 ? (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Ponto Forte
                </div>
                <h4 className="text-white/90 text-xs font-bold leading-tight">{strongestCategory.category}</h4>
                <p className="text-white/50 text-[10px] leading-tight font-mono">Precisão de {strongestCategory.rate}% de acertos nesta categoria.</p>
              </div>
            ) : (
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-center text-white/50 text-xs py-5">
                <HelpCircle className="w-5 h-5 mx-auto mb-2 text-white/30" />
                Destaques aparecerão aqui.
              </div>
            )}

            {/* Ponto Fraco */}
            {weakestCategory && weakestCategory.rate < 100 && weakestCategory.answered > 0 ? (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider font-mono">
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  Aprimoramento
                </div>
                <h4 className="text-white/90 text-xs font-bold leading-tight">{weakestCategory.category}</h4>
                <p className="text-white/50 text-[10px] leading-tight font-mono">Assertividade em {weakestCategory.rate}%. Recomenda-se focar na revisão destes tópicos.</p>
              </div>
            ) : null}
          </div>

          <div className="pt-2">
            <p className="text-white/40 text-[10px] leading-relaxed text-center font-mono">
              Atualizado em tempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Histórico Recente de Tentativas */}
      <div className="p-6 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Últimas Atividades</h3>
          <p className="text-white/60 text-xs">Histórico cronológico detalhado das suas rodadas de quiz respondidas para esta matéria.</p>
        </div>

        <div className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-inner">
          {filteredAttempts.slice(0, 5).map((attempt) => {
            const formattedDate = new Date(attempt.date).toLocaleString('pt-BR', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            });

            const percentAttempt = Math.round((attempt.score / attempt.totalQuestions) * 100);

            return (
              <div key={attempt.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition text-xs sm:text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">
                      Modo {attempt.mode === 'complete' ? 'Completo' : attempt.mode === 'quick' ? 'Rápido' : 'Segmentado'}
                    </span>
                    {attempt.category && (
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px] border border-white/10 font-bold">
                        {attempt.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-white/50 text-xs">
                    <span className="font-mono">{formattedDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-white/45" />
                      {formatTime(attempt.timeSpent)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white font-mono text-base">
                      {attempt.score} <span className="text-xs font-normal text-white/40">/ {attempt.totalQuestions}</span>
                    </div>
                    <div className={`text-xs font-extrabold font-mono ${percentAttempt >= 70 ? 'text-emerald-455' : percentAttempt >= 45 ? 'text-amber-455' : 'text-rose-455'}`}>
                      {percentAttempt}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
