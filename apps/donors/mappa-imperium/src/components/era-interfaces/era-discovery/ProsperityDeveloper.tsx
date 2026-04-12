
import React, { useState, useEffect, useMemo } from 'react';
import type { Player, ElementCard, Faction } from '../../types';
import { useAIGeneration } from '../../../hooks/useAIGeneration';
import { Type } from "@google/genai";
import AIContextInput from '../../shared/AIContextInput';
import AIGenerationSection from '../../shared/AIGenerationSection';
import MarkdownRenderer from '../../shared/MarkdownRenderer';
import { componentStyles } from '../../../design/tokens';
import { cn } from '../../../utils/cn';

interface ProsperityDeveloperProps {
    currentPlayer: Player;
    elements: ElementCard[];
    onUpdateElement: (element: ElementCard) => void;
}

const industries = [ 'Music', 'Alchemy or brew', 'Artistic Trinkets', 'Mining', 'Explorers', 'Seafarers', 'Fine Carpentry', 'Type of weaponry', 'Metal Industry', 'Type of Food', 'Fighting style', 'Beast Raising', 'Magic Training', 'Trade', 'Horsemanship', 'Metal Work' ];
const getRandomIndustry = () => industries[Math.floor(Math.random() * industries.length)];

const prosperityFieldsOrder = ['productionMethods', 'settlementIntegration', 'culturalIntegration', 'tradeApplications', 'knowledgeManagement', 'masterPractitioners'];
const prosperityFieldTitles: Record<string, string> = {
    productionMethods: 'Production Methods',
    settlementIntegration: 'Settlement Integration',
    culturalIntegration: 'Cultural Integration',
    tradeApplications: 'Trade & Relations',
    knowledgeManagement: 'Knowledge Management',
    masterPractitioners: 'Master Practitioners'
};


const parseIndustryDescription = (desc: string | undefined): Record<string, string> => {
    const fields: Record<string, string> = {};
    if (!desc) return fields;

    const parts = desc.split("\n\n**");
    parts.forEach(part => {
        const lines = part.replace(/\*\*/g, '').split('\n');
        const titleWithColon = lines.shift()?.trim();
        const title = titleWithColon?.endsWith(':') ? titleWithColon.slice(0, -1) : titleWithColon;
        const content = lines.join('\n').trim();

        for (const [key, value] of Object.entries(prosperityFieldTitles)) {
            if (value === title) {
                fields[key] = content;
                break;
            }
        }
    });
    return fields;
};

const combineIndustryDescription = (fields: Record<string, string>): string => {
    return prosperityFieldsOrder
        .map(key => fields[key] ? `**${prosperityFieldTitles[key]}**\n${fields[key]}` : '')
        .filter(Boolean)
        .join('\n\n');
};


const ProsperityDeveloper = ({ currentPlayer, elements, onUpdateElement }: ProsperityDeveloperProps) => {
    const primeFaction = useMemo(() => elements.find(el => el.owner === currentPlayer.playerNumber && el.type === 'Faction' && !(el.data as Faction).isNeighbor), [elements, currentPlayer]);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState(primeFaction && (primeFaction.data as Faction).industry ? (primeFaction.data as Faction).industry : getRandomIndustry());
    const [productionMethods, setProductionMethods] = useState('');
    const [settlementIntegration, setSettlementIntegration] = useState('');
    const [culturalIntegration, setCulturalIntegration] = useState('');
    const [tradeApplications, setTradeApplications] = useState('');
    const [knowledgeManagement, setKnowledgeManagement] = useState('');
    const [masterPractitioners, setMasterPractitioners] = useState('');
    const [userInput, setUserInput] = useState('');

    const { result, isLoading, error, generate, clear, elements: aiElements } = useAIGeneration();
    const isComplete = !!(primeFaction?.data as Faction)?.industry;
    const inputClasses = componentStyles.input.base + " resize-y";


    useEffect(() => {
        if (result) {
            try {
                const parsed = JSON.parse(result);
                setProductionMethods(parsed.productionMethods || '');
                setSettlementIntegration(parsed.settlementIntegration || '');
                setCulturalIntegration(parsed.culturalIntegration || '');
                setTradeApplications(parsed.tradeApplications || '');
                setKnowledgeManagement(parsed.knowledgeManagement || '');
                setMasterPractitioners(parsed.masterPractitioners || '');
                clear();
            } catch(e) { console.error("Failed to parse AI response for Prosperity:", e); }
        }
    }, [result, clear]);

    const handleStartEditing = () => {
        if (!primeFaction) return;
        const factionData = primeFaction.data as Faction;
        const parsed = parseIndustryDescription(factionData.industryDescription);
        setSelectedIndustry(factionData.industry || getRandomIndustry());
        setProductionMethods(parsed.productionMethods || '');
        setSettlementIntegration(parsed.settlementIntegration || '');
        setCulturalIntegration(parsed.culturalIntegration || '');
        setTradeApplications(parsed.tradeApplications || '');
        setKnowledgeManagement(parsed.knowledgeManagement || '');
        setMasterPractitioners(parsed.masterPractitioners || '');
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!primeFaction) return;

        const combinedDescription = combineIndustryDescription({
            productionMethods, settlementIntegration, culturalIntegration, tradeApplications, knowledgeManagement, masterPractitioners
        });

        const updatedFaction: Faction = {
            ...(primeFaction.data as Faction),
            industry: selectedIndustry,
            industryDescription: combinedDescription
        };
        onUpdateElement({ ...primeFaction, data: updatedFaction });
        setIsEditing(false);
    };

    const handleAIGenerate = () => {
        if (!primeFaction) return;
        const factionData = primeFaction.data as Faction;
        const prompt = `Based on Mappa Imperium rules (4.3 Prosperity), describe how the '${factionData.name}' faction integrates its new specialty: '${selectedIndustry}'. Consider their race (${factionData.race}), theme (${factionData.theme}), and geography. Generate a JSON object with fields: 'productionMethods', 'settlementIntegration', 'culturalIntegration', 'tradeApplications', 'knowledgeManagement', and 'masterPractitioners'. Each field should be a descriptive paragraph.`;
        
        const responseSchema = { 
            type: Type.OBJECT, 
            properties: { 
                productionMethods: { type: Type.STRING },
                settlementIntegration: { type: Type.STRING },
                culturalIntegration: { type: Type.STRING },
                tradeApplications: { type: Type.STRING },
                knowledgeManagement: { type: Type.STRING },
                masterPractitioners: { type: Type.STRING, description: "A sentence naming one or two key figures or guilds." }
            }, 
            required: ['productionMethods', 'settlementIntegration', 'culturalIntegration', 'tradeApplications', 'knowledgeManagement', 'masterPractitioners']
        };
        generate(prompt, userInput, { responseMimeType: 'application/json', responseSchema });
    };

    if (!primeFaction) {
        return <div className="p-8 text-center bg-red-50 text-red-800 rounded-lg">Error: Prime Faction not found for current player. Please complete Era III.</div>;
    }

    if (isComplete && !isEditing) {
        const factionData = primeFaction.data as Faction;
        return (
            <div className="space-y-4">
                 <header className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-amber-800">4.3 Faction Prosperity</h2>
                        <p className="mt-2 text-lg text-gray-600">Your faction has established its unique economic and cultural cornerstone.</p>
                    </div>
                    <button onClick={handleStartEditing} className={cn(componentStyles.button.base, componentStyles.button.secondary, "bg-blue-100 text-blue-800 hover:bg-blue-200")}>
                        Edit
                    </button>
                </header>
                <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                    <h3 className="text-xl font-bold text-green-800">Prosperity Defined: {factionData.industry}</h3>
                    <div className="mt-2 text-green-700">
                        <MarkdownRenderer content={factionData.industryDescription || ''} />
                    </div>
                </div>
            </div>
        );
    }

    const isAiDisabled = isLoading || productionMethods.trim() !== '' || settlementIntegration.trim() !== '';

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-amber-800">4.3 Faction Prosperity</h2>
                <p className="mt-2 text-lg text-gray-600">Define the unique good, service, or profession that distinguishes your empire from its neighbors.</p>
            </header>

            <div className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
                <div>
                    <label htmlFor="industry-select" className={componentStyles.form.label}>Select Industry (Rule 4.3)</label>
                    <select id="industry-select" value={selectedIndustry} onChange={e => setSelectedIndustry(e.target.value)} className={componentStyles.input.base}>
                        {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                </div>
                
                <div>
                    <label htmlFor="prod-methods" className={componentStyles.form.label}>{prosperityFieldTitles.productionMethods}</label>
                    <textarea id="prod-methods" value={productionMethods} onChange={e => setProductionMethods(e.target.value)} rows={3} required placeholder="What makes your approach unique?" className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="settlement-integ" className={componentStyles.form.label}>{prosperityFieldTitles.settlementIntegration}</label>
                    <textarea id="settlement-integ" value={settlementIntegration} onChange={e => setSettlementIntegration(e.target.value)} rows={3} required placeholder="How does each major settlement contribute?" className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="cultural-integ" className={componentStyles.form.label}>{prosperityFieldTitles.culturalIntegration}</label>
                    <textarea id="cultural-integ" value={culturalIntegration} onChange={e => setCulturalIntegration(e.target.value)} rows={3} required placeholder="How does this industry reflect your faction's values?" className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="trade-app" className={componentStyles.form.label}>{prosperityFieldTitles.tradeApplications}</label>
                    <textarea id="trade-app" value={tradeApplications} onChange={e => setTradeApplications(e.target.value)} rows={3} required placeholder="Who are your main customers? What do you trade for?" className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="knowledge-mgmt" className={componentStyles.form.label}>{prosperityFieldTitles.knowledgeManagement}</label>
                    <textarea id="knowledge-mgmt" value={knowledgeManagement} onChange={e => setKnowledgeManagement(e.target.value)} rows={3} required placeholder="How is expertise passed down? Where is training conducted?" className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="masters" className={componentStyles.form.label}>{prosperityFieldTitles.masterPractitioners}</label>
                    <input id="masters" value={masterPractitioners} onChange={e => setMasterPractitioners(e.target.value)} required placeholder="Name key figures or guilds..." className={componentStyles.input.base} />
                </div>
                
                <AIGenerationSection title="AI-Powered Generation">
                    <AIContextInput
                        id="industry-ai"
                        label="Your Ideas (Optional)"
                        value={userInput}
                        onChange={setUserInput}
                        elements={aiElements}
                        rows={2}
                        tooltip="Reference existing elements by copying their ID from the Element Manager and pasting it here. The AI will use them as context."
                    />
                    <button type="button" onClick={handleAIGenerate} disabled={isAiDisabled} className={cn(componentStyles.button.base, componentStyles.button.primary, "w-full bg-blue-600 hover:bg-blue-700")}>
                        {isLoading ? 'Generating...' : 'Generate Description'}
                    </button>
                    {isAiDisabled && !isLoading && <p className="text-xs text-center text-gray-500">Clear description fields to enable AI.</p>}
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                </AIGenerationSection>

                <div className="pt-4 border-t flex gap-4">
                    {isEditing && (
                        <button type="button" onClick={() => setIsEditing(false)} className={cn(componentStyles.button.base, componentStyles.button.secondary, "w-1/3")}>Cancel</button>
                    )}
                     <button onClick={handleSave} disabled={!productionMethods.trim()} className={cn(componentStyles.button.base, componentStyles.button.primary, "flex-grow")}>
                        {isEditing ? 'Update Industry' : 'Save Industry to Faction'}
                     </button>
                </div>
            </div>
        </div>
    );
};

export default ProsperityDeveloper;
