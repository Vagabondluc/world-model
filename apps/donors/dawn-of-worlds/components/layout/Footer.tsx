
import React from 'react';
import { useGameStore } from '../../store/gameStore';

interface FooterProps {
  onTimelineClick: () => void;
  isTimelineActive: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onTimelineClick, isTimelineActive }) => {
  const events = useGameStore(state => state.events);
  const players = useGameStore(state => state.config?.players);

  const getPlayerColor = (pid: string) => players?.find(p => p.id === pid)?.color || '#fff';

  return (
    <footer role="contentinfo" className="h-10 shrink-0 border-t border-white/5 bg-bg-panel flex items-center px-4 overflow-hidden relative z-30">
      <button 
        type="button"
        onClick={onTimelineClick}
        className={`flex items-center gap-2 pr-4 border-r border-white/5 hover:text-white transition-colors ${isTimelineActive ? 'text-primary font-black' : 'text-text-muted'}`}
      >
        <span className="material-symbols-outlined text-sm" aria-hidden="true">history</span>
        <span className="text-[10px] font-bold uppercase tracking-widest">Event Log</span>
        <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${isTimelineActive ? 'rotate-180' : ''}`}>keyboard_arrow_up</span>
      </button>
      
      <div className="flex-1 px-4 flex items-center gap-8 overflow-x-auto no-scrollbar whitespace-nowrap">
         {events.slice(-3).reverse().map((e) => (
           <div key={e.id} className="flex items-center gap-2 text-[11px] opacity-80 animate-in fade-in slide-in-from-left-2">
              <span className="font-bold text-text-muted">A{e.age}·R{e.round}</span>
              <span className="material-symbols-outlined text-[14px]" style={{ color: getPlayerColor(e.playerId) }}>chevron_right</span>
              <span className="text-white/80">{e.type.replace('WORLD_', '')}</span>
           </div>
         ))}
         {events.length === 0 && (
           <div className="text-[11px] text-text-muted italic opacity-50">Primordial void active...</div>
         )}
      </div>
      
      <div className="pl-4 border-l border-white/5 flex items-center gap-4">
        <div className="flex items-center gap-2 group cursor-help" title="BroadcastChannel Sync Active">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
          <span className="text-[10px] text-text-muted uppercase font-bold tracking-tighter group-hover:text-green-400 transition-colors">Local Multi-Tab Sync</span>
        </div>
      </div>
    </footer>
  );
};
