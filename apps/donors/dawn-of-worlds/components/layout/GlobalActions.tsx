
import React from 'react';

interface GlobalActionsProps {
  onCounselorClick: () => void;
  onShortcutsClick: () => void;
  onChroniclerClick: () => void;
  onSearchClick: () => void;
  onEndTurnClick: () => void;
}

export const GlobalActions: React.FC<GlobalActionsProps> = ({
  onCounselorClick,
  onShortcutsClick,
  onChroniclerClick,
  onSearchClick,
  onEndTurnClick
}) => {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4">
        <button onClick={onCounselorClick} className="flex flex-col items-center group text-text-muted hover:text-cyan-400 transition-colors" aria-label="Ask Oracle">
          <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">psychology_alt</span>
          <span className="text-[8px] uppercase font-black tracking-widest">Oracle</span>
        </button>
        <button onClick={onShortcutsClick} className="flex flex-col items-center group text-text-muted hover:text-white transition-colors" aria-label="Help">
          <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">help_center</span>
          <span className="text-[8px] uppercase font-black tracking-widest">Help</span>
        </button>
        <button onClick={onChroniclerClick} className="flex flex-col items-center group text-text-muted hover:text-white transition-colors" aria-label="Scribe">
          <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">auto_stories</span>
          <span className="text-[8px] uppercase font-black tracking-widest">Scribe</span>
        </button>
      </div>

      <div className="relative w-48 group">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted group-hover:text-white transition-colors">search</span>
        <input 
          onClick={onSearchClick}
          readOnly
          className="h-9 w-full rounded-lg border-none bg-bg-input pl-9 text-xs text-white placeholder:text-text-muted focus:ring-1 focus:ring-primary cursor-pointer hover:bg-white/5 transition-colors"
          placeholder="Search world..."
          type="text"
        />
      </div>

      <button 
        type="button"
        onClick={onEndTurnClick}
        className="group flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-bold text-white transition-all hover:bg-primary-hover active:scale-95 shadow-glow"
      >
        <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">play_arrow</span>
        FINISH TURN
      </button>
    </div>
  );
};
