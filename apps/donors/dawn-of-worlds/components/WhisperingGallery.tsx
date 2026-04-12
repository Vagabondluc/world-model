
import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useChatStore } from '../store/chatStore';
import { useSyncChannel } from '../hooks/useSyncChannel';
import { ChatMessage, PlayerId } from '../types';
import { triggerHaptic } from '../logic/haptics';
import { ui } from '../logic/ui.tokens';

const WhisperingGallery: React.FC = () => {
  const config = useGameStore(state => state.config);
  const activePlayerId = useGameStore(state => state.activePlayerId);
  const { messages, isOpen, unreadCount, activeWhisperTarget, toggleChat, addMessage, setWhisperTarget } = useChatStore();
  const { broadcastChat } = useSyncChannel();
  
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !config) return;

    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      senderId: activePlayerId,
      targetId: activeWhisperTarget,
      content: inputText.trim(),
      type: 'CHAT'
    };

    addMessage(newMsg);
    broadcastChat(newMsg);
    setInputText('');
    triggerHaptic('tap');
  };

  const getPlayer = (pid: PlayerId) => config?.players.find(p => p.id === pid);

  if (!isOpen) {
    return (
      <button 
        onClick={() => toggleChat(true)}
        className="fixed bottom-14 left-6 z-[60] size-14 bg-bg-panel border border-white/10 rounded-2xl flex items-center justify-center text-text-muted hover:text-white transition-all shadow-2xl group"
      >
        <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">chat_bubble</span>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 size-6 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-bg-dark animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-14 left-6 z-[60] w-80 h-[450px] bg-bg-panel/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
        <div className="flex items-center gap-3">
           <span className="material-symbols-outlined text-primary text-xl">forum</span>
           <div>
             <h3 className="text-xs font-black text-white uppercase tracking-widest">Whispering Gallery</h3>
             <p className="text-[9px] text-text-muted uppercase">Diplomatic Scroll</p>
           </div>
        </div>
        <button onClick={() => toggleChat(false)} className="size-8 rounded-full hover:bg-white/5 flex items-center justify-center text-text-muted">
           <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </header>

      {/* Tabs */}
      <div className="h-10 flex border-b border-white/5 bg-black/20">
         <button 
           onClick={() => setWhisperTarget(undefined)}
           className={`flex-1 text-[9px] font-black uppercase tracking-widest transition-all ${!activeWhisperTarget ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:text-white'}`}
         >
           Table
         </button>
         {config?.players.filter(p => p.id !== activePlayerId).map(p => (
            <button 
              key={p.id}
              onClick={() => setWhisperTarget(p.id)}
              className={`flex-1 text-[9px] font-black uppercase tracking-widest transition-all ${activeWhisperTarget === p.id ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-400/5' : 'text-text-muted hover:text-white'}`}
            >
              {p.name.split(' ')[0]}
            </button>
         ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/10">
        {messages.filter(m => !m.targetId || m.targetId === activePlayerId || m.senderId === activePlayerId).map((msg) => {
          const sender = getPlayer(msg.senderId);
          const isMe = msg.senderId === activePlayerId;
          const isWhisper = !!msg.targetId;
          
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
              <div className="flex items-center gap-1.5 mb-1 px-1">
                {!isMe && <div className="size-1.5 rounded-full" style={{ backgroundColor: sender?.color }}></div>}
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-tight">
                   {isMe ? 'You' : sender?.name} {isWhisper && <span className="text-purple-400 italic">(Whispering)</span>}
                </span>
              </div>
              <div className={`max-w-[90%] px-3 py-2 rounded-2xl text-xs leading-relaxed shadow-sm ${
                isMe 
                ? 'bg-primary/20 text-white rounded-tr-none border border-primary/20' 
                : isWhisper 
                  ? 'bg-purple-900/30 text-purple-100 border border-purple-500/20 rounded-tl-none'
                  : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-8">
             <span className="material-symbols-outlined text-4xl mb-2">history_edu</span>
             <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">The history of this era remains unwritten...</p>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-bg-panel border-t border-white/5 flex items-center gap-2">
         <input 
           type="text" 
           value={inputText}
           onChange={e => setInputText(e.target.value)}
           placeholder={activeWhisperTarget ? `Whispering to ${getPlayer(activeWhisperTarget)?.name}...` : "Scribe a message to the table..."}
           className="flex-1 bg-bg-input border-none rounded-xl px-4 py-2 text-xs text-white placeholder:text-text-muted/40 focus:ring-1 focus:ring-primary/50"
         />
         <button 
           type="submit"
           className="size-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-glow active:scale-90 transition-all disabled:opacity-50 disabled:grayscale"
           disabled={!inputText.trim()}
         >
           <span className="material-symbols-outlined text-lg">send</span>
         </button>
      </form>
    </div>
  );
};

export default WhisperingGallery;
