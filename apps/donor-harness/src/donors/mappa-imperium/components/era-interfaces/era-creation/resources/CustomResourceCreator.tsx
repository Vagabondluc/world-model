import React, { useState, useRef, useEffect } from 'react';
import type { Resource } from '@mi/types';
import EmojiPicker from '../../../shared/EmojiPicker';
import { Type } from "@google/genai";
import AIContextInput from '../../../shared/AIContextInput';
import { useAIGeneration } from '../../../../hooks/useAIGeneration';
import AIGenerationSection from '../../../shared/AIGenerationSection';
import { componentStyles } from '../../../../design/tokens';
import { cn } from '../../../../utils/cn';

interface CustomResourceCreatorProps {
    onCreate: (resource: Omit<Resource, 'id'>) => void;
    disabled: boolean;
}

const AIOptionsCheckbox = ({ id, label, description, checked, onChange, disabled = false }: { id: string, label: string, description: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled?: boolean }) => (
    <div className={`relative flex items-start ${disabled ? 'opacity-50' : ''}`}>
        <div className="flex h-5 items-center">
            <input
                id={id}
                aria-describedby={`${id}-description`}
                name={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 disabled:cursor-not-allowed"
            />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor={id} className={`font-medium text-gray-700 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>{label}</label>
            <p id={`${id}-description`} className="text-gray-500">{description}</p>
        </div>
    </div>
);

const resourceTypes: Resource['type'][] = ['mineral', 'flora', 'fauna', 'magical', 'other'];
const getRandomResourceType = () => resourceTypes[Math.floor(Math.random() * resourceTypes.length)];

const CustomResourceCreator = ({ onCreate, disabled }: CustomResourceCreatorProps) => {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('💎');
    const [type, setType] = useState<Resource['type']>(getRandomResourceType);
    const [properties, setProperties] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    // AI State
    const { elements, generate, result, isLoading, error, clear } = useAIGeneration();
    const [isMundane, setIsMundane] = useState(false);
    const [includeCauses, setIncludeCauses] = useState(false);
    const [includeFantastic, setIncludeFantastic] = useState(true);
    const [includeStory, setIncludeStory] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [aiError, setAiError] = useState('');

    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setAiError(error);
    }, [error]);

    useEffect(() => {
        if (!result) return;
        try {
            const parsedResult = JSON.parse(result);
            setName(parsedResult.name);

            const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
            if (parsedResult.symbol && typeof parsedResult.symbol === 'string' && emojiRegex.test(parsedResult.symbol)) {
                const match = parsedResult.symbol.match(emojiRegex);
                setSymbol(match ? match[0] : '💎');
            } else {
                setSymbol('💎');
            }

            setType(parsedResult.type);

            let combinedProperties = parsedResult.coreDescription;
            if (parsedResult.causesAndConsequences) combinedProperties += `\n\n[Causes and Consequences]\n${parsedResult.causesAndConsequences}`;
            if (parsedResult.fantasticElements) combinedProperties += `\n\n[Fantastic Elements]\n${parsedResult.fantasticElements}`;
            if (parsedResult.futureStoryPotential) combinedProperties += `\n\n[Future Story Potential]\n${parsedResult.futureStoryPotential}`;
            setProperties(combinedProperties);
            clear();
        } catch (e) {
            console.error("Failed to parse AI JSON response", e);
            setAiError("AI returned an invalid format. Please try again.");
        }
    }, [result, clear]);


    useEffect(() => {
        if (isMundane) {
            setIncludeFantastic(false);
        }
    }, [isMundane]);

    const handleClear = () => {
        setName('');
        setSymbol('💎');
        setType(getRandomResourceType());
        setProperties('');
        setUserInput('');
        clear();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !properties.trim()) return;
        onCreate({ name, symbol, type, properties });
        handleClear();
    };

    const handleEmojiSelect = (emoji: string) => {
        setSymbol(emoji);
    };

    const handleAIGenerate = async () => {
        clear();
        const landmassType = 'diverse area';
        const geographySummary = 'various terrains';

        let basePrompt = `For a fantasy world region that is a "${landmassType}" with features like ${geographySummary}, create a unique resource or special site.`;
        if (isMundane) {
            basePrompt = `For a fantasy world region that is a "${landmassType}" with features like ${geographySummary}, create a unique but MUNDANE (non-magical and not supernatural) resource or special site.`;
        }

        const partialData = { name: name.trim(), symbol, type };
        const hasPartialData = partialData.name || (partialData.symbol !== '💎') || (partialData.type !== 'mineral');
        let finalUserInput = userInput;

        if (hasPartialData) {
            let partialPrompt = 'The user has already started defining this resource. Please build upon or complete the following details, using them as the source of truth:\n';
            if (partialData.name) partialPrompt += `- Name: "${partialData.name}"\n`;
            if (partialData.symbol !== '💎') partialPrompt += `- Symbol: "${partialData.symbol}"\n`;
            if (partialData.type !== 'mineral') partialPrompt += `- Type: "${partialData.type}"\n`;
            finalUserInput = `${partialPrompt}\nUser's Additional Ideas: ${userInput}`.trim();
        }

        const responseSchema: any = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "A unique, fantasy-style name for the resource or site." },
                symbol: { type: Type.STRING, description: "A single emoji character to represent it on a map." },
                type: { type: Type.STRING, description: "The type of resource.", enum: isMundane ? ['mineral', 'flora', 'fauna', 'other'] : ['mineral', 'flora', 'fauna', 'magical', 'other'] },
                coreDescription: { type: Type.STRING, description: "One paragraph establishing what makes it visibly unique and why it matters." },
            },
            required: ['name', 'symbol', 'type', 'coreDescription']
        };

        if (includeCauses) responseSchema.properties.causesAndConsequences = { type: Type.STRING, description: "One paragraph detailing possible origins and effects." };
        if (includeFantastic) responseSchema.properties.fantasticElements = { type: Type.STRING, description: "One paragraph detailing magical or supernatural aspects." };
        if (includeStory) responseSchema.properties.futureStoryPotential = { type: Type.STRING, description: "Brief notes on potential story hooks." };

        await generate(basePrompt, finalUserInput, { responseMimeType: "application/json", responseSchema });
    };

    const isAiDisabled = isLoading || disabled || properties.trim() !== '';

    return (
        <div className={componentStyles.card.base}>
            <h3 className="text-2xl font-bold text-amber-900">Define a New Resource</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label htmlFor="resourceName" className={componentStyles.form.label}>Resource Name</label>
                        <input type="text" id="resourceName" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Sunstone, Whisperwood" required className={componentStyles.input.base} />
                    </div>
                    <div className="relative">
                        <label htmlFor="resourceSymbol" className={componentStyles.form.label}>Symbol</label>
                        <button ref={triggerRef} type="button" id="resourceSymbol" onClick={() => setIsPickerOpen(!isPickerOpen)} className={cn(componentStyles.input.base, "text-center text-2xl")} aria-haspopup="true" aria-expanded={isPickerOpen}>{symbol}</button>
                        <EmojiPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onSelect={handleEmojiSelect} triggerRef={triggerRef} />
                    </div>
                </div>
                <div>
                    <label htmlFor="resourceType" className={componentStyles.form.label}>Resource Type</label>
                    <select id="resourceType" value={type} onChange={e => setType(e.target.value as Resource['type'])} className={componentStyles.input.base}>
                        <option value="mineral">Mineral</option>
                        <option value="flora">Flora</option>
                        <option value="fauna">Fauna</option>
                        <option value="magical">Magical</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="resourceProperties" className={componentStyles.form.label}>Properties & Uniqueness</label>
                    <textarea id="resourceProperties" value={properties} onChange={e => setProperties(e.target.value)} rows={5} placeholder="Describe what makes it special..." required className={componentStyles.input.base} />
                </div>

                <div className="flex gap-4 pt-4 border-t">
                    <button type="button" onClick={handleClear} className={cn(componentStyles.button.base, componentStyles.button.secondary, "w-1/3")}>Clear Form</button>
                    <button type="submit" disabled={disabled} className={cn(componentStyles.button.base, componentStyles.button.primary, "w-2/3")}>
                        {disabled ? 'Limit Reached' : 'Define Resource'}
                    </button>
                </div>

                <AIGenerationSection title="AI-Powered Generation">
                    <div className="space-y-2">
                        <div className="space-y-3">
                            <AIOptionsCheckbox id="mundane" label="Mundane Resource" description="Generate a non-magical resource." checked={isMundane} onChange={(e) => setIsMundane(e.target.checked)} />
                            <AIOptionsCheckbox id="causes" label="Causes & Consequences" description="Include potential origins and effects." checked={includeCauses} onChange={(e) => setIncludeCauses(e.target.checked)} />
                            <AIOptionsCheckbox id="fantastic" label="Fantastic Elements" description="Include magical properties or anomalies." checked={includeFantastic} onChange={(e) => setIncludeFantastic(e.target.checked)} disabled={isMundane} />
                            <AIOptionsCheckbox id="story" label="Future Story Potential" description="Include notes on settlements and conflicts." checked={includeStory} onChange={(e) => setIncludeStory(e.target.checked)} />
                        </div>
                    </div>
                    <div>
                        <AIContextInput
                            id="userInput"
                            label="Your Ideas (Optional)"
                            value={userInput}
                            onChange={setUserInput}
                            placeholder="e.g., 'a crystal that hums', or paste a UUID..."
                            elements={elements}
                            rows={2}
                            tooltip="Reference existing elements by copying their ID from the Element Manager and pasting it here. The AI will use them as context."
                        />
                    </div>
                    <button type="button" onClick={handleAIGenerate} disabled={isAiDisabled} className={cn(componentStyles.button.base, componentStyles.button.primary, "w-full bg-blue-600 hover:bg-blue-700")}>
                        {isLoading ? 'Generating...' : 'Generate with AI'}
                    </button>
                    {properties.trim() !== '' && !isLoading && (
                        <p className="text-xs text-center text-gray-500 mt-2">
                            AI generation is disabled to avoid overwriting your custom description. Clear the field to enable.
                        </p>
                    )}
                    {aiError && <p className="text-sm text-red-600 mt-2">{aiError}</p>}
                </AIGenerationSection>
            </form>
        </div>
    );
};

export default CustomResourceCreator;
