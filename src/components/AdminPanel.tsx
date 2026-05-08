/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Video, 
  FileText, 
  Users, 
  Settings, 
  Search,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Layers,
  Save,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, CourseModule, Instructor, Lesson } from '../types';
import { MOCK_COURSES } from '../data/courses';

export default function AdminPanel() {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteCourse = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-20 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-[#01142F]">Nexora Content Hub</h2>
          <p className="text-slate-500 font-medium">Gérez vos formations, modules et formateurs depuis un seul endroit.</p>
        </div>
        <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl hover:bg-indigo-700 transition-all active:scale-95">
           <Plus size={18} /> Créer un nouveau cours
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
           <div className="relative">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Rechercher..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold shadow-sm"
             />
           </div>
           <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 text-white">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Statistiques Globales</h4>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Total Etudiants</span>
                    <span className="text-lg font-black">4,281</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Cours Actifs</span>
                    <span className="text-lg font-black">{courses.length}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Heures de Vidéo</span>
                    <span className="text-lg font-black">124h</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Main Content: Courses Table */}
        <div className="lg:col-span-3">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                 <h4 className="font-black text-sm uppercase tracking-widest text-slate-600">Liste des Formations</h4>
                 <div className="flex gap-2">
                    <button className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"><Layers size={18} className="text-slate-400" /></button>
                    <button className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"><Settings size={18} className="text-slate-400" /></button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">
                       <tr>
                          <th className="px-8 py-6">Formation</th>
                          <th className="px-8 py-6">Catégorie</th>
                          <th className="px-8 py-6">Instructeurs</th>
                          <th className="px-8 py-6 text-center">Modules</th>
                          <th className="px-8 py-6 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredCourses.map(course => (
                         <tr key={course.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <img src={course.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                                  <div>
                                     <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{course.title}</p>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.level}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-tight border border-indigo-100">
                                  {course.category}
                               </span>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex -space-x-2">
                                  {course.instructors.map(inst => (
                                    <img key={inst.id} src={inst.photo} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" title={inst.name} alt="" />
                                  ))}
                               </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <span className="font-black text-slate-900">{course.modules?.length || 0}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => setEditingCourse(course)}
                                    className="p-3 bg-white border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                  >
                                     <Edit2 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => deleteCourse(course.id)}
                                    className="p-3 bg-white border border-slate-100 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                  >
                                     <Trash2 size={16} />
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>

      {/* Course Edit Modal */}
      <AnimatePresence>
        {editingCourse && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setEditingCourse(null)}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
             >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
                   <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">Édition : {editingCourse.title}</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">ID: {editingCourse.id}</p>
                   </div>
                   <button onClick={() => setEditingCourse(null)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                      <X size={24} className="text-slate-400" />
                   </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-12">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {/* Left: Basic Info */}
                      <div className="space-y-8">
                         <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Titre du Cours</label>
                            <input 
                               type="text" 
                               defaultValue={editingCourse.title}
                               className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
                            <textarea 
                               rows={4}
                               defaultValue={editingCourse.description}
                               className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-6">
                            <div>
                               <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Catégorie</label>
                               <select defaultValue={editingCourse.category} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none">
                                  <option>Design</option>
                                  <option>Développement</option>
                                  <option>IA</option>
                                  <option>Marketing</option>
                               </select>
                            </div>
                            <div>
                               <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Niveau</label>
                               <select defaultValue={editingCourse.level} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none">
                                  <option>Débutant</option>
                                  <option>Intermédiaire</option>
                                  <option>Expert</option>
                               </select>
                            </div>
                         </div>
                      </div>

                      {/* Right: Modules & Lessons */}
                      <div className="space-y-8">
                         <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Structure des Modules ({editingCourse.modules?.length})</h4>
                            <button className="text-indigo-600 font-bold text-xs flex items-center gap-1 hover:underline"><Plus size={14} /> Ajouter</button>
                         </div>
                         <div className="space-y-4">
                            {editingCourse.modules?.map((mod, i) => (
                              <div key={mod.id} className="p-6 bg-slate-950 rounded-2xl text-white border border-slate-800">
                                 <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                       <span className="text-xs font-black text-indigo-400">0{i+1}</span>
                                       <p className="font-bold text-sm tracking-tight">{mod.title}</p>
                                    </div>
                                    <div className="flex gap-2">
                                       <button className="p-1.5 text-slate-500 hover:text-white"><Edit2 size={14} /></button>
                                       <button className="p-1.5 text-slate-500 hover:text-rose-400"><Trash2 size={14} /></button>
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    {mod.lessons.map(lesson => (
                                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                         <div className="flex items-center gap-3">
                                            {lesson.type === 'video' ? <Video size={14} className="text-indigo-400" /> : <FileText size={14} className="text-emerald-400" />}
                                            <span className="text-xs font-medium text-slate-300">{lesson.title}</span>
                                         </div>
                                         <span className="text-[10px] font-bold text-slate-500 uppercase">{lesson.duration}</span>
                                      </div>
                                    ))}
                                    <button className="w-full py-2 border border-dashed border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 hover:border-indigo-400/30 transition-all">+ Ajouter une leçon</button>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4 shrink-0">
                   <button onClick={() => setEditingCourse(null)} className="px-8 py-4 text-slate-600 font-bold hover:text-slate-900">Annuler</button>
                   <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
                      <Save size={18} /> Enregistrer
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
