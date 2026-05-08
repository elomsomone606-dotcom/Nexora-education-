/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, MessageSquare, Plus, History, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getNexoraAIResponse } from '../services/geminiService';
import { storageService, ChatThread } from '../services/storageService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const DEFAULT_WELCOME = "Bonjour ! Je suis Nexora AI. Je suis prête à vous aider pour vos cours, votre business ou vos créations. Que faisons-nous aujourd'hui ?";

export default function NexoraAI() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: DEFAULT_WELCOME }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load threads on mount
  useEffect(() => {
    const loadedThreads = storageService.getAIThreads();
    setThreads(loadedThreads);
    
    // Resume last active thread if any
    if (loadedThreads.length > 0) {
      const lastThread = loadedThreads[0];
      setCurrentThreadId(lastThread.id);
      setMessages(lastThread.messages);
    }
  }, []);

  // Save current thread whenever messages change
  useEffect(() => {
    if (currentThreadId && messages.length > 1) {
      const title = messages.find(m => m.role === 'user')?.content.substring(0, 30) + "..." || "Nouvelle discussion";
      const thread: ChatThread = {
        id: currentThreadId,
        title,
        lastUpdate: Date.now(),
        messages
      };
      storageService.saveAIThread(thread);
      setThreads(storageService.getAIThreads());
    }
  }, [messages, currentThreadId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startNewChat = () => {
    const newId = Date.now().toString();
    setCurrentThreadId(newId);
    setMessages([{ id: '1', role: 'assistant', content: DEFAULT_WELCOME }]);
  };

  const loadThread = (thread: ChatThread) => {
    setCurrentThreadId(thread.id);
    setMessages(thread.messages);
  };

  const deleteThread = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    storageService.deleteAIThread(id);
    const updated = storageService.getAIThreads();
    setThreads(updated);
    if (currentThreadId === id) {
      if (updated.length > 0) {
        loadThread(updated[0]);
      } else {
        startNewChat();
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!currentThreadId) {
      setCurrentThreadId(Date.now().toString());
    }

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const response = await getNexoraAIResponse(newMessages.map(m => ({ role: m.role, content: m.content })));
    const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response || "Une erreur est survenue." };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden h-[80vh]">
      {/* Sidebar - History */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-slate-100 bg-slate-50/50 flex flex-col h-full"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <History size={16} /> Historique
              </h3>
              <button 
                onClick={startNewChat}
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                title="Nouvelle discussion"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {threads.length === 0 ? (
                <div className="text-center p-10 opacity-30">
                  <MessageSquare size={32} className="mx-auto mb-2" />
                  <p className="text-xs font-black uppercase">Aucun historique</p>
                </div>
              ) : (
                threads.map(thread => (
                  <div 
                    key={thread.id}
                    onClick={() => loadThread(thread)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all group relative flex items-center justify-between ${
                      currentThreadId === thread.id 
                      ? 'bg-white border-2 border-indigo-500/20 shadow-md ring-2 ring-indigo-500/5' 
                      : 'hover:bg-white border-2 border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${currentThreadId === thread.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                          <MessageSquare size={14} />
                       </div>
                       <div className="text-left overflow-hidden">
                          <p className={`text-xs font-bold truncate ${currentThreadId === thread.id ? 'text-indigo-900' : 'text-slate-600'}`}>{thread.title}</p>
                          <p className="text-[9px] font-black uppercase text-slate-400 mt-0.5">{new Date(thread.lastUpdate).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <button 
                      onClick={(e) => deleteThread(e, thread.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all text-slate-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden h-full">
        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-white border border-slate-100 shadow-xl p-1 rounded-r-lg text-slate-400 hover:text-indigo-600 transition-all"
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Header */}
        <div className="p-8 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Bot size={28} />
            </div>
            <div>
              <h3 className="font-black text-xl leading-none mb-1">NEXORA AI</h3>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assistant Intelligent Actif</p>
              </div>
            </div>
          </div>
          <button 
             onClick={() => setMessages([{ id: Date.now().toString(), role: 'assistant', content: "Contenu vidé. Commençons à nouveau !" }])}
             className="p-3 hover:bg-white/10 rounded-xl transition-all border border-white/5"
             title="Effacer le chat actuel"
          >
            <Trash2 size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/20">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-xl ${msg.role === 'user' ? 'bg-[#0F172A] text-white' : 'bg-white text-indigo-600 border border-slate-100'}`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`p-6 rounded-[1.5rem] shadow-sm font-medium ${msg.role === 'user' ? 'bg-[#0F172A] text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white border border-slate-100 p-5 rounded-[1.5rem] rounded-tl-none flex gap-2 shadow-sm items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-duration:800ms]"></span>
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:200ms]"></span>
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:400ms]"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Pensée en cours...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="p-8 bg-white border-t border-slate-100 shrink-0">
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Posez votre question à Nexora AI..."
              className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 px-8 pr-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner font-medium resize-none h-20"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale transition-all shadow-xl shadow-indigo-200 group-hover:scale-105"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between px-2">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={12} className="text-amber-500" /> IA Optimisée pour l'écosystème Nexora
             </p>
             <p className="text-[10px] text-slate-300 font-medium">Shift + Enter pour une nouvelle ligne</p>
          </div>
        </div>
      </div>
    </div>
  );
}
