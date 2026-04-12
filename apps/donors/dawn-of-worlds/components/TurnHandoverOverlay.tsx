import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { triggerHaptic } from '../logic/haptics';
import { ui } from '../logic/ui.tokens';

const TurnHandoverOverlay: React.FC = () => {
  const isHandoverActive = useGameStore(state => state.isHandoverActive);
  const activePlayerId = useGameStore(state => state.activePlayerId);
  const players = useGameStore(state => state.config?.players);
  const completeHandover = useGameStore(state => state.completeHandover);
  
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  const activePlayer = players?.find(p => p.id === activePlayerId);
  const needsPin = !!activePlayer?.secret;

  useEffect(() => {
    if (isHandoverActive) {
      triggerHaptic('turn');
      setPinInput('');
      setError(false);
    }
  }, [isHandoverActive]);

  if (!isHandoverActive) return null;

  const handleConfirm = () => {
    if (needsPin) {
      if (pinInput === activePlayer.secret) {
        triggerHaptic('confirm');
        completeHandover();
      } else {
        triggerHaptic('reject');
        setError(true);
        setTimeout(() => setError(false), 500);
      }
    } else {
      triggerHaptic('confirm');
      completeHandover();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      <div className="absolute inset-0 z-0 opacity-10">
         <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_240s_linear_infinite] origin-center bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')]"></div>
      </div>

      <div className={`relative z-10 max-w-md w-full text-center space-y-12 transition-transform duration-500 ${error ? 'animate-shake' : ''}`}>
        <div className="space-y-4">
          <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em] block animate-pulse">Authority Transition</span>
          <h1 className="text-4xl font-black text-white font-display uppercase tracking-tight">Pass the device</h1>
          <div className="h-px w-24 bg-white/20 mx-auto"></div>
        </div>

        <div className="flex flex-col items-center gap-6">
           <div 
             className="size-24 rounded-3xl rotate-12 flex items-center justify-center border-4 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all"
             style={{ backgroundColor: activePlayer?.color || '#fff', boxShadow: `0 0 40px ${activePlayer?.color}44` }}
           >
              <span className="material-symbols-outlined text-5xl text-black/80 font-variation-fill">person</span>
           </div>
           <div>
             <h2 className="text-2xl font-black text-white uppercase">{activePlayer?.name || 'Architect'}</h2>
             <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold mt-1">Ready for Epoch Turn</p>
           </div>
        </div>

        {needsPin && (
          <div className="space-y-4">
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Identify Yourself (Enter PIN)</p>
            <input 
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className={`w-full bg-white/5 border-2 ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl py-4 text-center text-2xl font-black tracking-[1em] text-white focus:outline-none focus:border-primary transition-all`}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
          </div>
        )}

        <button 
          onClick={handleConfirm}
          className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-primary hover:text-white transition-all shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:-translate-y-1 active:scale-95"
        >
          {needsPin ? 'Verify & Assume Authority' : 'Assume Authority'}
        </button>

        <p className="text-[9px] text-white/20 uppercase font-medium tracking-widest">Privacy Protocol 007.2 Active</p>
      </div>
    </div>
  );
};

export default TurnHandoverOverlay;
