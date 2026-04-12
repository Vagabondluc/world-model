
import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CombatSession } from '../types';
import { ui } from '../logic/ui.tokens';
import { triggerHaptic } from '../logic/haptics';

interface WarScribeProps {
  session: CombatSession;
  onComplete: () => void;
  lastEventId?: string;
}

const WarScribe: React.FC<WarScribeProps> = ({ session, onComplete, lastEventId }) => {
  const annotate = useGameStore(state => state.annotateChronicler);
  const world = useGameStore(state => state.worldCache);
  const defender = world.get(session.defenderId);
  const attackerName = session.attackerId; // Assuming generic for now
  
  const defaultTitle = defender ? `The Battle of ${defender.name || defender.kind}` : 'Skirmish';
  const defaultBody = session.winner === 'ATTACKER' 
    ? `The forces of ${attackerName} overwhelmed the defenders, leaving only ruin in their wake.`
    : `The defenders stood firm against the aggression of ${attackerName}, repelling the assault.`;

  const [title, setTitle] = useState(defaultTitle);
  const [body, setBody] = useState(defaultBody);
  const [tone, setTone] = useState<'Heroic' | 'Tragic' | 'Neutral'>('Tragic');

  const handleSeal = () => {
    if (lastEventId) {
        annotate(lastEventId, { title, body, tone });
    }
    triggerHaptic('confirm');
    onComplete();
  };

  return (
    <div className={`fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500`}>
      <div className="w-full max-w-lg bg-[#150a0a] border border-red-900/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.2)]">
        
        {/* Header */}
        <div className="h-16 px-8 flex items-center justify-between border-b border-red-900/20 bg-red-950/10">
           <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500 text-xl">history_edu</span>
              <h2 className="text-sm font-black text-red-100 uppercase tracking-widest">The War Scribe</h2>
           </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Battle Name</label>
              <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#0a0505] border border-red-900/30 rounded-xl p-3 text-red-50 font-display font-bold text-lg focus:border-red-500 outline-none"
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Chronicle Entry</label>
              <textarea 
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={4}
                className="w-full bg-[#0a0505] border border-red-900/30 rounded-xl p-4 text-red-100/80 text-sm leading-relaxed focus:border-red-500 outline-none resize-none"
              />
           </div>

           <div className="flex gap-2">
              {(['Heroic', 'Tragic', 'Neutral'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${tone === t ? 'bg-red-500/20 border-red-500 text-red-200' : 'bg-transparent border-white/5 text-white/40'}`}
                  >
                      {t}
                  </button>
              ))}
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-red-900/20 bg-[#0a0505] flex justify-end">
           <button 
             onClick={handleSeal}
             className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all active:scale-95"
           >
             Seal Fate
           </button>
        </div>
      </div>
    </div>
  );
};

export default WarScribe;
