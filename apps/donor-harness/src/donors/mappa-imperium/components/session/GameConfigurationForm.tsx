import React from 'react';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';
import { TURNS_PER_ERA } from '../../data/eras';

interface GameConfigurationFormProps {
    players: number;
    setPlayers: (val: number) => void;
    useAi: boolean;
    setUseAi: (val: boolean) => void;
    aiPlayers: number;
    setAiPlayers: (val: number) => void;
    length: 'Short' | 'Standard' | 'Long' | 'Epic';
    setLength: (val: 'Short' | 'Standard' | 'Long' | 'Epic') => void;
    turnDuration: number;
    setTurnDuration: (val: number) => void;
    onSubmit: (e: React.FormEvent) => void;
    totalYears: number;
    eraBreakdown: { era3: number; era4: number; era5: number; era6: number };
}

export const GameConfigurationForm: React.FC<GameConfigurationFormProps> = ({
    players, setPlayers, useAi, setUseAi, aiPlayers, setAiPlayers,
    length, setLength, turnDuration, setTurnDuration, onSubmit, totalYears, eraBreakdown
}) => {
    const gameLengths: ('Short' | 'Standard' | 'Long' | 'Epic')[] = ['Short', 'Standard', 'Long', 'Epic'];

    return (
        <form onSubmit={onSubmit}>
            <div className="mb-8">
                <label htmlFor="players" className={cn(componentStyles.form.label, "text-lg font-semibold mb-3")}>
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
                    <label htmlFor="aiPlayers" className={cn(componentStyles.form.label, "text-lg font-semibold mb-3")}>
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
                    <label htmlFor="turnDuration" className={cn(componentStyles.form.label, "text-lg font-semibold")}>
                        Years Per Turn: <span className="text-amber-700 font-bold">{turnDuration}</span>
                    </label>
                    <button
                        type="button"
                        onClick={() => setTurnDuration(10)}
                        className={cn(componentStyles.button.icon, "bg-gray-200 hover:bg-gray-300 text-gray-600 !w-8 !h-8")}
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
    );
};
