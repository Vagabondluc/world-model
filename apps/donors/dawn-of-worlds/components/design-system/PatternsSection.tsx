
import React from 'react';

export const PatternsSection: React.FC = () => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">info</span>
        Forensic Patterns
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Location Data', title: 'Iron Peaks', sub: 'Sector Q:12 R:8', color: 'border-l-primary' },
          { label: 'Entity Status', title: 'Berserker Corp', sub: 'Status: Battle Ready', color: 'border-l-red-500' },
          { label: 'Yield Data', title: 'Great Forge', sub: 'Production: +12 AP', color: 'border-l-amber-400' }
        ].map(card => (
          <div key={card.title} className={`bg-slate-900 p-5 rounded border border-slate-800 border-l-4 ${card.color} shadow-lg transition-transform hover:scale-[1.02]`}>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{card.label}</h4>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-white">{card.title}</p>
              <p className="text-xs text-slate-500 font-mono italic">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
