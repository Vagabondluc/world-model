import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { MessageSquare, Minimize2, Settings, Maximize2 } from 'lucide-react';
import MessageFilters from './MessageFilters';
import ChannelSelector from './ChannelSelector';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SharedMarkers from './SharedMarkers';
import SharedNotes from './SharedNotes';
import SharedCursors from './SharedCursors';

const ChatPanel = () => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'markers' | 'notes'>('chat');
    const [filter, setFilter] = useState<'all' | 'system' | 'player' | 'action'>('all');
    const [channel, setChannel] = useState('global');

    const { lobbyState, sendChatMessage } = useGameStore();
    const { chat } = lobbyState;

    // Derived state
    const unreadCount = 0; // TODO: Implement read status tracking

    const filteredMessages = chat.filter(msg => {
        if (filter === 'all') return true;
        return msg.type === filter;
    });

    const handleSendMessage = (content: string) => {
        // In real impl, we'd check channel to determine message type or recipient
        sendChatMessage(content, 'player');
    };

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-[60]">
                <Button
                    onClick={() => setIsMinimized(false)}
                    variant="primary"
                    className="shadow-lg rounded-full w-12 h-12 flex items-center justify-center relative"
                >
                    <MessageSquare className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-stone-200 overflow-hidden flex flex-col transition-all duration-300 h-[600px] max-h-[80vh]">
            {/* Header */}
            <div className="bg-amber-800 text-amber-50 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                    <MessageSquare className="w-4 h-4" />
                    Chat & Collaboration
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-100 hover:text-white p-1 h-auto"
                        onClick={() => { }}
                    >
                        <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-100 hover:text-white p-1 h-auto"
                        onClick={() => setIsMinimized(true)}
                    >
                        <Minimize2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-stone-50">
                {/* Tab Navigation */}
                <div className="flex border-b border-stone-200 bg-white">
                    {(['chat', 'markers', 'notes'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2",
                                activeTab === tab
                                    ? "border-amber-600 text-amber-800 bg-amber-50"
                                    : "border-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-700"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'chat' && (
                    <>
                        <div className="px-3 pt-3">
                            <MessageFilters currentFilter={filter} onFilterChange={setFilter} />
                            <ChannelSelector currentChannel={channel} onChannelChange={setChannel} />
                        </div>
                        <MessageList messages={filteredMessages} />
                        <MessageInput onSend={handleSendMessage} />
                    </>
                )}

                {activeTab === 'markers' && <SharedMarkers />}
                {activeTab === 'notes' && <SharedNotes />}
            </div>

            <SharedCursors />
        </div>
    );
};

export default ChatPanel;
