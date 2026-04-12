import React, { useMemo } from 'react';
import { useGameStore } from '../../stores/gameStore';
import type { Faction } from '../../types';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';
import { TURNS_PER_ERA } from '../../data/eras';

const GameEndScreen = () => {
    const { elements, players, gameSettings, exportGameData, exportChronicleFeed, logOff } = useGameStore();

    const stats = useMemo(() => {
        if (!gameSettings) return null;

        const ypt = gameSettings.turnDuration;
        const turnsConfig = TURNS_PER_ERA[gameSettings.length];
        const era3Duration = Math.max(30, (turnsConfig[3] || 3) * ypt);
        const era4Duration = turnsConfig[4] * ypt;
        const era5Duration = turnsConfig[5] * ypt;
        const era6Duration = turnsConfig[6] * ypt;
        const totalYears = era3Duration + era4Duration + era5Duration + era6Duration;

        const primeFactions = elements
            .filter(el => el.type === 'Faction' && !(el.data as Faction).isNeighbor)
            .map(el => ({ name: el.name, ownerName: players.find(p => p.playerNumber === el.owner)?.name || `Player ${el.owner}` }));
            
        const elementCounts = elements.reduce((acc, el) => {
            acc[el.type] = (acc[el.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalYears,
            primeFactions,
            totalElements: elements.length,
            elementCounts
        };
    }, [elements, players, gameSettings]);
    
    if (!stats) {
        return (
            <div className={componentStyles.layout.centeredCard}>
                <div className={cn(componentStyles.card.page, "text-center")}>
                    <h1 className="text-5xl font-bold text-amber-800">Error</h1>
                    <p className="mt-4 text-gray-600">Could not load game summary. Game settings are missing.</p>
                     <button onClick={logOff} className={cn(componentStyles.button.base, componentStyles.button.primary, "mt-8")}>
                        Return to Main Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={componentStyles.layout.centeredCard}>
            <div className={cn(componentStyles.card.page, "max-w-2xl")}>
                <div className="text-center">
                    <span className="text-6xl" role="img" aria-label="Trophy">🏆</span>
                    <h1 className="text-5xl font-bold text-amber-800 mt-4">Chronicle Complete!</h1>
                    <p className="mt-4 text-lg text-gray-600">Congratulations, worldbuilders! You have successfully chronicled the history of your world from its creation to the end of an age.</p>
                </div>
                
                <div className="mt-8 p-6 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg space-y-4">
                    <h2 className="text-2xl font-bold text-amber-900">Final World Summary</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-amber-800">
                        <div><strong>Total Years of History:</strong> <span className="font-bold">{stats.totalYears}</span></div>
                        <div><strong>Total Elements Created:</strong> <span className="font-bold">{stats.totalElements}</span></div>
                    </div>
                    <div>
                        <h3 className="font-bold">Empires Founded:</h3>
                        <ul className="list-disc list-inside ml-4">
                            {stats.primeFactions.map((f, i) => <li key={i}>{f.name} ({f.ownerName})</li>)}
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-bold">Element Breakdown:</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            {Object.entries(stats.elementCounts).map(([type, count]) => (
                                <span key={type} className="bg-amber-100 px-2 py-1 rounded-full">{type}: <strong>{count as number}</strong></span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                     <p className="text-center text-gray-600">What would you like to do next?</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <button onClick={exportGameData} className={cn(componentStyles.button.base, componentStyles.button.primary, "w-full bg-green-700 hover:bg-green-600")}>
                            Export Final World (.json)
                        </button>
                        <button onClick={exportChronicleFeed} className={cn(componentStyles.button.base, componentStyles.button.primary, "w-full bg-sky-700 hover:bg-sky-600")}>
                            Publish Final Feed (.json)
                        </button>
                     </div>
                     <button onClick={logOff} className={cn(componentStyles.button.base, componentStyles.button.secondary, "w-full")}>
                        Return to Main Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameEndScreen;