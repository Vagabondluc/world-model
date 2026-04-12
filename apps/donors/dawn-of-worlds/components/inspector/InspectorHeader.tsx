
import React from 'react';

interface InspectorHeaderProps {
  icon: string;
  title: string;
  subtitle: string;
  onClose: () => void;
  isError?: boolean;
}

export const InspectorHeader: React.FC<InspectorHeaderProps> = ({ icon, title, subtitle, onClose, isError }) => (
  <div className={`p-4 border-b transition-all duration-300 ${isError ? 'border-red-500 bg-red-500/10' : 'border-white/5 bg-white/[0.02]'} flex items-center justify-between shrink-0`}>
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded shadow-glow transition-colors ${isError ? 'bg-red-500 text-white' : 'bg-primary/20 text-primary'}`}>
        <span className="material-symbols-outlined">{isError ? 'report' : icon}</span>
      </div>
      <div>
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          {title}
          {isError && <span className="material-symbols-outlined text-[14px] text-red-500 animate-pulse">warning</span>}
        </h2>
        <span className={`text-[10px] uppercase font-bold tracking-tight ${isError ? 'text-red-400' : 'text-text-muted'}`}>
          {isError ? 'Action Requirement Failed' : subtitle}
        </span>
      </div>
    </div>
    <button onClick={onClose} className="text-text-muted hover:text-white transition-colors p-1">
      <span className="material-symbols-outlined text-sm">close</span>
    </button>
  </div>
);
