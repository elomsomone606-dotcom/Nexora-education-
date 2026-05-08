/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Briefcase, 
  Target, 
  MapPin, 
  TrendingUp, 
  FileSearch, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  PieChart,
  Globe,
  Award,
  CircleHelp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_COURSES } from '../data/courses';
import { Course } from '../types';

interface AfricanProjectProps {
  onStartCourse: (course: Course) => void;
}

export default function AfricanProject({ onStartCourse }: AfricanProjectProps) {
  const [selectedSector, setSelectedSector] = useState('Fintech');
  
  const projects = MOCK_COURSES.filter(c => c.category === 'African Project');
  
  const sectors = [
    { id: 'Fintech', icon: PieChart, desc: 'Paiements & Mobile Money' },
    { id: 'Energy', icon: Sparkles, desc: 'Solaire & Recyclage' },
    { id: 'AgriTech', icon: Target, desc: 'Transformation locale' },
    { id: 'EdTech', icon: Award, desc: 'Éducation de masse' },
  ];

  return (
    <div className="space-y-12 pb-20 text-left">
      {/* Premium Header */}
      <div className="bg-[#01142F] rounded-[3.5rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl border border-slate-800">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
               <div className="flex items-center gap-3 mb-8 bg-indigo-500/10 w-fit px-6 py-2 rounded-full border border-indigo-500/20">
                  <Briefcase className="text-indigo-400" size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">Nexora African Project Hub</span>
               </div>
               <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-8 leading-none">
                  L'Incubateur<br />
                  <span className="text-indigo-500">Stratégique.</span>
               </h2>
               <p className="text-xl text-slate-400 max-w-lg font-medium leading-relaxed mb-10">
                  Formations avancées pour entrepreneurs africains. Résolvez les problèmes réels avec des analyses de terrain et des stratégies d'élite.
               </p>
               <div className="flex gap-6">
                  <div className="flex flex-col">
                     <span className="text-3xl font-black text-white italic">2500+</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Projets Lancés</span>
                  </div>
                  <div className="w-px h-12 bg-slate-800"></div>
                  <div className="flex flex-col">
                     <span className="text-3xl font-black text-indigo-500 italic">Expert</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Niveau requis</span>
                  </div>
               </div>
            </div>
            
            <div className="hidden lg:block relative">
               <div className="aspect-square bg-indigo-600/10 rounded-full border border-indigo-500/20 p-12 flex items-center justify-center animate-pulse">
                  <div className="aspect-square bg-indigo-600/20 rounded-full w-full flex items-center justify-center p-12">
                     <Globe size={120} className="text-indigo-400 opacity-20" />
                  </div>
               </div>
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ repeat: Infinity, duration: 4 }}
                 className="absolute top-1/4 -left-10 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl"
               >
                  <TrendingUp className="text-emerald-400 mb-2" />
                  <p className="text-2xl font-black italic">+42% Growth</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase">African Market</p>
               </motion.div>
            </div>
         </div>
         <Globe className="absolute right-[-10%] bottom-[-10%] w-[500px] h-[500px] opacity-10 blur-3xl pointer-events-none" />
      </div>

      {/* Strategic Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-10">
           <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 px-4">Domaines d'impact</h4>
              <div className="space-y-4">
                 {sectors.map((sec) => (
                   <button 
                     key={sec.id}
                     onClick={() => setSelectedSector(sec.id)}
                     className={`w-full p-8 rounded-[2rem] border transition-all text-left flex items-center gap-6 group ${
                       selectedSector === sec.id 
                       ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-105' 
                       : 'bg-white border-slate-100 text-slate-900 hover:border-indigo-100'
                     }`}
                   >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                        selectedSector === sec.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                      }`}>
                         <sec.icon size={24} />
                      </div>
                      <div>
                         <p className="font-black text-lg italic uppercase tracking-tighter">{sec.id}</p>
                         <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedSector === sec.id ? 'text-slate-400' : 'text-slate-500'}`}>{sec.desc}</p>
                      </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100">
              <CircleHelp className="text-indigo-600 mb-4" />
              <h5 className="text-xl font-black mb-3">Validation requise</h5>
              <p className="text-sm font-medium text-indigo-900/60 leading-relaxed mb-6">
                 Ces cours sont extrêmement exigeants. Un score minimal de 90% est requis à l'examen final pour obtenir la certification stratégique.
              </p>
              <button className="text-indigo-600 font-bold text-sm hover:underline italic">Lire les prérequis académiques</button>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black italic uppercase tracking-tight">Formations Élite ({projects.length})</h3>
              <div className="flex gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sessions Actives</span>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden group hover:border-indigo-100 transition-all">
                   <div className="flex flex-col md:flex-row">
                      <div className="md:w-72 shrink-0 relative overflow-hidden">
                         <img src={project.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                         <div className="absolute top-6 left-6 px-4 py-2 bg-slate-900/90 backdrop-blur-md text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                            {project.level}
                         </div>
                      </div>
                      <div className="p-10 flex-1 flex flex-col justify-between">
                         <div>
                            <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                               <div className="flex items-center gap-2">
                                  <MapPin size={14} className="text-indigo-600" />
                                  <span>Marché Panafricain</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <Award size={14} className="text-amber-500" />
                                  <span>Certification Élite</span>
                               </div>
                            </div>
                            <h4 className="text-2xl font-black mb-4 uppercase italic tracking-tighter group-hover:text-indigo-600 transition-colors leading-tight">
                               {project.title}
                            </h4>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8 line-clamp-2">
                               {project.description}
                            </p>
                         </div>

                         <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center">
                               <FileSearch size={16} className="text-slate-400 mb-2" />
                               <span className="text-[10px] font-black uppercase">Études de cas</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center">
                               <ShieldAlert size={16} className="text-slate-400 mb-2" />
                               <span className="text-[10px] font-black uppercase">Analyse Risque</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center">
                               <TrendingUp size={16} className="text-slate-400 mb-2" />
                               <span className="text-[10px] font-black uppercase">Scalabilité</span>
                            </div>
                         </div>

                         <button 
                           onClick={() => onStartCourse(project)}
                           className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all shadow-2xl active:scale-95"
                         >
                            Accéder au cursus stratégique <ArrowRight size={18} />
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
