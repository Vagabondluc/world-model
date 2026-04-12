
import React, { useEffect, useState } from 'react';
import Galaxy from './Galaxy';

interface StartScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
  onJoinLobby: () => void;
  onQuickStart: () => void;
  hasSave: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onNewGame, onContinue, onJoinLobby, onQuickStart, hasSave }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center bg-[#050505] overflow-hidden text-white perspective-[2000px]">

      {/* Galaxy Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Galaxy
          starSpeed={0.3}
          density={1.5}
          hueShift={280}
          rotationSpeed={0.05}
          transparent={false}
        />
      </div>

      {/* Main Content */}
      <div className={`z-10 flex flex-col items-center gap-12 max-w-xl w-full p-12 transition-all duration-1000 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

        {/* Hero Typography */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-display bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-primary/50 relative z-10">
              DAWN
            </h1>
            <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full z-0 pointer-events-none"></div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-display bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-primary/50 -mt-4">
            OF WORLDS
          </h1>
          <div className="flex items-center gap-4 mt-6 opacity-60">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white"></div>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary-light">Collaborative Engine v0.6</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white"></div>
          </div>
        </div>

        {/* Action Menu */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={onQuickStart}
            className="group relative w-full py-4 bg-white text-black border border-white hover:bg-white/90 font-black uppercase tracking-widest text-sm rounded-lg transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] mb-2"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">bolt</span>
              Quick Play (Solo)
            </span>
          </button>

          <button
            onClick={onNewGame}
            className="group relative w-full py-5 bg-transparent border border-white/20 hover:border-primary/50 text-white font-bold uppercase tracking-widest text-sm rounded-lg transition-all duration-300 overflow-hidden hover:shadow-[0_0_40px_rgba(127,19,236,0.2)]"
          >
            <div className="absolute inset-0 bg-primary/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-primary-light">
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Forge New World
            </span>
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onJoinLobby}
              className="py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-white font-bold uppercase tracking-widest text-xs rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">groups</span>
              Multiplayer
            </button>
            <button
              onClick={onContinue}
              disabled={!hasSave}
              className={`py-4 bg-transparent border border-white/10 font-bold uppercase tracking-widest text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${hasSave
                ? 'text-white hover:bg-white/5 hover:border-green-500/30 hover:text-green-400 cursor-pointer'
                : 'text-white/30 opacity-50 cursor-not-allowed'
                }`}
            >
              <span className="material-symbols-outlined text-sm">history</span>
              Resume
            </button>
          </div>
        </div>

        {/* Status Footer */}
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
          <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider">Local Storage Ready</p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
