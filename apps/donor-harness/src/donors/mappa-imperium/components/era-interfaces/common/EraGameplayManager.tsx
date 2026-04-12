import React, { useState, useEffect, useMemo } from 'react';
import { useAI } from '../../../contexts/AIContext';
import AIContextInput from '../../shared/AIContextInput';
import type { Player, ElementCard, GameSettings, Event as EventType } from '@mi/types';
import AIGenerationSection from '../../shared/AIGenerationSection';
import { Type } from "@google/genai";

interface EraGameplayManagerProps {
    eraId: number;
    title: string;
    description: string;
    basePrompt: string;
    currentPlayer: Player;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number, creationStep?: string) => void;
    gameSettings: GameSettings | null;
}

const EraGameplayManager = ({
    eraId,
    title,
    description,
    basePrompt,
    currentPlayer,
    elements,
    onCreateElement,
    gameSettings,
}: EraGameplayManagerProps) => {
    const { result, isLoading, error, generate, clear, elements: aiElements } = useAI();
    
    const [eventName, setEventName] = useState('');
    const [eventYear, setEventYear] = useState<number | ''>('');
    const [eventDescription, setEventDescription] = useState('');
    const [userInput, setUserInput] = useState('');
    const [yearError, setYearError] = useState('');
    
    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 bg-white text-gray-900";

    const { currentTurn, totalTurns, yearRange } = useMemo(() => {
        if (!gameSettings || !currentPlayer || eraId < 4) return { currentTurn: 1, totalTurns: 1, yearRange: { start: 0, end: 0 } };

        const turnsPerEra: Record<GameSettings['length'], { 4: number; 5: number; 6: number; }> = {
            Short: { 4: 3, 5: 4, 6: 3 }, Standard: { 4: 6, 5: 6, 6: 5 },
            Long: { 4: 8, 5: 8, 6: 6 }, Epic: { 4: 11, 5: 12, 6: 10 }
        };

        const safeEraId = eraId as 4 | 5 | 6;
        const totalTurnsForEra = turnsPerEra[gameSettings.length][safeEraId] || 0;
        const turnDuration = gameSettings.turnDuration || 10;
        const era3Years = 30;
        
        const completedTurns = elements.filter(el => el.owner === currentPlayer.playerNumber && el.era === eraId && !el.isDebug).length;
        const turn = completedTurns + 1;

        let precedingYears = era3Years;
        if (eraId > 4) precedingYears += (turnsPerEra[gameSettings.length][4] || 0) * turnDuration;
        if (eraId > 5) precedingYears += (turnsPerEra[gameSettings.length][5] || 0) * turnDuration;

        const startYear = precedingYears + ((turn - 1) * turnDuration) + 1;
        const endYear = startYear + turnDuration - 1;

        return { currentTurn: turn, totalTurns: totalTurnsForEra, yearRange: { start: startYear, end: endYear }};

    }, [eraId, currentPlayer, elements, gameSettings]);
    
    useEffect(() => {
        if (yearRange.start > 0 && eventYear === '') {
            setEventYear(yearRange.start);
        }
    }, [yearRange.start, eventYear]);

    useEffect(() => {
        if (result) {
            try {
                const parsed = JSON.parse(result);
                if (parsed.name) setEventName(parsed.name);
                if (parsed.description) setEventDescription(parsed.description);
            } catch(e) {
                console.error("Failed to parse AI response for Gameplay Manager:", e);
                setEventDescription(result); // Fallback for non-JSON
            }
            clear();
        }
    }, [result, clear]);
    
    const handleYearChange = (value: string) => {
        const num = value === '' ? '' : parseInt(value, 10);
        setEventYear(num);
        setYearError((num !== '' && (num < yearRange.start || num > yearRange.end)) ? `Year must be between ${yearRange.start} and ${yearRange.end}.` : '');
    };

    const handleGenerate = () => {
        const finalPrompt = `Generate a creative 'name' (a title for this event) and a 'description' (a detailed narrative chronicle) for an event in a fantasy worldbuilding game. The core instruction is: "${basePrompt}". Respond with a single JSON object.`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "A creative, thematic title for this historical event." },
                description: { type: Type.STRING, description: "A detailed narrative chronicle of the event, following the prompt instructions." }
            },
            required: ['name', 'description']
        };

        generate(finalPrompt, userInput, {
            eraId,
            year: Number(eventYear),
            turnDuration: gameSettings?.turnDuration,
            responseMimeType: 'application/json',
            responseSchema: responseSchema
        });
    };

    const handleCreate = () => {
        if (typeof eventYear !== 'number' || (yearRange.start > 0 && (eventYear < yearRange.start || eventYear > yearRange.end))) {
            setYearError(`Year must be between ${yearRange.start} and ${yearRange.end}.`);
            return;
        }

        const newEventData: Omit<EventType, 'id'> = {
            name: eventName,
            description: eventDescription,
        };
        
        const newElement: Omit<ElementCard, 'id'> = {
            type: 'Event',
            name: eventName,
            owner: currentPlayer.playerNumber,
            era: eraId,
            data: { id: `data-${crypto.randomUUID()}`, ...newEventData },
        };
        
        onCreateElement(newElement, eventYear, `Era ${eraId} Event`);
        
        setEventName('');
        setEventDescription('');
        setUserInput('');
        setYearError('');
    };

    if (currentTurn > totalTurns) {
        return <div className="p-8 text-center bg-green-50 text-green-800 rounded-lg">All turns for this era are complete!</div>;
    }

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-amber-800">{title}</h2>
                <p className="mt-2 text-lg text-gray-600">{description}</p>
            </header>

            <div className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
                 <p className="text-lg font-semibold text-gray-700">
                    You are on <span className="font-bold">Turn {currentTurn} of {totalTurns}</span>, taking place between <span className="font-bold">Years {yearRange.start}-{yearRange.end}</span>.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="event-name" className="block text-sm font-medium text-gray-700">Event Title / Roll</label>
                        <input type="text" id="event-name" value={eventName} onChange={e => setEventName(e.target.value)} required className={inputClasses} placeholder="e.g., 'The King is Dead'" />
                    </div>
                    <div>
                        <label htmlFor="event-year" className="block text-sm font-medium text-gray-700">Year of Event</label>
                        <input type="number" id="event-year" value={eventYear} onChange={e => handleYearChange(e.target.value)} min={yearRange.start} max={yearRange.end} required className={inputClasses} />
                        {yearError && <p className="text-xs text-red-600 mt-1">{yearError}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="event-description" className="block text-sm font-medium text-gray-700">Event Chronicle</label>
                    <textarea 
                        id="event-description"
                        value={eventDescription}
                        onChange={e => setEventDescription(e.target.value)}
                        rows={10}
                        className={`${inputClasses} resize-y`}
                        placeholder="Describe the event, or use the AI generator below to create a narrative..."
                        required
                    />
                </div>
                
                <div className="flex gap-4 pt-4 border-t">
                    <button
                        type="button"
                        onClick={handleCreate}
                        disabled={!eventName || !eventDescription || typeof eventYear !== 'number' || !!yearError}
                        className="w-full bg-amber-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-700 shadow-lg disabled:bg-gray-400"
                    >
                        Create Event & Complete Turn
                    </button>
                </div>

                <AIGenerationSection title="AI-Powered Generation">
                    <AIContextInput
                        id="era-gameplay-ai-input"
                        label="Your Ideas for AI (Optional)"
                        value={userInput}
                        onChange={setUserInput}
                        elements={aiElements}
                        rows={3}
                        tooltip="Reference existing elements by copying their ID from the Element Manager and pasting it here. The AI will use them as context."
                    />
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 shadow disabled:bg-gray-400"
                    >
                        {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Generating...</> : '✨ Generate Chronicle'}
                    </button>
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                </AIGenerationSection>
            </div>
        </div>
    );
};

export default EraGameplayManager;
