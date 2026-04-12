import React, { useState, useEffect } from 'react';
import type { ElementCard, Settlement, Faction } from '../../../types';
import { useAI } from '../../../contexts/AIContext';
import { Type } from "@google/genai";
import AIContextInput from '../../shared/AIContextInput';
import AIGenerationSection from '../../shared/AIGenerationSection';

const settlementPurposes = [ "Food", "Mining", "Industry", "Trade", "Military", "Religion", "Capital" ];

interface SettlementFormProps {
    title: string;
    primeFaction: ElementCard | null;
    onCreate: (data: Omit<Settlement, 'id'>) => void;
    disabled?: boolean;
    preselectedPurpose?: string;
    onComplete: () => void;
}

const SettlementForm = ({
    title,
    primeFaction,
    onCreate,
    disabled = false,
    preselectedPurpose,
    onComplete,
}: SettlementFormProps) => {
    const [name, setName] = useState('');
    const [purpose, setPurpose] = useState(preselectedPurpose || 'Food');
    const [description, setDescription] = useState('');
    const [userInput, setUserInput] = useState('');

    const { elements, generate, result, isLoading, error, clear } = useAI();
    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 bg-white text-gray-900";

    useEffect(() => {
        if (preselectedPurpose) {
            setPurpose(preselectedPurpose);
        }
    }, [preselectedPurpose]);

    useEffect(() => {
        if (result) {
            try {
                const parsed = JSON.parse(result);
                if (parsed.name) setName(parsed.name);
                if (parsed.description) setDescription(parsed.description);
                clear();
            } catch (e) {
                console.error("Failed to parse AI response for Settlement:", e);
            }
        }
    }, [result, clear]);

    useEffect(() => {
        if (primeFaction?.id) {
            setUserInput(`Faction context for this settlement: ${primeFaction.id}`);
        } else {
            setUserInput('');
        }
    }, [primeFaction]);

    const handleClear = () => {
        setName('');
        if (!preselectedPurpose) setPurpose('Food');
        setDescription('');
        // Keep the faction context in the user input on clear
        if (primeFaction?.id) {
            setUserInput(`Faction context for this settlement: ${primeFaction.id}`);
        } else {
            setUserInput('');
        }
        clear();
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate({ name, purpose, description, factionId: primeFaction?.id });
        onComplete();
        handleClear();
    };
    
    const handleAIGenerate = () => {
        if (!primeFaction) return;
        const factionData = primeFaction.data as Faction;
        clear();
        let prompt = `Based on the Mappa Imperium rules (Settlement Table), generate a suitable 'name' and 'description' for a new settlement. The settlement's purpose is '${purpose}'. It belongs to the '${factionData.name}' (${factionData.race}) faction, whose theme is: '${factionData.theme}'.`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
            },
            required: ['name', 'description']
        };

        generate(prompt, userInput, { responseMimeType: "application/json", responseSchema });
    }

    const isAiDisabled = isLoading || disabled || name.trim() !== '' || description.trim() !== '';

    return (
        <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="settlement-name" className="block text-sm font-medium text-gray-700">Settlement Name</label>
                    <input type="text" id="settlement-name" value={name} onChange={e => setName(e.target.value)} required className={inputClasses} disabled={disabled}/>
                </div>
                <div>
                    <label htmlFor="settlement-purpose" className="block text-sm font-medium text-gray-700">Purpose</label>
                    <select id="settlement-purpose" value={purpose} onChange={e => setPurpose(e.target.value)} className={inputClasses} disabled={disabled || !!preselectedPurpose}>
                        {settlementPurposes.filter(p => p !== 'Capital').map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="settlement-description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="settlement-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} required className={inputClasses} disabled={disabled} />
            </div>

            <div className="flex gap-4 pt-4 border-t">
                <button type="button" onClick={handleClear} className="w-1/3 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Clear Form</button>
                <button type="submit" disabled={disabled} className="w-2/3 bg-amber-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-700 transition-all transform hover:scale-105 shadow-lg disabled:bg-gray-400">
                    {disabled ? 'Complete' : 'Place Settlement'}
                </button>
            </div>

            <AIGenerationSection title="AI-Powered Generation">
                <AIContextInput
                    id="settlement-ai-input"
                    label="Your Ideas (Optional)"
                    value={userInput}
                    onChange={setUserInput}
                    placeholder="e.g., 'a town built into the cliffside...'"
                    elements={elements}
                    rows={2}
                    disabled={disabled}
                    tooltip="Reference existing elements by copying their ID from the Element Manager and pasting it here. The AI will use them as context."
                />
                <button type="button" onClick={handleAIGenerate} disabled={isAiDisabled} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all shadow disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Generating...</> : 'Generate Details'}
                </button>
                {isAiDisabled && !isLoading && <p className="text-xs text-center text-gray-500 mt-2">Clear Name and Description fields to enable AI.</p>}
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </AIGenerationSection>
        </form>
    );
};

export default SettlementForm;