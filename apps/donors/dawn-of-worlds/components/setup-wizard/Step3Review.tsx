
import React from 'react';
import { GameSessionConfig } from '../../types';

interface Step3ReviewProps {
  config: GameSessionConfig;
  setConfig: (config: GameSessionConfig) => void;
}

export const Step3Review: React.FC<Step3ReviewProps> = ({ config, setConfig }) => {
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <label className="text-xs font-bold text-primary uppercase tracking-widest">World Config</label>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
            <p className="text-2xl font-black text-white">{config.worldName || 'Unnamed'}</p>
            <p className="text-sm text-text-muted">{config.mapSize} Map</p>
            <p className="text-sm text-text-muted">{config.players.length} Architects</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <label className="text-xs font-bold text-primary uppercase tracking-widest">Divine Laws</label>
          <div className="space-y-2">
            <div 
              onClick={() => setConfig({...config, rules: {...config.rules, strictAP: !config.rules.strictAP}})}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${config.rules.strictAP ? 'bg-primary/10 border-primary text-white' : 'bg-white/5 border-white/5 text-text-muted'}`}
            >
              <span className="text-sm font-bold">Strict AP Enforcement</span>
              <span className="material-symbols-outlined text-sm">{config.rules.strictAP ? 'check_circle' : 'radio_button_unchecked'}</span>
            </div>
            <div 
              onClick={() => setConfig({...config, rules: {...config.rules, draftMode: !config.rules.draftMode}})}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${config.rules.draftMode ? 'bg-primary/10 border-primary text-white' : 'bg-white/5 border-white/5 text-text-muted'}`}
            >
              <span className="text-sm font-bold">Draft Mode (Undo Allowed)</span>
              <span className="material-symbols-outlined text-sm">{config.rules.draftMode ? 'check_circle' : 'radio_button_unchecked'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-start gap-4">
        <span className="material-symbols-outlined text-yellow-500">warning</span>
        <div>
          <p className="text-xs font-bold text-yellow-500 uppercase mb-1">Local Storage Warning</p>
          <p className="text-xs text-yellow-100/60 leading-relaxed">
            Forging a new world will overwrite any existing local saves. Ensure you have exported your previous chronicles if you wish to keep them.
          </p>
        </div>
      </div>
    </div>
  );
};
