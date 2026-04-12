
import React from 'react';
import { PlayerConfig } from '../../types';
import { PRESET_COLORS, DIVINE_DOMAINS } from '../../logic/wizard-data';

interface PlayerConfigFormProps {
  player: PlayerConfig;
  onUpdate: (changes: Partial<PlayerConfig>) => void;
  onToggleReady: () => void;
}

export const PlayerConfigForm: React.FC<PlayerConfigFormProps> = ({ player, onUpdate, onToggleReady }) => {
  return (
    <div className="space-y-8 flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest">My Persona</h3>
        {player.isReady && <span className="text-xs text-green-400 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Locked In</span>}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-text-muted uppercase mb-2 block">Display Name</label>
          <input 
            type="text" 
            value={player.name}
            onChange={e => onUpdate({ name: e.target.value })}
            disabled={player.isReady}
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="text-[10px] font-bold text-text-muted uppercase mb-2 block">Color</label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.slice(0, 4).map(c => (
                  <button 
                    key={c.hex}
                    onClick={() => onUpdate({ color: c.hex })}
                    disabled={player.isReady}
                    className={`size-8 rounded-full border-2 transition-transform ${player.color === c.hex ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
           </div>
           <div>
              <label className="text-[10px] font-bold text-text-muted uppercase mb-2 block">Domain</label>
              <select 
                value={player.domain}
                onChange={e => onUpdate({ domain: e.target.value })}
                disabled={player.isReady}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-primary focus:outline-none disabled:opacity-50"
              >
                {DIVINE_DOMAINS.map(d => (
                  <option key={d.id} value={d.id}>{d.id}</option>
                ))}
              </select>
           </div>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <button 
          onClick={onToggleReady}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${
            player.isReady 
            ? 'bg-white/10 text-white hover:bg-white/20' 
            : 'bg-primary text-white hover:bg-primary-hover shadow-glow'
          }`}
        >
          {player.isReady ? 'Cancel Ready' : 'Mark Ready'}
        </button>
      </div>
    </div>
  );
};
