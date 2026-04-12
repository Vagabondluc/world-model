import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { User, Copy, MessageSquare, Send } from 'lucide-react';

const LobbyWaitingRoom = () => {
    const { lobbyState, leaveRoom, startGame } = useGameStore(); // StartGame might need real mapping
    const { roomId, isHost, players, chat } = lobbyState;
    const [message, setMessage] = useState('');

    // Mock ready status
    const [ready, setReady] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(roomId || '');
        // Could add toast here
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        // In real impl, would send via ws
        setMessage('');
    };

    return (
        <div className="min-h-screen bg-stone-100 p-8 flex items-center justify-center">
            <div className={cn(componentStyles.card.page, "max-w-5xl w-full h-[80vh] flex flex-col p-0 overflow-hidden")}>
                {/* Header */}
                <div className="bg-amber-800 text-amber-50 p-4 flex justify-between items-center shadow-md z-10">
                    <div className="flex items-center gap-4">
                        <Button onClick={leaveRoom} variant="ghost" className="text-amber-100 hover:text-white hover:bg-amber-700">
                            &larr; Leave
                        </Button>
                        <h1 className="text-xl font-bold">Lobby: {roomId}</h1>
                        <button onClick={handleCopy} className="p-2 hover:bg-amber-700 rounded-full" title="Copy Room ID">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-sm font-medium">
                        Waiting for players... ({players.length}/6)
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Player List */}
                    <div className="w-1/3 bg-stone-50 border-r border-stone-200 p-6 flex flex-col">
                        <h2 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" /> Players
                        </h2>
                        <div className="space-y-2 flex-1 overflow-y-auto">
                            {players.map(player => (
                                <div key={player.playerNumber} className="bg-white p-3 rounded shadow-sm border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-600">
                                            {player.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800">{player.name}</div>
                                            {player.isAi && <div className="text-xs text-blue-600 font-medium">AI Agent</div>}
                                        </div>
                                    </div>
                                    {/* Mock ready status indicator */}
                                    <div className={cn("w-3 h-3 rounded-full", player.playerNumber === 1 ? "bg-green-500" : "bg-gray-300")} title="Ready Status"></div>
                                </div>
                            ))}
                            {/* Empty slots representation */}
                            {Array.from({ length: Math.max(0, 6 - players.length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="border-2 border-dashed border-stone-200 p-3 rounded flex items-center justify-center text-stone-400 text-sm">
                                    Empty Slot
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-stone-200">
                            <Button
                                className={cn("w-full transition-colors", ready ? "bg-green-600 hover:bg-green-700" : "bg-stone-500 hover:bg-stone-600")}
                                onClick={() => setReady(!ready)}
                            >
                                {ready ? 'Ready!' : 'Mark as Ready'}
                            </Button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 bg-white flex flex-col">
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            {chat.map((msg, i) => (
                                <div key={i} className={cn("flex flex-col", msg.senderId === 'System' ? "items-center" : "items-start")}>
                                    {msg.senderId === 'System' ? (
                                        <span className="bg-stone-100 text-stone-500 text-xs px-2 py-1 rounded-full">{msg.content}</span>
                                    ) : (
                                        <div className="max-w-[80%]">
                                            <span className="text-xs text-gray-400 ml-1">{msg.senderName}</span>
                                            <div className="bg-amber-50 border border-amber-100 text-gray-800 p-2 rounded-lg rounded-tl-none">
                                                {msg.content}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className={cn(componentStyles.input.base, "flex-grow")}
                                />
                                <Button type="submit" variant="primary" className="px-3">
                                    <Send className="w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer/Start Game */}
                {isHost && (
                    <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end items-center gap-4">
                        <div className="text-sm text-gray-500">
                            Map: <span className="font-semibold text-gray-700">Standard</span> • Privacy: <span className="font-semibold text-gray-700">Public</span>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            className="px-8 shadow-lg"
                        // onClick={() => startGame(...)} // Needs logic
                        >
                            Start Game
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LobbyWaitingRoom;
