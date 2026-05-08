/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Video, 
  FileText, 
  MessageSquare, 
  ArrowLeft,
  Share2,
  Bookmark,
  Info,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  Download,
  Linkedin,
  Twitter,
  Github,
  Award,
  Bot
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';
import { Course, Lesson, CourseModule, Instructor, UserProfile } from '../types';
import Markdown from 'react-markdown';
import NexoraQuiz from './NexoraQuiz';
import NexoraCertificate from './NexoraCertificate';

interface CoursePlayerProps {
  course: Course;
  user: UserProfile;
  onClose: () => void;
  onProgressUpdate: (courseId: string, progress: number) => void;
  onComplete: (courseId: string, xpReward: number) => void;
  onExerciseActive?: (lesson: Lesson | null) => void;
  externalCompletedLessons?: Set<string>;
}

export default function CoursePlayer({ 
  course, 
  user, 
  onClose, 
  onProgressUpdate, 
  onComplete, 
  onExerciseActive,
  externalCompletedLessons = new Set()
}: CoursePlayerProps) {
  const [activeLessonId, setActiveLessonId] = useState<string>(
    course.modules?.[0]?.lessons?.[0]?.id || ''
  );
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const [finalGrade, setFinalGrade] = useState<number | null>(null);

  // Sync external completions
  useEffect(() => {
    if (externalCompletedLessons.size > 0) {
      setCompletedLessons(prev => {
        const next = new Set(prev);
        let changed = false;
        externalCompletedLessons.forEach(id => {
          if (!next.has(id)) {
            next.add(id);
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [externalCompletedLessons]);

  // Find active lesson and its module
  const currentLesson = course.modules?.flatMap(m => m.lessons).find(l => l.id === activeLessonId);
  const currentModule = course.modules?.find(m => m.lessons.some(l => l.id === activeLessonId));

  useEffect(() => {
    if (currentLesson?.type === 'exercise') {
      onExerciseActive?.(currentLesson);
    } else {
      onExerciseActive?.(null);
    }
  }, [activeLessonId, currentLesson]);

  // Flattened lessons for navigation
  const allLessons = course.modules?.flatMap(m => m.lessons) || [];
  const currentIndex = allLessons.findIndex(l => l.id === activeLessonId);
  
  const handleNext = () => {
    if (!completedLessons.has(activeLessonId)) return;
    if (currentIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveLessonId(allLessons[currentIndex - 1].id);
    }
  };

  const toggleLessonCompletion = (id: string, force?: boolean) => {
    const newCompleted = new Set(completedLessons);
    if (force === true) {
      newCompleted.add(id);
    } else if (force === false) {
      newCompleted.delete(id);
    } else {
      if (newCompleted.has(id)) {
        newCompleted.delete(id);
      } else {
        newCompleted.add(id);
      }
    }
    setCompletedLessons(newCompleted);
    
    const progress = Math.round((newCompleted.size / allLessons.length) * 100);
    onProgressUpdate(course.id, progress);

    if (newCompleted.size === allLessons.length) {
      onComplete(course.id, course.xp_reward);
    }
  };

  const handleQuizComplete = (score: number) => {
    if (currentLesson?.quiz?.id.includes('final')) {
      setFinalGrade(score);
    }
    toggleLessonCompletion(activeLessonId, true);
    handleNext();
  };

  const handleExercisePass = (grade: number) => {
    if (activeLessonId.includes('fin') || activeLessonId.includes('final')) {
      setFinalGrade(grade);
    }
    toggleLessonCompletion(activeLessonId, true);
  };

  const downloadCoursePDF = () => {
    const doc = new jsPDF();
    const title = course.title;
    const moduleName = currentModule?.title || '';
    const lessonTitle = currentLesson?.title || '';
    const instructor = course.instructors[0]?.name || 'Nexora University';
    
    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('NEXORA UNIVERSITY', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('CAMPUS PRO • EXCELLENCE DIGITALE', 105, 30, { align: 'center' });

    // Body
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(16);
    doc.text(title, 20, 55);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`${moduleName} - ${lessonTitle}`, 20, 65);
    doc.text(`Enseignant: ${instructor}`, 20, 72);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 80, 190, 80);

    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(currentLesson?.content || '', 170);
    doc.text(splitText, 20, 95);

    // Footer
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`NEXORA CAMPUS PRO - Document Universitaire Confidentiel`, 105, 285, { align: 'center' });
    }

    doc.save(`Nexora_${title.replace(/\s/g, '_')}_Mod${currentIndex + 1}.pdf`);
  };

  const renderContent = () => {
    if (currentLesson?.type === 'quiz' && currentLesson.quiz) {
      return (
        <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
          <NexoraQuiz 
            quiz={currentLesson.quiz} 
            onComplete={handleQuizComplete} 
            onClose={() => setActiveLessonId(allLessons[currentIndex - 1]?.id || activeLessonId)} 
          />
        </div>
      );
    }

    if (currentLesson?.type === 'exercise') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0a0f1a] relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_70%)]"></div>
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="max-w-3xl w-full bg-slate-900/50 backdrop-blur-2xl border-2 border-indigo-500/20 rounded-[3rem] p-12 shadow-3xl text-center relative z-10"
           >
             <div className="w-24 h-24 bg-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/10">
                <Bot size={48} className="text-indigo-400" />
             </div>
             <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">Évaluation IA Nexora</h3>
             <p className="text-indigo-400 font-bold text-sm uppercase tracking-[0.3em] mb-8">Votre conseiller vous attend</p>
             
             <div className="bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-2xl mb-10 text-left">
                <p className="text-indigo-200 text-sm font-medium leading-relaxed">
                  Cet exercice est évalué en temps réel par notre IA. Répondez aux questions de l'assistant stratégique en bas à droite de votre écran. 
                  <br /><br />
                  <b>Critère de succès :</b> Vous devez obtenir une note minimale de <b>10/20</b> pour valider cette étape et accéder à l'examen final.
                </p>
             </div>

             <div className="markdown-body prose prose-invert prose-indigo max-w-none text-left mb-12 bg-slate-950/50 p-8 rounded-2xl border border-slate-800">
                <Markdown>{currentLesson?.content || 'Aucune instruction fournie pour cet exercice.'}</Markdown>
             </div>
             
             <div className="flex items-center gap-4 justify-center">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   AI Correction Active
                </div>
             </div>
           </motion.div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col">
        {currentLesson?.type === 'video' ? (
          <div className="aspect-video w-full bg-black relative flex items-center justify-center group">
            <iframe 
              src={`${currentLesson.videoUrl}?autoplay=0&modestbranding=1&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                  <Video size={14} /> Interface YouTube Nexora
               </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full p-8 md:p-16">
             <div className="mb-12">
               <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20 mb-4 inline-block">
                 Session de lecture
               </span>
               <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">{currentLesson?.title}</h2>
               
               <button 
                 onClick={downloadCoursePDF}
                 className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all mb-8 border border-white/5"
               >
                 <Download size={16} className="text-indigo-400" /> Télécharger Support (PDF)
               </button>

               <div className={`markdown-body prose prose-invert prose-indigo max-w-none`}>
                  <Markdown>{currentLesson?.content || ''}</Markdown>
               </div>
             </div>
          </div>
        )}

        {/* Annotations & Tips Section */}
        {(currentLesson?.annotations?.length || 0) > 0 && (
          <div className="max-w-4xl mx-auto w-full px-8 pb-16 space-y-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Points clés & Annotations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLesson?.annotations?.map(anno => (
                <div key={anno.id} className={`p-6 rounded-[1.5rem] border-2 flex items-start gap-4 ${
                  anno.type === 'tip' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-100' :
                  anno.type === 'info' ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-100' :
                  'bg-rose-500/5 border-rose-500/20 text-rose-100'
                }`}>
                  <div className="mt-1 shadow-lg">
                    {anno.type === 'tip' ? <Lightbulb size={20} className="text-emerald-400" /> :
                     anno.type === 'info' ? <Info size={20} className="text-indigo-400" /> :
                     <AlertTriangle size={20} className="text-rose-400" />}
                  </div>
                  <div>
                    <p className="font-black text-xs uppercase tracking-tight mb-1">{anno.title}</p>
                    <p className="text-sm opacity-80 leading-relaxed font-medium">{anno.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources Section */}
        {(currentLesson?.resources?.length || 0) > 0 && (
           <div className="max-w-4xl mx-auto w-full px-8 pb-16">
              <div className="p-8 rounded-[2rem] bg-slate-900 border border-slate-800">
                <h4 className="text-lg font-black mb-6 flex items-center gap-3">
                  <Download className="text-indigo-500" /> Ressources téléchargeables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentLesson?.resources?.map((res, i) => (
                    <a 
                      key={i} 
                      href={res.url} 
                      className="flex items-center justify-between p-4 bg-slate-800 hover:bg-indigo-600 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                         <FileText size={20} className="text-slate-400 group-hover:text-white" />
                         <span className="font-bold text-sm tracking-tight">{res.name}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase opacity-40 group-hover:opacity-100">{res.type}</span>
                    </a>
                  ))}
                </div>
              </div>
           </div>
        )}

        {/* Instructors Widget */}
        <div className="max-w-4xl mx-auto w-full px-8 pb-20 border-t border-slate-900 pt-16">
           <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Formateurs du cours</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {course.instructors.map(inst => (
                <div key={inst.id} className="flex gap-6 items-start">
                   <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-2 border-indigo-500/20 shadow-xl shrink-0">
                      <img src={inst.photo} alt={inst.name} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h5 className="text-lg font-black mb-1">{inst.name}</h5>
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 italic">{inst.specialty}</p>
                      <p className="text-sm text-slate-400 leading-relaxed mb-4 font-medium">{inst.bio}</p>
                      <div className="flex gap-4">
                         {inst.socials?.linkedin && <Linkedin size={16} className="text-slate-500 hover:text-white cursor-pointer" />}
                         {inst.socials?.twitter && <Twitter size={16} className="text-slate-500 hover:text-white cursor-pointer" />}
                         {inst.socials?.github && <Github size={16} className="text-slate-500 hover:text-white cursor-pointer" />}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A] z-[100] flex flex-col overflow-hidden text-white">
      {showCertificate && (
        <NexoraCertificate user={user} course={course} grade={finalGrade} onClose={() => setShowCertificate(false)} />
      )}
      
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-4 w-[1px] bg-slate-800 mx-2 hidden sm:block"></div>
          <div>
            <h1 className="font-bold text-sm tracking-tight line-clamp-1">{course.title}</h1>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              {currentModule?.title} • {currentIndex + 1}/{allLessons.length}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
           <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">Progression : {Math.round((completedLessons.size / allLessons.length) * 100)}%</span>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500" 
                  style={{ width: `${(completedLessons.size / allLessons.length) * 100}%` }}
                ></div>
              </div>
           </div>
           <div className="h-4 w-[1px] bg-slate-800"></div>
           <div className="flex items-center gap-2">
             <button className="p-2 text-slate-400 hover:text-white transition-all"><Share2 size={18} /></button>
             <button className="p-2 text-slate-400 hover:text-white transition-all"><Bookmark size={18} /></button>
           </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-950 flex flex-col">
          {/* Lesson Screen */}
          {renderContent()}

          {/* Player Controls Bar */}
          <div className="shrink-0 h-24 bg-slate-900 border-t border-slate-800 px-10 flex items-center justify-between sticky bottom-0 z-50">
             <button 
               onClick={handlePrev}
               disabled={currentIndex === 0}
               className="flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all group"
             >
               <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-slate-700">
                 <ChevronLeft size={20} />
               </div>
               Précédent
             </button>

             <div className="flex items-center gap-4">
               {currentLesson?.type !== 'quiz' && currentLesson?.type !== 'exercise' && (
                 <button 
                   onClick={() => toggleLessonCompletion(activeLessonId)}
                   className={`flex items-center gap-4 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95 ${
                      completedLessons.has(activeLessonId) 
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                      : 'bg-white text-slate-900 hover:bg-white/90'
                   }`}
                 >
                   {completedLessons.has(activeLessonId) ? (
                     <><CheckCircle2 size={24} /> Terminé</>
                   ) : (
                     <><Circle size={24} /> Marquer comme terminé</>
                   )}
                 </button>
               )}
               
               {completedLessons.size === allLessons.length && (
                  <button 
                    onClick={() => {
                      if (finalGrade !== null && finalGrade < 15) {
                        alert(`Désolé, votre note finale est de ${finalGrade}/20. Un minimum de 15/20 est requis pour obtenir le certificat de Campus Pro. Vous pouvez recommencer le parcours.`);
                        return;
                      }
                      setShowCertificate(true);
                    }}
                    className="bg-amber-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-amber-500/20 flex items-center gap-3 animate-bounce"
                  >
                    <Award size={20} /> Certifier
                  </button>
               )}
             </div>

             <button 
               onClick={handleNext}
               disabled={currentIndex === allLessons.length - 1 || !completedLessons.has(activeLessonId)}
               className="flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all group"
             >
               Suivant
               <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-slate-700">
                 <ChevronRight size={20} />
               </div>
             </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-slate-900 border-l border-slate-800 flex flex-col shrink-0"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-black text-sm uppercase tracking-tighter italic">Contenu du cours</h3>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white">
                  <ArrowLeft size={18} className="rotate-180" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                 {course.modules?.map((mod, idx) => (
                   <div key={mod.id} className="space-y-3">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Module {idx + 1}</span>
                        <h4 className="font-black text-xs tracking-tight uppercase text-slate-300">{mod.title}</h4>
                      </div>
                      <div className="space-y-1">
                          {mod.lessons.map((lesson, lIdx) => {
                            const lessonGlobalIndex = allLessons.findIndex(l => l.id === lesson.id);
                            const isLocked = lessonGlobalIndex > 0 && !completedLessons.has(allLessons[lessonGlobalIndex - 1].id);
                            
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => !isLocked && setActiveLessonId(lesson.id)}
                                disabled={isLocked}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${
                                  activeLessonId === lesson.id 
                                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                                  : isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 text-slate-400'
                                }`}
                              >
                                <div className="shrink-0">
                                   {isLocked ? (
                                     <Circle size={16} className="text-slate-600" />
                                   ) : completedLessons.has(lesson.id) ? (
                                     <CheckCircle2 size={16} className={activeLessonId === lesson.id ? 'text-white' : 'text-emerald-500'} />
                                   ) : (
                                     lesson.type === 'video' ? <Video size={16} /> : <FileText size={16} />
                                   )}
                                </div>
                                <div className="flex-1">
                                   <p className="text-xs font-bold tracking-tight line-clamp-1">{lesson.title}</p>
                                   <span className="text-[9px] font-medium opacity-60 italic">{lesson.duration}</span>
                                </div>
                              </button>
                            );
                          })}
                      </div>
                   </div>
                 ))}
                 
                 {/* Final Project Reward Card */}
                 <div className="mt-8 p-6 rounded-[2rem] bg-gradient-to-br from-indigo-900 to-violet-900 border border-indigo-500/20 relative overflow-hidden">
                    <div className="relative z-10">
                       <Award className="text-amber-400 mb-2" size={32} />
                       <h5 className="font-black text-sm uppercase tracking-tight mb-2">Objectif de XP : +{course.xp_reward}</h5>
                       <p className="text-[10px] text-indigo-200 leading-relaxed font-medium">Complétez toutes les leçons pour débloquer votre certificat blockchain Nexora.</p>
                    </div>
                    <div className="absolute right-[-10%] bottom-[-10%] opacity-20 rotate-12">
                       <Award size={100} />
                    </div>
                 </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Toggle Sidebar Button (Floating) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute right-6 top-24 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          >
            <BookOpen size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
