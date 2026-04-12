import React, { useState, useEffect, useMemo } from 'react';
import type { Player, ElementCard, Faction } from '../../../types';
import { useAI } from '../../../contexts/AIContext';
import { Type } from "@google/genai";
import AIContextInput from '../../shared/AIContextInput';
import AIGenerationSection from '../../shared/AIGenerationSection';
import MarkdownRenderer from '../../shared/MarkdownRenderer';

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

    const { result, isLoading, error, generate, clear, elements: aiElements } = useAI();
    const isComplete = !!(primeFaction?.data as Faction)?.industry;
    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 bg-white text-gray-900 resize-y";


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
                    <button onClick={handleStartEditing} className="btn btn-secondary bg-blue-100 text-blue-800 hover:bg-blue-200">
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
                    <label htmlFor="industry-select" className="block text-sm font-medium text-gray-700">Select Industry (Rule 4.3)</label>
                    <select id="industry-select" value={selectedIndustry} onChange={e => setSelectedIndustry(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-amber-500">
                        {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                </div>
                
                <div>
                    <label htmlFor="prod-methods" className="block text-sm font-medium text-gray-700">{prosperityFieldTitles.productionMethods}</label>
                    <textarea id="prod-methods" value={productionMethods} onChange={e => setProductionMethods(e.target.value)} rows={3} required placeholder="What makes your approach unique?" className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="settlement-integ" className="block text-sm font-medium text-gray-700">{prosperityFieldTitles.settlementIntegration}</label>
                    <textarea id="settlement-integ" value={settlementIntegration} onChange={e => setSettlementIntegration(e.target.value)} rows={3} required placeholder="How does each major settlement contribute?" className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="cultural-integ" className="block text-sm font-medium text-gray-700">{prosperityFieldTitles.culturalIntegration}</label>
                    <textarea id="cultural-integ" value={culturalIntegration} onChange={e => setCulturalIntegration(e.target.value)} rows={3} required placeholder="How does this industry reflect your faction's values?" className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="trade-app" className="block text-sm font-medium text-gray-700">{prosperityFieldTitles.tradeApplications}</label>
                    <textarea id="trade-app" value={tradeApplications} onChange={e => setTradeApplications(e.target.value)} rows={3} required placeholder="Who are your main customers? What do you trade for?" className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="knowledge-mgmt" className="block text-sm font-medium text-gray-700">{prosperityFieldTitles.knowledgeManagement}</label>
                    <textarea id="knowledge-mgmt" value={knowledgeManagement} onChange={e => setKnowledgeManagement(e.target.value)} rows={3} required placeholder="How is expertise passed down? Where is training conducted?" className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="masters" className="block text-sm font-medium text-gray-700">{prosperityFieldTitles.masterPractitioners}</label>
                    <input id="masters" value={masterPractitioners} onChange={e => setMasterPractitioners(e.target.value)} required placeholder="Name key figures or guilds..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 bg-white text-gray-900" />
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
                    <button type="button" onClick={handleAIGenerate} disabled={isAiDisabled} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 shadow disabled:bg-gray-400">
                        {isLoading ? 'Generating...' : 'Generate Description'}
                    </button>
                    {isAiDisabled && !isLoading && <p className="text-xs text-center text-gray-500">Clear description fields to enable AI.</p>}
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                </AIGenerationSection>

                <div className="pt-4 border-t flex gap-4">
                    {isEditing && (
                        <button type="button" onClick={() => setIsEditing(false)} className="w-1/3 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                    )}
                     <button onClick={handleSave} disabled={!productionMethods.trim()} className="flex-grow bg-amber-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-700 shadow-lg disabled:bg-gray-400">
                        {isEditing ? 'Update Industry' : 'Save Industry to Faction'}
                     </button>
                </div>
            </div>
        </div>
    );
};

export default ProsperityDeveloper;