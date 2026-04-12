import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

const HostGameScreen = () => {
    const { createRoom, backToSetup } = useGameStore();

    const [roomName, setRoomName] = useState('My Game Room');
    const [players, setPlayers] = useState(4);
    const [mapSize, setMapSize] = useState<'Small' | 'Standard' | 'Large'>('Standard');
    const [privacy, setPrivacy] = useState<'public' | 'private'>('public');

    const handleCreate = () => {
        createRoom(roomName, {
            players,
            mapSize,
            privacy,
            // defaults
            length: 'Standard',
            turnDuration: 10
        });
    };

    return (
        <div className={componentStyles.layout.centeredCard}>
            <div className={cn(componentStyles.card.page, "max-w-2xl")}>
                <div className="flex items-center justify-between mb-8">
                    <Button onClick={backToSetup} variant="secondary">Back</Button>
                    <h1 className="text-3xl font-bold text-amber-800">Host New Game</h1>
                    <div className="w-16" /> {/* Spacer */}
                </div>

                <div className="space-y-6">
                    <div>
                        <label className={componentStyles.form.label}>Room Name</label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className={componentStyles.input.base}
                        />
                    </div>

                    <div>
                        <label className={componentStyles.form.label}>Player Count: <span className="text-amber-700">{players}</span></label>
                        <input
                            type="range"
                            min="2"
                            max="6"
                            value={players}
                            onChange={(e) => setPlayers(parseInt(e.target.value))}
                            className={componentStyles.input.range}
                        />
                        <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
                            <span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                        </div>
                    </div>

                    <div>
                        <label className={componentStyles.form.label}>Map Size</label>
                        <div className="flex gap-4">
                            {(['Small', 'Standard', 'Large'] as const).map(size => (
                                <button
                                    key={size}
                                    onClick={() => setMapSize(size)}
                                    className={cn(
                                        componentStyles.button.toggle,
                                        mapSize === size ? componentStyles.button.toggleActive : ''
                                    )}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className={componentStyles.form.label}>Privacy</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setPrivacy('public')}
                                className={cn(componentStyles.button.toggle, privacy === 'public' ? componentStyles.button.toggleActive : '')}
                            >
                                Public
                            </button>
                            <button
                                onClick={() => setPrivacy('private')}
                                className={cn(componentStyles.button.toggle, privacy === 'private' ? componentStyles.button.toggleActive : '')}
                            >
                                Private
                            </button>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <Button
                            onClick={handleCreate}
                            variant="primary"
                            className="w-full py-4 text-lg"
                        >
                            Create Room
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostGameScreen;
