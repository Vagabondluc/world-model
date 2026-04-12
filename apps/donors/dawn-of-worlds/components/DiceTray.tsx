
import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { triggerHaptic } from '../logic/haptics';
import { ui } from '../logic/ui.tokens';

const Dice: React.FC<{ value: number; rolling: boolean }> = ({ value, rolling }) => (
  <div className={`size-16 bg-white rounded-xl shadow-[0_4px_0_#ccc] flex items-center justify-center text-4xl font-bold text-black border-2 border-[#eee] ${rolling ? 'animate-spin' : ''}`}>
    {rolling ? '?' : value}
  </div>
);

const DiceTray: React.FC = () => {
  const dispatch = useGameStore(state => state.dispatch);
  const activePlayerId = useGameStore(state => state.activePlayerId);
  const playerState = useGameStore(state => state.playerCache[activePlayerId]);
  const state = useGameStore(state => state);

  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<[number, number] | null>(null);

  if (!playerState || playerState.hasRolledThisTurn) return null;

  const handleRoll = () => {
    setRolling(true);
    triggerHaptic('tap');
    
    // Simulate animation time
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setResult([d1, d2]);
      setRolling(false);
      triggerHaptic('confirm');

      const bonus = playerState.lowPowerBonus || 0;
      const total = d1 + d2 + bonus;

      setTimeout(() => {
        dispatch({
          id: crypto.randomUUID(),
          ts: Date.now(),
          type: 'POWER_ROLL',
          playerId: activePlayerId,
          age: state.age,
          round: state.round,
          turn: state.turn,
          payload: { roll: [d1, d2], bonus, result: total }
        });
      }, 1000); // Wait for user to see result
    }, 800);
  };

  const bonus = playerState.lowPowerBonus || 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`bg-bg-panel border border-white/10 ${ui.radius.panel} p-8 flex flex-col items-center gap-8 shadow-2xl max-w-sm w-full mx-4`}>
        
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black text-white uppercase tracking-tight font-display">Gather Power</h2>
          <p className="text-xs text-text-muted">Roll the dice to generate Action Points for this turn.</p>
        </div>

        <div className="flex gap-4 p-6 bg-black/20 rounded-2xl border border-white/5">
          <Dice value={result ? result[0] : 1} rolling={rolling} />
          <Dice value={result ? result[1] : 1} rolling={rolling} />
        </div>

        {bonus > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
            <span className="material-symbols-outlined text-green-400 text-sm">trending_up</span>
            <span className="text-xs font-bold text-green-400 uppercase tracking-wide">+{bonus} Low Power Bonus</span>
          </div>
        )}

        <button
          onClick={handleRoll}
          disabled={rolling || !!result}
          className={`w-full py-4 ${ui.radius.button} font-black uppercase tracking-[0.2em] text-sm transition-all shadow-glow ${
            rolling || result 
              ? 'bg-white/10 text-white/50 cursor-not-allowed' 
              : 'bg-primary text-white hover:scale-105 active:scale-95'
          }`}
        >
          {rolling ? 'Rolling...' : result ? 'Power Gathered!' : 'Roll Dice'}
        </button>

      </div>
    </div>
  );
};

export default DiceTray;
