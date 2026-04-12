import React, { useState, useRef, useEffect } from 'react';
import { useAIGeneration } from '../../../hooks/useAIGeneration';
import { Type } from "@google/genai";
import type { ElementCard, Deity } from '@mi/types';
import AIContextInput from '../../shared/AIContextInput';
import EmojiPicker from '../../shared/EmojiPicker';
import { DEITY_PROMPT_TEMPLATE } from '../../../data/ai-templates';
import AIGenerationSection from '../../shared/AIGenerationSection';

interface DeityCreatorFormProps {
    existingDeities: ElementCard[];
    onCreate: (deity: Omit<Deity, 'id'>, year: number) => void;
    disabled: boolean;
}

const DeityCreatorForm = ({
    existingDeities,
    onCreate,
    disabled,
}: DeityCreatorFormProps) => {
    const [name, setName] = useState('');
    const [domain, setDomain] = useState('');
    const [symbol, setSymbol] = useState(''); // Descriptive text
    const [emoji, setEmoji] = useState('✨'); // Emoji for map
    const [description, setDescription] = useState('');
    const [year, setYear] = useState<number | ''>(1);
    const [userInput, setUserInput] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const { elements, generate, result, isLoading, error, clear } = useAIGeneration();

    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 bg-white text-gray-900";


    useEffect(() => {
        if (result) {
            try {
                const parsed = JSON.parse(result);
                setName(parsed.name || '');
                setDomain(parsed.domain || '');
                setSymbol(parsed.symbol || '');
                setEmoji(parsed.emoji || '✨');
                setDescription(parsed.description || '');
                clear();
            } catch (e) {
                console.error("Failed to parse AI response for Deity:", e);
            }
        }
    }, [result, clear]);

    const handleClear = () => {
        setName('');
        setDomain('');
        setSymbol('');
        setEmoji('✨');
        setDescription('');
        setYear(1);
        setUserInput('');
        clear();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !domain.trim() || !symbol.trim() || !description.trim() || year === '') return;
        onCreate({ name, domain, symbol, emoji, description }, year as number);
        handleClear();
    };

    const handleAIGenerate = () => {
        clear();

        let finalUserInput = userInput;
        const partialData = { name: name.trim(), domain: domain.trim(), symbol: symbol.trim() };
        const hasPartialData = partialData.name || partialData.domain || partialData.symbol;

        if (hasPartialData) {
            let partialPrompt = 'The user has provided the following starting points. Use these as the source of truth and creatively fill in any missing information:\n';
            if (partialData.name) partialPrompt += `- Name: ${partialData.name}\n`;
            if (partialData.domain) partialPrompt += `- Domain: ${partialData.domain}\n`;
            if (partialData.symbol) partialPrompt += `- Symbol Description: ${partialData.symbol}\n`;
            finalUserInput = `${partialPrompt}\nUser's Additional Ideas: ${userInput}`.trim();
        }

        const existingDeityNames = existingDeities.map(d => d.name).join(', ') || 'None';
        const basePrompt = `My pantheon already includes: ${existingDeityNames}. Please generate a new, distinct deity.`

        const fullPrompt = `${DEITY_PROMPT_TEMPLATE}\n${basePrompt}`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                domain: { type: Type.STRING },
                symbol: { type: Type.STRING, description: "A rich text description of their holy symbol (e.g., 'A cracked stone hammer wreathed in lightning')." },
                emoji: { type: Type.STRING, description: "A single emoji character to represent them on a map." },
                description: { type: Type.STRING, description: "A detailed 3-4 sentence description." },
            },
            required: ['name', 'domain', 'symbol', 'emoji', 'description'],
        };

        generate(fullPrompt, finalUserInput, { responseMimeType: "application/json", responseSchema });
    };

    const isAiDisabled = isLoading || disabled || description.trim() !== '';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border space-y-4">
            <h3 className="text-2xl font-bold text-amber-900">Create a New Deity</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label htmlFor="deityName" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="deityName" value={name} onChange={e => setName(e.target.value)} required className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="deityYear" className="block text-sm font-medium text-gray-700">Year</label>
                        <input type="number" id="deityYear" value={year} onChange={e => setYear(e.target.value === '' ? '' : parseInt(e.target.value, 10))} min="1" max="30" required className={inputClasses} />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label htmlFor="deityDomain" className="block text-sm font-medium text-gray-700">Domain</label>
                        <input type="text" id="deityDomain" value={domain} onChange={e => setDomain(e.target.value)} required className={inputClasses} />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Map Emoji</label>
                        <button ref={triggerRef} type="button" onClick={() => setIsPickerOpen(!isPickerOpen)} className="mt-1 w-full py-2 border border-gray-300 rounded-md shadow-sm text-2xl bg-white">{emoji}</button>
                        <EmojiPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onSelect={setEmoji} triggerRef={triggerRef} />
                    </div>
                </div>
                <div>
                    <label htmlFor="deitySymbol" className="block text-sm font-medium text-gray-700">Symbol Description</label>
                    <input type="text" id="deitySymbol" value={symbol} onChange={e => setSymbol(e.target.value)} required placeholder="e.g., A cracked anvil glowing with heat" className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="deityDescription" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="deityDescription" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className={inputClasses}></textarea>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                    <button type="button" onClick={handleClear} className="w-1/3 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
                    <button type="submit" disabled={disabled} className="w-2/3 bg-amber-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-700 transition-all shadow-lg disabled:bg-gray-400">
                        {disabled ? 'Pantheon Full' : 'Save Deity'}
                    </button>
                </div>

                <AIGenerationSection title="AI-Powered Generation">
                    <AIContextInput
                        id="deity-user-input"
                        label="Your Ideas (Optional)"
                        value={userInput}
                        onChange={setUserInput}
                        placeholder="e.g., 'a god of storms and secrets', or paste a UUID..."
                        elements={elements}
                        rows={2}
                        disabled={disabled}
                        tooltip="Reference existing elements by copying their ID from the Element Manager and pasting it here. The AI will use them as context."
                    />
                    <button type="button" onClick={handleAIGenerate} disabled={isAiDisabled} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all shadow disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Generating...</> : 'Generate with AI'}
                    </button>
                    {description.trim() !== '' && !isLoading && (
                        <p className="text-xs text-center text-gray-500 mt-2">
                            AI generation is disabled to avoid overwriting your custom description. Clear the field to enable.
                        </p>
                    )}
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                </AIGenerationSection>
            </form>
        </div>
    );
};

export default DeityCreatorForm;
