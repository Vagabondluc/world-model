
import React, { useState } from 'react';
import { X, Keyboard, MousePointer, Info, BookOpen } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';

export const HelpModal: React.FC = () => {
  const { isHelpOpen, setHelpOpen } = useUIStore();
  const [activeTab, setActiveTab] = useState<'CONTROLS' | 'GUIDE'>('CONTROLS');

  if (!isHelpOpen) return null;

  return (
    <div className="absolute inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Operator's Manual</h2>
          </div>
          <button onClick={() => setHelpOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('CONTROLS')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'CONTROLS' ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Controls & Input
          </button>
          <button 
            onClick={() => setActiveTab('GUIDE')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'GUIDE' ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Simulation Guide
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'CONTROLS' && (
            <div className="space-y-8">
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-4 uppercase tracking-widest">
                  <MousePointer className="w-4 h-4" /> Mouse Gestures
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                    <span className="block text-xs font-bold text-indigo-400 mb-1">Left Click / Drag</span>
                    <span className="text-xs text-slate-400">Rotate View / Apply Brush (in Edit Mode)</span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                    <span className="block text-xs font-bold text-indigo-400 mb-1">Right Click / Drag</span>
                    <span className="text-xs text-slate-400">Pan View</span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                    <span className="block text-xs font-bold text-indigo-400 mb-1">Scroll</span>
                    <span className="text-xs text-slate-400">Zoom In / Out</span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                    <span className="block text-xs font-bold text-indigo-400 mb-1">Click Hex</span>
                    <span className="text-xs text-slate-400">Inspect Details & Hydrate Voxels</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-4 uppercase tracking-widest">
                  <Keyboard className="w-4 h-4" /> Keyboard Shortcuts
                </h3>
                <div className="space-y-2">
                  {[
                    { keys: ['?'], desc: 'Toggle Help' },
                    { keys: ['M'], desc: 'Toggle Projection (Globe / Flat)' },
                    { keys: ['Space'], desc: 'Pause / Resume Simulation' },
                    { keys: ['Esc'], desc: 'Close Inspector / Panels' },
                    { keys: ['1', '2', '3'], desc: 'Workspace Modes (Focus / Balanced / Inspect)' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800/50">
                      <span className="text-xs text-slate-400 font-medium">{item.desc}</span>
                      <div className="flex gap-1">
                        {item.keys.map(k => (
                          <kbd key={k} className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-[10px] font-mono font-bold text-slate-300 shadow-sm">{k}</kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'GUIDE' && (
            <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-2 uppercase tracking-widest">
                  <BookOpen className="w-4 h-4" /> The Simulation
                </h3>
                <p>
                  Orbis creates a deterministic planetary simulation. Every aspect of the world, from the height of the mountains to the placement of every tree voxel, is derived from a unified seed and a set of physical laws.
                </p>
              </section>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase mb-2">L1: Tectonics</h4>
                  <p className="text-xs">The planet is divided into crustal plates. Their collision creates mountains (orogeny) and rifts. This drives the base elevation map.</p>
                </div>
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase mb-2">L2: Hydrology</h4>
                  <p className="text-xs">Water flows downhill. Rivers erode terrain over geologic time, creating valleys and carrying sediment to the sea to form deltas.</p>
                </div>
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">L3: Biome</h4>
                  <p className="text-xs">Temperature and moisture determine the biome. Flora and civilization density are derived from habitable scores.</p>
                </div>
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 uppercase mb-2">L4: Voxel Realization</h4>
                  <p className="text-xs">When you inspect a hex, the engine generates a high-fidelity 3D volume on the fly, matching the global stats exactly.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
