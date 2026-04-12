import React, { useState, useRef, useMemo, useEffect } from 'react';
import type { GameSetupProps, GameSettings } from '../../types';
import { cn } from '../../utils/cn';
import { componentStyles } from '../../design/tokens';

const TURNS_PER_ERA: Record<GameSettings['length'], { 3: number; 4: number; 5: number; 6: number; }> = {
    Short: { 3: 3, 4: 3, 5: 4, 6: 3 },
    Standard: { 3: 3, 4: 6, 5: 6, 6: 5 },
    Long: { 3: 3, 4: 8, 5: 8, 6: 6 },
    Epic: { 3: 3, 4: 11, 5: 12, 6: 10 }
};

const GameSetup = ({ onStart, onDebug, onImport, onImportFromFeed, onBrowseLobby }: GameSetupProps) => {
    const [players, setPlayers] = useState(2);
    const [length, setLength] = useState<'Short' | 'Standard' | 'Long' | 'Epic'>('Standard');
    const [turnDuration, setTurnDuration] = useState(10);
    const [feedUrl, setFeedUrl] = useState('');
    const gameLengths: ('Short' | 'Standard' | 'Long' | 'Epic')[] = ['Short', 'Standard', 'Long', 'Epic'];
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

    const { totalYears, eraBreakdown } = useMemo(() => {
        const ypt = turnDuration;
        const turnsConfig = TURNS_PER_ERA[length];

        const era3Duration = Math.max(30, 3 * ypt);
        const era4Duration = turnsConfig[4] * ypt;
        const era5Duration = turnsConfig[5] * ypt;
        const era6Duration = turnsConfig[6] * ypt;

        const total = era3Duration + era4Duration + era5Duration + era6Duration;

        return {
            totalYears: total,
            eraBreakdown: {
                era3: era3Duration,
                era4: era4Duration,
                era5: era5Duration,
                era6: era6Duration,
            }
        };
    }, [length, turnDuration]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onStart({ players, length, turnDuration, aiPlayers: useAi ? aiPlayers : 0 });
    };
    
    const handleFeedSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedUrl.trim()) {
            onImportFromFeed(feedUrl.trim());
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImport(e.target.files[0]);
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

                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <label htmlFor="players" className="block text-lg font-semibold text-gray-700 mb-3">
                            Number of Human Players: <span className="text-amber-700 font-bold">{players}</span>
                        </label>
                        <input
                            type="range"
                            id="players"
                            min="1"
                            max={useAi ? 8 - aiPlayers : 8}
                            value={players}
                            onChange={(e) => setPlayers(parseInt(e.target.value, 10))}
                            className={componentStyles.input.range}
                        />
                    </div>
                     <div className="mb-4">
                        <label htmlFor="useAi" className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="useAi"
                                checked={useAi}
                                onChange={(e) => {
                                    setUseAi(e.target.checked);
                                    if (e.target.checked) {
                                        const maxAi = 8 - players;
                                        setAiPlayers(maxAi > 0 ? 1 : 0);
                                    }
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="ml-2 text-lg font-semibold text-gray-700">Add AI Players</span>
                        </label>
                    </div>

                    {useAi && (
                        <div className="mb-8 animate-fade-in">
                            <label htmlFor="aiPlayers" className="block text-lg font-semibold text-gray-700 mb-3">
                                Number of AI Players: <span className="text-amber-700 font-bold">{aiPlayers}</span>
                            </label>
                            <input
                                type="range"
                                id="aiPlayers"
                                min="1"
                                max={8 - players}
                                value={aiPlayers}
                                onChange={(e) => setAiPlayers(parseInt(e.target.value, 10))}
                                className={componentStyles.input.range}
                                disabled={(8 - players) < 1}
                            />
                        </div>
                    )}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Game Length</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {gameLengths.map((len) => (
                                <button
                                    key={len}
                                    type="button"
                                    onClick={() => setLength(len)}
                                    className={cn(componentStyles.button.toggle, length === len ? componentStyles.button.toggleActive : '')}
                                >
                                    {len}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-3">
                            <label htmlFor="turnDuration" className="block text-lg font-semibold text-gray-700">
                                Years Per Turn: <span className="text-amber-700 font-bold">{turnDuration}</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setTurnDuration(10)}
                                className={cn(componentStyles.button.base, componentStyles.button.icon, "bg-gray-200 hover:bg-gray-300 text-gray-600 !w-8 !h-8")}
                                aria-label="Reset turn duration to 10 years"
                                title="Reset to 10 years"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-13.88-4.32" />
                                </svg>
                            </button>
                        </div>
                        <input
                            type="range"
                            id="turnDuration"
                            min="1"
                            max="100"
                            value={turnDuration}
                            onChange={(e) => setTurnDuration(parseInt(e.target.value, 10))}
                            className={componentStyles.input.range}
                        />
                         <p className="text-sm text-gray-500 mt-2">Sets the number of years each turn represents in Eras III, IV, V, & VI.</p>
                         <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 text-amber-900 rounded-r-md">
                            <p className="font-semibold">This chronicle will contain approx. <span className="font-bold text-lg">{totalYears}</span> years of history.</p>
                            <div className="text-xs mt-2 text-amber-800/80 space-y-0.5">
                                <p>
                                    <strong>Era III:</strong> {eraBreakdown.era3} years 
                                    ({turnDuration < 10 ? '30 years minimum' : `${TURNS_PER_ERA[length][3]} turns`})
                                </p>
                                <p><strong>Era IV:</strong> {eraBreakdown.era4} years ({TURNS_PER_ERA[length][4]} turns)</p>
                                <p><strong>Era V:</strong> {eraBreakdown.era5} years ({TURNS_PER_ERA[length][5]} turns)</p>
                                <p><strong>Era VI:</strong> {eraBreakdown.era6} years ({TURNS_PER_ERA[length][6]} turns)</p>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={cn(componentStyles.button.base, componentStyles.button.primary, 'w-full')}
                    >
                        {useAi ? 'Configure AI Players' : 'Begin Worldbuilding'}
                    </button>
                </form>

                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={onBrowseLobby}
                            className={cn(componentStyles.button.base, componentStyles.button.secondary, 'w-full bg-sky-800 hover:bg-sky-700 text-white flex items-center justify-center gap-2')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Browse
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
            {onDebug && (
                 <button
                    onClick={onDebug}
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