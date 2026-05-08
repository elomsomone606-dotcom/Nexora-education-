/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  MessageSquare, 
  MessageCircle, 
  Briefcase,
  Menu,
  X, 
  Bell, 
  User,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  LayoutDashboard,
  Settings,
  LogOut,
  Search,
  Moon,
  Sun,
  Play,
  Code2,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, ModuleId, UserProfile } from './types';
import NexoraAI from './components/NexoraAI';
import NexoraEducation from './components/NexoraEducation';
import NexoraCreate from './components/NexoraCreate';
import NexoraUniversity from './components/NexoraUniversity';
import Dashboard from './components/Dashboard';
import CoursePlayer from './components/CoursePlayer';
import AdminPanel from './components/AdminPanel';
import SpeakFlow from './components/SpeakFlow';
import AfricanProject from './components/AfricanProject';
import AICodingAcademy from './components/AICodingAcademy';
import { checkSupabaseConnection } from './services/supabaseClient';
import { aiService } from './services/aiService';

// Mock User Data
const initialUser: UserProfile = {
  id: 'user_123',
  name: 'Koffi Amen',
  xp: 1250,
  level: 5,
  enrolled_courses: ['e1'],
  completed_courses: ['e2'],
  badges: ['badge_python_basic']
};

const MOCK_ENROLLED: Course[] = [
  {
    id: 'e1',
    title: 'Fondamentaux du Design UI/UX',
    description: 'Comprendre les bases du design visuel.',
    category: 'Design',
    price_credits: 0,
    xp_reward: 500,
    content: '...',
    progress: 65,
    instructors: [
      { 
        id: 'i1', 
        name: 'Yannick Noah', 
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        bio: 'Design Expert',
        specialty: 'UI/UX'
      }
    ],
    level: 'Débutant',
    lessons_count: 5,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop'
  }
];

import { storageService } from './services/storageService';
import AfricanAIAdvisor from './components/AfricanAIAdvisor';

const DEFAULT_USER: UserProfile = {
  id: 'user_1',
  name: 'Entrepreneur Nexora',
  xp: 1250,
  level: 5,
  enrolled_courses: ['p1', 'p2'],
  completed_courses: [],
  badges: ['Bienvenue', 'Explorateur']
};

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>(() => {
    const saved = localStorage.getItem('active_module');
    return (saved as ModuleId) || 'dashboard';
  });
  const [user, setUser] = useState<UserProfile>(() => storageService.getUser(DEFAULT_USER));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>('Analyse de votre profil...');
  const [backendStatus, setBackendStatus] = useState({ status: 'checking', message: 'Vérification...' });
  const [learningCourse, setLearningCourse] = useState<Course | null>(null);
  const [activeExercise, setActiveExercise] = useState<any | null>(null);
  const [passedExercises, setPassedExercises] = useState<Set<string>>(new Set());
  const [showSplash, setShowSplash] = useState(true);
  const [showCodingAcademy, setShowCodingAcademy] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('active_module', activeModule);
  }, [activeModule]);

  useEffect(() => {
    storageService.saveUser(user);
  }, [user]);

  const handleUpdateProgress = (courseId: string, progress: number) => {
    storageService.saveCourseProgress(courseId, progress);
    setUser(prev => ({ ...prev })); // Force re-render for progress bars
  };

  const handleCompleteCourse = (courseId: string, xpReward: number) => {
    setUser(prev => {
      if (prev.completed_courses?.includes(courseId)) return prev;
      const newCompleted = [...(prev.completed_courses || []), courseId];
      const newXP = prev.xp + xpReward;
      const newLevel = Math.floor(newXP / 1000) + 1;
      return { ...prev, completed_courses: newCompleted, xp: newXP, level: newLevel };
    });
  };

  const handleSetLearningCourse = (course: Course) => {
    if (!user.enrolled_courses?.includes(course.id)) {
      setUser(prev => ({
        ...prev,
        enrolled_courses: [...(prev.enrolled_courses || []), course.id]
      }));
    }
    setLearningCourse(course);
  };

  const sidebarItems = [
    { id: 'dashboard', name: 'Tableau de bord', icon: LayoutDashboard, desc: 'Vue d\'ensemble' },
    { id: 'education', name: 'Cours Interactifs', icon: BookOpen, desc: 'Cours gratuits' },
    { id: 'university', name: 'Campus Pro', icon: GraduationCap, desc: 'Certifications' },
    { id: 'projects', name: 'African Project', icon: Briefcase, desc: 'Stratégies Elites' },
    { id: 'speakflow', name: 'SpeakFlow English', icon: MessageCircle, desc: 'Anglais IA' },
    { id: 'coding', name: 'Coding Academy', icon: Code2, desc: 'Studio Immersif' },
    { id: 'admin', name: 'Admin Hub', icon: Settings, desc: 'Gestion' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC] text-[#0F172A]'} font-sans transition-colors duration-300 flex overflow-hidden`}>
      
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-[#020617] flex flex-col items-center justify-center p-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_70%)]"></div>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 text-center"
            >
              <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_0_50px_rgba(79,70,229,0.3)] mx-auto mb-12 relative overflow-hidden group">
                 <Sparkles size={64} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-6 uppercase italic">
                NEX<span className="text-indigo-500">ORA</span>
              </h1>
              <p className="text-indigo-400 font-bold text-sm uppercase tracking-[0.5em] mb-12 opacity-80">
                CAMPUS PRO • EXCELLENCE DIGITALE
              </p>
              
              <div className="w-64 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                ></motion.div>
              </div>
            </motion.div>

            {/* Background elements */}
            <div className="absolute bottom-10 left-10 text-slate-800 font-black text-9xl opacity-10 select-none">UNIVERSITY</div>
            <div className="absolute top-10 right-10 text-slate-800 font-black text-9xl opacity-10 select-none">AFRICA</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Player Portal */}
      {learningCourse && (
        <CoursePlayer 
          course={learningCourse} 
          user={user}
          onClose={() => {
            setLearningCourse(null);
            setActiveExercise(null);
          }} 
          onProgressUpdate={handleUpdateProgress}
          onComplete={handleCompleteCourse}
          onExerciseActive={(ex) => setActiveExercise(ex)}
          externalCompletedLessons={passedExercises}
        />
      )}

      {/* Advisor AI for African Project & Campus Pro */}
      {(activeModule === 'projects' || (learningCourse && learningCourse.category === 'Campus Pro')) && (
        <AfricanAIAdvisor 
          activeExercise={activeExercise} 
          courseContext={learningCourse ? {
            title: learningCourse.title,
            instructor: learningCourse.instructors[0]?.name,
            moduleTitle: learningCourse.modules.find(m => m.lessons.some(l => l.id === activeExercise?.id))?.title,
            isFinalExam: activeExercise?.id?.includes('final') || activeExercise?.id?.includes('fin')
          } : undefined}
          onPass={(grade) => {
            if (activeExercise) {
              setPassedExercises(prev => new Set(prev).add(activeExercise.id));
              // Also communicate back to CoursePlayer if it has a ref, 
              // but here we rely on externalCompletedLessons sync
            }
          }}
          isVisible={true}
        />
      )}
      <aside className={`hidden lg:flex flex-col w-20 xl:w-64 border-r ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} transition-all`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Sparkles size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter xl:block hidden uppercase">NEXORA</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as any)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${
                activeModule === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : `${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`
              }`}
            >
              <item.icon size={22} className={activeModule === item.id ? '' : 'group-hover:text-indigo-600'} />
              <span className="font-semibold text-sm xl:block hidden">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200/10 space-y-2">
          <button className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Settings size={22} />
            <span className="font-semibold text-sm xl:block hidden">Réglages</span>
          </button>
          <button className="w-full flex items-center gap-4 p-3 rounded-xl text-rose-500 hover:bg-rose-50/10 transition-all">
            <LogOut size={22} />
            <span className="font-semibold text-sm xl:block hidden">Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className={`sticky top-0 z-40 border-b ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'} backdrop-blur-xl px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors lg:hidden text-slate-500"
              >
                <Menu size={24} />
              </button>
              <div className="relative hidden md:block">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher un cours, une certification..." 
                  className={`pl-10 pr-4 py-2 rounded-xl text-sm w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-transparent'}`}
                />
              </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className={`p-2.5 rounded-xl relative ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
               {/* <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" /> */}
               <User className="text-indigo-600" size={20} />
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
               <ModuleContainer 
                 key={activeModule}
                 moduleId={activeModule} 
                 onBack={() => setActiveModule('dashboard')} 
                 user={user}
                 isDarkMode={isDarkMode}
                 setLearningCourse={handleSetLearningCourse}
                 aiAdvice={aiAdvice}
                 sidebarItems={sidebarItems}
                 onSetActiveModule={setActiveModule}
                 onProgressUpdate={handleUpdateProgress}
                 onComplete={handleCompleteCourse}
               />
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsMenuOpen(false)}
               className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-md lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className={`fixed left-0 top-0 bottom-0 w-80 z-[70] shadow-2xl p-6 lg:hidden ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Sparkles size={20} />
                   </div>
                   <span className="font-black text-xl tracking-tighter uppercase">NEXORA</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                 {sidebarItems.map(item => (
                   <button 
                    key={item.id}
                    onClick={() => { setActiveModule(item.id as any); setIsMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeModule === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'hover:bg-slate-50'}`}
                   >
                     <item.icon size={20} />
                     <span className="font-bold text-sm tracking-tight">{item.name}</span>
                   </button>
                 ))}
              </div>
              
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModuleContainer({ 
  moduleId, 
  onBack, 
  user, 
  isDarkMode, 
  setLearningCourse, 
  aiAdvice, 
  sidebarItems,
  onSetActiveModule,
  onProgressUpdate,
  onComplete
}: { 
  moduleId: ModuleId, 
  onBack: () => void, 
  user: UserProfile, 
  isDarkMode: boolean, 
  setLearningCourse: (c: Course) => void,
  aiAdvice: string,
  sidebarItems: any[],
  onSetActiveModule: (id: any) => void,
  onProgressUpdate: (id: string, prog: number) => void,
  onComplete: (id: string, xp: number) => void
}) {
  const renderModule = () => {
    switch (moduleId) {
      case 'coding':
        return (
          <AICodingAcademy 
            user={user} 
            onClose={() => onSetActiveModule('dashboard')} 
          />
        );
      case 'dashboard': 
        return (
          <Dashboard 
            user={user} 
            onContinueCourse={setLearningCourse} 
            isDarkMode={isDarkMode}
            aiAdvice={aiAdvice}
            sidebarItems={sidebarItems}
            onSetActiveModule={onSetActiveModule}
          />
        );
      case 'admin': return <AdminPanel />;
      case 'projects': return <AfricanProject onStartCourse={setLearningCourse} />;
      case 'speakflow': return <SpeakFlow />;
      case 'education': return (
        <NexoraEducation 
          user={user} 
          onProgressUpdate={onProgressUpdate} 
          onCompleteCourse={onComplete} 
        />
      );
      case 'university': return (
        <NexoraUniversity 
          user={user} 
          onProgressUpdate={onProgressUpdate} 
          onCompleteCourse={onComplete} 
        />
      );
      case 'create': return <NexoraCreate />;
      case 'ai': return <NexoraAI />;
      default:
        return (
          <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-[3rem] p-16 text-center border-2 border-dashed`}>
             <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-indigo-100 shadow-2xl">
                <Sparkles size={48} />
             </div>
             <h3 className="text-4xl font-black mb-4 uppercase italic">Bientôt disponible</h3>
             <p className="max-w-md mx-auto text-slate-500 font-medium mb-10 leading-relaxed text-lg">
                La fonctionnalité <b>{(moduleId as string).toUpperCase()}</b> est en cours de développement par nos ingénieurs.
             </p>
             <button onClick={onBack} className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black shadow-2xl shadow-indigo-600/20 uppercase tracking-widest text-sm italic">
                Retour au Dashboard
             </button>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-10"
    >
      {moduleId !== 'dashboard' && (
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className={`p-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'} shadow-sm`}
          >
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div className="text-left">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">{moduleId} <span className="text-indigo-600">Nexora</span></h2>
            <p className="text-slate-500 font-medium">Plateforme éducative & digitale de nouvelle génération</p>
          </div>
        </div>
      )}

      {renderModule()}
    </motion.div>
  );
}
