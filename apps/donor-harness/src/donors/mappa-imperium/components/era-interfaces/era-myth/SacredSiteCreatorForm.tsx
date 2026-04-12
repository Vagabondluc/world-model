import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAIGeneration } from '../../../hooks/useAIGeneration';
import { Type } from "@google/genai";
import type { ElementCard, Deity, Location } from '@mi/types';
import AIContextInput from '../../shared/AIContextInput';
import EmojiPicker from '../../shared/EmojiPicker';
import { SACRED_SITE_PROMPT_TEMPLATE } from '../../../data/ai-templates';
import AIGenerationSection from '../../shared/AIGenerationSection';


interface SacredSiteCreatorFormProps {
    pantheon: ElementCard[];
    playerSacredSites: ElementCard[];
    onCreate: (location: Omit<Location, 'id'>, year: number) => void;
    disabled: boolean;
}

const siteTypes = [
    'bottomless pit', 'lone mountain', 'hot spring', 'rock tower', 'small lake', 
    'ancient tree', 'cave', 'volcano', 'grove', 'henge', 'geyser'
];

const getRandomSiteType = () => siteTypes[Math.floor(Math.random() * siteTypes.length)];

const SacredSiteCreatorForm = ({ pantheon, playerSacredSites, onCreate, disabled }: SacredSiteCreatorFormProps) => {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('🏞️');
    const [description, setDescription] = useState('');
    const [selectedDeityId, setSelectedDeityId] = useState<string>('');
    const [siteType, setSiteType] = useState(getRandomSiteType);
    const [year, setYear] = useState<number | ''>(1);
    const [userInput, setUserInput] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const { elements, generate, result, isLoading, error, clear } = useAIGeneration();
    
    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 disabled:bg-gray-50 bg-white text-gray-900";


    const availableDeities = useMemo(() => {
        const assignedDeityIds = new Set(
            playerSacredSites.map(site => (site.data as Location).deityId)
        );
        return pantheon.filter(deity => !assignedDeityIds.has(deity.id));
    }, [pantheon, playerSacredSites]);

    useEffect(() => {
        const isSelectedDeityUnavailable = !availableDeities.some(d => d.id === selectedDeityId);
        if (availableDeities.length > 0 && (isSelectedDeityUnavailable || !selectedDeityId)) {
            setSelectedDeityId(availableDeities[0].id);
        } else if (availableDeities.length === 0) {
            setSelectedDeityId('');
        }
    }, [availableDeities, selectedDeityId]);

    useEffect(() => {
        if (result) {
            try {
                const parsed = JSON.parse(result);
                setName(parsed.name || '');
                setSymbol(parsed.symbol || '🏞️');
                setDescription(parsed.description || '');
                clear();
            } catch (e) {
                console.error("Failed to parse AI response for Sacred Site:", e);
            }
        }
    }, [result, clear]);

    const handleClear = () => {
        setName('');
        setSymbol('🏞️');
        setDescription('');
        setYear(1);
        setUserInput('');
        setSiteType(getRandomSiteType());
        clear();
    };

    const handleAIGenerate = () => {
        const selectedDeity = pantheon.find(d => d.id === selectedDeityId);
        if (!selectedDeity) return;

        const deityData = selectedDeity.data as Deity;
        clear();

        let finalUserInput = userInput;
        const partialData = { name: name.trim(), symbol };
        const hasPartialData = partialData.name || (partialData.symbol !== '🏞️');
        
        if (hasPartialData) {
            let partialPrompt = 'The user has provided the following starting points. Please expand on them: ';
            if (partialData.name) partialPrompt += `Name: "${partialData.name}". `;
            if (partialData.symbol !== '🏞️') partialPrompt += `Symbol: "${partialData.symbol}". `;
            finalUserInput = `${partialPrompt}\nUser's Additional Ideas: ${userInput}`.trim();
        }

        const basePrompt = SACRED_SITE_PROMPT_TEMPLATE
            .replace('{DEITY_NAME}', selectedDeity.name)
            .replace('{DEITY_DOMAIN}', deityData.domain)
            .replace('{SITE_TYPE}', siteType)
            .replace('{DEITY_DESCRIPTION}', deityData.description)
            .replace('{USER_IDEAS}', ''); 

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                symbol: { type: Type.STRING },
                description: { type: Type.STRING }
            },
            required: ['name', 'symbol', 'description']
        };

        generate(basePrompt, finalUserInput, { responseMimeType: "application/json", responseSchema });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !description.trim() || !selectedDeityId || year === '') return;
        onCreate({ name, symbol, description, siteType, deityId: selectedDeityId }, year as number);
        handleClear();
    };

    const isAiDisabled = isLoading || disabled || description.trim() !== '';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border space-y-4">
            <h3 className="text-2xl font-bold text-amber-900">Create a Sacred Site</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="deity-select" className="block text-sm font-medium text-gray-700">Associated Deity</label>
                        <select id="deity-select" value={selectedDeityId} onChange={e => setSelectedDeityId(e.target.value)} disabled={disabled || availableDeities.length === 0} className={inputClasses}>
                            {availableDeities.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sitetype-select" className="block text-sm font-medium text-gray-700">Site Type (rule 2.5)</label>
                        <select id="sitetype-select" value={siteType} onChange={e => setSiteType(e.target.value)} disabled={disabled} className={`${inputClasses} capitalize`}>
                            {siteTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">Site Name</label>
                        <input type="text" id="siteName" value={name} onChange={e => setName(e.target.value)} required className={inputClasses} disabled={disabled} />
                    </div>
                     <div>
                        <label htmlFor="siteYear" className="block text-sm font-medium text-gray-700">Year</label>
                        <input type="number" id="siteYear" value={year} onChange={e => setYear(e.target.value === '' ? '' : parseInt(e.target.value, 10))} min="1" max="30" required className={inputClasses} />
                    </div>
                </div>
                 <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">Map Symbol</label>
                    <button ref={triggerRef} type="button" onClick={() => !disabled && setIsPickerOpen(!isPickerOpen)} className="mt-1 w-full py-2 border border-gray-300 rounded-md shadow-sm text-2xl bg-white disabled:bg-gray-100 disabled:cursor-not-allowed" disabled={disabled}>{symbol}</button>
                    <EmojiPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onSelect={setSymbol} triggerRef={triggerRef} />
                </div>
                <div>
                    <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="siteDescription" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className={inputClasses} disabled={disabled}></textarea>
                </div>
                
                <div className="flex gap-4 pt-4 border-t">
                    <button type="button" onClick={handleClear} className="w-1/3 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Clear Form</button>
                    <button type="submit" disabled={disabled} className="w-2/3 bg-amber-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-700 transition-all shadow-lg disabled:bg-gray-400">
                        {disabled ? 'All Sites Placed' : 'Save Sacred Site'}
                    </button>
                </div>

                <AIGenerationSection title="AI-Powered Generation">
                    <AIContextInput
                        id="site-user-input"
                        label="Your Ideas for AI (Optional)"
                        value={userInput}
                        onChange={setUserInput}
                        placeholder="e.g., 'a tree that weeps silver sap'"
                        elements={elements}
                        rows={2}
                        disabled={disabled}
                        tooltip="Reference existing elements by copying their ID from the Element Manager and pasting it here. The AI will use them as context."
                    />
                    <button type="button" onClick={handleAIGenerate} disabled={isAiDisabled} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all shadow disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Generating...</> : 'Populate with AI'}
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

export default SacredSiteCreatorForm;
