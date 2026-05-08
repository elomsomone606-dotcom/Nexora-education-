/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award,
  Zap,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { Quiz, QuizQuestion } from '../types';

interface NexoraQuizProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onClose: () => void;
}

export default function NexoraQuiz({ quiz, onComplete, onClose }: NexoraQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = quiz.questions[currentStep];
  
  const handleAnswer = (optionIndex: number) => {
    if (answers[currentQuestion.id] !== undefined) return;
    
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentStep < quiz.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const score = calculateScore();
  const passed = score >= quiz.minScore;

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto w-full p-12 bg-white rounded-[3rem] border border-slate-100 shadow-2xl text-center flex flex-col items-center"
      >
        <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl ${passed ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
           {passed ? <Award size={48} /> : <RotateCcw size={48} />}
        </div>
        
        <h3 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">
          {passed ? 'Félicitations !' : 'Oups, Presque...'}
        </h3>
        
        <div className="flex items-center gap-6 mb-10">
           <div className="text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Votre Score</p>
              <p className={`text-5xl font-black italic ${passed ? 'text-emerald-600' : 'text-rose-600'}`}>{score}%</p>
           </div>
           <div className="w-px h-12 bg-slate-100"></div>
           <div className="text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Score Requis</p>
              <p className="text-5xl font-black italic text-slate-300">{quiz.minScore}%</p>
           </div>
        </div>

        <p className="text-slate-500 font-medium leading-relaxed mb-12 max-w-sm">
          {passed 
            ? "Vous avez maîtrisé ce module avec succès. Vous gagnez des points XP bonus !" 
            : "Vous n'avez pas atteint le score minimum. Ne vous découragez pas, revoyez le contenu et réessayez !"}
        </p>

        <div className="flex flex-col w-full gap-4">
           {passed ? (
             <button 
               onClick={() => onComplete(score)}
               className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs italic shadow-xl hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-3"
             >
                Terminer le module <ArrowRight size={18} />
             </button>
           ) : (
             <button 
               onClick={() => {
                 setCurrentStep(0);
                 setAnswers({});
                 setIsFinished(false);
               }}
               className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs italic shadow-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3"
             >
                Réessayer le Quiz <RotateCcw size={18} />
             </button>
           )}
           <button 
             onClick={onClose}
             className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs italic text-slate-400 hover:text-slate-600 transition-all"
           >
              Quitter
           </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full p-8 md:p-0">
      <div className="mb-12 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
               <HelpCircle size={24} />
            </div>
            <div>
               <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Question {currentStep + 1} de {quiz.questions.length}</h4>
               <p className="text-xl font-black italic uppercase tracking-tight">{quiz.title}</p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <Zap className="text-amber-500" size={18} />
            <span className="text-base font-black italic">+{Math.round(100/quiz.questions.length)} XP</span>
         </div>
      </div>

      <div className="relative mb-12">
         <div className="h-1 lg:h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }}
              className="h-full bg-indigo-500"
            />
         </div>
      </div>

      <motion.div 
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        <h2 className="text-3xl md:text-4xl font-black leading-tight italic tracking-tighter uppercase">{currentQuestion.question}</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = answers[currentQuestion.id] === idx;
            const isCorrect = idx === currentQuestion.correctAnswer;
            const showFeedback = answers[currentQuestion.id] !== undefined;
            
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`p-8 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${
                  showFeedback 
                    ? isCorrect 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xl scale-105'
                      : isSelected 
                        ? 'bg-rose-50 border-rose-500 text-rose-900'
                        : 'bg-white border-slate-100 opacity-50'
                    : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-xl'
                }`}
                disabled={showFeedback}
              >
                <div className="flex items-center gap-6 relative z-10">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                     showFeedback && isCorrect ? 'bg-emerald-600 text-white' : 
                     showFeedback && isSelected ? 'bg-rose-600 text-white' : 
                     'bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
                   }`}>
                      {String.fromCharCode(65 + idx)}
                   </div>
                   <span className="text-lg font-bold tracking-tight uppercase italic">{option}</span>
                   
                   {showFeedback && isCorrect && <CheckCircle2 className="ml-auto text-emerald-600" size={24} />}
                   {showFeedback && isSelected && !isCorrect && <XCircle className="ml-auto text-rose-600" size={24} />}
                </div>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[2rem] bg-indigo-50 border border-indigo-100"
            >
               <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
                     <Zap size={20} />
                  </div>
                  <div>
                    <h5 className="font-black text-xs uppercase tracking-widest text-indigo-900 mb-2">Explication Stratégique</h5>
                    <p className="text-sm font-medium text-indigo-900/70 leading-relaxed italic">
                      {currentQuestion.explanation || "L'Afrique est un terrain d'opportunités où la compréhension des réalités locales est la clé de la réussite."}
                    </p>
                  </div>
               </div>
               <button 
                 onClick={handleNext}
                 className="mt-8 w-full bg-indigo-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs italic flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl"
               >
                 {currentStep < quiz.questions.length - 1 ? 'Question suivante' : 'Voir les résultats'} <ChevronRight size={18} />
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
