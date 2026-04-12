
import React from 'react';

export const EmptyInspector: React.FC = () => (
  <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-40">
    <span className="material-symbols-outlined text-4xl mb-4 text-white/20">query_stats</span>
    <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">No Selection</h2>
    <p className="text-[10px] text-text-muted mt-2">Select a hex on the map to inspect its history and properties.</p>
  </div>
);
