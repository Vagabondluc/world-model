
import React, { useState } from 'react';
import { GameSessionConfig, PlayerConfig } from '../../types';
import { triggerHaptic } from '../../logic/haptics';
import { playGong } from '../../logic/audio';
import { PlayerList } from './PlayerList';
import { PlayerConfigForm } from './PlayerConfigForm';

interface ActiveLobbyProps {
  config: GameSessionConfig;
  myPlayerId: string | null;
  onAddMyself: () => void;
  onUpdatePlayer: (changes: Partial<PlayerConfig>) => void;
  onToggleReady: () => void;
  onStartGame: () => void;
  onExit: () => void;
}

export const ActiveLobby: React.FC<ActiveLobbyProps> = ({
  config,
  myPlayerId,
  onAddMyself,
  onUpdatePlayer,
  onToggleReady,
  onStartGame,
  onExit
}) => {
  const [copied, setCopied] = useState(false);
  const me = config.players.find(p => p.id === myPlayerId);
  const allReady = config.players.every(p => p.isReady);

  const handleCopyInvite = () => {
    const url = `${window.location.origin}/?join=${config.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    triggerHaptic('confirm');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleForge = () => {
    playGong();
    setTimeout(onStartGame, 500);
  };

  return (
    <div className="h-screen bg-[#0a0a0c] text-white flex flex-col items-center p-8 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>

      <header className="w-full max-w-4xl flex items-center justify-between mb-12 z-10">
        <div>
          <h2 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Session Protocol</h2>
          <h1 className="text-4xl font-black font-display tracking-tight">{config.worldName}</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Access Code</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-mono font-bold tracking-widest text-white">{config.id}</span>
            <button 
              onClick={handleCopyInvite}
              className={`p-2 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all ${
                copied ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/10 border-white/10 hover:bg-white/20'
              }`}
            >
              {copied ? 'Copied' : 'Invite'}
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 z-10">
        
        {/* Left Col: Roster */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/50">Architects ({config.players.length}/6)</h3>
            {!myPlayerId && (
              <button onClick={onAddMyself} className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-bold hover:bg-primary-hover">
                + Claim Seat
              </button>
            )}
          </div>
          <PlayerList players={config.players} myPlayerId={myPlayerId} />
        </div>

        {/* Right Col: My Config */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col">
          {me ? (
            <PlayerConfigForm 
              player={me} 
              onUpdate={onUpdatePlayer} 
              onToggleReady={onToggleReady} 
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
               <span className="material-symbols-outlined text-6xl mb-4">chair</span>
               <p className="text-sm font-bold uppercase">Spectator Mode</p>
               <p className="text-xs">Claim a seat to participate.</p>
            </div>
          )}
        </div>

      </main>

      {/* Footer Actions */}
      <footer className="w-full max-w-4xl mt-8 pt-8 border-t border-white/10 flex justify-between items-center z-10">
        <button onClick={onExit} className="text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest">
          Leave Lobby
        </button>
        {myPlayerId === 'P1' && (
          <button 
            onClick={handleForge}
            disabled={!allReady || config.players.length < 1}
            className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Forge World
          </button>
        )}
        {myPlayerId !== 'P1' && (
          <p className="text-xs text-text-muted animate-pulse">Waiting for Host to Forge...</p>
        )}
      </footer>
    </div>
  );
};
