
import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-[#0a0a0c]/80 backdrop-blur-md px-8 py-4">
      <div className="flex items-center gap-8">
        <h2 className="text-lg font-bold tracking-tight">Design System Explorer</h2>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-sm font-medium text-slate-400 hover:text-primary cursor-pointer transition-colors">Docs</span>
          <span className="text-sm font-medium text-slate-400 hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="text-sm font-medium text-slate-400 hover:text-primary cursor-pointer transition-colors">Github</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input className="bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary" placeholder="Search tokens..."/>
        </div>
        <button className="bg-primary text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:brightness-110 shadow-glow transition-all">
          <span className="material-symbols-outlined text-sm">download</span>
          Export JSON
        </button>
      </div>
    </header>
  );
};
