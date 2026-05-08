/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  BrainCircuit, 
  Target, 
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Minimize2,
  Maximize2,
  MessageSquare
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AfricanAIAdvisor({ 
  activeExercise, 
  onPass, 
  isVisible = true,
  courseContext 
}: { 
  activeExercise?: any; 
  onPass?: (grade: number) => void; 
  isVisible?: boolean;
  courseContext?: { title: string; instructor?: string; moduleTitle?: string; isFinalExam?: boolean }
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastGrade, setLastGrade] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeExercise) {
      setIsOpen(true);
      setMessages([
        { 
          role: 'assistant', 
          content: `Bienvenue à l'évaluation du module : "${courseContext?.moduleTitle || activeExercise.title}". \n\nJe suis ${courseContext?.instructor || 'votre professeur IA'}. Voici votre sujet : \n${activeExercise.content}\n\nRédigez votre analyse ci-dessous, je vais évaluer votre rigueur universitaire.` 
        }
      ]);
    } else {
      setMessages([
        { 
          role: 'assistant', 
          content: `Bonjour. Je suis ${courseContext?.instructor || 'votre Professeur IA Campus Pro'}. Je suis là pour vous accompagner dans votre apprentissage de "${courseContext?.title || "ce domaine"}". Avez-vous une question sur le cours actuel ?` 
        }
      ]);
    }
  }, [activeExercise, courseContext]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemInstruction = activeExercise 
        ? `Tu es le Professeur IA de Campus Pro. L'utilisateur passe un examen/exercice pour le module : ${courseContext?.moduleTitle}.
           Sujet : ${activeExercise.content}.
           
           TON RÔLE :
           1. Pose des questions de relance si nécessaire pour approfondir la réflexion.
           2. Analyse la qualité académique de la réponse.
           3. Donne une NOTE sur 20 à la fin de l'échange (sois EXTRÊMEMENT EXIGEANT, niveau Université).
           4. FORMAT DE NOTE OBLIGATOIRE : "[NOTE: X/20]".
           5. RÈGLES DE VALIDATION :
              - Pour un exercice standard : il faut au moins 10/20.
              - Pour l'EXAMEN FINAL (${courseContext?.isFinalExam ? 'OUI' : 'NON'}) : il faut au moins 15/20 pour obtenir le certificat.
           6. Si la note est insuffisante, explique pourquoi académiquement.`
        : `Tu es le Professeur IA titulaire de Campus Pro pour le cours : ${courseContext?.title}. 
           Ton ton est académique, bienveillant mais rigoureux. 
           Tes réponses doivent être structurées (Définition, Analyse, Conclusion).`;

      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map(m => ({
            role: m.role === 'assistant' ? 'model' as const : 'user' as const,
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: { systemInstruction }
      });
      const text = response.text || "";
 
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);

      const noteMatch = text.match(/\[NOTE: (\d+)\/20\]/);
      if (noteMatch) {
        const grade = parseInt(noteMatch[1]);
        setLastGrade(grade);
        const threshold = courseContext?.isFinalExam ? 15 : 10;
        if (grade >= threshold && onPass) {
          setTimeout(() => onPass(grade), 3000);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Une erreur de connexion au serveur académique a eu lieu. Ressayons." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible && !activeExercise) return null;

  return (
    <>
      {/* Floating Toggle Button - Reduced Size */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[200] w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center border-2 border-indigo-500 overflow-hidden group"
      >
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <Bot size={28} className="relative z-10" />
         <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className={`fixed bottom-24 right-6 z-[200] w-[340px] h-[480px] bg-white rounded-[2.5rem] shadow-[0_25px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="p-5 bg-[#01142F] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center border border-indigo-400/30">
                   {activeExercise ? <Target size={16} /> : <BrainCircuit size={16} />}
                </div>
                <div>
                   <h4 className="text-[11px] font-black italic uppercase tracking-tight">
                     {activeExercise ? "Évaluation" : "Advisor Nexora"}
                   </h4>
                   <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-indigo-300">Nexora AI</span>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
              >
                <Minimize2 size={16} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth bg-slate-50/30"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[92%] p-4 rounded-[1.2rem] text-[12px] leading-relaxed shadow-sm ${
                     m.role === 'user' 
                     ? 'bg-slate-900 text-white rounded-tr-none' 
                     : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 font-medium'
                   }`}>
                      {m.content}
                   </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-white p-3 rounded-[1.2rem] rounded-tl-none border border-slate-100 italic text-slate-400 text-[10px] flex items-center gap-2 shadow-sm">
                      <Sparkles className="animate-spin text-indigo-500" size={12} />
                      Analyse...
                   </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
               <div className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-xs shadow-inner"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-all disabled:opacity-30"
                  >
                    <Send size={12} />
                  </button>
               </div>
               {activeExercise && lastGrade !== null && lastGrade < 10 && (
                 <p className="text-[9px] text-rose-500 text-center mt-2 font-black uppercase tracking-tighter">
                   Insuffisant ({lastGrade}/20) - Réessayez
                 </p>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
