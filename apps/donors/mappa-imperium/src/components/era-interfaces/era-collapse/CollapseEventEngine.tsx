
import React, { useState, useMemo, useEffect } from 'react';
import type { Player, ElementCard, GameSettings, Event as EventType, Faction, Settlement, War, Monument } from '../../types';
import { useAIGeneration } from '../../../hooks/useAIGeneration';
import { Type } from "@google/genai";
import { collapseEvents } from '../../../data/collapseEvents';
import CollapseEventSelector from './CollapseEventSelector';
import AIContextInput from '../../shared/AIContextInput';
import DicePip from '../../shared/DicePip';
import AIGenerationSection from '../../shared/AIGenerationSection';
import { componentStyles } from '../../../design/tokens';
import { cn } from '../../../utils/cn';

interface CollapseEventEngineProps {
    currentPlayer: Player;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number, creationStep?: string) => void;
    gameSettings: GameSettings | null;
}

const CollapseEventEngine = ({
    currentPlayer,
    elements,
    onCreateElement,
    gameSettings,
}: CollapseEventEngineProps) => {
    const [diceValues, setDiceValues] = useState<[number, number, number]>([6, 6, 6]);
    const [selectedRoll, setSelectedRoll] = useState<number | ''>('');
    const [formState, setFormState] = useState({ name: '', year: '' as number | '', description: '', userInput: '' });
    const [yearError, setYearError] = useState('');

    const { result, isLoading, error, generate, clear, elements: aiElements } = useAIGeneration();
    const inputClasses = componentStyles.input.base;

    const selectedEvent = useMemo(() => selectedRoll ? collapseEvents[Number(selectedRoll)] : null, [selectedRoll]);

    const { currentTurn, totalTurns, yearRange } = useMemo(() => {
        if (!gameSettings || !currentPlayer) return { currentTurn: 1, totalTurns: 5, yearRange: { start: 0, end: 0 } };
        
        const turnsPerEra: Record<GameSettings['length'], { 4: number; 5: number; 6: number; }> = { Short: { 4: 3, 5: 4, 6: 3 }, Standard: { 4: 6, 5: 6, 6: 5 }, Long: { 4: 8, 5: 8, 6: 6 }, Epic: { 4: 11, 5: 12, 6: 10 } };
        const turnDuration = gameSettings.turnDuration;
        
        const era3Years = 30;
        const era4Years = (turnsPerEra[gameSettings.length][4] || 0) * turnDuration;
        const era5Years = (turnsPerEra[gameSettings.length][5] || 0) * turnDuration;
        
        const turns = turnsPerEra[gameSettings.length][6];

        const completedTurns = elements.filter(el => el.owner === currentPlayer.playerNumber && el.era === 6 && el.creationStep === '6.1 Final Era Event' && !el.isDebug).length;
        const turn = completedTurns + 1;
        
        const precedingYears = era3Years + era4Years + era5Years;
        const startYear = precedingYears + ((turn - 1) * turnDuration) + 1;
        const endYear = startYear + turnDuration - 1;

        return { currentTurn: turn, totalTurns: turns, yearRange: { start: startYear, end: endYear } };
    }, [currentPlayer, elements, gameSettings]);

    const rollDiceAndSet = () => {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const d3 = Math.floor(Math.random() * 6) + 1;
        setDiceValues([d1, d2, d3]);
        setSelectedRoll(d1 + d2 + d3);
    };

    useEffect(() => {
        if (!selectedRoll) rollDiceAndSet();
    }, []);
    
     useEffect(() => {
        setFormState({ name: '', year: yearRange.start > 0 ? yearRange.start : '', description: '', userInput: '' });
    }, [selectedRoll, yearRange.start]);

    useEffect(() => {
        if (result) {
            try {
                const parsed = JSON.parse(result);
                if (parsed.name && parsed.description) {
                    setFormState(prev => ({ ...prev, name: parsed.name, description: parsed.description }));
                }
            } catch (e) {
                console.error("Failed to parse AI response for Collapse Event:", e);
                setFormState(prev => ({ ...prev, description: result })); // Fallback
            }
            clear();
        }
    }, [result, clear]);

    const handleYearChange = (value: string) => {
        const num = value === '' ? '' : parseInt(value, 10);
        setFormState(prev => ({ ...prev, year: num }));
        setYearError((num !== '' && (num < yearRange.start || num > yearRange.end)) ? `Year must be between ${yearRange.start} and ${yearRange.end}.` : '');
    };
    
    const handleGenerate = () => {
        if (!selectedEvent) return;
        const basePrompt = `Based on the Mappa Imperium "Age of Collapse" rules, generate a 'name' and 'description' for the event: "${selectedEvent.name}". The core instruction is: "${selectedEvent.prompt}". Respond with a single JSON object.`;
        const responseSchema = { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['name', 'description'] };
        generate(basePrompt, formState.userInput, { eraId: 6, year: Number(formState.year), responseMimeType: 'application/json', responseSchema: responseSchema });
    };

    const handleCreateElement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent || !formState.name || typeof formState.year !== 'number' || yearError) return;

        let data: Partial<Faction | Settlement | EventType | War | Monument> = { name: formState.name, description: formState.description };

        if(selectedEvent.elementType === 'Faction') (data as Faction).isNeighbor = true;
        if(selectedEvent.elementType === 'Settlement') (data as Settlement).purpose = selectedEvent.name;
        
        onCreateElement({
            type: selectedEvent.elementType,
            name: formState.name,
            owner: currentPlayer.playerNumber,
            era: 6,
            data: { id: `data-${crypto.randomUUID()}`, ...data } as any
        }, formState.year, '6.1 Final Era Event');
        
        rollDiceAndSet();
    };

    if (currentTurn > totalTurns) {
        return <div className="p-8 text-center bg-green-50 text-green-800 rounded-lg">All turns for this era are complete!</div>;
    }

    return (
        <div className="space-y-6">
            <header>
                <p className="mt-2 text-lg text-gray-600">You are on <span className="font-bold">Turn {currentTurn} of {totalTurns}</span>, taking place between <span className="font-bold">Years {yearRange.start}-{yearRange.end}</span>.</p>
            </header>
            
            <div className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-700">Your Roll:</span>
                        <div className="flex items-center gap-2">
                            <DicePip value={diceValues[0]} /><DicePip value={diceValues[1]} /><DicePip value={diceValues[2]} />
                            <span className="text-xl font-bold text-amber-800">= {selectedRoll}</span>
                        </div>
                    </div>
                    <button type="button" onClick={rollDiceAndSet} className={cn(componentStyles.button.base, componentStyles.button.secondary)}>Reroll</button>
                </div>

                <CollapseEventSelector selectedRoll={selectedRoll} onRollSelect={setSelectedRoll} />
                
                 <div className="pt-4 border-t">
                    {selectedEvent && (
                        <form onSubmit={handleCreateElement} className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label htmlFor="element-name" className={componentStyles.form.label}>Event/Element Title</label>
                                    <input type="text" id="element-name" value={formState.name} onChange={e => setFormState(p => ({...p, name: e.target.value}))} required className={inputClasses} placeholder={`e.g., The ${selectedEvent.name}`} />
                                </div>
                                <div>
                                    <label htmlFor="element-year" className={componentStyles.form.label}>Year</label>
                                    <input type="number" id="element-year" value={formState.year} onChange={e => handleYearChange(e.target.value)} min={yearRange.start} max={yearRange.end} required className={inputClasses} />
                                    {yearError && <p className="text-xs text-red-600 mt-1">{yearError}</p>}
                                </div>
                            </div>

                             <div>
                                <label htmlFor="narrative-edit" className={componentStyles.form.label}>Chronicle</label>
                                <textarea id="narrative-edit" value={formState.description} onChange={e => setFormState(p => ({...p, description: e.target.value}))} rows={8} maxLength={1200} className={cn(inputClasses, "resize-y")} placeholder="Describe the event manually, or use the AI generator..." required/>
                            </div>
                            
                            <div className="flex gap-4 pt-4 border-t">
                                <button type="submit" disabled={!formState.name || typeof formState.year !== 'number' || !!yearError} className={cn(componentStyles.button.base, componentStyles.button.primary, "w-full")}>Create {selectedEvent.elementType} & Complete Turn</button>
                            </div>

                             <AIGenerationSection title="AI-Powered Generation">
                                <p className="text-sm text-gray-500 italic">{selectedEvent?.description}</p>
                                <AIContextInput
                                    id="collapse-user-input" label="Your Ideas for AI (Optional)"
                                    tooltip="Reference existing elements by copying their ID from the Element Manager and pasting it here. The AI will use them as context."
                                    value={formState.userInput} onChange={val => setFormState(p => ({...p, userInput: val}))} elements={aiElements}
                                />
                                <button type="button" onClick={handleGenerate} disabled={isLoading || formState.description.trim() !== ''} className={cn(componentStyles.button.base, componentStyles.button.primary, "w-full bg-blue-600 hover:bg-blue-700")}>
                                    {isLoading ? 'Generating...' : '✨ Generate Chronicle'}
                                </button>
                                {formState.description.trim() !== '' && !isLoading && <p className="text-xs text-center text-gray-500">Clear description to enable AI generation.</p>}
                                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                            </AIGenerationSection>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollapseEventEngine;
