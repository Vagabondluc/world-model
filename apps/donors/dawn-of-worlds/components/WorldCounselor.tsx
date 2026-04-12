
import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GoogleGenAI } from "@google/genai";
import { triggerHaptic } from '../logic/haptics';
import { ui } from '../logic/ui.tokens';

interface WorldCounselorProps {
  onClose: () => void;
}

const WorldCounselor: React.FC<WorldCounselorProps> = ({ onClose }) => {
  const state = useGameStore();
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConsult = async () => {
    setLoading(true);
    triggerHaptic('confirm');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Compress state for prompt
      const summary = {
        age: state.age,
        round: state.round,
        turn: state.turn,
        activePlayer: state.activePlayerId,
        recentEvents: state.events.slice(-10).map(e => ({ type: e.type, player: e.playerId })),
        worldStats: {
            totalObjects: state.worldCache.size,
            nations: Array.from(state.worldCache.values()).filter(o => o.kind === 'NATION').map(n => n.name),
            races: Array.from(state.worldCache.values()).filter(o => o.kind === 'RACE').map(r => r.name),
        }
      };

      const prompt = `
        You are the World Counselor, a divine advisor for the game "Dawn of Worlds".
        Current State: ${JSON.stringify(summary)}
        
        Provide 3 short, distinct suggestions for the active player (${state.activePlayerId}) to make the world more interesting.
        1. Strategic: Gameplay focused (resources, borders).
        2. Narrative: Story focused (lore, relationships).
        3. Chaotic: Disruptive focused (catastrophes, wars).
        
        Format as Markdown bullet points. Be concise and evocative.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAdvice(response.text || "The stars are silent.");
    } catch (e) {
      setAdvice("Connection to the Divine Plane failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#0a0a0c] border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col relative">
        
        {/* Divine Header */}
        <div className="h-32 bg-gradient-to-b from-cyan-900/20 to-transparent flex items-center justify-center relative">
           <div className={`size-16 rounded-full bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] ${loading ? 'animate-pulse' : ''}`}>
              <span className="material-symbols-outlined text-3xl text-cyan-400">psychology_alt</span>
           </div>
           <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white">
              <span className="material-symbols-outlined">close</span>
           </button>
        </div>

        <div className="px-8 pb-8 text-center space-y-6">
           <div>
              <h2 className="text-xl font-black text-white font-display tracking-tight uppercase">The World Counselor</h2>
              <p className="text-xs text-cyan-200/60 uppercase tracking-widest mt-1">Divine Intelligence Interface</p>
           </div>

           {!advice && !loading && (
             <div className="py-8 text-white/40 text-sm italic">
                "I observe the tides of history. Seek my counsel, and I shall illuminate the path."
             </div>
           )}

           {loading && (
             <div className="py-8 flex flex-col items-center gap-4">
                <div className="w-full max-w-[200px] h-1 bg-cyan-900/30 rounded-full overflow-hidden">
                   <div className="h-full bg-cyan-400 animate-[loading_1s_ease-in-out_infinite] w-1/2"></div>
                </div>
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest animate-pulse">Divining Probabilities...</p>
             </div>
           )}

           {advice && (
             <div className="text-left bg-white/5 p-6 rounded-2xl border border-white/10 prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap font-serif leading-relaxed text-slate-200">
                   {advice}
                </div>
             </div>
           )}

           {!loading && (
             <button 
               onClick={handleConsult}
               className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-glow transition-all active:scale-95"
             >
               {advice ? 'Seek Further Wisdom' : 'Consult the Oracle'}
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default WorldCounselor;
