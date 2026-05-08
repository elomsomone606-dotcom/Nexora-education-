/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Filter, Play, Award, Clock, BookOpen, ChevronRight, CheckCircle2, X as CloseIcon, Loader2, User, Star, Globe, Settings as AdminIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, UserProfile } from '../types';
import { MOCK_COURSES } from '../data/courses';
import CoursePlayer from './CoursePlayer';

interface NexoraEducationProps {
  user: UserProfile;
  onProgressUpdate: (id: string, prog: number) => void;
  onCompleteCourse: (id: string, xp: number) => void;
}

export default function NexoraEducation({ user, onProgressUpdate, onCompleteCourse }: NexoraEducationProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [learningCourse, setLearningCourse] = useState<Course | null>(null);
  const [filter, setFilter] = useState('Tous');
  const [levelFilter, setLevelFilter] = useState('Tous');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const categories = ['Tous', 'Design', 'Marketing', 'Développement', 'African Project'];
  const levels = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];

  const filteredCourses = MOCK_COURSES.filter(c => 
    (filter === 'Tous' || c.category === filter) && 
    (levelFilter === 'Tous' || c.level === levelFilter)
  );

  const handleCertify = async (course: Course) => {
    setIsEnrolling(true);
    setTimeout(() => {
      setIsEnrolling(false);
      alert(`Félicitations ! Votre demande de certification pour "${course.title}" a été enregistrée. Elle sera traitée gratuitement sous peu.`);
      setSelectedCourse(null);
    }, 1500);
  };

  const handleStartCourse = (course: Course) => {
    setLearningCourse(course);
    setSelectedCourse(null);
  };

  if (learningCourse) {
    return (
      <CoursePlayer 
        course={learningCourse} 
        user={user}
        onClose={() => setLearningCourse(null)} 
        onProgressUpdate={onProgressUpdate}
        onComplete={onCompleteCourse}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Info & Admin Toggle */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-indigo-50 border border-indigo-100 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100 border border-indigo-50">
            <BookOpen size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#0F172A] mb-1 text-left uppercase italic italic">Apprentissage 100% Gratuit</h3>
            <p className="text-indigo-600/70 font-medium text-left">Accédez à tous les cours et obtenez vos certificats sans aucun frais.</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAdminMode(!isAdminMode)}
          className={`p-8 rounded-[2.5rem] border flex flex-col items-center justify-center gap-2 transition-all group ${
            isAdminMode ? 'bg-slate-900 text-white border-slate-800' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'
          }`}
        >
          <AdminIcon size={32} className={isAdminMode ? 'text-indigo-400' : 'group-hover:text-indigo-600'} />
          <span className="text-[10px] font-black uppercase tracking-widest">Admin Hub</span>
        </button>
      </div>

      {isAdminMode && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-[2rem] p-8 text-white border border-slate-800"
        >
           <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-black uppercase tracking-tighter italic">Gestion des Contenus (Admin)</h4>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">+ Nouveau Cours</button>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   <tr>
                      <th className="pb-4">Cours</th>
                      <th className="pb-4">Instructeurs</th>
                      <th className="pb-4">Leçons</th>
                      <th className="pb-4">Actions</th>
                   </tr>
                </thead>
                <tbody className="text-sm font-medium">
                   {MOCK_COURSES.map(course => (
                     <tr key={course.id} className="border-t border-slate-800">
                        <td className="py-4">{course.title}</td>
                        <td className="py-4">{course.instructors.map(i => i.name).join(', ')}</td>
                        <td className="py-4">{course.modules?.flatMap(m => m.lessons).length}</td>
                        <td className="py-4">
                           <button className="text-indigo-400 font-bold hover:underline">Modifier</button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </motion.div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 text-left">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher une compétence..." 
              className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
             <Filter size={16} className="text-slate-400" />
             <div className="flex gap-2 p-1 bg-white border border-slate-100 rounded-2xl overflow-x-auto">
               {levels.map(lvl => (
                 <button 
                   key={lvl}
                   onClick={() => setLevelFilter(lvl)}
                   className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${levelFilter === lvl ? 'bg-[#0F172A] text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   {lvl}
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="flex gap-3 p-1.5 bg-white border border-slate-100 rounded-2xl overflow-x-auto w-full md:w-fit">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${filter === cat ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map(course => (
          <motion.div
            key={course.id}
            whileHover={{ y: -8 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group h-full hover:shadow-2xl hover:border-indigo-100 transition-all text-left"
          >
            <div className="relative h-56 bg-indigo-50 overflow-hidden">
               <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="absolute top-6 left-6 bg-white text-indigo-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                 100% GRATUIT
               </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-4">
                 <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                   course.level === 'Débutant' ? 'bg-emerald-50 text-emerald-600' :
                   course.level === 'Intermédiaire' ? 'bg-amber-50 text-amber-600' :
                   'bg-rose-50 text-rose-600'
                 }`}>
                   {course.level}
                 </span>
                 <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">• {course.duration}</span>
              </div>
              <h4 className="text-2xl font-black mb-3 text-[#0F172A] leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 uppercase tracking-tight italic">{course.title}</h4>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">{course.description}</p>
              
              <div className="flex items-center gap-4 mb-8">
                 <div className="flex -space-x-3">
                   {course.instructors.map(inst => (
                     <div key={inst.id} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden" title={inst.name}>
                        <img src={inst.photo} alt={inst.name} className="w-full h-full object-cover" />
                     </div>
                   ))}
                 </div>
                 <span className="text-xs font-bold text-slate-600">
                   {course.instructors.length > 1 ? `${course.instructors[0].name} +${course.instructors.length - 1}` : course.instructors[0].name}
                 </span>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Play size={16} fill="currentColor" />
                  <span className="text-xs font-black uppercase tracking-widest leading-none">Démarrer</span>
                </div>
                <button 
                  onClick={() => setSelectedCourse(course)}
                  className="bg-slate-50 hover:bg-slate-900 hover:text-white px-6 py-3 rounded-xl font-black text-xs transition-all border border-transparent uppercase tracking-widest"
                >
                  Détails
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setSelectedCourse(null)}
               className="fixed inset-0 bg-slate-900/60 z-[100] backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-xl w-full bg-white z-[110] rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100"
            >
              <div className="p-12 space-y-10">
                <div className="flex justify-between items-start text-left">
                  <div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">Cursus Interactif</span>
                    <h3 className="text-4xl font-black mt-6 text-[#01122D] leading-[1.1] tracking-tight italic italic">{selectedCourse.title}</h3>
                    <p className="text-slate-500 font-medium mt-4 leading-relaxed">{selectedCourse.description}</p>
                  </div>
                  <button onClick={() => setSelectedCourse(null)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors"><CloseIcon size={24} className="text-slate-400" /></button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Durée</p>
                    <p className="text-lg font-black text-slate-900">{selectedCourse.duration}</p>
                  </div>
                  <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">XP</p>
                    <p className="text-lg font-black text-indigo-700">+{selectedCourse.xp_reward}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => handleStartCourse(selectedCourse)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all text-center uppercase italic"
                  >
                    Suivre le cours
                  </button>
                  <button 
                    onClick={() => handleCertify(selectedCourse)}
                    disabled={isEnrolling}
                    className="w-full text-slate-900 text-center py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                  >
                    {isEnrolling ? <Loader2 className="animate-spin mx-auto" /> : 'Demander le certificat gratuit'}
                  </button>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-center gap-6">
                   <div className="flex -space-x-3">
                     {selectedCourse.instructors.map(inst => (
                       <img key={inst.id} src={inst.photo} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                     ))}
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                     Supervisé par {selectedCourse.instructors.length} experts
                   </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

