
import React, { useState, useRef, useEffect } from 'react';
import type { Location } from '../../../../types';
import EmojiPicker from '../../../shared/EmojiPicker';
import { Type } from "@google/genai";
import AIContextInput from '../../../shared/AIContextInput';
import { useAIGeneration } from '../../../../hooks/useAIGeneration';
import AIGenerationSection from '../../../shared/AIGenerationSection';
import { componentStyles } from '../../../../design/tokens';
import { cn } from '../../../../utils/cn';

interface CustomSiteCreatorProps {
    onCreate: (location: Omit<Location, 'id'>) => void;
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

const siteTypes = [
    'natural wonder', 'anomaly', 'ruin', 'lair', 'shrine', 'portal', 'settlement', 'landmark'
];

const getRandomSiteType = () => siteTypes[Math.floor(Math.random() * siteTypes.length)];

const CustomSiteCreator = ({ onCreate, disabled }: CustomSiteCreatorProps) => {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('📍');
    const [siteType, setSiteType] = useState<string>(getRandomSiteType);
    const [description, setDescription] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    // AI State
    const { elements, generate, result, isLoading, error, clear } = useAIGeneration();
    const [isMundane, setIsMundane] = useState(false);
    const [includeFantastic, setIncludeFantastic] = useState(true);
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
            setSymbol(parsedResult.symbol || '📍');
            setSiteType(parsedResult.siteType || 'landmark');
            setDescription(parsedResult.description);
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
        setSymbol('📍');
        setSiteType(getRandomSiteType());
        setDescription('');
        setUserInput('');
        clear();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) return;
        onCreate({ name, symbol, siteType, description });
        handleClear();
    };

    const handleEmojiSelect = (emoji: string) => {
        setSymbol(emoji);
    };

    const handleAIGenerate = async () => {
        clear();
        const landmassType = 'diverse area'; // Could be dynamic from MapData

        let basePrompt = `For a fantasy world region that is a "${landmassType}", create a unique special site or landmark.`;
        if (isMundane) {
            basePrompt += ` Keep it MUNDANE (natural or historical, not magical).`;
        } else if (includeFantastic) {
            basePrompt += ` Include magical or supernatural elements.`;
        }

        const partialData = { name: name.trim(), symbol, siteType };
        let finalUserInput = userInput;

        if (partialData.name || partialData.siteType) {
            let partialPrompt = 'The user has provided some details:\n';
            if (partialData.name) partialPrompt += `- Name: "${partialData.name}"\n`;
            if (partialData.siteType) partialPrompt += `- Type: "${partialData.siteType}"\n`;
            finalUserInput = `${partialPrompt}\nUser's Additional Ideas: ${userInput}`.trim();
        }

        const responseSchema: any = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "A unique name for the site." },
                symbol: { type: Type.STRING, description: "A single emoji character." },
                siteType: { type: Type.STRING, description: "The type of site.", enum: siteTypes },
                description: { type: Type.STRING, description: "A detailed description of the site and its significance." },
            },
            required: ['name', 'symbol', 'siteType', 'description']
        };

        await generate(basePrompt, finalUserInput, { responseMimeType: "application/json", responseSchema });
    };

    const isAiDisabled = isLoading || disabled || description.trim() !== '';

    return (
        <div className={componentStyles.card.base}>
            <h3 className="text-2xl font-bold text-amber-900">Define a Special Site</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label htmlFor="siteName" className={componentStyles.form.label}>Site Name</label>
                        <input type="text" id="siteName" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., The Whispering Cave" required className={componentStyles.input.base} />
                    </div>
                    <div className="relative">
                        <label htmlFor="siteSymbol" className={componentStyles.form.label}>Symbol</label>
                        <button ref={triggerRef} type="button" id="siteSymbol" onClick={() => setIsPickerOpen(!isPickerOpen)} className={cn(componentStyles.input.base, "text-center text-2xl")} aria-haspopup="true" aria-expanded={isPickerOpen}>{symbol}</button>
                        <EmojiPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onSelect={handleEmojiSelect} triggerRef={triggerRef} />
                    </div>
                </div>
                <div>
                    <label htmlFor="siteType" className={componentStyles.form.label}>Site Type</label>
                    <select id="siteType" value={siteType} onChange={e => setSiteType(e.target.value)} className={componentStyles.input.base}>
                        {siteTypes.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="siteDescription" className={componentStyles.form.label}>Description & Significance</label>
                    <textarea id="siteDescription" value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Describe the site..." required className={componentStyles.input.base} />
                </div>

                <div className="flex gap-4 pt-4 border-t">
                    <button type="button" onClick={handleClear} className={cn(componentStyles.button.base, componentStyles.button.secondary, "w-1/3")}>Clear Form</button>
                    <button type="submit" disabled={disabled} className={cn(componentStyles.button.base, componentStyles.button.primary, "w-2/3")}>
                        {disabled ? 'Limit Reached' : 'Define Site'}
                    </button>
                </div>

                <AIGenerationSection title="AI-Powered Generation">
                    <div className="space-y-2">
                        <AIOptionsCheckbox id="mundane-site" label="Mundane Site" description="Natural or historical only." checked={isMundane} onChange={(e) => setIsMundane(e.target.checked)} />
                        <AIOptionsCheckbox id="fantastic-site" label="Fantastic Elements" description="Include magic/anomalies." checked={includeFantastic} onChange={(e) => setIncludeFantastic(e.target.checked)} disabled={isMundane} />
                    </div>
                    <div>
                        <AIContextInput
                            id="siteUserInput"
                            label="Your Ideas (Optional)"
                            value={userInput}
                            onChange={setUserInput}
                            placeholder="e.g., 'a bridge made of glass'"
                            elements={elements}
                            rows={2}
                            tooltip="Reference existing elements..."
                        />
                    </div>
                    <button type="button" onClick={handleAIGenerate} disabled={isAiDisabled} className={cn(componentStyles.button.base, componentStyles.button.primary, "w-full bg-blue-600 hover:bg-blue-700")}>
                        {isLoading ? 'Generating...' : 'Generate with AI'}
                    </button>
                    {description.trim() !== '' && !isLoading && (
                        <p className="text-xs text-center text-gray-500 mt-2">
                            AI generation is disabled to avoid overwriting your custom description.
                        </p>
                    )}
                    {aiError && <p className="text-sm text-red-600 mt-2">{aiError}</p>}
                </AIGenerationSection>
            </form>
        </div>
    );
};

export default CustomSiteCreator;
