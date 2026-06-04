/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Question, QuizAttempt } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  HelpCircle, 
  ChevronRight, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Timer, 
  HelpCircleIcon, 
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';

interface QuizCardProps {
  questions: Question[];
  mode: 'complete' | 'quick' | 'themed';
  category?: string;
  onFinishQuiz: (attempt: QuizAttempt) => void;
  onBackToMenu: () => void;
}

export function QuizCard({ questions, mode, category, onFinishQuiz, onBackToMenu }: QuizCardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false); // Travado após responder para ver o feedback
  const [answers, setAnswers] = useState<{ questionId: number; selectedAnswer: string; isCorrect: boolean }[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  
  // Timer de tempo total
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentQuestion = questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  // Formatar tempo (ex: 02:45)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (letter: string) => {
    if (isLocked) return;
    setSelectedLetter(letter);
  };

  const handleConfirmAnswer = () => {
    if (!selectedLetter || isLocked) return;

    const isCorrect = selectedLetter === currentQuestion.correctAnswer;
    setIsLocked(true);

    // Salvar resposta da questão
    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedAnswer: selectedLetter,
        isCorrect,
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedLetter(null);
      setIsLocked(false);
    } else {
      // Finalizou o Quiz! Computar pontuação
      const finalScore = answers.reduce((acc, curr) => curr.isCorrect ? acc + 1 : acc, 0);
      
      const newAttempt: QuizAttempt = {
        id: Math.random().toString(36).substring(2, 11),
        date: new Date().toISOString(),
        score: finalScore,
        totalQuestions: questions.length,
        timeSpent,
        mode,
        category: category as any,
        answers: [
          ...answers,
          // Caso faltar a última resposta na lista de estado por questão de delay
          ...(answers.some(a => a.questionId === currentQuestion.id) 
            ? [] 
            : [{ questionId: currentQuestion.id, selectedAnswer: selectedLetter!, isCorrect: selectedLetter === currentQuestion.correctAnswer }])
        ]
      };

      // Corrigir possíveis inconsistências de tamanho de array devido a cliques rápidos
      if (newAttempt.answers.length > questions.length) {
        newAttempt.answers = newAttempt.answers.slice(0, questions.length);
      }

      onFinishQuiz(newAttempt);
    }
  };

  // Encontrar se a resposta corrente já foi adicionada nas answers salvos neste turno
  const currentSavedAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const hasUserAnsweredSuccessfully = isLocked || !!currentSavedAnswer;
  const isCurrentCorrect = currentSavedAnswer ? currentSavedAnswer.isCorrect : (selectedLetter === currentQuestion.correctAnswer);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Barra de Progresso e Timer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="font-mono text-xs font-bold text-blue-400 shrink-0">
            {currentIdx + 1} de {questions.length}
          </span>
          {/* Bolinhas de progresso visual */}
          <div className="flex gap-1.5 overflow-x-auto py-1 max-w-[200px] sm:max-w-xs scrollbar-none">
            {questions.map((_, idx) => {
              const ansObj = answers[idx];
              let dotBg = 'bg-white/5 border-white/10';
              if (idx === currentIdx) {
                dotBg = 'bg-blue-500 border-blue-400 ring-2 ring-blue-500/20';
              } else if (ansObj) {
                dotBg = ansObj.isCorrect ? 'bg-emerald-500 border-emerald-450 shadow-sm shadow-emerald-500/20' : 'bg-rose-500 border-rose-450 shadow-sm shadow-rose-500/20';
              }
              return (
                <div 
                  key={idx} 
                  className={`w-3.5 h-3.5 rounded-full border transition-all shrink-0 ${dotBg}`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-white bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium shadow-inner">
            <Clock className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Tempo: {formatTime(timeSpent)}</span>
          </div>
          <button
            onClick={onBackToMenu}
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition flex items-center gap-1 font-semibold bg-rose-500/5 border border-rose-505/20 px-3.5 py-1.5 rounded-xl cursor-pointer"
          >
            <Flag className="w-3 h-3 text-rose-450" />
            Encerrar Quiz
          </button>
        </div>
      </div>

      {/* Friso da Barra de Progresso Real */}
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Card da Questão */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="p-6 sm:p-8 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl space-y-6"
        >
          {/* Cabeçalho da questão */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-purple-400 font-mono uppercase tracking-widest">{currentQuestion.category}</span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{currentQuestion.title}</h3>
            </div>
            <span className="text-[10px] font-bold text-white/60 font-mono bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 shrink-0 shadow-sm">
              {currentQuestion.source}
            </span>
          </div>

          {/* Enunciado detalhado */}
          <div className="text-white/90 text-xs sm:text-sm leading-relaxed p-4 bg-white/[0.02] border border-white/5 rounded-xl max-h-[350px] overflow-y-auto whitespace-pre-line text-justify font-sans shadow-inner">
            {currentQuestion.text}
          </div>

          {/* Alternativas */}
          <div className="space-y-3">
            <span className="text-white/50 font-bold text-xs tracking-wider uppercase block font-mono">OPÇÕES:</span>
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedLetter === opt.letter;
                const isCorrectAns = opt.letter === currentQuestion.correctAnswer;
                
                let buttonStyle = 'border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white/90 shadow-sm';
                let numberStyle = 'bg-white/10 text-white/60 border-white/10';

                // Se o usuário selecionou antes de registrar resposta
                if (isSelected && !hasUserAnsweredSuccessfully) {
                  buttonStyle = 'border-blue-500 bg-blue-500/10 text-white ring-2 ring-blue-500/20';
                  numberStyle = 'bg-blue-500 text-white font-bold border-blue-400 shadow-md';
                }

                // Se a resposta já foi travada para feedback
                if (hasUserAnsweredSuccessfully) {
                  if (isCorrectAns) {
                    buttonStyle = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-medium shadow-inner';
                    numberStyle = 'bg-emerald-500 text-slate-950 font-bold border-emerald-450 shadow-md';
                  } else if (isSelected && !isCurrentCorrect) {
                     buttonStyle = 'border-rose-500/50 bg-rose-500/10 text-rose-300 font-medium shadow-inner';
                     numberStyle = 'bg-rose-500 text-white font-bold border-rose-450 shadow-md';
                  } else {
                     buttonStyle = 'border-white/5 bg-transparent text-white/30 opacity-40';
                     numberStyle = 'bg-white/5 text-white/30 border-white/5';
                  }
                }

                return (
                  <button
                    key={opt.letter}
                    onClick={() => handleOptionSelect(opt.letter)}
                    disabled={hasUserAnsweredSuccessfully}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-4 transition duration-200 ${buttonStyle} ${!hasUserAnsweredSuccessfully ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span className={`flex items-center justify-center font-mono font-bold w-6 h-6 rounded-lg text-xs shrink-0 border transition-all ${numberStyle}`}>
                      {opt.letter}
                    </span>
                    <span className="leading-relaxed mt-0.5 font-sans transition-colors">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seção de Feedback Imediato */}
          <AnimatePresence>
            {hasUserAnsweredSuccessfully && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-white/10 pt-5 mt-4 space-y-4"
              >
                {/* Alerta de Resultado */}
                <div className={`p-4 rounded-xl flex items-start gap-3 border ${
                  isCurrentCorrect 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 shadow-sm' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-300 shadow-sm'
                }`}>
                  {isCurrentCorrect ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold">
                      {isCurrentCorrect ? 'Parabéns, você acertou!' : `Incorreto. A alternativa de gabarito é a letra ${currentQuestion.correctAnswer}.`}
                    </h4>
                    <p className="text-white/60 text-xs leading-relaxed">
                      Veja abaixo a fundamentação acadêmica que contextualiza essa escolha operacional e as táticas gerenciais.
                    </p>
                  </div>
                </div>

                {/* Explicação Conceitual */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 shadow-inner space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold uppercase tracking-wider font-mono">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    Justificativa e Análise de Comportamento
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed text-justify font-sans">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Barra de Ação Inferior */}
          <div className="flex items-center justify-between border-t border-white/10 pt-5 mt-4 text-white/45">
            <span className="text-[10px] sm:text-3xs font-mono block">
              Quiz de Comportamento Humano nas Organizações
            </span>
            
            <div className="flex items-center gap-2">
              {!hasUserAnsweredSuccessfully ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={!selectedLetter}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition duration-250 ${
                    selectedLetter 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-450 hover:to-purple-550 text-white shadow-lg shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer' 
                      : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmar Resposta
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-450 hover:to-indigo-550 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition duration-250 shadow-lg shadow-purple-500/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  {currentIdx === questions.length - 1 ? 'Ver Resultado Final' : 'Próxima Questão'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
