import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { cn } from '../../utils/cn';
import { componentStyles } from '../../design/tokens';
import type { GameDurationPreview } from '../../types/progress.types';
import { calculateGameDurationPreview } from '../../utils/progressUtils';
import { GameConfigurationForm } from './GameConfigurationForm';
const GameSetup = () => {
    const { startGame, debugSetup, importFromFile, importFromFeed, browseLobby, enterHostSetup, enterJoinSetup } = useGameStore();

    const [players, setPlayers] = useState(2);
    const [length, setLength] = useState<'Short' | 'Standard' | 'Long' | 'Epic'>('Standard');
    const [turnDuration, setTurnDuration] = useState(10);
    const [feedUrl, setFeedUrl] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // AI Player State
    const [useAi, setUseAi] = useState(false);
    const [aiPlayers, setAiPlayers] = useState(1);

    // Synchronize player counts
    useEffect(() => {
        if (!useAi) return;
        const maxHuman = 8 - aiPlayers;
        if (players > maxHuman) {
            setPlayers(maxHuman);
        }
    }, [aiPlayers, useAi]);

    useEffect(() => {
        const maxAi = 8 - players;
        if (aiPlayers > maxAi) {
            setAiPlayers(maxAi);
        }
    }, [players]);

    const { totalYears, eraBreakdown }: GameDurationPreview = useMemo(() => {
        return calculateGameDurationPreview(length, turnDuration);
    }, [length, turnDuration]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startGame({ players, length, turnDuration, aiPlayers: useAi ? aiPlayers : 0 });
    };

    const handleFeedSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedUrl.trim()) {
            importFromFeed(feedUrl.trim());
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            importFromFile(e.target.files[0]);
        }
    };

    return (
        <div className={componentStyles.layout.centeredCard}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
            />
            <div className={cn(componentStyles.card.page, 'max-w-2xl')}>
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-amber-800 flex items-center justify-center gap-4">
                        <span className="text-6xl">🌍</span>
                        Mappa Imperium
                    </h1>
                </div>

                <GameConfigurationForm
                    players={players}
                    setPlayers={setPlayers}
                    useAi={useAi}
                    setUseAi={setUseAi}
                    aiPlayers={aiPlayers}
                    setAiPlayers={setAiPlayers}
                    length={length}
                    setLength={setLength}
                    turnDuration={turnDuration}
                    setTurnDuration={setTurnDuration}
                    onSubmit={handleSubmit}
                    totalYears={totalYears}
                    eraBreakdown={eraBreakdown}
                />

                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={enterHostSetup}
                            className={cn(componentStyles.button.base, componentStyles.button.primary, 'w-full bg-amber-700 hover:bg-amber-600 text-white flex items-center justify-center gap-2')}
                        >
                            Host Game
                        </button>
                        <button
                            onClick={enterJoinSetup}
                            className={cn(componentStyles.button.base, componentStyles.button.primary, 'w-full bg-amber-700 hover:bg-amber-600 text-white flex items-center justify-center gap-2')}
                        >
                            Join Game
                        </button>
                        <button
                            onClick={browseLobby}
                            className={cn(componentStyles.button.base, componentStyles.button.secondary, 'w-full bg-sky-800 hover:bg-sky-700 text-white flex items-center justify-center gap-2')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Browse Archives
                        </button>
                        <button
                            onClick={handleImportClick}
                            className={cn(componentStyles.button.base, componentStyles.button.secondary, 'w-full bg-gray-600 text-white hover:bg-gray-700 flex items-center justify-center gap-2')}
                            aria-label="Import World"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Import
                        </button>
                    </div>
                    <form onSubmit={handleFeedSubmit}>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                id="feedUrl"
                                value={feedUrl}
                                onChange={(e) => setFeedUrl(e.target.value)}
                                placeholder="Or paste direct URL to chronicle-feed.json"
                                className={cn(componentStyles.input.base, 'flex-grow')}
                            />
                            <button
                                type="submit"
                                className={cn(componentStyles.button.base, componentStyles.button.primary, 'bg-sky-700 hover:bg-sky-600')}
                            >
                                Load
                            </button>
                        </div>
                    </form>
                </div>

                <p className="text-center text-gray-500 mt-6 text-sm">By PeeHell</p>
            </div>
            {debugSetup && (
                <button
                    onClick={debugSetup}
                    className={cn(componentStyles.button.base, componentStyles.button.destructive, 'fixed bottom-4 right-4 flex items-center gap-2')}
                    aria-label="Debug Setup"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Debug Start
                </button>
            )}
        </div>
    );
};

export default GameSetup;