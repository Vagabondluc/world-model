
import React from 'react';

export const MechanicsSection: React.FC = () => {
  return (
    <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col gap-8">
      <div>
        <h3 className="text-lg font-bold mb-4">Action Point System</h3>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-mono text-slate-500 uppercase">State: Full (5/5)</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="size-4 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]"></div>)}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-mono text-slate-500 uppercase">State: Depleted (2/5)</p>
            <div className="flex gap-2">
              {[1, 2].map(i => <div key={i} className="size-4 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]"></div>)}
              {[1, 2, 3].map(i => <div key={i} className="size-4 rounded-full bg-amber-400/20 border border-amber-400/20"></div>)}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Spatial Selection States</h3>
        <div className="flex gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="size-16 bg-primary/20 border-2 border-primary border-dashed clip-hex flex items-center justify-center">
              <span className="material-symbols-outlined text-primary/60 text-3xl">add_location</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">ghost-target</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="size-16 bg-slate-800 border-2 border-primary clip-hex flex items-center justify-center shadow-glow">
              <span className="material-symbols-outlined text-white text-3xl">stars</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">focus-active</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="size-16 bg-red-500/20 border-2 border-red-500 clip-hex flex items-center justify-center">
              <span className="material-symbols-outlined text-red-500 text-3xl">block</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">illegal-zone</span>
          </div>
        </div>
      </div>
    </section>
  );
};
