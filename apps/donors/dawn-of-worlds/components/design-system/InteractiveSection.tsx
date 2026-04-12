
import React from 'react';

export const InteractiveSection: React.FC = () => {
  return (
    <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
      <h3 className="text-lg font-bold mb-6">Interactive Elements</h3>
      <div className="flex flex-wrap gap-6 mb-10">
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-mono text-slate-500 uppercase">Primary</span>
          <button className="bg-primary text-black font-bold px-6 py-2 rounded shadow-glow hover:brightness-110">START GAME</button>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-mono text-slate-500 uppercase">Default</span>
          <button className="bg-slate-800 text-slate-200 font-bold px-6 py-2 rounded hover:bg-slate-700 transition-all">CANCEL</button>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-mono text-slate-500 uppercase">Disabled</span>
          <button className="bg-slate-900 text-slate-700 font-bold px-6 py-2 rounded cursor-not-allowed border border-dashed border-slate-800">LOCKED</button>
        </div>
      </div>

      <h4 className="text-sm font-bold mb-4 text-slate-500 uppercase tracking-widest">Feedback States</h4>
      <div className="flex flex-col gap-3">
        <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-3">
          <span className="material-symbols-outlined text-red-500">error</span>
          <p className="text-sm font-medium text-red-500">Insufficient Action Points (AP)</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-2xl w-fit flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary shadow-glow"></span>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Placement Preview</p>
          </div>
          <p className="text-[11px] text-slate-400">Mountain terrain +2 DEF</p>
        </div>
      </div>
    </section>
  );
};
