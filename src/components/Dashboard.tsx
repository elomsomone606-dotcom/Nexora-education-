/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  ChevronRight,
  Flame,
  Star,
  Target,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, Course, ModuleId } from '../types';
import { MOCK_COURSES } from '../data/courses';
import { storageService } from '../services/storageService';

interface DashboardProps {
  user: UserProfile;
  onContinueCourse: (course: Course) => void;
  isDarkMode: boolean;
  aiAdvice: string;
  sidebarItems: any[];
  onSetActiveModule: (id: ModuleId) => void;
}

export default function Dashboard({ 
  user, 
  onContinueCourse, 
  isDarkMode, 
  aiAdvice, 
  sidebarItems,
  onSetActiveModule
}: DashboardProps) {
  // Use real enrolled courses from localStorage
  const ongoingCourses = storageService.getEnrolledCourses(MOCK_COURSES);
  
  // Fallback to mock if none enrolled
  const displayedCourses = ongoingCourses.length > 0 ? ongoingCourses : MOCK_COURSES.slice(0, 2).map(c => ({
    ...c,
    progress: 0
  }));

  const stats = [
    { label: 'Heures d\'étude', value: '4h', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Cours terminés', value: user.completed_courses?.length || 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Points XP', value: user.xp, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Badges', value: user.badges?.length || 0, icon: Award, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-12 pb-20 text-left">
      {/* Dashboard Header Integration */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">Bonjour, {user.name} 👋</h2>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>C'est un excellent jour pour apprendre quelque chose de nouveau.</p>
        </div>
        
        {/* AI Wisdom Card */}
        <div className={`flex-1 max-w-md w-full p-6 rounded-3xl border-2 ${isDarkMode ? 'bg-indigo-900/10 border-indigo-500/20 text-indigo-100' : 'bg-indigo-50 border-indigo-100 text-indigo-900'} relative overflow-hidden`}>
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 mt-1">
                  <Sparkles className="text-white" size={20} />
              </div>
              <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">CONSEIL IA NEXORA</p>
                  <p className="text-sm font-semibold leading-relaxed">
                    {aiAdvice}
                  </p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <Sparkles size={100} />
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:bg-slate-900 hover:border-slate-800 transition-all duration-500"
           >
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                 <stat.icon size={28} />
              </div>
              <p className="text-3xl font-black text-slate-900 group-hover:text-white transition-colors">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 group-hover:text-slate-500">{stat.label}</p>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Ongoing Courses */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h4 className="text-xl font-black uppercase tracking-tighter italic">Continuer l'apprentissage</h4>
               <button className="text-indigo-600 font-bold text-sm hover:underline">Voir tout</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {displayedCourses.map(course => (
                 <div key={course.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col h-full group">
                    <img src={course.image} className="w-full h-40 object-cover rounded-[1.5rem] mb-6 shadow-md" alt="" />
                    <h5 className="text-xl font-black mb-2 line-clamp-1 uppercase tracking-tight italic">{course.title}</h5>
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                       <span>{course.progress}% terminés</span>
                       <span>8 Leçons restantes</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
                       <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <button 
                      onClick={() => onContinueCourse(course)}
                      className="mt-auto w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                    >
                       Reprendre le cours
                    </button>
                 </div>
               ))}
            </div>
         </div>

         {/* Right Sidebar: Recommended & Achievements */}
         <div className="space-y-10">
            {/* Success Card */}
            <div className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                  <Target size={32} className="mb-4 text-amber-400" />
                  <h5 className="text-xl font-black mb-2">Prochaine étape</h5>
                  <p className="text-sm font-medium text-indigo-100/80 mb-6">Validez le quiz de "Python pour les Débutants" pour obtenir votre badge de base.</p>
                  <div className="flex items-center justify-between bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                     <span className="text-xs font-bold">Progression Quiz</span>
                     <span className="text-xs font-black">7/10</span>
                  </div>
               </div>
               <BarChart3 className="absolute right-[-10%] bottom-[-10%] w-32 h-32 opacity-10 -rotate-12" />
            </div>

            {/* Badges List */}
            <div className="space-y-6 text-left">
               <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 px-2">Mes Badges</h4>
               <div className="grid grid-cols-3 gap-4">
                  {(user.badges || [1, 2, 3]).map((badge, i) => (
                    <div key={i} className="aspect-square rounded-[1.5rem] bg-white border border-slate-100 shadow-sm flex items-center justify-center p-4 group transition-all hover:border-indigo-500/20 hover:scale-105">
                       <div className="w-full h-full rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl italic group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {typeof badge === 'string' ? badge.charAt(0) : <Star size={20} />}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Explore Grid */}
            <div className="space-y-6 pt-10 border-t border-slate-100 dark:border-slate-800">
               <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 px-2">Explorer Nexora</h4>
               <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                  {sidebarItems.slice(1, 4).map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSetActiveModule(item.id as ModuleId)}
                      className={`p-6 rounded-[2rem] border flex flex-col gap-4 cursor-pointer transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-xl shadow-sm'}`}
                    >
                      <div className={`w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-base font-black tracking-tight uppercase italic">{item.name}</h4>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
