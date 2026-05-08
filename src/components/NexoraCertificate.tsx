/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Download, 
  Share2, 
  ShieldCheck,
  QrCode,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { Course, UserProfile } from '../types';

interface NexoraCertificateProps {
  user: UserProfile;
  course: Course;
  onClose: () => void;
  grade?: number | null;
}

export default function NexoraCertificate({ user, course, onClose, grade }: NexoraCertificateProps) {
  const date = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const certId = `NX-${course.id.toUpperCase()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Certificate Display Area */}
        <div className="flex-1 p-12 lg:p-20 bg-slate-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
           <div id="certificate-content" className="w-full max-w-3xl aspect-[1.414/1] bg-white border-[12px] border-slate-900 p-12 relative shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden">
              {/* Pattern Background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none uppercase font-black text-[12rem] leading-none text-slate-900 -rotate-12 flex flex-wrap gap-20">
                 NEXORA NEXORA NEXORA
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-24 h-24 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-xl shadow-indigo-200">
                    <Award size={48} />
                 </div>
                 
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Certificat de Réussite</h4>
                 
                 <p className="text-xl font-medium text-slate-500 mb-2 italic">Ce document atteste que</p>
                 <h2 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter uppercase italic">{user.name}</h2>
                 
                 <p className="text-lg font-medium text-slate-500 mb-4 leading-relaxed">
                   a complété avec succès la formation professionnelle intitulée
                 </p>
                 <h3 className="text-3xl font-black text-indigo-600 mb-6 uppercase tracking-tight">{course.title}</h3>
                 
                 {grade && (
                   <div className="mb-10">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mention Académique</p>
                     <p className="text-4xl font-black text-indigo-500 italic">{grade}/20</p>
                   </div>
                 )}
                 
                 <div className="grid grid-cols-3 gap-12 w-full mt-8 pt-12 border-t border-slate-100">
                    <div className="text-left">
                       <p className="text-[8px] font-black uppercase text-slate-400 mb-2">Délivré le</p>
                       <p className="text-sm font-black text-slate-900">{date}</p>
                    </div>
                    <div className="flex flex-col items-center">
                       <QrCode size={48} className="text-slate-900 opacity-20 mb-2" />
                       <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{certId}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black uppercase text-slate-400 mb-2">Signature</p>
                       <p className="font-serif italic text-xl text-slate-900">Nexora Labs IA</p>
                    </div>
                 </div>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-slate-300"></div>
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-slate-300"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-slate-300"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-slate-300"></div>
           </div>
        </div>

        {/* Sidebar Actions */}
        <div className="w-full md:w-96 p-12 bg-white flex flex-col">
           <div className="flex justify-between items-start mb-12">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                 <ShieldCheck size={28} />
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400"
              >
                <X size={24} />
              </button>
           </div>
           
           <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Félicitations !</h3>
           <p className="text-slate-500 font-medium leading-relaxed mb-10">
              Votre certificat a été généré et vérifié. Vous pouvez maintenant le partager sur vos réseaux professionnels.
           </p>

           <div className="space-y-4 mb-auto">
              <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-95">
                 <Download size={20} /> Télécharger PDF
              </button>
              <button className="w-full bg-white border-2 border-slate-100 text-slate-900 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                 <Share2 size={20} /> Partager sur LinkedIn
              </button>
           </div>

           <div className="mt-12 pt-12 border-t border-slate-100">
              <div className="flex items-center gap-3">
                 <CheckCircle2 size={16} className="text-emerald-500" />
                 <span className="text-xs font-bold text-slate-600 tracking-tight">Code de vérification Nexora Trust</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 mt-2">{certId}</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
