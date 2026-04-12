
import React from 'react';

export const ColorSection: React.FC = () => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">palette</span>
        Color Palette
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { name: 'Deep Space', hex: '#0A0A0C', class: 'bg-[#0A0A0C]', token: 'bg-deep-space' },
          { name: 'Action Primary', hex: '#13B6EC', class: 'bg-primary', token: 'bg-primary' },
          { name: 'Error', hex: '#EF4444', class: 'bg-red-500', token: 'bg-red-500' },
          { name: 'Player Red', hex: '#F87171', class: 'bg-[#f87171]', token: 'bg-player-red' },
          { name: 'Player Blue', hex: '#60A5FA', class: 'bg-[#60a5fa]', token: 'bg-player-blue' },
          { name: 'Gold AP', hex: '#FBBF24', class: 'bg-amber-400', token: 'bg-gold-accent' },
        ].map(color => (
          <div key={color.name} className="flex flex-col gap-3 group">
            <div className={`w-full aspect-square rounded-xl ${color.class} border border-slate-800 shadow-xl flex items-end p-3 transition-transform group-hover:-translate-y-1`}>
              <span className="text-[10px] font-mono text-white/50 bg-black/40 px-1.5 rounded">{color.hex}</span>
            </div>
            <div>
              <p className="text-sm font-bold">{color.name}</p>
              <p className="text-[10px] font-mono text-slate-500">{color.token}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
