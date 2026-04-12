import React from 'react';
import { useGameStore } from '../store/gameStore';
import { exportGameState } from '../logic/export';
import { ToggleButton } from './design-system/ToggleButton';
import { ModalHeader } from './design-system/ModalHeader';

interface PlayerDashboardProps {
  onClose: () => void;
  onExitGame: () => void;
}

const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ onClose, onExitGame }) => {
  const state = useGameStore(state => state);
  const settings = state.settings;
  const setSettings = (newSettings: any) => {
    // In a real app we'd have a store action for this
    useGameStore.setState({ settings: { ...settings, ...newSettings } });
  };

  const getPlayerStats = (pid: string) => {
    const createdCount = state.events.filter(e => e.type === 'WORLD_CREATE' && e.playerId === pid && !state.revokedEventIds.has(e.id)).length;
    const totalSpent = state.events
      .filter(e => e.playerId === pid && !state.revokedEventIds.has(e.id))
      .reduce((acc, e) => acc + (('cost' in e) ? (e as any).cost : 0), 0);
    return { createdCount, totalSpent };
  };

  const handleExport = () => {
    exportGameState(state, { includeMetadata: false });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-200">
      <div className="w-full max-w-6xl h-full max-h-[800px] bg-[#0a0a0c] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <ModalHeader
          title="The Council"
          subtitle={state.config?.worldName || 'Unknown World'}
          icon="public"
          onClose={onClose}
        />

        {/* 2x2 Grid Layout */}
        <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">

          {/* Quadrant A: World Vitals */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col gap-6 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-8xl">timelapse</span>
            </div>
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest">World Vitals</h3>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-text-muted mb-1">Current Era</p>
                <p className="text-5xl font-black text-white font-display">AGE {state.age === 1 ? 'I' : state.age === 2 ? 'II' : 'III'}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Global Round</p>
                <p className="text-5xl font-black text-white font-display">{state.round}</p>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-white">Age Duration Compliance</span>
                <span className="text-xs font-mono text-primary">{Math.min(100, Math.floor((state.round / 5) * 100))}%</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.min(100, (state.round / 5) * 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Quadrant B: The Ledger */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col gap-4 row-span-2 relative overflow-hidden">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">leaderboard</span>
              Architect Ledger
            </h3>

            <div className="flex-1 overflow-y-auto -mx-2 px-2 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase text-text-muted font-bold tracking-widest">
                    <th className="py-3 font-medium">Architect</th>
                    <th className="py-3 font-medium text-right">Influence</th>
                    <th className="py-3 font-medium text-right">AP Spent</th>
                    <th className="py-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {state.players.map(pid => {
                    const stats = getPlayerStats(pid);
                    const isActive = state.activePlayerId === pid;
                    const pConfig = state.config?.players.find(p => p.id === pid);

                    return (
                      <tr key={pid} className={`group ${isActive ? 'bg-white/[0.02]' : ''}`}>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-3 rounded-full" style={{ backgroundColor: pConfig?.color || '#fff' }}></div>
                            <div>
                              <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-white/60'}`}>{pConfig?.name || pid}</p>
                              <p className="text-[10px] text-text-muted">{pConfig?.isHuman ? 'Human' : 'AI'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-right font-mono text-white">{stats.createdCount * 5 + stats.totalSpent}</td>
                        <td className="py-4 text-right font-mono text-white/60">{stats.totalSpent}</td>
                        <td className="py-4 text-right">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-bold uppercase border border-green-500/20">
                              <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                              Active
                            </span>
                          ) : (
                            <span className="text-[10px] text-white/20 font-bold uppercase">Waiting</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quadrant C: Divine Laws (Settings) */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col gap-4 overflow-hidden group">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center justify-between">
              Divine Laws
              <span className="text-[8px] opacity-40">Session Rules</span>
            </h3>
            <div className="space-y-2">
              <ToggleButton
                label="Adaptive Action Palette"
                isActive={settings.ui.contextFilterActions}
                onClick={() => setSettings({ ui: { ...settings.ui, contextFilterActions: !settings.ui.contextFilterActions } })}
              />
              <ToggleButton
                label="Round-Scoped Protection"
                isActive={settings.social.protectedUntilEndOfRound}
                onClick={() => setSettings({ social: { ...settings.social, protectedUntilEndOfRound: !settings.social.protectedUntilEndOfRound } })}
              />
              <ToggleButton
                label="Render PNG Tiles (Beta)"
                isActive={settings.ui.renderPngTiles}
                onClick={() => setSettings({ ui: { ...settings.ui, renderPngTiles: !settings.ui.renderPngTiles } })}
              />
              <ToggleButton
                label="Globe Generation"
                sublabel="Experimental"
                isActive={settings.genesis.enableGlobeMode}
                onClick={() => setSettings({ genesis: { ...settings.genesis, enableGlobeMode: !settings.genesis.enableGlobeMode } })}
              />
            </div>
          </div>

          {/* Quadrant D: Session Actions */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Session Control</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleExport} className="py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all">
                <span className="material-symbols-outlined text-lg">download</span>
                Export
              </button>
              <button onClick={onExitGame} className="py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 transition-all">
                <span className="material-symbols-outlined text-lg">logout</span>
                Abandon
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
