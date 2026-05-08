/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GraduationCap, Map, Users, Target, ShieldCheck, ChevronRight, Play, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, UserProfile } from '../types';
import { CAMPUS_PRO_COURSES } from '../data/courses';
import CoursePlayer from './CoursePlayer';

interface NexoraUniversityProps {
  user: UserProfile;
  onProgressUpdate: (id: string, prog: number) => void;
  onCompleteCourse: (id: string, xp: number) => void;
}

export default function NexoraUniversity({ user, onProgressUpdate, onCompleteCourse }: NexoraUniversityProps) {
  const [learningCourse, setLearningCourse] = useState<Course | null>(null);
  const [isEnrolling, setIsEnrolling] = useState<string | null>(null);

  const universityCourses = CAMPUS_PRO_COURSES;

  const handleEnroll = async (course: Course) => {
    setIsEnrolling(course.id);
    setTimeout(() => {
      setIsEnrolling(null);
      setLearningCourse(course);
    }, 1500);
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
    <div className="space-y-16 pb-20">
      {/* Hero University */}
      <div className="bg-[#020617] rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-800">
        <div className="relative z-10 max-w-3xl">
           <div className="flex items-center gap-3 mb-10">
              <span className="bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/30 backdrop-blur-md">
                Campus Pro : Excellence Académique
              </span>
           </div>
           <h3 className="text-6xl md:text-8xl font-black mb-10 leading-[0.95] tracking-tighter text-left uppercase italic">
             L'Université <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-400 to-cyan-400">du 21ème siècle.</span>
           </h3>
           <p className="text-slate-400 text-xl mb-14 leading-relaxed opacity-90 max-w-xl font-medium text-left">
             Des cursus universitaires rigoureux en 7 étapes clés, alliant théorie fondamentale, analyse critique et projet final d'innovation.
           </p>
           <div className="flex flex-wrap gap-8 items-center">
             <button className="bg-white text-slate-900 px-12 py-6 rounded-2xl font-black shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-lg uppercase italic">
                Voir les Cursus <ChevronRight size={22} />
             </button>
             <div className="flex items-center gap-4 text-slate-500">
                <div className="flex -space-x-4">
                   {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-800 flex items-center justify-center font-bold text-xs ring-4 ring-indigo-500/10">U{i}</div>)}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">+1200 Étudiants</p>
             </div>
           </div>
        </div>
        
        <GraduationCap className="absolute right-[-40px] bottom-[-40px] text-white/5 w-[500px] h-[500px] -rotate-12" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      </div>

      {/* Structured Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {universityCourses.map(course => (
          <motion.div
            key={course.id}
            whileHover={{ y: -12 }}
            className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-full group hover:border-indigo-500/30 transition-all duration-500 text-left"
          >
            {/* Path Header */}
            <div className="p-12 pb-0">
               <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-indigo-600 transition-all shadow-xl">
                    {course.level?.[0]}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 italic">
                    NIVEAU {course.level}
                  </span>
               </div>
               <h4 className="text-4xl font-black mb-6 text-[#010816] leading-[1.1] tracking-tighter group-hover:text-indigo-600 transition-colors uppercase italic italic">
                 {course.title}
               </h4>
               <p className="text-slate-500 font-medium text-lg mb-10 leading-relaxed">
                 {course.description}
               </p>

               <div className="flex items-center gap-6 mb-12">
                  <div className="flex -space-x-3">
                    {course.instructors.map(inst => (
                      <img key={inst.id} src={inst.photo} className="w-12 h-12 rounded-full border-4 border-white shadow-lg" alt={inst.name} />
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Encadré par</p>
                    <p className="text-sm font-bold text-slate-800">{course.instructors.map(i => i.name).join(' & ')}</p>
                  </div>
               </div>
            </div>
            
            {/* Path Footer */}
            <div className="mt-auto p-12 pt-0">
               <div className="grid grid-cols-2 gap-6 mb-12">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Durée Prévue</p>
                     <p className="text-lg font-black text-slate-900">{course.duration}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Structure</p>
                     <p className="text-lg font-black text-slate-900">{course.modules?.length || 0} Modules Académiques</p>
                  </div>
               </div>

               <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-black text-[#01142F] group-hover:text-indigo-600 transition-colors uppercase italic">
                      GRATUIT
                    </p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Accès Campus Illimité</p>
                  </div>
                  <button 
                    onClick={() => handleEnroll(course)}
                    disabled={!!isEnrolling}
                    className="flex items-center gap-4 bg-slate-950 group-hover:bg-indigo-600 text-white pl-8 pr-4 py-4 rounded-3xl shadow-2xl transition-all group-hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <span className="font-black text-sm uppercase tracking-widest italic">{isEnrolling === course.id ? 'Préparation...' : 'S\'inscrire'}</span>
                    <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                      {isEnrolling === course.id ? <Loader2 className="animate-spin" size={20} /> : <Play size={18} fill="currentColor" />}
                    </div>
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Accreditation Badge */}
      <section className="relative py-24 px-12 rounded-[4rem] bg-[#0F172A] text-white overflow-hidden text-center border border-slate-800">
         <div className="relative z-10">
            <div className="inline-flex items-center gap-3 bg-indigo-500/20 text-indigo-400 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-indigo-500/30 mb-8 backdrop-blur-md">
               <ShieldCheck size={20} />
               Certification Blockchain Authentifiée
            </div>
            <h4 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter leading-tight italic">
              Un diplôme qui ouvre les portes de <span className="text-indigo-500">l'avenir.</span>
            </h4>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed mb-16 font-medium opacity-80">
              Nos parcours universitaires sont validés par notre conseil académique composé d'ingénieurs de la Silicon Valley et d'entrepreneurs africains. Chaque certificat porte une signature numérique unique.
            </p>
            <div className="flex flex-wrap justify-center gap-16 opacity-40">
               {['GLOBAL TECH', 'AFRICA VENTURES', 'DIGITAL ALLIANCE', 'TECH ACADEMY'].map(logo => (
                 <span key={logo} className="font-black text-2xl tracking-tighter italic">{logo}</span>
               ))}
            </div>
         </div>
         <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-indigo-600/10 rounded-full blur-[200px]"></div>
      </section>
    </div>
  );
}

