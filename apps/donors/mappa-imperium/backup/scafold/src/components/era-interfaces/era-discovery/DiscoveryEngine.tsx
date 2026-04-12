import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Player, ElementCard, GameSettings, Resource, Location, Faction, Settlement, Event as EventType, Character } from '../../types';
import { useAI } from '../../../contexts/AIContext';
import { Type } from "@google/genai";
import { discoveryEvents } from '../../../data/discoveryEvents';
import DiscoveryEventSelector from './DiscoveryEventSelector';
import AIContextInput from '../../shared/AIContextInput';
import EmojiPicker from '../../shared/EmojiPicker';
import DicePip from '../../shared/DicePip';
import HelpTooltip from '../../shared/HelpTooltip';
import AIGenerationSection from '../../shared/AIGenerationSection';

interface DiscoveryEngineProps {
    currentPlayer: Player;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number, creationStep?: string) => void;
    gameSettings: GameSettings | null;
}

const races = [ "Demonkind", "Seafolk", "Smallfolk", "Reptilian", "Dwarves", "Humans", "Elves", "Greenskins", "Animalfolk", "Giantkind" ];
const siteTypes = [ 'bottomless pit', 'lone mountain', 'hot spring', 'rock tower', 'small lake', 'ancient tree', 'cave', 'volcano', 'grove', 'henge', 'geyser', 'natural' ];
const resourceTypes: Resource['type'][] = ['mineral', 'flora', 'fauna', 'magical', 'other'];
const settlementPurposes = [ "Food", "Mining", "Industry", "Trade", "Military", "Religion" ];

const DiscoveryEngine = ({
    currentPlayer,
    elements,
    onCreateElement,
    gameSettings,
}: DiscoveryEngineProps) => {
    const [diceValues, setDiceValues] = useState<[number, number, number]>([6, 6, 6]);
    const [selectedRoll, setSelectedRoll] = useState<number | ''>('');
    const [formState, setFormState] = useState({ name: '', year: '' as number | '', description: '', symbol: '❓', selectValue1: '', userInput: '' });
    const [yearError, setYearError] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const triggerRef = useRef<HTMLButtonElement>(null);
    const { result, isLoading, error, generate, clear, elements: aiElements } = useAI();
    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 bg-white text-gray-900";

    const selectedEvent = useMemo(() => selectedRoll ? discoveryEvents[Number(selectedRoll)] : null, [selectedRoll]);

    const { currentTurn, totalTurns, yearRange } = useMemo(() => {
        if (!gameSettings || !currentPlayer) return { currentTurn: 1, totalTurns: 6, yearRange: { start: 0, end: 0 } };
        const turnsPerEra: Record<GameSettings['length'], { 4: number }> = { Short: { 4: 3 }, Standard: { 4: 6 }, Long: { 4: 8 }, Epic: { 4: 11 } };
        const turns = turnsPerEra[gameSettings.length][4];
        const turnDuration = gameSettings.turnDuration;
        const era3Years = 30;
        const completedTurns = elements.filter(el => el.owner === currentPlayer.playerNumber && el.era === 4 && el.creationStep === '4.1 Exploration' && !el.isDebug).length;
        const turn = completedTurns + 1;
        const startYear = era3Years + ((turn - 1) * turnDuration) + 1;
        const endYear = startYear + turnDuration - 1;
        return { currentTurn: turn, totalTurns: turns, yearRange: { start: startYear, end: endYear } };
    }, [currentPlayer, elements, gameSettings]);

    const resetFormState = (eventType?: ElementCard['type']) => {
        let newSelectValue1 = '';
        if (eventType === 'Resource') newSelectValue1 = resourceTypes[0];
        else if (eventType === 'Location') newSelectValue1 = siteTypes[0];
        else if (eventType === 'Faction') newSelectValue1 = races[0];
        else if (eventType === 'Settlement') newSelectValue1 = settlementPurposes[0];
        setFormState({ name: '', year: yearRange.start > 0 ? yearRange.start : '', description: '', symbol: '❓', selectValue1: newSelectValue1, userInput: '' });
    };

    const rollDiceAndSet = () => {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const d3 = Math.floor(Math.random() * 6) + 1;
        setDiceValues([d1, d2, d3]);
        setSelectedRoll(d1 + d2 + d3);
    };

    const handleRollSelect = (roll: number) => {
        setSelectedRoll(roll);
    };

    useEffect(() => {
        if (!selectedRoll) rollDiceAndSet();
    }, []);

    useEffect(() => {
        if(selectedEvent) resetFormState(selectedEvent.elementType);
    }, [selectedRoll]);

    useEffect(() => {
        if (result) {
            try {
                const parsed = JSON.parse(result);
                const newFormState = { ...formState };
                if (parsed.name) newFormState.name = parsed.name;
                if (parsed.description) newFormState.description = parsed.description;

                switch (selectedEvent?.elementType) {
                    case 'Resource':
                        if (parsed.symbol) newFormState.symbol = parsed.symbol;
                        if (parsed.type) newFormState.selectValue1 = parsed.type;
                        break;
                    case 'Location':
                        if (parsed.symbol) newFormState.symbol = parsed.symbol;
                        if (parsed.siteType) newFormState.selectValue1 = parsed.siteType;
                        break;
                    case 'Faction':
                        if (parsed.emoji) newFormState.symbol = parsed.emoji;
                        if (parsed.race) newFormState.selectValue1 = parsed.race;
                        break;
                    case 'Settlement':
                        if (parsed.purpose) newFormState.selectValue1 = parsed.purpose;
                        break;
                }
                setFormState(newFormState);
                clear();
            } catch (e) {
                console.error("Failed to parse AI JSON response", e);
                setFormState(prev => ({...prev, description: result })); // Fallback to raw text
            }
        }
    }, [result, clear, selectedEvent]);
    
    const handleYearChange = (value: string) => {
        const num = value === '' ? '' : parseInt(value, 10);
        setFormState(prev => ({ ...prev, year: num }));
        setYearError((num !== '' && (num < yearRange.start || num > yearRange.end)) ? `Year must be between ${yearRange.start} and ${yearRange.end}.` : '');
    };

    const handleGenerate = () => {
        if (!selectedEvent) return;

        const baseSchema: any = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "A creative, thematic name for the discovered element." },
                description: { type: Type.STRING, description: "A detailed narrative chronicle of the discovery and its implications." }
            },
            required: ["name", "description"]
        };

        switch (selectedEvent.elementType) {
            case 'Resource':
                baseSchema.properties['symbol'] = { type: Type.STRING, description: "A single emoji character representing the resource." };
                baseSchema.properties['type'] = { type: Type.STRING, description: "The type of the resource.", enum: resourceTypes };
                baseSchema.required.push('symbol', 'type');
                break;
            case 'Location':
                baseSchema.properties['symbol'] = { type: Type.STRING, description: "A single emoji character representing the location." };
                baseSchema.properties['siteType'] = { type: Type.STRING, description: "The type of the location.", enum: siteTypes };
                baseSchema.required.push('symbol', 'siteType');
                break;
            case 'Faction':
                baseSchema.properties['emoji'] = { type: Type.STRING, description: "A single emoji character representing the faction." };
                baseSchema.properties['race'] = { type: Type.STRING, description: "The race of the faction.", enum: races };
                baseSchema.required.push('emoji', 'race');
                break;
            case 'Settlement':
                baseSchema.properties['purpose'] = { type: Type.STRING, description: "The purpose of the settlement.", enum: settlementPurposes };
                baseSchema.required.push('purpose');
                break;
        }

        generate(selectedEvent.prompt, formState.userInput, { 
            eraId: 4, 
            year: Number(formState.year), 
            turnDuration: gameSettings?.turnDuration, 
            responseMimeType: 'application/json', 
            responseSchema: baseSchema 
        });
    };

    const handleCreateElement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent || !formState.name || typeof formState.year !== 'number' || yearError) return;

        let data: any = { id: `data-${crypto.randomUUID()}`, name: formState.name, description: formState.description };
        switch (selectedEvent.elementType) {
            case 'Resource': data = { ...data, symbol: formState.symbol, type: formState.selectValue1 } as Resource; break;
            case 'Location': data = { ...data, symbol: formState.symbol, siteType: formState.selectValue1 } as Location; break;
            case 'Faction': data = { ...data, emoji: formState.symbol, race: formState.selectValue1, isNeighbor: true, name: formState.name, theme: '', symbolName: '', color: '', leaderName: '' } as Faction; break;
            case 'Settlement': data = { ...data, purpose: formState.selectValue1 } as Settlement; break;
            case 'Character': data = { ...data } as Character; break;
            default: data = { ...data } as EventType; break;
        }

        const newElement = { type: selectedEvent.elementType, name: formState.name, owner: currentPlayer.playerNumber, era: 4, data };
        onCreateElement(newElement, formState.year, '4.1 Exploration');
        rollDiceAndSet();
    };
    
    const renderCreationFormFields = () => {
        if (!selectedEvent) return null;
        
        const nameField = (
            <div className="md:col-span-2">
                <label htmlFor="element-name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="element-name" value={formState.name} onChange={e => setFormState(p => ({...p, name: e.target.value}))} required className={inputClasses} />
            </div>
        );

        const yearField = (
            <div>
                <label htmlFor="element-year" className="block text-sm font-medium text-gray-700">Year</label>
                <input type="number" id="element-year" value={formState.year} onChange={e => handleYearChange(e.target.value)} min={yearRange.start} max={yearRange.end} required className={inputClasses} />
                {yearError && <p className="text-xs text-red-600 mt-1">{yearError}</p>}
            </div>
        );

        const symbolField = (
             <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Map Emoji</label>
                <button ref={triggerRef} type="button" onClick={() => setIsPickerOpen(true)} className={`${inputClasses} text-2xl text-left`}>{formState.symbol}</button>
             </div>
        );

        const typeSelectField = (label: string, options: readonly string[]) => (
            <div>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <select value={formState.selectValue1} onChange={e => setFormState(p => ({...p, selectValue1: e.target.value}))} className={inputClasses}>
                    {options.map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
                </select>
            </div>
        );

        switch (selectedEvent.elementType) {
            case 'Resource': return <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">{nameField}{yearField}{symbolField}{typeSelectField("Type", resourceTypes)}</div>;
            case 'Location': return <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">{nameField}{yearField}{symbolField}{typeSelectField("Site Type", siteTypes)}</div>;
            case 'Faction': return <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">{nameField}{yearField}{symbolField}{typeSelectField("Race", races)}</div>;
            case 'Settlement': return <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">{nameField}{yearField}{typeSelectField("Purpose", settlementPurposes)}<div/></div>;
            default: return <div className="grid md:grid-cols-3 gap-4">{nameField}{yearField}</div>;
        }
    };

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-amber-800">4.1 Exploration</h2>
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
                    <button type="button" onClick={rollDiceAndSet} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Reroll</button>
                </div>
                
                <DiscoveryEventSelector selectedRoll={selectedRoll} onRollSelect={handleRollSelect} disabled={false} />

                <div className="pt-4 border-t">
                    {selectedEvent && (
                        <form onSubmit={handleCreateElement} className="space-y-4">
                            <h3 className="text-lg font-semibold">Chronicle Your Discovery: "{selectedEvent.name}"</h3>
                            {renderCreationFormFields()}
                            <div>
                                <label htmlFor="narrative-edit" className="block text-sm font-medium text-gray-700">Description / Narrative</label>
                                <textarea id="narrative-edit" value={formState.description} onChange={e => setFormState(p => ({...p, description: e.target.value}))} rows={8} maxLength={1200} className={`${inputClasses} resize-y`} placeholder="Describe the event manually, or use the AI generator..." required/>
                            </div>
                            
                            <div className="flex gap-4 pt-4 border-t">
                                <button type="submit" disabled={!formState.name || typeof formState.year !== 'number' || !!yearError} className="w-full bg-amber-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-700 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed">Create Element & Complete Turn</button>
                            </div>

                            <AIGenerationSection title="AI-Powered Generation">
                                <p className="text-sm text-gray-500 italic">{selectedEvent?.description}</p>
                                <AIContextInput
                                    id="discovery-user-input" label="Your Ideas for AI (Optional)"
                                    tooltip="Reference existing elements by copying their ID from the Element Manager and pasting it here. The AI will use them as context."
                                    value={formState.userInput} onChange={val => setFormState(p => ({...p, userInput: val}))} elements={aiElements}
                                />
                                <button type="button" onClick={handleGenerate} disabled={isLoading || formState.description.trim() !== ''} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 shadow disabled:bg-gray-400">
                                    {isLoading ? 'Generating...' : '✨ Generate Narrative'}
                                </button>
                                {formState.description.trim() !== '' && !isLoading && <p className="text-xs text-center text-gray-500">Clear description to enable AI generation.</p>}
                                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                            </AIGenerationSection>
                        </form>
                    )}
                </div>
            </div>
            <EmojiPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onSelect={(emoji) => setFormState(p => ({...p, symbol: emoji}))} triggerRef={triggerRef} />
        </div>
    );
};

export default DiscoveryEngine;