
import React from 'react';

interface SidebarProps {
  onExit: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onExit }) => {
  return (
    <aside className="w-64 border-r border-slate-800 bg-[#101d22] flex flex-col shrink-0">
      <div className="p-6 flex flex-col gap-8">
        <div className="flex gap-3 items-center cursor-pointer group" onClick={onExit}>
          <div className="bg-primary rounded-lg size-10 flex items-center justify-center text-white shadow-glow transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined">architecture</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-none">World Builder</h1>
            <p className="text-primary text-[10px] font-mono uppercase tracking-wider mt-1">v1.0.4 - Design System</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {[
            { id: 'tokens', label: 'Core Tokens', icon: 'token' },
            { id: 'components', label: 'Game Components', icon: 'category' },
            { id: 'patterns', label: 'Layout Patterns', icon: 'dashboard_customize' },
            { id: 'icons', label: 'Icon Library', icon: 'draw' }
          ].map((item, i) => (
            <div key={item.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${i === 0 ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="material-symbols-outlined text-sm">settings</span>
          <p className="text-sm font-medium">System States</p>
        </div>
      </div>
    </aside>
  );
};
