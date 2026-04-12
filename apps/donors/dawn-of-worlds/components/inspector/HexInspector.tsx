
import React, { useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Hex, GameState } from '../../types';
import { selectWorldObjectsAtHex, selectEventsAffectingHex } from '../../logic/selectors';
import { InspectorHeader } from './InspectorHeader';
import { WorldObjectCard } from './WorldObjectCard';
import { LocalHistory } from './LocalHistory';

interface HexInspectorProps {
  hex: Hex;
  onClose: () => void;
  isError?: boolean;
}

export const HexInspector: React.FC<HexInspectorProps> = ({ hex, onClose, isError }) => {
  const state = useGameStore();
  
  const hexData = useMemo(() => ({
    objects: selectWorldObjectsAtHex(state as unknown as GameState, hex),
    events: selectEventsAffectingHex(state as unknown as GameState, hex)
  }), [state, hex]);

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      <InspectorHeader 
        icon="grid_view" 
        title={`Hex (${hex.q}, ${hex.r})`} 
        subtitle="Sector Data" 
        onClose={onClose} 
        isError={isError}
      />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {isError && (
          <div className="p-4 border-b border-red-500/20 bg-red-500/10">
            <p className="text-[10px] font-black text-red-500 uppercase mb-3 tracking-widest">Requirement Blocked</p>
            <div className="flex items-center gap-3 text-red-100">
               <span className="material-symbols-outlined text-red-500">cancel</span>
               <span className="text-xs font-bold leading-tight">Pre-requisite missing for targeted action. Consult rulebook for Age requirements.</span>
            </div>
          </div>
        )}

        <div className="p-4 border-b border-white/5">
          <p className="text-[10px] font-bold text-primary uppercase mb-3 tracking-widest">Entities Present</p>
          {hexData.objects.length > 0 ? (
            <div className="space-y-2">
              {hexData.objects.map(obj => <WorldObjectCard key={obj.id} object={obj} />)}
            </div>
          ) : (
            <div className="py-6 text-center border border-dashed border-white/5 rounded-lg bg-black/10">
              <p className="text-[10px] text-text-muted italic">Sector unpopulated.</p>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-[10px] font-bold text-primary uppercase mb-4 tracking-widest">Local Chronology</p>
          <LocalHistory events={hexData.events} />
        </div>
      </div>
    </div>
  );
};
