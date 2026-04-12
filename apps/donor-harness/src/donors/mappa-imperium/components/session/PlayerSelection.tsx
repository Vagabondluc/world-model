
import React, { useState, useMemo } from 'react';
import { useGameStore } from '../../stores/gameStore';
import type { Player } from '@mi/types';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';

const PlayerSelection = () => {
    const { players, selectPlayer, joinAsObserver } = useGameStore();
    
    const [selectedPlayerNumber, setSelectedPlayerNumber] = useState<number | null>(null);
    const [inputPlayerName, setInputPlayerName] = useState('');
    const [inputPassword, setInputPassword] = useState('');

    const selectedPlayer = useMemo(() => 
        players.find(p => p.playerNumber === selectedPlayerNumber),
        [players, selectedPlayerNumber]
    );
    
    // A slot is "claimed" if it has a password set. This indicates a player has joined before.
    const isClaimed = !!selectedPlayer?.password;

    const handlePlayerClick = (player: Player) => {
        if (player.isOnline) return; // Can't select online players
        setSelectedPlayerNumber(player.playerNumber);
        // Reset inputs on new selection
        setInputPlayerName('');
        setInputPassword('');
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlayer) return;

        const nameToSend = isClaimed ? selectedPlayer.name : inputPlayerName.trim();
        const passwordToSend = inputPassword.trim();
        
        if (nameToSend && passwordToSend) {
            selectPlayer(selectedPlayer.playerNumber, nameToSend, passwordToSend);
        }
    };

    const renderSelectionForm = () => {
        if (!selectedPlayer) {
            return (
                <div className="text-center text-gray-500 py-12">
                    <p>Select an available player slot to begin.</p>
                </div>
            );
        }

        if (isClaimed) {
            // Form for rejoining a claimed slot
            return (
                <div className="p-6 bg-gray-50 rounded-lg border animate-fade-in-slide-up">
                    <h3 className="text-2xl font-bold text-center text-amber-800 mb-4">
                        Rejoin as <span className="text-amber-600">{selectedPlayer.name}</span>
                    </h3>
                    <div className="mb-6">
                        <label htmlFor="password" className={componentStyles.form.label}>
                            Enter Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                            placeholder="Enter your password to rejoin"
                            required
                            autoFocus
                            className={componentStyles.input.base}
                        />
                    </div>
                </div>
            );
        } else {
            // Form for joining an unclaimed slot
            return (
                <div className="p-6 bg-gray-50 rounded-lg border animate-fade-in-slide-up">
                    <h3 className="text-2xl font-bold text-center text-amber-800 mb-4">
                        Join as Player {selectedPlayer.playerNumber}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="playerName" className={componentStyles.form.label}>
                                Enter Your Name
                            </label>
                            <input
                                type="text"
                                id="playerName"
                                value={inputPlayerName}
                                onChange={(e) => setInputPlayerName(e.target.value)}
                                placeholder={`Name for Player ${selectedPlayer.playerNumber}`}
                                required
                                autoFocus
                                className={componentStyles.input.base}
                            />
                        </div>
                         <div>
                            <label htmlFor="new-password" className={componentStyles.form.label}>
                                Set a Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                value={inputPassword}
                                onChange={(e) => setInputPassword(e.target.value)}
                                placeholder="Claim your slot"
                                required
                                className={componentStyles.input.base}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    };
    
    const isSubmitDisabled = !selectedPlayer || 
        (isClaimed && !inputPassword.trim()) || 
        (!isClaimed && (!inputPlayerName.trim() || !inputPassword.trim()));

    return (
        <div className={componentStyles.layout.centeredCard}>
            <div className={cn(componentStyles.card.page, "max-w-2xl")}>
                <h1 className="text-4xl font-bold text-amber-800 mb-2 text-center">Choose Your Role</h1>
                <p className="text-center text-gray-600 mb-8">Select a player slot to join or rejoin the game, or join as an observer.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Select a Player Slot</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {players.map(player => {
                                const hasJoinedBefore = !!player.password;
                                return (
                                <button
                                    key={player.playerNumber}
                                    type="button"
                                    onClick={() => handlePlayerClick(player)}
                                    disabled={player.isOnline}
                                    className={`p-4 rounded-md font-bold text-center transition-all duration-200 border-2 flex flex-col items-center justify-center ${
                                        selectedPlayerNumber === player.playerNumber
                                            ? 'bg-amber-600 text-white border-amber-800 ring-4 ring-amber-300'
                                            : player.isOnline
                                            ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-amber-100 hover:border-amber-400'
                                    }`}
                                >
                                    <span>{hasJoinedBefore ? player.name : `Player ${player.playerNumber}`}</span>
                                    {player.isOnline ? 
                                        <span className="block text-xs font-normal">(Online)</span> :
                                        hasJoinedBefore ? 
                                        <span className="block text-xs font-normal text-green-700">(Claimed)</span> :
                                        <span className="block text-xs font-normal text-gray-500">(Open)</span>
                                    }
                                </button>
                            )})}
                        </div>
                    </div>

                    {renderSelectionForm()}
                    
                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className={cn(componentStyles.button.base, componentStyles.button.primary, "w-full mt-8")}
                    >
                        {isClaimed ? 'Rejoin Chronicle' : 'Join Chronicle'}
                    </button>
                </form>

                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                    onClick={joinAsObserver}
                    className={cn(componentStyles.button.base, componentStyles.button.primary, "w-full bg-gray-600 hover:bg-gray-700")}
                >
                    Join as Observer
                </button>
            </div>
        </div>
    );
};

export default PlayerSelection;
