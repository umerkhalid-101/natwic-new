import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const GeminiChat: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Welcome to the Natwic® Digital Lab. I'm your studio assistant. How can I help you redefine your brand today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are the 'Natwic Studio Lead AI'. You represent Natwic Studio, a high-end digital agency. Your tone is refined, minimalist, professional, and sophisticated. You emphasize pure intent, high-fidelity design, and functional engineering. Standard projects start at $3450 and monthly retainers at $6850. Encourage exploration of the studio's portfolio.",
          temperature: 0.7,
        },
      });

      setMessages(prev => [...prev, { role: 'assistant', text: response.text || "I apologize, my creative cycles were interrupted. Could we revisit that?" }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: "Connection to the studio lost. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 30 }}
      className="fixed bottom-24 right-8 z-[100] w-full max-w-sm bg-white border border-zinc-100 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col h-[550px]"
    >
      <div className="p-6 border-b border-zinc-50 flex justify-between items-center bg-white/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center text-[10px] font-bold text-white tracking-widest">NW</div>
          <div>
            <p className="text-xs font-semibold tracking-tight">Studio AI</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-[8px] text-zinc-400 uppercase font-bold tracking-[0.2em]">Active Link</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-400">✕</button>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-2xl text-[12px] leading-relaxed ${
              m.role === 'user' 
                ? 'bg-black text-white rounded-tr-none font-medium' 
                : 'bg-zinc-50 text-zinc-600 rounded-tl-none border border-zinc-100'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-50 p-4 rounded-2xl rounded-tl-none border border-zinc-100">
               <div className="flex gap-1">
                <div className="w-1 h-1 bg-zinc-300 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-zinc-50">
        <div className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="w-full bg-zinc-50 border border-zinc-100 rounded-full px-6 py-4 text-[11px] focus:outline-none focus:border-black transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>
    </motion.div>
  );
};