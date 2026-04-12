
import React from 'react';
import { useGameStore } from '../store/gameStore';
import { HexInspector } from './inspector/HexInspector';
import { EntityInspector } from './inspector/EntityInspector';
import { EmptyInspector } from './inspector/EmptyInspector';

interface InspectorSidebarProps {
  isErrorState: boolean;
}

const InspectorSidebar: React.FC<InspectorSidebarProps> = ({ isErrorState }) => {
  const selection = useGameStore(state => state.activeSelection);
  const setSelection = useGameStore(state => state.setSelection);

  const handleClose = () => {
    setSelection({ kind: 'NONE' });
  };

  return (
    <aside className="w-80 border-l border-white/5 bg-[#1a1122] flex flex-col z-20 shadow-2xl">
      <div className="flex-1 overflow-hidden relative">
        {selection.kind === 'NONE' && <EmptyInspector />}
        
        {selection.kind === 'HEX' && (
          <HexInspector 
            hex={selection.hex} 
            onClose={handleClose} 
            isError={isErrorState} 
          />
        )}
        
        {selection.kind === 'WORLD' && (
          <EntityInspector 
            worldId={selection.worldId} 
            onClose={handleClose}
            isError={isErrorState} 
          />
        )}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/5 shrink-0">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-bg-input/50 border border-white/5 opacity-60">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Auth: Local Instance</span>
        </div>
      </div>
    </aside>
  );
};

export default InspectorSidebar;
