import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

// Mock room data
const MOCK_ROOMS = [
    { id: 'RM001', name: "Dave's Game", players: 2, maxPlayers: 4, mapSize: 'Standard', status: 'waiting' },
    { id: 'RM002', name: "Epic Campaign", players: 5, maxPlayers: 6, mapSize: 'Large', status: 'waiting' },
    { id: 'RM003', name: "Quick Match", players: 1, maxPlayers: 2, mapSize: 'Small', status: 'waiting' },
];

const JoinGameScreen = () => {
    const { joinRoom, backToSetup } = useGameStore();
    const [roomCode, setRoomCode] = useState('');

    const handleJoin = (id: string) => {
        joinRoom(id);
    };

    return (
        <div className={componentStyles.layout.centeredCard}>
            <div className={cn(componentStyles.card.page, "max-w-2xl")}>
                <div className="flex items-center justify-between mb-8">
                    <Button onClick={backToSetup} variant="secondary">Back</Button>
                    <h1 className="text-3xl font-bold text-amber-800">Join Game</h1>
                    <div className="w-16" /> {/* Spacer */}
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Panel: Public Rooms */}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Public Rooms</h3>
                        <div className="space-y-3 h-80 overflow-y-auto pr-2">
                            {MOCK_ROOMS.map(room => (
                                <div key={room.id} className="border p-3 rounded-lg hover:bg-stone-50 transition-colors flex justify-between items-center group">
                                    <div>
                                        <p className="font-bold text-amber-900">{room.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {room.players}/{room.maxPlayers} Players • {room.mapSize}
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => handleJoin(room.id)}
                                    >
                                        Join
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-2">
                            <Button variant="ghost" size="sm" className="text-gray-500">Refresh List</Button>
                        </div>
                    </div>

                    {/* Right Panel: Code Input */}
                    <div className="md:w-64 border-l pl-8 border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Join by Code</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Room Code</label>
                                <input
                                    type="text"
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                    placeholder="ABC1234"
                                    className={cn(componentStyles.input.base, "uppercase tracking-widest text-center")}
                                    maxLength={8}
                                />
                            </div>
                            <Button
                                onClick={() => handleJoin(roomCode)}
                                disabled={!roomCode}
                                className="w-full"
                            >
                                Join
                            </Button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent</h4>
                            <ul className="text-xs text-gray-500 space-y-2">
                                <li className="cursor-pointer hover:text-amber-700">• RM001 (Yesterday)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinGameScreen;
