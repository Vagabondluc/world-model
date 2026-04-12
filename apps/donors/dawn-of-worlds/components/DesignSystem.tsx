
import React from 'react';
import { Sidebar } from './design-system/Sidebar';
import { TopBar } from './design-system/TopBar';
import { ColorSection } from './design-system/ColorSection';
import { InteractiveSection } from './design-system/InteractiveSection';
import { MechanicsSection } from './design-system/MechanicsSection';
import { PatternsSection } from './design-system/PatternsSection';
import { IconsSection } from './design-system/IconsSection';

interface DesignSystemProps {
  onExit: () => void;
}

const DesignSystem: React.FC<DesignSystemProps> = ({ onExit }) => {
  return (
    <div className="flex h-screen bg-[#101d22] text-slate-100 font-sans overflow-hidden">
      <Sidebar onExit={onExit} />

      <main className="flex-1 flex flex-col overflow-y-auto bg-slate-950">
        <TopBar />

        <div className="p-8 max-w-6xl mx-auto w-full flex flex-col gap-12 pb-20">
          <div className="flex flex-col gap-2">
            <span className="text-primary font-mono text-xs font-bold uppercase tracking-widest">Documentation</span>
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-black tracking-tight font-display">Component Token Sheet</h1>
                <p className="text-slate-400 text-lg">Global styles, Tailwind tokens, and game-specific UI mechanics.</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold uppercase tracking-tighter">Figma Linked</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-[10px] font-bold uppercase tracking-tighter">Production Ready</span>
              </div>
            </div>
          </div>

          <ColorSection />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InteractiveSection />
            <MechanicsSection />
          </div>

          <PatternsSection />
          <IconsSection />

          <footer className="py-12 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-mono uppercase tracking-[0.2em]">World Builder Engine Framework © 2026</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default DesignSystem;
