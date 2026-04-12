
import React from 'react';

export const IconsSection: React.FC = () => {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-6">Iconography Catalog</h2>
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-8">
          {[
            { icon: 'terrain', label: 'Mountain' },
            { icon: 'location_city', label: 'City' },
            { icon: 'groups', label: 'Race' },
            { icon: 'forest', label: 'Forest' },
            { icon: 'water', label: 'Water' },
            { icon: 'castle', label: 'Fortress' },
            { icon: 'diamond', label: 'Resource' },
            { icon: 'skull', label: 'Ruins' }
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="size-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 group-hover:text-white transition-colors">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
