/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MessageCircle, 
  Send,
  ArrowLeft,
  Settings,
  MoreVertical,
  Circle,
  Volume2,
  X,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { storageService } from '../services/storageService';

type Screen = 'home' | 'chat' | 'voice';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  correction?: string;
  translation?: string;
}

export default function SpeakFlow() {
  const [screen, setScreen] = useState<Screen>('home');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load history
  useEffect(() => {
    const history = storageService.getSpeakFlowMessages();
    if (history.length > 0) {
      setMessages(history);
    } else {
      setMessages([
        { 
          id: '1', 
          role: 'assistant', 
          content: "Hi! I'm SpeakFlow AI. I'm here to help you practice English. Use French if you get stuck, and I'll help you translate!" 
        }
      ]);
    }
  }, []);

  // Save history
  useEffect(() => {
    if (messages.length > 0) {
      storageService.saveSpeakFlowMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, screen]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: messageText 
    };

    setMessages(prev => [...prev, userMsg]);
    if (!text) setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map(m => ({
            role: m.role === 'assistant' ? 'model' as const : 'user' as const,
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: messageText }] }
        ],
        config: {
          systemInstruction: `You are SpeakFlow AI, an extremely patient and understanding English tutor for French speakers. 
          Your goals:
          1. Act as a natural, kind conversation partner.
          2. If the user makes a mistake, correct it politely in English, then give a very brief explanation in French so they understand WHY it was wrong.
          3. If the user speaks French, translate it to English and explain the translation briefly in French if it's complex.
          4. Keep responses encouraging and short.
          5. Use "Correction: [English version]" followed by "Explication: [French explanation]".
          
          Format your response as a single friendly message.`
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that.";
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiText
      };

      setMessages(prev => [...prev, assistantMsg]);
      
      // Real Text-to-Speech for voice mode
      if (screen === 'voice') {
        speak(aiText);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: "Sorry, I lost my connection. Let's try again!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setVoiceTranscript('');
    setIsPlayingAudio(false);
    
    // Simulation of voice recognition text appearing
    const phrases = ["I want to learn English", "I have some mistakes", "Can you help me?"];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    let currentText = "";
    const words = randomPhrase.split(" ");
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < words.length) {
        currentText += (i === 0 ? "" : " ") + words[i];
        setVoiceTranscript(currentText);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    // Auto-stop simulation if user doesn't stop
    setTimeout(() => {
      if (isRecording) stopVoiceRecording();
    }, 5000);
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (voiceTranscript.trim()) {
      handleSend(voiceTranscript);
    }
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-')) || voices[0];
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.lang = 'en-US';
    utterance.rate = 1.0; // Normal speaking speed
    utterance.pitch = 1;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // --- RENDERS ---

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white h-full relative overflow-hidden">
       {/* Decorative circles */}
       <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
       <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

       <div className="relative z-10 space-y-12 max-w-md w-full">
          <div>
            <p className="text-blue-600 font-black uppercase tracking-[0.3em] mb-4 text-sm">MBG Elom pg</p>
            <h2 className="text-6xl font-black italic tracking-tighter text-slate-900 leading-none">SpeakFlow<br /><span className="text-blue-600">AI.</span></h2>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => setScreen('chat')}
              className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
              <MessageCircle size={24} /> Start Conversation
            </button>
            <button 
              onClick={() => setScreen('voice')}
              className="w-full bg-white border-4 border-blue-600 text-blue-600 py-6 rounded-3xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-50 transition-all active:scale-95"
            >
              <Mic size={24} /> Voice Mode
            </button>
          </div>

          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
            Your Personal AI English Tutor
          </p>
       </div>
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full bg-[#f0f2f5] relative">
      {/* WhatsApp style header */}
      <div className="bg-white p-4 flex items-center justify-between shadow-sm border-b border-slate-100 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setScreen('home')} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
               <Mic size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 leading-none mb-1">SpeakFlow AI</h3>
              <p className="text-[10px] uppercase font-black tracking-widest text-emerald-500 flex items-center gap-1">
                <Circle size={6} fill="currentColor" /> Online
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
           <button className="p-2 hover:bg-slate-50 rounded-full"><Settings size={20} /></button>
           <button className="p-2 hover:bg-slate-50 rounded-full"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Message List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-xl shadow-sm relative ${
                msg.role === 'user' 
                ? 'bg-emerald-100 text-slate-800 rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none'
              }`}>
                <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                <p className="text-[10px] text-slate-400 mt-2 text-right">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white flex items-center gap-4 border-t border-slate-100">
         <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <Plus size={24} />
         </button>
         <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="w-full bg-slate-100 border-none rounded-2xl py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
            />
         </div>
         {input.trim() ? (
           <button 
             onClick={() => handleSend()}
             className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all"
           >
             <Send size={20} />
           </button>
         ) : (
           <button 
             onMouseDown={startVoiceRecording}
             onMouseUp={stopVoiceRecording}
             className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all active:scale-90 ${
               isRecording ? 'bg-rose-500 text-white scale-110 animate-pulse' : 'bg-blue-600 text-white'
             }`}
           >
             <Mic size={20} />
           </button>
         )}
      </div>
    </div>
  );

  const renderVoice = () => {
    const lastMessage = messages[messages.length - 1];
    const isAIResponding = lastMessage?.role === 'assistant' && !isLoading;

    return (
      <div className="flex flex-col h-full bg-blue-600 text-white p-12 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
            <motion.div 
              animate={{ 
                scale: isRecording ? [1, 1.2, 1] : isPlayingAudio ? [1, 1.05, 1] : 1,
                opacity: isRecording || isPlayingAudio ? [0.1, 0.2, 0.1] : 0.05
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-[500px] h-[500px] bg-white rounded-full"
            ></motion.div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
            <button onClick={() => setScreen('home')} className="self-start p-3 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-md transition-all">
              <X size={24} />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-200">
                  {isRecording ? "Listening..." : isPlayingAudio ? "Speaking..." : "Voice Mode"}
                </h3>
                <p className="text-4xl font-black italic tracking-tighter">
                  {isRecording ? "Go ahead..." : isAIResponding ? "Listen carefully." : "Ready to talk?"}
                </p>
              </div>

              {/* Animated Mic/Speaker Button */}
              <div className="relative">
                  <AnimatePresence>
                    {(isRecording || isPlayingAudio) && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.5 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 bg-white/20 rounded-full"
                      ></motion.div>
                    )}
                  </AnimatePresence>
                  <button 
                    onClick={toggleRecording}
                    className={`w-32 h-32 rounded-full flex items-center justify-center relative z-10 transition-all ${
                      isRecording ? 'bg-white text-blue-600 scale-110 shadow-2xl' : 
                      isPlayingAudio ? 'bg-emerald-400 text-white shadow-xl' :
                      'bg-blue-500 text-white shadow-xl hover:bg-blue-400'
                    }`}
                  >
                    {isPlayingAudio ? <Volume2 size={48} /> : <Mic size={48} />}
                  </button>
                  
                  {isRecording && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-white/60 w-full"
                    >
                      Click to finish
                    </motion.p>
                  )}
              </div>

              {/* Wave Animation */}
              <div className="flex items-end gap-1 h-12">
                  {[...Array(10)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ 
                        height: isRecording || isPlayingAudio ? [20, 48, 20] : 10 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.5, 
                        delay: i * 0.1 
                      }}
                      className="w-1.5 bg-white/40 rounded-full"
                    ></motion.div>
                  ))}
              </div>

              {/* Live STT / Response Area */}
              <div className="max-w-md p-8 bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/10 min-h-[160px] w-full flex flex-col items-center justify-center space-y-4">
                  {isRecording ? (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white text-xl font-bold italic"
                    >
                      "{voiceTranscript || "..."}"
                    </motion.p>
                  ) : isAIResponding ? (
                    <div className="space-y-4">
                       <p className="text-white text-lg font-medium leading-relaxed">
                         {lastMessage.content}
                       </p>
                    </div>
                  ) : (
                    <p className="text-blue-100 font-medium italic opacity-70">
                      Press the microphone to start speaking.
                    </p>
                  )}
              </div>
            </div>

            {/* AI Response Display Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-auto p-6 bg-white rounded-3xl shadow-2xl flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          <Circle size={12} className="text-blue-600 animate-ping" fill="currentColor" />
                      </div>
                      <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nexora Thinking</p>
                          <p className="text-slate-900 font-bold">Processing your speech...</p>
                      </div>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[75vh] w-full bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-blue-900/10">
       <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              {renderHome()}
            </motion.div>
          )}
          {screen === 'chat' && (
            <motion.div key="chat" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} className="h-full">
              {renderChat()}
            </motion.div>
          )}
          {screen === 'voice' && (
            <motion.div key="voice" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }} className="h-full">
              {renderVoice()}
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}
