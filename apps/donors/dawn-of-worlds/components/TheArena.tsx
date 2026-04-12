
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { triggerHaptic } from '../logic/haptics';
import { ui } from '../logic/ui.tokens';
import { CombatModifier, CombatSession } from '../types';
import WarScribe from './WarScribe';

const DiceBox: React.FC<{ rolls: [number, number] | null; rolling: boolean; color: string }> = ({ rolls, rolling, color }) => (
  <div className="flex gap-4 justify-center py-8">
    <div className={`size-20 rounded-2xl bg-[#0a0a0c] border-2 border-white/10 flex items-center justify-center text-4xl font-bold shadow-2xl ${rolling ? 'animate-spin' : ''}`} style={{ borderColor: rolls ? color : undefined, color: rolls ? color : '#333' }}>
      {rolling ? '?' : rolls ? rolls[0] : ''}
    </div>
    <div className={`size-20 rounded-2xl bg-[#0a0a0c] border-2 border-white/10 flex items-center justify-center text-4xl font-bold shadow-2xl ${rolling ? 'animate-spin' : ''}`} style={{ borderColor: rolls ? color : undefined, color: rolls ? color : '#333' }}>
      {rolling ? '?' : rolls ? rolls[1] : ''}
    </div>
  </div>
);

const ModifierRow: React.FC<{ mod: CombatModifier; onDelete?: () => void }> = ({ mod, onDelete }) => (
  <div className="flex items-center justify-between bg-black/20 px-3 py-2 rounded-lg border border-white/5">
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-white/60 uppercase">{mod.label}</span>
      {mod.type === 'AUTO' && <span className="text-[8px] bg-white/10 px-1 rounded text-white/30">AUTO</span>}
    </div>
    <div className="flex items-center gap-3">
      <span className={`font-mono font-bold ${mod.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
        {mod.value > 0 ? '+' : ''}{mod.value}
      </span>
      {onDelete && (
        <button onClick={onDelete} className="text-white/20 hover:text-white">
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      )}
    </div>
  </div>
);

const TheArena: React.FC = () => {
  const session = useGameStore(state => state.combatSession);
  const actions = useGameStore(state => state);
  const world = useGameStore(state => state.worldCache);
  const dispatch = useGameStore(state => state.dispatch);
  
  const [lastEventId, setLastEventId] = useState<string>();
  const [newModName, setNewModName] = useState('');
  const [newModVal, setNewModVal] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  if (!session) return null;

  const defender = world.get(session.defenderId);
  const attackerName = session.attackerId; // Placeholder until we have unit selection
  const defenderName = defender?.name || defender?.kind || 'Unknown';

  const sumMods = (mods: CombatModifier[]) => mods.reduce((acc, m) => acc + m.value, 0);
  const attTotal = session.rolls ? (session.rolls.attacker[0] + session.rolls.attacker[1] + sumMods(session.attackerModifiers)) : 0;
  const defTotal = session.rolls ? (session.rolls.defender[0] + session.rolls.defender[1] + sumMods(session.defenderModifiers)) : 0;

  const handleRoll = () => {
    actions.setCombatStage('ROLLING');
    setIsRolling(true);
    triggerHaptic('tap');
    
    setTimeout(() => {
      const ar: [number, number] = [Math.ceil(Math.random()*6), Math.ceil(Math.random()*6)];
      const dr: [number, number] = [Math.ceil(Math.random()*6), Math.ceil(Math.random()*6)];
      
      const aSum = ar[0] + ar[1] + sumMods(session.attackerModifiers);
      const dSum = dr[0] + dr[1] + sumMods(session.defenderModifiers);
      
      let winner: 'ATTACKER' | 'DEFENDER' | 'DRAW' = 'DRAW';
      if (aSum > dSum) winner = 'ATTACKER';
      else if (dSum > aSum) winner = 'DEFENDER';
      else winner = 'DEFENDER'; // Defender wins ties usually

      actions.updateCombatSession({
        rolls: { attacker: ar, defender: dr },
        winner
      });
      setIsRolling(false);
      actions.setCombatStage('RESOLUTION');
      triggerHaptic(winner === 'ATTACKER' ? 'confirm' : 'reject');
    }, 1500);
  };

  const handleResolution = (consequence: 'SCATTER' | 'OBLITERATE' | 'REPEL') => {
    const eventId = crypto.randomUUID();
    setLastEventId(eventId);
    
    // Dispatch Combat Event
    dispatch({
      id: eventId,
      ts: Date.now(),
      type: 'COMBAT_RESOLVE',
      playerId: actions.activePlayerId,
      age: actions.age,
      round: actions.round,
      turn: actions.turn,
      payload: {
        attackerId: session.attackerId,
        defenderId: session.defenderId,
        rolls: {
            attacker: session.rolls!.attacker,
            defender: session.rolls!.defender,
            modifiers: { attacker: sumMods(session.attackerModifiers), defender: sumMods(session.defenderModifiers) }
        },
        outcome: session.winner === 'ATTACKER' ? 'ATTACKER_WINS' : session.winner === 'DEFENDER' ? 'DEFENDER_WINS' : 'DRAW',
        consequence
      }
    });

    // If Obliterate, destroy object
    if (consequence === 'OBLITERATE') {
        // TODO: Calc cost
        dispatch({
            id: crypto.randomUUID(),
            ts: Date.now(),
            type: 'WORLD_DELETE',
            playerId: actions.activePlayerId,
            age: actions.age,
            round: actions.round,
            turn: actions.turn,
            cost: 0, // Placeholder
            payload: { worldId: session.defenderId }
        });
    }

    actions.setCombatStage('CHRONICLE');
  };

  if (session.stage === 'CHRONICLE') {
    return <WarScribe session={session} onComplete={actions.closeCombat} lastEventId={lastEventId} />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-4xl h-[600px] bg-[#050505] border border-white/10 rounded-3xl shadow-2xl flex overflow-hidden relative">
        
        {/* Background FX */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] z-0"></div>
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-red-900/10 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none"></div>

        {/* ATTACKER SIDE */}
        <div className="flex-1 p-8 flex flex-col z-10 border-r border-white/5 relative">
           <h2 className="text-3xl font-black text-red-500 font-display uppercase tracking-tighter">Attacker</h2>
           <p className="text-xs font-bold text-red-400/50 uppercase tracking-widest mb-8">{attackerName}</p>
           
           <div className="flex-1 overflow-y-auto space-y-2 mb-4 custom-scrollbar">
              {session.attackerModifiers.map(m => <ModifierRow key={m.id} mod={m} />)}
           </div>

           {session.stage === 'TACTICS' && (
             <div className="bg-red-900/10 p-3 rounded-xl border border-red-500/20">
                <input 
                  className="bg-transparent text-xs text-white placeholder:text-white/20 w-full mb-2 outline-none font-bold" 
                  placeholder="Add Modifier Name..." 
                  value={newModName} onChange={e => setNewModName(e.target.value)}
                />
                <div className="flex justify-between items-center">
                   <div className="flex gap-2">
                      <button onClick={() => setNewModVal(v => v-1)} className="size-6 bg-black/40 rounded flex items-center justify-center hover:text-white text-white/50">-</button>
                      <span className="text-xs font-mono w-6 text-center">{newModVal > 0 ? '+' : ''}{newModVal}</span>
                      <button onClick={() => setNewModVal(v => v+1)} className="size-6 bg-black/40 rounded flex items-center justify-center hover:text-white text-white/50">+</button>
                   </div>
                   <button 
                     onClick={() => {
                        actions.updateCombatSession({ 
                            attackerModifiers: [...session.attackerModifiers, { id: crypto.randomUUID(), label: newModName || 'Bonus', value: newModVal, type: 'USER' }] 
                        });
                        setNewModName('');
                     }}
                     className="text-[9px] uppercase font-bold bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-colors"
                   >
                     Add
                   </button>
                </div>
             </div>
           )}

           <DiceBox rolls={session.rolls?.attacker || null} rolling={isRolling} color="#ef4444" />
           {session.stage === 'RESOLUTION' && (
             <div className="text-center">
               <span className="text-6xl font-black text-red-500 tabular-nums">{attTotal}</span>
               <p className="text-[10px] text-red-400/50 uppercase font-bold tracking-widest mt-2">Total Power</p>
             </div>
           )}
        </div>

        {/* CENTER VS */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
           <div className="size-16 bg-black border-2 border-white/10 rounded-full flex items-center justify-center shadow-2xl relative">
              <span className="text-xl font-black text-white italic">VS</span>
              {session.stage === 'RESOLUTION' && (
                  <div className={`absolute top-20 px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs whitespace-nowrap shadow-[0_0_30px_rgba(0,0,0,1)] ${
                      session.winner === 'ATTACKER' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                      {session.winner} VICTORY
                  </div>
              )}
           </div>
        </div>

        {/* DEFENDER SIDE */}
        <div className="flex-1 p-8 flex flex-col z-10 items-end text-right">
           <h2 className="text-3xl font-black text-blue-500 font-display uppercase tracking-tighter">Defender</h2>
           <p className="text-xs font-bold text-blue-400/50 uppercase tracking-widest mb-8">{defenderName}</p>
           
           <div className="flex-1 w-full overflow-y-auto space-y-2 mb-4 custom-scrollbar">
              {session.defenderModifiers.map(m => <ModifierRow key={m.id} mod={m} />)}
           </div>

           <DiceBox rolls={session.rolls?.defender || null} rolling={isRolling} color="#3b82f6" />
           {session.stage === 'RESOLUTION' && (
             <div className="text-center w-full">
               <span className="text-6xl font-black text-blue-500 tabular-nums">{defTotal}</span>
               <p className="text-[10px] text-blue-400/50 uppercase font-bold tracking-widest mt-2">Total Defense</p>
             </div>
           )}
        </div>

        {/* FOOTER CONTROLS */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-black/80 backdrop-blur border-t border-white/5 flex items-center justify-center z-30">
           {session.stage === 'SETUP' && (
             <button onClick={() => actions.setCombatStage('TACTICS')} className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-xl hover:scale-105 transition-transform">
               Open Tactics
             </button>
           )}
           {session.stage === 'TACTICS' && (
             <button onClick={handleRoll} className="px-10 py-4 bg-red-600 text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:bg-red-500 transition-colors animate-pulse">
               Roll for War
             </button>
           )}
           {session.stage === 'RESOLUTION' && session.winner === 'ATTACKER' && (
             <div className="flex gap-4">
               <button onClick={() => handleResolution('SCATTER')} className="px-8 py-3 bg-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/20">
                 Scatter (Free)
               </button>
               <button onClick={() => handleResolution('OBLITERATE')} className="px-8 py-3 bg-red-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-red-500 shadow-glow">
                 Obliterate (Cost AP)
               </button>
             </div>
           )}
           {session.stage === 'RESOLUTION' && session.winner === 'DEFENDER' && (
             <button onClick={() => handleResolution('REPEL')} className="px-8 py-3 bg-blue-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-blue-500">
               Accept Defeat
             </button>
           )}
        </div>

        <button onClick={actions.closeCombat} className="absolute top-6 right-6 z-50 text-white/20 hover:text-white">
           <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
};

export default TheArena;
