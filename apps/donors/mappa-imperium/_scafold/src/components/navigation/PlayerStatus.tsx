import React, { useState } from 'react';
import type { PlayerStatusProps } from '../../types';
import { websocketService } from '../../services/websocketService';

const PlayerStatus = ({ players, currentPlayer, isDebugMode, onSwitchPlayer, onLogOff }: PlayerStatusProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const onlinePlayers = players.filter(p => p.isOnline).length;

    const handleToggleStatus = (playerNumber: number) => {
        websocketService.emit('player:toggleStatus', { playerNumber });
    };

    const getStatusIcon = () => {
        if (currentPlayer) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            );
        }
        return (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        );
    }

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-700 rounded-md font-semibold transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <div className="relative">
                    {getStatusIcon()}
                     <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 text-white text-xs items-center justify-center">{onlinePlayers}</span>
                    </span>
                </div>
                <span>{currentPlayer?.name || 'Observing'}</span>
            </button>

            {isOpen && (
                <div 
                    className="dropdown-menu text-gray-800 flex flex-col animate-fade-in-down"
                    role="menu"
                >
                    <div className="p-4 border-b">
                        <h3 className="font-bold text-lg">Players ({onlinePlayers}/{players.length} online)</h3>
                    </div>
                    <ul className="py-2 max-h-64 overflow-y-auto" role="none">
                        {players.map(player => (
                            <li key={player.playerNumber} className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-gray-800">
                                <div className="flex items-center gap-3">
                                    <span 
                                        className={`h-3 w-3 rounded-full ${player.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                                        title={player.isOnline ? 'Online' : 'Offline'}
                                    ></span>
                                    <span className="font-semibold">{player.name}</span>
                                    {player.playerNumber === currentPlayer?.playerNumber && (
                                        <span className="text-xs bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full">YOU</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {isDebugMode && player.playerNumber !== currentPlayer?.playerNumber && (
                                        <button
                                            onClick={() => { onSwitchPlayer(player.playerNumber); setIsOpen(false); }}
                                            className="btn btn-secondary text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                                            title={`Switch view to ${player.name}`}
                                        >
                                            View
                                        </button>
                                    )}
                                    {isDebugMode && player.playerNumber !== currentPlayer?.playerNumber && (
                                         <button
                                            onClick={() => handleToggleStatus(player.playerNumber)}
                                            className="btn btn-secondary text-xs"
                                            title="Simulate online status"
                                        >
                                            Toggle
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                     <div className="p-2 border-t mt-auto">
                        <button
                            onClick={onLogOff}
                            className="dropdown-item flex items-center gap-2"
                            role="menuitem"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Log Off & Return to Setup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerStatus;