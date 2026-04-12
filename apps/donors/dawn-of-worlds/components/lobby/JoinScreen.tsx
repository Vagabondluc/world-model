
import React from 'react';

interface JoinScreenProps {
  sessionCode: string;
  setSessionCode: (code: string) => void;
  onJoin: () => void;
  onCreate: () => void;
  onExit: () => void;
}

export const JoinScreen: React.FC<JoinScreenProps> = ({
  sessionCode,
  setSessionCode,
  onJoin,
  onCreate,
  onExit
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-white p-8">
      <h1 className="text-4xl font-black font-display mb-8">THE ASSEMBLY</h1>
      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Session Code</label>
          <input 
            type="text" 
            value={sessionCode}
            onChange={e => setSessionCode(e.target.value.toUpperCase())}
            placeholder="ENTER CODE"
            className="w-full bg-[#1a1122] border border-white/20 p-4 text-center text-2xl font-mono tracking-widest rounded-xl focus:border-primary focus:outline-none"
          />
        </div>
        <button 
          onClick={onJoin}
          disabled={sessionCode.length < 3}
          className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 disabled:opacity-50"
        >
          Join Session
        </button>
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#050505] px-2 text-text-muted">Or</span></div>
        </div>
        <button 
          onClick={onCreate}
          className="w-full py-4 border border-white/20 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white/5"
        >
          Host New World
        </button>
        <button onClick={onExit} className="w-full text-xs text-text-muted hover:text-white mt-4">Return to Void</button>
      </div>
    </div>
  );
};
