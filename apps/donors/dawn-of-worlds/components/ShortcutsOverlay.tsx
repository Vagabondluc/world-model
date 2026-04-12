
import React, { useState } from 'react';
import { ui } from '../logic/ui.tokens';
import { useGameStore } from '../store/gameStore';
import { triggerHaptic } from '../logic/haptics';

interface ShortcutsOverlayProps {
   onClose: () => void;
}

const ShortcutRow: React.FC<{ keys: string[]; label: string }> = ({ keys, label }) => (
   <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest group-hover:text-white transition-colors">{label}</span>
      <div className="flex gap-1.5">
         {keys.map((k, i) => (
            <kbd key={i} className="min-w-[24px] h-6 px-1.5 flex items-center justify-center bg-white/5 border border-white/10 rounded font-mono text-[10px] font-black text-primary-light shadow-inner">
               {k}
            </kbd>
         ))}
      </div>
   </div>
);

const ShortcutsOverlay: React.FC<ShortcutsOverlayProps> = ({ onClose }) => {
   const [tab, setTab] = useState<'COMMANDS' | 'RULES'>('COMMANDS');
   const settings = useGameStore(state => state.settings);
   // We use direct setState to modify deep settings for now, in a real app this would be an action
   const setSettings = (newSettings: any) => useGameStore.setState({ settings: { ...settings, ...newSettings } });

   const toggleMute = () => {
      triggerHaptic('tap');
      setSettings({ ui: { ...settings.ui, audioMuted: !settings.ui.audioMuted } });
   };

   const toggleTiles = () => {
      triggerHaptic('tap');
      setSettings({ ui: { ...settings.ui, renderPngTiles: !settings.ui.renderPngTiles } });
   };

   return (
      <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300" onClick={onClose}>
         <div className="w-full max-w-2xl bg-bg-panel border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>

            {/* Header with Tab Toggle */}
            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex flex-col gap-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">help_center</span>
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-white font-display tracking-tight uppercase">Help Center</h2>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest">Architectural Guide & Commands</p>
                     </div>
                  </div>
                  <button onClick={onClose} className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center text-text-muted transition-colors">
                     <span className="material-symbols-outlined">close</span>
                  </button>
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 self-start">
                     <button
                        onClick={() => setTab('COMMANDS')}
                        className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'COMMANDS' ? 'bg-primary text-white shadow-glow' : 'text-text-muted hover:text-white'}`}
                     >
                        Hotkeys
                     </button>
                     <button
                        onClick={() => setTab('RULES')}
                        className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'RULES' ? 'bg-primary text-white shadow-glow' : 'text-text-muted hover:text-white'}`}
                     >
                        How to Play
                     </button>
                  </div>

                  <button
                     onClick={toggleTiles}
                     className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${settings.ui.renderPngTiles ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-text-muted hover:text-white'}`}
                  >
                     <span className="material-symbols-outlined text-sm">{settings.ui.renderPngTiles ? 'image' : 'grid_on'}</span>
                     {settings.ui.renderPngTiles ? 'Tiles: ON' : 'Tiles: OFF'}
                  </button>

                  <button
                     onClick={toggleMute}
                     className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${settings.ui.audioMuted ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}
                  >
                     <span className="material-symbols-outlined text-sm">{settings.ui.audioMuted ? 'volume_off' : 'volume_up'}</span>
                     {settings.ui.audioMuted ? 'Audio Muted' : 'Audio Active'}
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
               {tab === 'COMMANDS' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                     <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Navigation</h3>
                        <ShortcutRow label="Pan Viewport" keys={['W', 'A', 'S', 'D']} />
                        <ShortcutRow label="Pan Viewport" keys={['Arrows']} />
                        <ShortcutRow label="Zoom Scale" keys={['+', '-']} />
                        <ShortcutRow label="Recenter View" keys={['Space']} />
                        <ShortcutRow label="Clear Selection" keys={['Esc']} />
                     </section>

                     <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Authority</h3>
                        <ShortcutRow label="Undo Action" keys={['Ctrl', 'Z']} />
                        <ShortcutRow label="Finish Turn" keys={['Enter']} />
                        <ShortcutRow label="Search Indices" keys={['/']} />
                        <ShortcutRow label="Open Help" keys={['?']} />
                     </section>

                     <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Interfaces</h3>
                        <ShortcutRow label="Toggle Council" keys={['C']} />
                        <ShortcutRow label="Toggle Scribe" keys={['S']} />
                        <ShortcutRow label="Toggle Log" keys={['T']} />
                        <ShortcutRow label="Toggle Sidebars" keys={['[', ']']} />
                     </section>

                     <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Context</h3>
                        <div className="p-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
                           <p className="text-[10px] text-text-muted leading-relaxed italic">
                              Use numerical keys 1-9 to trigger the first 9 available actions in your palette.
                           </p>
                        </div>
                     </section>
                  </div>
               ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <section className="space-y-3">
                        <h3 className="text-sm font-bold text-white uppercase tracking-tight">The Objective</h3>
                        <p className="text-xs text-text-muted leading-relaxed">
                           Dawn of Worlds is a collaborative world-building game. Unlike traditional strategy games, players are not competing to "win" in a military sense, but to create the most interesting and rich shared history. You act as divine architects shaping the land, its people, and their destiny.
                        </p>
                     </section>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                           <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">Age I</span>
                           <p className="text-[11px] font-bold text-white mb-1">Primordial</p>
                           <p className="text-[10px] text-text-muted leading-tight">Focus on physical geography. Mountains, seas, and landmarks.</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                           <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">Age II</span>
                           <p className="text-[11px] font-bold text-white mb-1">Civilization</p>
                           <p className="text-[10px] text-text-muted leading-tight">Create sentient races, found their cities, and define their cultures.</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                           <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">Age III</span>
                           <p className="text-[11px] font-bold text-white mb-1">Politics</p>
                           <p className="text-[10px] text-text-muted leading-tight">Nations rise, borders expand, and wars decide the fate of empires.</p>
                        </div>
                     </div>

                     <section className="space-y-3">
                        <h3 className="text-sm font-bold text-white uppercase tracking-tight">Power & Authority</h3>
                        <ul className="space-y-2">
                           <li className="flex gap-3 items-start">
                              <span className="material-symbols-outlined text-primary text-sm mt-0.5">bolt</span>
                              <p className="text-xs text-text-muted"><span className="text-white font-bold">Action Points (AP):</span> Every turn, you roll for Power. Spend it wisely to modify the world.</p>
                           </li>
                           <li className="flex gap-3 items-start">
                              <span className="material-symbols-outlined text-primary text-sm mt-0.5">history</span>
                              <p className="text-xs text-text-muted"><span className="text-white font-bold">The Chronicle:</span> Every action is recorded. Use the Scribe to add narrative flavor to your mechanical actions.</p>
                           </li>
                           <li className="flex gap-3 items-start">
                              <span className="material-symbols-outlined text-primary text-sm mt-0.5">security</span>
                              <p className="text-xs text-text-muted"><span className="text-white font-bold">Divine Protection:</span> New creations are protected from modification by others for the duration of the current round.</p>
                           </li>
                        </ul>
                     </section>
                  </div>
               )}
            </div>

            <div className="px-8 py-4 bg-black/40 border-t border-white/5 text-center">
               <p className="text-[9px] text-white/20 uppercase font-bold tracking-[0.3em]">Mappa Mundi v0.9 Beta</p>
            </div>
         </div>
      </div>
   );
};

export default ShortcutsOverlay;
