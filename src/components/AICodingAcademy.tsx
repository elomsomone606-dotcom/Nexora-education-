import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Code2, 
  Send, 
  Play, 
  Terminal, 
  Layout, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Award,
  Sparkles,
  ChevronRight,
  Database,
  Smartphone,
  Globe,
  Settings,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { UserProfile } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  goal: string;
}

interface LanguageOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  extension: string;
  exercises: Exercise[];
}

const LANGUAGES: LanguageOption[] = [
  { 
    id: 'html', 
    name: 'HTML/CSS Strategist', 
    icon: <Globe size={18} />, 
    extension: 'html',
    exercises: [
      {
        id: 'html_1',
        title: 'Structure Sémantique',
        description: 'Créez une structure HTML5 académique avec header, main et footer.',
        goal: 'Utiliser les balises sémantiques correctes pour le SEO et l\'accessibilité.',
        initialCode: '<!-- Exercice 1: Structure Sémantique -->\n<body>\n  <!-- Ajoutez vos balises ici -->\n</body>'
      },
      {
        id: 'html_2',
        title: 'Design Responsif (CSS Grid)',
        description: 'Créez une grille de 3 colonnes qui s\'adapte sur mobile.',
        goal: 'Maîtriser display: grid et les media queries.',
        initialCode: '<div class="container">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>\n\n<style>\n  .container {\n    /* Votre code grid ici */\n  }\n</style>'
      },
      {
        id: 'html_3',
        title: 'Accessibilité & ARIA',
        description: 'Créez une fenêtre modale accessible utilisant les attributs ARIA appropriés.',
        goal: 'Implémenter role="dialog", aria-modal="true" et aria-labelledby pour une accessibilité optimale.',
        initialCode: '<!-- Exercice 3: Modal Accessible -->\n<div id="modal-container">\n  <!-- Créez votre modal ici avec les attributs ARIA -->\n</div>\n\n<style>\n  #modal-container {\n    display: flex;\n    justify-content: center;\n    padding: 2rem;\n  }\n</style>'
      }
    ]
  },
  { 
    id: 'javascript', 
    name: 'JavaScript Engineer', 
    icon: <Code2 size={18} />, 
    extension: 'javascript',
    exercises: [
      {
        id: 'js_1',
        title: 'Logique Algorithmique',
        description: 'Créez une fonction qui calcule la moyenne d\'un tableau de notes.',
        goal: 'Manipuler les tableaux et les boucles/méthodes array.',
        initialCode: 'function calculerMoyenne(notes) {\n  // Votre logique ici\n}\n\nconst mesNotes = [15, 18, 12, 14, 16];\nconsole.log(calculerMoyenne(mesNotes));'
      }
    ]
  },
  { 
    id: 'python', 
    name: 'Python Data Alchemist', 
    icon: <Database size={18} />, 
    extension: 'python',
    exercises: [
      {
        id: 'py_1',
        title: 'Analyse de Données',
        description: 'Filtrez une liste de dictionnaires pour ne garder que les projets rentables.',
        goal: 'List comprehensions et dictionnaires.',
        initialCode: 'projets = [\n    {"nom": "Nexora AI", "profit": 5000},\n    {"nom": "Legacy Tool", "profit": -1200}\n]\n\n# Votre code ici'
      }
    ]
  }
];

import NexoraCertificate from './NexoraCertificate';

export default function AICodingAcademy({ user, onClose }: { user: UserProfile, onClose: () => void }) {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [code, setCode] = useState(selectedLang.exercises[0]?.initialCode || '');
  const [previewContent, setPreviewContent] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview');
  const [progress, setProgress] = useState(0);
  const [passedExercises, setPassedExercises] = useState<Set<string>>(new Set());
  const [showCert, setShowCert] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentExercise = selectedLang.exercises[currentExerciseIdx];

  // Dummy course for certificate
  const academyCourse = {
    id: `cert_${selectedLang.id}`,
    title: `Expertise Académique ${selectedLang.name}`,
    description: `Validation des compétences en ${selectedLang.name} par Nexora Academy.`,
    category: 'Coding Academy',
    price_credits: 0,
    xp_reward: 5000,
    instructors: [{
      id: 'ai_prof',
      name: 'Nexora AI Professor',
      photo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop',
      bio: 'Intelligence Artificielle Enseignante',
      specialty: 'Computer Science'
    }],
    duration: '20h',
    lessons_count: selectedLang.exercises.length,
    content: '',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop'
  };

  useEffect(() => {
    setMessages([
      { 
        role: 'assistant', 
        content: `Bienvenue dans l'Académie Nexora, ${user.name}. \n\nDomaine : ${selectedLang.name}.\n\nModule actuel : **${currentExercise.title}**\n\n${currentExercise.description}\n\nL'IA Enseignante analysera votre code selon la méthode : **Cause, Conséquence, Conseil, Pourquoi, Conclusion**.` 
      }
    ]);
    setCode(currentExercise.initialCode);
  }, [selectedLang.id, currentExerciseIdx]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const runCode = () => {
    if (selectedLang.id === 'html') {
      setPreviewContent(code);
      setActiveTab('preview');
    } else {
      setConsoleOutput(prev => [...prev, `[System] Exécution de ${selectedLang.name}...`, `> Exécution réussie. Vérification par l'IA nécessaire pour validation.`]);
      setActiveTab('console');
    }
  };

  const validateExercise = async () => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: "J'ai terminé mon code. Pouvez-vous le valider ?" }]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Tu es le Professeur Expert de Nexora Academy.
        DOMAIN : ${selectedLang.name}
         EXERCICE : ${currentExercise.title}
        OBJECTIF : ${currentExercise.goal}
        
        CODE DE L'ÉTUDIANT : 
        \`\`\`${selectedLang.extension}
        ${code}
        \`\`\`
        
        TON ANALYSE DOIT SUIVRE CE PLAN STRICT (en français) :
        1. ANALYSE TECHNIQUE (CAUSE/CONSÉQUENCE) : Explique pourquoi le code est bon ou mauvais et les conséquences sur le système.
        2. CONSEIL DE L'EXPERT : Comment l'améliorer pour un niveau professionnel.
        3. LE POURQUOI : Expliquer la notion fondamentale derrière cet exercice.
        4. CONCLUSION : Valider ou non l'exercice.
        
        Si le code est correct et remplit l'objectif, termine OBLIGATOIREMENT ta réponse par le mot-clé "[VALIDATION_OK]". Sinon, explique ce qui manque.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      const text = response.text;
      
      if (text.includes('[VALIDATION_OK]')) {
        setPassedExercises(prev => new Set(prev).add(currentExercise.id));
        const newProgress = Math.round(((passedExercises.size + 1) / (selectedLang.exercises.length)) * 100);
        setProgress(newProgress);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: text.replace('[VALIDATION_OK]', '✅ EXERCICE VALIDÉ ! Excellent travail.') }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Erreur technique lors de la validation académique." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Tu es le Professeur IA de Nexora Academy. 
        L'étudiant travaille sur l'exercice "${currentExercise.title}" en ${selectedLang.name}.
        CODE ACTUEL : 
        \`\`\`${selectedLang.extension}
        ${code}
        \`\`\`
        
        Réponds de manière académique, structurée et pédagogique en français.
        Question : "${userMessage}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Erreur de communication." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-[#020617] flex flex-col font-sans overflow-hidden">
      <AnimatePresence>
        {showCert && (
          <NexoraCertificate 
            user={user} 
            course={academyCourse as any} 
            grade={18} 
            onClose={() => setShowCert(false)} 
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Code2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase italic">AI Coding <span className="text-indigo-500">Academy</span></h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Immersive Studio v2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-800 rounded-xl p-1 gap-1">
            {LANGUAGES.map(lang => (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedLang.id === lang.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {lang.icon}
                <span className="hidden md:inline">{lang.name}</span>
              </button>
            ))}
          </div>
          
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            &times;
          </button>
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Zone 1: AI Professor Chat */}
        <aside className="w-80 lg:w-96 border-r border-white/5 flex flex-col bg-slate-900/30">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
              <Sparkles size={16} /> Professeur IA
            </div>
            <div className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[10px] font-black uppercase">En ligne</div>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === 'assistant' 
                  ? 'bg-slate-800/80 text-slate-200 border border-white/5 shadow-sm' 
                  : 'bg-indigo-600 text-white'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/80 rounded-2xl p-4 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-900/50 border-t border-white/5 space-y-3">
            <button 
              onClick={validateExercise}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
            >
              {isLoading ? <span className="animate-spin text-lg">◌</span> : <CheckCircle2 size={16} />}
              Valider l'exercice
            </button>
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Question au professeur..."
                className="w-full bg-slate-800 border-white/5 border rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              <button 
                onClick={handleSendMessage}
                className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-colors"
                disabled={isLoading}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* Zone 2: Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="h-10 bg-slate-900 flex items-center px-4 justify-between border-b border-white/5">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                  </div>
                  <span className="ml-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     main.{selectedLang.extension}
                  </span>
                </div>
                
                <div className="h-6 w-px bg-white/5 hidden md:block"></div>
                
                <div className="hidden md:flex items-center gap-1">
                  {selectedLang.exercises.map((ex, idx) => (
                    <button
                      key={ex.id}
                      onClick={() => setCurrentExerciseIdx(idx)}
                      className={`w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center transition-all ${
                        currentExerciseIdx === idx 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : passedExercises.has(ex.id)
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : 'bg-slate-800 text-slate-500 hover:text-white'
                      }`}
                    >
                      {passedExercises.has(ex.id) ? <CheckCircle2 size={10} /> : idx + 1}
                    </button>
                  ))}
                </div>
             </div>
             
             <button 
               onClick={runCode}
               className="flex items-center gap-2 bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all group"
             >
               <Play size={14} className="group-hover:fill-current" /> Exécuter
             </button>
          </div>
          
          <div className="flex-1 bg-[#1e1e1e]">
            <Editor
              height="100%"
              defaultLanguage={selectedLang.extension}
              language={selectedLang.extension === 'html' ? 'html' : selectedLang.extension}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 20 },
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            />
          </div>

          {/* Performance Stats Overlay */}
          <div className="absolute bottom-4 right-4 flex gap-4 pointer-events-none">
             <div className="bg-slate-900/80 backdrop-blur-md border border-white/5 rounded-xl p-3 shadow-2xl">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Difficulté Académique</p>
                <div className="flex gap-1">
                   {[1,2,3,4,5].map(i => <div key={i} className={`w-3 h-1 rounded-full ${i <= (currentExerciseIdx + 1) * 2 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>)}
                </div>
             </div>
             <div className="bg-slate-900/80 backdrop-blur-md border border-white/5 rounded-xl p-3 shadow-2xl">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Status Validation</p>
                <p className={`text-sm font-black ${passedExercises.has(currentExercise.id) ? 'text-emerald-500' : 'text-amber-500 uppercase'}`}>
                   {passedExercises.has(currentExercise.id) ? 'VALIDÉ' : 'EN COURS'}
                </p>
             </div>
          </div>
        </div>

        {/* Zone 3: Live Preview / Console */}
        <div className="w-1/3 lg:w-[400px] xl:w-[500px] border-l border-white/5 flex flex-col bg-slate-900/50">
           <div className="flex border-b border-white/5 bg-slate-900/50">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'preview' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Aperçu Direct
              </button>
              <button 
                onClick={() => setActiveTab('console')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'console' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Console Académique
              </button>
           </div>

           <div className="flex-1 p-0 overflow-hidden relative group">
              {activeTab === 'preview' ? (
                selectedLang.id === 'html' ? (
                  <iframe 
                    title="Live Preview"
                    srcDoc={previewContent}
                    className="w-full h-full bg-white border-none"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                     <Terminal size={48} className="text-slate-700 mb-4" />
                     <p className="text-slate-400 font-bold">Le rendu graphique est disponible pour HTML/CSS uniquement.</p>
                     <p className="text-xs text-slate-600 mt-2 italic whitespace-normal">Utilisez la Console Académique pour Python/JS.</p>
                  </div>
                )
              ) : (
                <div className="h-full bg-black/50 font-mono text-xs p-4 overflow-y-auto space-y-1">
                   {consoleOutput.map((line, i) => (
                     <div key={i} className={line.startsWith('[System]') ? 'text-indigo-400 font-bold' : 'text-slate-300'}>
                       {line}
                     </div>
                   ))}
                   {consoleOutput.length === 0 && <span className="text-slate-700 italic">Console vide. Exécutez le code.</span>}
                </div>
              )}

              <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
           </div>
        </div>
      </div>

      {/* Footer Stats */}
      <footer className="h-12 border-t border-white/5 bg-slate-900 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progression Parcours</span>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                ></motion.div>
              </div>
              <span className="text-xs font-black text-indigo-400">{progress}%</span>
           </div>
           
           <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-500">
                <CheckCircle2 size={14} /> 4 Exercices Réussis
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} /> 12 Modules Restants
              </span>
           </div>
        </div>

        <button 
          onClick={() => progress === 100 ? setShowCert(true) : alert("Complétez tous les exercices à 100% pour obtenir votre certification.")}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
            progress === 100 
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-600/20 hover:scale-105' 
            : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          <Award size={14} /> Obtenir Certification
        </button>
      </footer>
    </div>
  );
}
