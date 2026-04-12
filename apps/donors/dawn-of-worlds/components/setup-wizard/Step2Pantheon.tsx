
import React, { useState, useMemo } from 'react';
import { GameSessionConfig, PlayerConfig } from '../../types';
import { PRESET_COLORS, DIVINE_DOMAINS, SUGGESTED_NAMES } from '../../logic/wizard-data';
import { triggerHaptic } from '../../logic/haptics';
import { ui } from '../../logic/ui.tokens';

interface Step2PantheonProps {
  config: GameSessionConfig;
  setConfig: (config: GameSessionConfig) => void;
}

export const Step2Pantheon: React.FC<Step2PantheonProps> = ({ config, setConfig }) => {
  const [editingDomainIndex, setEditingDomainIndex] = useState<number | null>(null);
  const [searchDomain, setSearchDomain] = useState('');

  const updatePlayer = (index: number, changes: Partial<PlayerConfig>) => {
    const newPlayers = [...config.players];
    newPlayers[index] = { ...newPlayers[index], ...changes };
    setConfig({ ...config, players: newPlayers });
  };

  const addArchitect = () => {
    if (config.players.length < 6) {
      triggerHaptic('confirm');
      const nextColor = PRESET_COLORS[config.players.length % PRESET_COLORS.length].hex;
      setConfig({
        ...config,
        players: [...config.players, { 
          id: `P${config.players.length + 1}`, 
          name: 'New Architect', 
          color: nextColor, 
          isHuman: true, 
          avatar: 'person', 
          domain: 'MORTAL' 
        }]
      });
    }
  };

  const removeArchitect = (index: number) => {
    if (config.players.length > 2) {
      triggerHaptic('reject');
      setConfig({
        ...config,
        players: config.players.filter((_, i) => i !== index)
      });
    }
  };

  const randomizeArchitect = (index: number) => {
    triggerHaptic('tap');
    const randomDomain = DIVINE_DOMAINS[Math.floor(Math.random() * DIVINE_DOMAINS.length)];
    const randomName = SUGGESTED_NAMES[Math.floor(Math.random() * SUGGESTED_NAMES.length)];
    updatePlayer(index, {
      name: randomName,
      domain: randomDomain.id,
      avatar: randomDomain.icon
    });
  };

  const filteredDomains = useMemo(() => {
    return DIVINE_DOMAINS.filter(d => 
      d.id.includes(searchDomain.toUpperCase()) || 
      d.tone.toUpperCase().includes(searchDomain.toUpperCase())
    );
  }, [searchDomain]);

  return (
    <div className="h-full flex flex-col relative">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <label className="text-xs font-black text-primary uppercase tracking-widest">The Pantheon</label>
          <p className="text-[10px] text-text-muted">Define the architects of this world.</p>
        </div>
        <button 
          onClick={addArchitect}
          disabled={config.players.length >= 6}
          className={`flex items-center gap-2 px-4 py-2 ${ui.radius.button} border border-dashed border-white/20 hover:border-primary text-xs font-bold uppercase tracking-widest transition-all ${config.players.length >= 6 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5'}`}
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Seat
        </button>
      </div>

      {/* Architect Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pb-20">
        {config.players.map((player, idx) => {
          const domainInfo = DIVINE_DOMAINS.find(d => d.id === player.domain);
          
          return (
            <div key={player.id} className="relative bg-[#1a1122] border border-white/5 rounded-xl p-4 group hover:border-white/10 transition-all flex flex-col gap-4 shadow-lg">
              
              {/* Card Header: Avatar & Color */}
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div 
                    className="size-16 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: player.color }}
                  >
                    <span className="material-symbols-outlined text-4xl text-black/60 font-variation-fill">
                      {domainInfo?.icon || 'person'}
                    </span>
                  </div>
                  {/* Color Picker Popover Trigger (Simplistic for now, just cycle) */}
                  <button 
                    onClick={() => {
                        const currIdx = PRESET_COLORS.findIndex(c => c.hex === player.color);
                        const nextColor = PRESET_COLORS[(currIdx + 1) % PRESET_COLORS.length].hex;
                        updatePlayer(idx, { color: nextColor });
                    }}
                    className="absolute -bottom-2 -right-2 size-6 rounded-full bg-white text-black flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-lg"
                    title="Cycle Color"
                  >
                    <span className="material-symbols-outlined text-[14px]">palette</span>
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Architect {idx + 1}</span>
                    <div className="flex gap-1">
                       <button onClick={() => randomizeArchitect(idx)} className="text-white/20 hover:text-primary transition-colors p-1" title="Randomize Persona">
                          <span className="material-symbols-outlined text-sm">casino</span>
                       </button>
                       {config.players.length > 2 && (
                         <button onClick={() => removeArchitect(idx)} className="text-white/20 hover:text-red-500 transition-colors p-1" title="Remove Seat">
                            <span className="material-symbols-outlined text-sm">close</span>
                         </button>
                       )}
                    </div>
                  </div>
                  <input 
                    type="text" 
                    value={player.name}
                    onChange={(e) => updatePlayer(idx, { name: e.target.value })}
                    className="bg-transparent border-none p-0 text-lg font-bold text-white placeholder:text-white/20 w-full focus:ring-0 font-display"
                    placeholder="Name..."
                  />
                </div>
              </div>

              {/* Domain Selection */}
              <div 
                onClick={() => { triggerHaptic('tap'); setEditingDomainIndex(idx); setSearchDomain(''); }}
                className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5 hover:border-primary/50 cursor-pointer transition-all group/domain"
              >
                <div className="flex flex-col">
                   <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">Divine Domain</span>
                   <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{player.domain}</span>
                      <span className="text-[10px] text-white/40 italic">— {domainInfo?.tone || 'Unknown'}</span>
                   </div>
                </div>
                <span className="material-symbols-outlined text-white/20 group-hover/domain:text-primary transition-colors">edit</span>
              </div>

              {/* Secret Key Toggle */}
              <div className="flex items-center gap-2 mt-auto pt-2 border-t border-white/5">
                 <span className="material-symbols-outlined text-white/20 text-sm">lock</span>
                 <input 
                   type="text" 
                   value={player.secret || ''} 
                   onChange={(e) => updatePlayer(idx, { secret: e.target.value })}
                   placeholder="Optional Secret PIN"
                   className="flex-1 bg-transparent border-none text-[10px] text-white placeholder:text-white/10 focus:ring-0"
                 />
              </div>

            </div>
          );
        })}
      </div>

      {/* Domain Selection Overlay Modal */}
      {editingDomainIndex !== null && (
        <div className="absolute inset-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-white/5">
             <span className="material-symbols-outlined text-primary text-xl">manage_search</span>
             <input 
               autoFocus
               type="text" 
               value={searchDomain}
               onChange={(e) => setSearchDomain(e.target.value)}
               placeholder="Search Domains (e.g. Fire, Void, War)..."
               className="flex-1 bg-transparent border-none text-white placeholder:text-white/30 focus:ring-0 font-bold"
             />
             <button onClick={() => setEditingDomainIndex(null)} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white">
                <span className="material-symbols-outlined">close</span>
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredDomains.map(d => (
                  <button 
                    key={d.id}
                    onClick={() => {
                      triggerHaptic('confirm');
                      updatePlayer(editingDomainIndex, { domain: d.id, avatar: d.icon });
                      setEditingDomainIndex(null);
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 hover:border-primary hover:bg-primary/10 transition-all group ${
                        config.players[editingDomainIndex].domain === d.id ? 'bg-primary/20 border-primary shadow-glow' : 'bg-white/[0.02]'
                    }`}
                  >
                     <span className="material-symbols-outlined text-3xl text-white/70 group-hover:text-white group-hover:scale-110 transition-transform">{d.icon}</span>
                     <div className="text-center">
                        <p className="text-xs font-bold text-white">{d.id}</p>
                        <p className="text-[9px] text-text-muted uppercase tracking-wider">{d.tone}</p>
                     </div>
                  </button>
                ))}
             </div>
             {filteredDomains.length === 0 && (
                <div className="h-full flex items-center justify-center text-white/30 text-xs uppercase tracking-widest">
                   No domains found
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};
