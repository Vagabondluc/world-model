
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { queryWorld, SearchResult } from '../logic/search';
import { ui } from '../logic/ui.tokens';

interface SearchOverlayProps {
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose }) => {
  const state = useGameStore(state => state);
  const setSelection = useGameStore(state => state.setSelection);
  const inputRef = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HEX' | 'WORLD' | 'PLAYER'>('ALL');

  const results = useMemo(() => {
    let res = queryWorld(state as any, term);
    if (activeFilter === 'HEX') return res.filter(r => r.kind === 'HEX');
    if (activeFilter === 'WORLD') return res.filter(r => r.kind === 'WORLD');
    // Player filtering would require search logic update, currently returns all
    return res;
  }, [state, term, activeFilter]);

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSelect = (res: SearchResult) => {
    if (res.kind === 'HEX') {
      setSelection({ kind: 'HEX', hex: res.hex });
    } else {
      setSelection({ kind: 'WORLD', worldId: res.worldId });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-2xl bg-[#1f1629] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] animate-in slide-in-from-top-4 duration-300">
        
        {/* Search Bar */}
        <div className="px-6 py-5 border-b border-white/5 bg-[#261c33] flex items-center gap-4">
           <span className="material-symbols-outlined text-primary text-3xl">search</span>
           <input 
             ref={inputRef}
             value={term}
             onChange={(e) => setTerm(e.target.value)}
             className="flex-1 bg-transparent border-none focus:ring-0 text-white text-xl font-medium placeholder:text-text-muted/40 font-display" 
             placeholder="Search coordinates, world objects, players..." 
           />
           <kbd className="hidden md:inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-text-muted bg-bg-panel border border-white/10 rounded-lg uppercase">Esc</kbd>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 px-6 py-3 flex-wrap bg-[#1a1122] border-b border-white/5">
          {[
            { id: 'ALL', label: 'All Results', icon: 'apps' },
            { id: 'HEX', label: 'Hexes', icon: 'grid_view' },
            { id: 'WORLD', label: 'Worlds', icon: 'public' },
            { id: 'PLAYER', label: 'Players', icon: 'person' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 transition-all duration-300 ${
                activeFilter === f.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-[#362348] text-text-muted hover:bg-primary/40 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{f.icon}</span>
              <p className="text-xs font-medium">{f.label}</p>
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto bg-[#1f1629] custom-scrollbar p-2">
           {results.length > 0 ? (
             <div className="space-y-1">
               {results.map((res, i) => (
                 <div 
                   key={i} 
                   onClick={() => handleSelect(res)}
                   className="flex items-center gap-4 hover:bg-primary/10 border-l-4 border-transparent hover:border-primary px-4 py-3 justify-between cursor-pointer group transition-all rounded-r-lg mx-2"
                 >
                   <div className="flex items-center gap-4">
                      <div className="text-white flex items-center justify-center rounded-lg bg-[#362348] shrink-0 size-12 group-hover:bg-primary transition-colors shadow-inner">
                        <span className="material-symbols-outlined">
                          {res.kind === 'HEX' ? 'grid_view' : 'public'}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-white text-base font-semibold">{res.label}</p>
                        <p className="text-text-muted text-xs uppercase font-medium tracking-wide">{res.sublabel}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Go To</span>
                      <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">keyboard_return</span>
                   </div>
                 </div>
               ))}
             </div>
           ) : term ? (
             <div className="py-20 text-center">
                <span className="material-symbols-outlined text-5xl mb-4 text-text-muted opacity-20">search_off</span>
                <p className="text-text-muted text-sm italic">No results found for "{term}"</p>
             </div>
           ) : (
             <div className="py-20 text-center opacity-30">
                <span className="material-symbols-outlined text-5xl mb-4">manage_search</span>
                <p className="text-xs font-bold uppercase tracking-[0.2em]">Enter query to search indices</p>
             </div>
           )}
        </div>
        
        {/* Footer Tips */}
        <div className="px-6 py-3 bg-[#130d1a] border-t border-white/5 flex items-center justify-between text-[10px] text-text-muted uppercase font-bold tracking-tight">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <kbd className="flex items-center justify-center w-5 h-5 bg-[#362348] rounded shadow-inner text-primary">↑</kbd>
                <kbd className="flex items-center justify-center w-5 h-5 bg-[#362348] rounded shadow-inner text-primary">↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="flex items-center justify-center px-1.5 h-5 bg-[#362348] rounded shadow-inner text-primary">↵</kbd>
                <span>Select</span>
              </div>
           </div>
           <div className="italic opacity-60">
             Tip: Type <span className="text-primary">h:</span> for hexes, <span className="text-primary">p:</span> for players
           </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
