import React, { useState, useRef, useEffect } from 'react';
import type { ElementFormProps, Faction } from '../../../types';
import EmojiPicker from '../EmojiPicker';
import AIGenerationSection from '../AIGenerationSection';

const races = [ "Demonkind", "Seafolk", "Smallfolk", "Reptilian", "Dwarves", "Humans", "Elves", "Greenskins", "Animalfolk", "Giantkind", "Player's Choice" ];
const factionSymbols = [ "Flame", "Horse", "Boar", "Lion", "Dragon", "Hydra", "Lightning Bolt", "Bird", "Mountain", "Sun", "Moon", "Leaf", "Tree", "Claw", "Spider", "Grain", "Bow", "Horseshoe", "Harp", "Fish", "Anvil", "Wolf", "Wings", "Skull", "Axe", "Diamond", "Flower", "Apple", "Cup", "Spade", "Sword", "Beholder", "Scorpion", "Crab", "Unicorn", "Star" ];

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
        const title = lines.shift()?.trim();
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

export const FactionForm = ({ data, onDataChange, isReadOnly }: ElementFormProps<Faction>) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 disabled:bg-gray-100 bg-white text-gray-900";

    const [prosperityFields, setProsperityFields] = useState<Record<string, string>>({});

    useEffect(() => {
        setProsperityFields(parseIndustryDescription(data.industryDescription));
    }, [data.industryDescription]);

    const handleProsperityChange = (field: string, value: string) => {
        const newFields = { ...prosperityFields, [field]: value };
        setProsperityFields(newFields);
        onDataChange({ industryDescription: combineIndustryDescription(newFields) });
    };

    const handleIndustryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onDataChange({ industry: e.target.value });
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Race</label>
                    <select value={data.race} onChange={e => onDataChange({ race: e.target.value })} disabled={isReadOnly} className={inputClasses}>
                        {races.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input type="text" value={data.color} onChange={e => onDataChange({ color: e.target.value })} disabled={isReadOnly} className={inputClasses} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symbol Name</label>
                    <select value={data.symbolName} onChange={e => onDataChange({ symbolName: e.target.value })} disabled={isReadOnly} className={inputClasses}>
                        {factionSymbols.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Map Emoji</label>
                    <button ref={triggerRef} type="button" onClick={() => !isReadOnly && setIsPickerOpen(!isPickerOpen)} className={`w-full py-2 border border-gray-300 rounded-md shadow-sm text-2xl ${inputClasses}`} disabled={isReadOnly}>{data.emoji}</button>
                    <EmojiPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onSelect={(emoji) => onDataChange({ emoji: emoji })} triggerRef={triggerRef} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Leader</label>
                    <input type="text" value={data.leaderName} onChange={e => onDataChange({ leaderName: e.target.value })} disabled={isReadOnly} className={inputClasses} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capital City</label>
                    <input type="text" value={data.capitalName} onChange={e => onDataChange({ capitalName: e.target.value })} disabled={isReadOnly} className={inputClasses} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <textarea value={data.theme} onChange={(e) => onDataChange({ theme: e.target.value })} rows={2} className={inputClasses} required disabled={isReadOnly} />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={data.description} onChange={(e) => onDataChange({ description: e.target.value })} rows={3} className={inputClasses} required disabled={isReadOnly} />
            </div>
            
            <details className="group pt-4 border-t" open={!!data.industry}>
                <summary className="text-lg font-bold text-amber-900 cursor-pointer list-none flex justify-between items-center">
                    Prosperity / Industry
                    <span className="text-sm text-gray-500 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="mt-4 space-y-4 pt-4 border-t">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Industry Name</label>
                        <input type="text" value={data.industry || ''} onChange={handleIndustryNameChange} disabled={isReadOnly} className={inputClasses} />
                    </div>
                    {prosperityFieldsOrder.map(fieldKey => (
                         <div key={fieldKey}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{prosperityFieldTitles[fieldKey]}</label>
                            <textarea value={prosperityFields[fieldKey] || ''} onChange={e => handleProsperityChange(fieldKey, e.target.value)} rows={3} className={`${inputClasses} resize-y`} disabled={isReadOnly} />
                        </div>
                    ))}
                </div>
            </details>
        </>
    );
};