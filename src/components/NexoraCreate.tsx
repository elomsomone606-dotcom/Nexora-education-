/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Palette, Share2, FileText, Download, Sparkles, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function NexoraCreate() {
  const [activeTab, setActiveTab] = useState<'logos' | 'social' | 'scripts'>('logos');

  const tools = [
    { id: 'logos', name: 'Logos Automatiques', icon: Palette, desc: 'Générez des logos pour votre entreprise locale' },
    { id: 'social', name: 'Posts Réseaux Sociaux', icon: Share2, desc: 'Contenu optimisé pour Facebook & WhatsApp' },
    { id: 'scripts', name: 'Scripts Publicitaires', icon: FileText, desc: 'Textes percutants pour vos spots radio/vidéo' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTab(tool.id as any)}
            className={`p-6 rounded-3xl border transition-all text-left flex flex-col gap-4 ${activeTab === tool.id ? 'bg-purple-600 border-purple-600 text-white shadow-xl shadow-purple-200' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 shadow-sm'}`}
          >
            <tool.icon size={28} />
            <div>
              <h4 className="font-bold">{tool.name}</h4>
              <p className={`text-xs mt-1 ${activeTab === tool.id ? 'text-purple-100' : 'text-gray-400'}`}>{tool.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center">
         <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Wand2 size={40} />
         </div>
         <h3 className="text-2xl font-black mb-4 capitalize">Générateur de {activeTab}</h3>
         <p className="max-w-md text-gray-400 mb-8 font-medium">
            Entrez les détails de votre projet et laissez Nexora Create générer du contenu professionnel en quelques secondes.
         </p>
         
         <div className="w-full max-w-xl relative">
            <input 
              type="text" 
              placeholder="Ex: Un logo pour ma boutique de pagnes à Lomé..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-8 pr-32 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium shadow-inner"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-purple-600 text-white px-6 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">
               <Sparkles size={18} /> Générer
            </button>
         </div>

         <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-30 select-none">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square bg-gray-100 rounded-2xl border border-dashed border-gray-300"></div>
            ))}
         </div>
         
         <Sparkles className="absolute left-10 top-10 text-purple-50 w-24 h-24 rotate-12" />
         <Download className="absolute right-10 bottom-10 text-purple-50 w-24 h-24 -rotate-12" />
      </div>
    </div>
  );
}
