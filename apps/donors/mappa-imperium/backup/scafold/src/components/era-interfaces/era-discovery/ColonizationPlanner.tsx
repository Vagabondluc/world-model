import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Player, ElementCard, Character, GameSettings } from '../../../types';
import { useAI } from '../../../contexts/AIContext';
import { Type } from "@google/genai";
import AIContextInput from '../../shared/AIContextInput';
import AIGenerationSection from '../../shared/AIGenerationSection';

interface ColonizationPlannerProps {
    currentPlayer: Player;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number) => void;
    gameSettings: GameSettings | null;
    heroCount: number;
    heroLimit: number;
}

const professions = [ 'Musician', 'Sculptor', 'Artist', 'Poet', 'Author', 'Historian', 'Military Leader', 'City Leader', 'Explorer', 'Adventurer', 'Inventor', 'Diplomat', 'Trader', 'Humanitarian', 'Mage', 'Beast Tamer' ];
const getRandomProfession = () => professions[Math.floor(Math.random() * professions.length)];
const achievementTypes = [ 'Discovery', 'Innovation', 'Military Victory', 'Artistic Creation', 'Political Leadership', 'Great Sacrifice' ];
const statuses = [ 'Active', 'Retired', 'Legendary (disappeared)', 'Deceased' ];


const ColonizationPlanner = ({ currentPlayer, elements, onCreateElement, gameSettings, heroCount, heroLimit }: ColonizationPlannerProps) => {
    const [name, setName] = useState('');
    const [profession, setProfession] = useState(getRandomProfession);
    const [description, setDescription] = useState('');
    const [achievementType, setAchievementType] = useState(achievementTypes[0]);
    const [status, setStatus] = useState(statuses[0]);
    const [locationToHonor, setLocationToHonor] = useState('');
    const [newLocationName, setNewLocationName] = useState('');
    const [userInput, setUserInput] = useState('');
    const [year, setYear] = useState<number | ''>('');
    const [yearError, setYearError] = useState('');

    const { result, isLoading, error, generate, clear, elements: aiElements } = useAI();
    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 bg-white text-gray-900";

    const isComplete = heroCount >= heroLimit;

    const { era4YearRange } = useMemo(() => {
        if (!gameSettings) return { era4YearRange: { start: 0, end: 0 }};
        const turnsPerEra: Record<GameSettings['length'], { 4: number }> = { Short: { 4: 3 }, Standard: { 4: 6 }, Long: { 4: 8 }, Epic: { 4: 11 } };
        const totalTurns = turnsPerEra[gameSettings.length][4];
        const turnDuration = gameSettings.turnDuration;
        const era3Years = 30;

        const startYear = era3Years + 1;
        const endYear = era3Years + (totalTurns * turnDuration);

        return { era4YearRange: { start: startYear, end: endYear } };
    }, [gameSettings]);

    useEffect(() => {
        if (era4YearRange.end > 0 && year === '') {
            setYear(era4YearRange.end); // Default to the end of the era
        }
    }, [era4YearRange.end, year]);

    useEffect(() => {
        if (result) {
            try {
                const parsed = JSON.parse(result);
                if (parsed.name) setName(parsed.name);
                if (parsed.description) setDescription(parsed.description);
                if (parsed.locationToHonor) setLocationToHonor(parsed.locationToHonor);
                if (parsed.newLocationName) setNewLocationName(parsed.newLocationName);
                clear();
            } catch (e) { console.error("Failed to parse AI response for Hero:", e); }
        }
    }, [result, clear]);

    const handleClear = () => {
        setName('');
        setProfession(getRandomProfession());
        setDescription('');
        setAchievementType(achievementTypes[0]);
        setStatus(statuses[0]);
        setLocationToHonor('');
        setNewLocationName('');
        setUserInput('');
        setYear(era4YearRange.end);
        setYearError('');
        clear();
    };
    
    const handleYearChange = (value: string) => {
        const num = value === '' ? '' : parseInt(value, 10);
        setYear(num);

        if (num !== '' && (num < era4YearRange.start || num > era4YearRange.end)) {
            setYearError(`Year must be between ${era4YearRange.start} and ${era4YearRange.end}.`);
        } else {
            setYearError('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof year !== 'number' || year < era4YearRange.start || year > era4YearRange.end) {
            setYearError(`Year must be between ${era4YearRange.start} and ${era4YearRange.end}.`);
            return;
        }

        let fullDescription = `**Profession:** ${profession}\n**Status:** ${status}\n**Achievement Type:** ${achievementType}\n\n${description}`;
        if(locationToHonor && newLocationName) {
            fullDescription += `\n\n**Honored Location:** ${newLocationName} (formerly ${locationToHonor})`;
        }

        const newCharacterData: Omit<Character, 'id'> = {
            name: name,
            description: fullDescription
        };

        onCreateElement({
            type: 'Character',
            name: name,
            owner: currentPlayer.playerNumber,
            era: 4,
            data: { id: `data-${crypto.randomUUID()}`, ...newCharacterData }
        }, year);
        handleClear();
    };

    const handleAIGenerate = () => {
        const primeFaction = elements.find(el => el.owner === currentPlayer.playerNumber && el.type === 'Faction' && !(el.data as any).isNeighbor);
        const factionContext = primeFaction ? `The hero belongs to the '${primeFaction.name}' faction.` : '';

        const prompt = `Based on Mappa Imperium rules (4.2 Colonization), create a notable hero. Their profession is '${profession}'. Their achievement was a '${achievementType}'. Their current status is '${status}'. ${factionContext} Generate a JSON object with a 'name', a 'description' (a detailed paragraph about their deeds), a 'locationToHonor' (e.g., 'the western forest'), and a 'newLocationName' (e.g., 'Elara's Wood').`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                locationToHonor: { type: Type.STRING },
                newLocationName: { type: Type.STRING },
            },
            required: ['name', 'description', 'locationToHonor', 'newLocationName']
        };
        generate(prompt, userInput, { responseMimeType: 'application/json', responseSchema });
    };

    const isAiDisabled = isLoading || isComplete || name.trim() !== '' || description.trim() !== '';

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-amber-800">4.2 Colonization & Heroes</h2>
                <p className="mt-2 text-lg text-gray-600">Your burgeoning nation is defined by its great figures. Create three notable heroes whose deeds shape your faction's story.</p>
            </header>
            
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                <p className="text-xl font-semibold text-amber-800">Progress: <span className="font-bold">{heroCount} / {heroLimit}</span> heroes created.</p>
                {isComplete && <p className="mt-1 font-bold text-green-700">All heroes have been created! Proceed to the next step.</p>}
            </div>

            <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
                <h3 className="text-xl font-semibold">Create Hero #{heroCount + 1}</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label htmlFor="hero-name" className="block text-sm font-medium text-gray-700">Hero's Name</label>
                        <input type="text" id="hero-name" value={name} onChange={e => setName(e.target.value)} required className={inputClasses} disabled={isComplete} />
                    </div>
                    <div>
                        <label htmlFor="hero-year" className="block text-sm font-medium text-gray-700">Year of Achievement</label>
                        <input type="number" id="hero-year" value={year} onChange={e => handleYearChange(e.target.value)} min={era4YearRange.start} max={era4YearRange.end} required className={inputClasses} disabled={isComplete} />
                        {yearError && <p className="text-xs text-red-600 mt-1">{yearError}</p>}
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="hero-profession" className="block text-sm font-medium text-gray-700">Profession (Rule 4.2)</label>
                        <select id="hero-profession" value={profession} onChange={e => setProfession(e.target.value)} className={inputClasses} disabled={isComplete}>
                            {professions.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="hero-achievement" className="block text-sm font-medium text-gray-700">Achievement Type</label>
                        <select id="hero-achievement" value={achievementType} onChange={e => setAchievementType(e.target.value)} className={inputClasses} disabled={isComplete}>
                            {achievementTypes.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="hero-status" className="block text-sm font-medium text-gray-700">Current Status</label>
                    <select id="hero-status" value={status} onChange={e => setStatus(e.target.value)} className={inputClasses} disabled={isComplete}>
                        {statuses.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="hero-description" className="block text-sm font-medium text-gray-700">Specific Achievement / Legacy</label>
                    <textarea id="hero-description" value={description} onChange={e => setDescription(e.target.value)} rows={4} maxLength={1200} required className={`${inputClasses} resize-y`} disabled={isComplete} placeholder="Describe the act that made them a hero..."/>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="location-to-honor" className="block text-sm font-medium text-gray-700">Location to Honor</label>
                        <input type="text" id="location-to-honor" value={locationToHonor} onChange={e => setLocationToHonor(e.target.value)} className={inputClasses} disabled={isComplete} placeholder="e.g., The Northern Forest"/>
                    </div>
                     <div>
                        <label htmlFor="new-location-name" className="block text-sm font-medium text-gray-700">New Honored Name</label>
                        <input type="text" id="new-location-name" value={newLocationName} onChange={e => setNewLocationName(e.target.value)} className={inputClasses} disabled={isComplete} placeholder="e.g., Elara's Wood"/>
                    </div>
                </div>
                <div className="flex gap-4 pt-4 border-t">
                    <button type="button" onClick={handleClear} className="w-1/3 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Clear</button>
                    <button type="submit" disabled={isComplete} className="w-2/3 bg-amber-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-700 shadow-lg disabled:bg-gray-400">Create Hero</button>
                </div>

                <AIGenerationSection title="AI-Powered Generation">
                    <AIContextInput
                        id="hero-ai"
                        label="Your Ideas (Optional)"
                        value={userInput}
                        onChange={setUserInput}
                        elements={aiElements}
                        rows={2}
                        disabled={isComplete}
                        tooltip="Reference existing elements by copying their ID from the Element Manager and pasting it here. The AI will use them as context."
                    />
                    <button type="button" onClick={handleAIGenerate} disabled={isAiDisabled} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 shadow disabled:bg-gray-400">
                        {isLoading ? 'Generating...' : 'Generate Details'}
                    </button>
                    {isAiDisabled && !isLoading && <p className="text-xs text-center text-gray-500">Clear Name and Description to enable.</p>}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </AIGenerationSection>
            </form>
        </div>
    );
};

export default ColonizationPlanner;
