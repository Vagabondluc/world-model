import React, { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { GoogleGenAI } from "@google/genai";
import { triggerHaptic } from '../logic/haptics';
import { Annotation } from '../types';

interface SagaViewProps {
  onClose: () => void;
}

const SagaView: React.FC<SagaViewProps> = ({ onClose }) => {
  const state = useGameStore(state => state);
  const [chapter, setChapter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as string | null);
  const [currentAge, setCurrentAge] = useState(state.age);

  // Derived style based on prevalent tone
  const toneStyle = useMemo(() => {
    // Fix: Explicitly casting Object.values to Annotation array to fix property access errors on unknown
    const annotations = Object.values(state.chronicle) as Annotation[];
    const tones = annotations.map(a => a.tone);
    if (tones.includes('Tragic')) return { bg: 'bg-[#0f0a0a]', accent: 'text-red-500', glow: 'shadow-red-500/20' };
    if (tones.includes('Heroic')) return { bg: 'bg-[#0a0f0a]', accent: 'text-green-500', glow: 'shadow-green-500/20' };
    if (tones.includes('Mysterious')) return { bg: 'bg-[#0a0a1a]', accent: 'text-purple-500', glow: 'shadow-purple-500/20' };
    return { bg: 'bg-[#0a0a0c]', accent: 'text-amber-500', glow: 'shadow-amber-500/20' };
  }, [state.chronicle]);

  const generateSaga = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const ageEvents = state.events.filter(e => e.age === currentAge && !state.revokedEventIds.has(e.id));
      const ageLore = Object.entries(state.chronicle)
        .filter(([id]) => {
           const evt = state.events.find(e => e.id === id);
           return evt && evt.age === currentAge;
        })
        .map(([id, lore]) => {
          const l = lore as Annotation;
          return `Event ID ${id}: "${l.title}" - ${l.body} (Tone: ${l.tone})`;
        })
        .join('\n');

      const prompt = `
        You are a legendary chronicler of worlds. 
        Write a epic narrative chapter for Age ${currentAge} of the world "${state.config?.worldName}".
        
        Mechanical Event Log:
        ${JSON.stringify(ageEvents, null, 2)}
        
        Player Annotated Lore:
        ${ageLore}
        
        Rules:
        - Use high-fantasy, evocative prose.
        - Strictly follow the events in the log.
        - Incorporate player annotations as canonical truth.
        - Focus on themes of growth, conflict, and divine intervention.
        - Return only Markdown.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setChapter(response.text || 'The pages are blank...');
      triggerHaptic('confirm');
    } catch (err: any) {
      console.error(err);
      setError('The spirits of the loom are tangled. (AI Error)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!chapter && !loading) generateSaga();
  }, [currentAge]);

  return (
    <div className={`fixed inset-0 z-[65] ${toneStyle.bg} flex flex-col font-sans animate-in fade-in slide-in-from-right-10 duration-500 transition-colors`}>
      <header className="h-16 border-b border-white/5 bg-bg-panel px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className={`size-10 ${toneStyle.accent.replace('text', 'bg')}/20 rounded-lg flex items-center justify-center ${toneStyle.accent} border border-white/5`}>
            <span className="material-symbols-outlined">auto_stories</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-white font-display tracking-tight uppercase italic">The Great Saga</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">Age {currentAge} Chronicles</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex bg-bg-input p-1 rounded-lg border border-white/5">
              {[1, 2, 3].map(a => (
                <button 
                  key={a}
                  onClick={() => { setChapter(''); setCurrentAge(a as any); }}
                  className={`px-4 py-1.5 rounded text-[10px] font-bold transition-all ${currentAge === a ? `${toneStyle.accent.replace('text', 'bg')} text-black` : 'text-text-muted hover:text-white'}`}
                >
                  AGE {a === 1 ? 'I' : a === 2 ? 'II' : 'III'}
                </button>
              ))}
           </div>
           <button onClick={onClose} className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
           </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
             <div className={`size-16 border-t-2 ${toneStyle.accent} border-r-2 rounded-full animate-spin`}></div>
             <p className={`${toneStyle.accent} font-display font-bold uppercase tracking-[0.4em] animate-pulse`}>Consulting the Loom...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 gap-4">
             <span className="material-symbols-outlined text-6xl text-red-500">error</span>
             <h3 className="text-xl font-bold text-white uppercase">{error}</h3>
             <button onClick={generateSaga} className={`px-6 py-2 ${toneStyle.accent.replace('text', 'bg')} text-black font-bold rounded-lg uppercase tracking-widest hover:brightness-110 transition-all`}>Retry Summoning</button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto py-24 px-8 prose prose-invert prose-slate">
             <div className="mb-12 flex justify-center">
                <div className={`h-px w-24 bg-gradient-to-r from-transparent to-current opacity-30 ${toneStyle.accent}`}></div>
                <span className={`material-symbols-outlined mx-4 ${toneStyle.accent}`}>history_edu</span>
                <div className={`h-px w-24 bg-gradient-to-l from-transparent to-current opacity-30 ${toneStyle.accent}`}></div>
             </div>
             
             <div className="font-serif text-lg leading-relaxed text-slate-300 drop-shadow-sm first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left whitespace-pre-wrap">
                {chapter}
             </div>

             <div className="mt-20 pt-12 border-t border-white/5 flex flex-col items-center gap-8 opacity-40">
                <button onClick={generateSaga} className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:${toneStyle.accent} transition-colors`}>
                   <span className="material-symbols-outlined text-sm">refresh</span>
                   Rewrite History
                </button>
                <div className="size-8 bg-white/5 rotate-45 border border-white/10 flex items-center justify-center">
                   <div className={`size-2 opacity-50 ${toneStyle.accent.replace('text', 'bg')}`}></div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SagaView;