import React from 'react';
import { cn } from '../../utils/cn';
import { useGameStore } from '../../stores/gameStore';

interface ChannelSelectorProps {
    currentChannel: string;
    onChannelChange: (channelId: string) => void;
}

const ChannelSelector: React.FC<ChannelSelectorProps> = ({ currentChannel, onChannelChange }) => {
    const { players, currentPlayer } = useGameStore();

    // Mock channels: Global + Private with each other player
    const channels = [
        { id: 'global', label: 'Global' },
        // Simple logic for verifying mocked private channels
        ...players
            .filter(p => p.playerNumber !== currentPlayer?.playerNumber)
            .map(p => ({ id: `p${p.playerNumber}`, label: `Whisper ${p.name}` }))
    ];

    return (
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide border-b border-stone-100 mb-2">
            {channels.map(channel => (
                <button
                    key={channel.id}
                    onClick={() => onChannelChange(channel.id)}
                    className={cn(
                        "whitespace-nowrap px-3 py-1 rounded-full text-xs border transition-colors",
                        currentChannel === channel.id
                            ? "bg-amber-100 text-amber-900 border-amber-200"
                            : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
                    )}
                >
                    {channel.label}
                </button>
            ))}
        </div>
    );
};

export default ChannelSelector;
