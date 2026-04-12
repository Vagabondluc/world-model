
import React, { useState, useEffect, useRef } from 'react';
import type { Faction, Player } from '../../../types';
import { useAIGeneration } from '../../../hooks/useAIGeneration';
import AIContextInput from '../../shared/AIContextInput';
import { Type } from "@google/genai";
import EmojiPicker from '../../shared/EmojiPicker';
import AIGenerationSection from '../../shared/AIGenerationSection';
import { componentStyles } from '../../../design/tokens';
import { cn } from '../../../utils/cn';

interface FactionFormProps {
    onCreate: (factionData: Omit<Faction, 'id'|'capitalName'> & {capitalName?: string}) => void;
    isNeighbor: boolean;
    currentPlayer: Player;
    initialData?: Partial<Faction>;
}

const FactionForm = ({ onCreate, isNeighbor, currentPlayer, initialData = {} }: FactionFormProps) => {
    const [name, setName] = useState('');
    const [race, setRace] = useState(initialData.race || '');
    const [symbolName, setSymbolName] = useState(initialData.symbolName || '');
    const [emoji, setEmoji] = useState('🛡️');
    const [color, setColor] = useState(initialData.color || '');
    const [theme, setTheme] = useState('');
    const [description, setDescription] = useState('');
    const [leaderName, setLeaderName] = useState('');
    const [capitalName, setCapitalName] = useState('');
    const [userInput, setUserInput] = useState('');
    
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const { elements, generate, result, isLoading, error, clear } = useAIGeneration();

     useEffect(() => {
        setRace(initialData.race || '');
        setSymbolName(initialData.symbolName || '');
        setColor(initialData.color || '');
    }, [initialData]);

    useEffect(() => {
        if (result) {
            try {
                const parsed = JSON.parse(result);
                if(parsed.factionName) setName(parsed.factionName);
                if(parsed.race) setRace(parsed.race); // Update race with AI's specific suggestion
                if (parsed.theme) setTheme(parsed.theme);
                if (parsed.description) setDescription(parsed.description);

                if (!isNeighbor) {
                    if (parsed.leaderName) setLeaderName(parsed.leaderName);
                    if (parsed.capitalName) setCapitalName(parsed.capitalName);
                }
                
                const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
                if (parsed.emoji && typeof parsed.emoji === 'string' && emojiRegex.test(parsed.emoji)) {
                    const match = parsed.emoji.match(emojiRegex);
                    setEmoji(match ? match[0] : '🛡️');
                } else {
                    setEmoji('🛡️');
                }

                clear();
            } catch (e) {
                console.error("Failed to parse AI response for Faction:", e);
            }
        }
    }, [result, clear, isNeighbor]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate({ name, race, symbolName, emoji, color, theme, description, leaderName, isNeighbor, capitalName });
    };
    
    const handleClearForm = () => {
        setName('');
        setRace(initialData.race || ''); // Reset to initial roll
        setSymbolName(initialData.symbolName || '');
        setColor(initialData.color || '');
        setTheme('');
        setDescription('');
        setLeaderName('');
        setCapitalName('');
        setUserInput('');
        setEmoji('🛡️');
        clear();
    };

    const handleAIGenerate = () => {
        clear();
        let prompt = `Based on the Mappa Imperium rules, generate content for a faction. The faction's core elements are based on these rolled results:
- Ancestry Category: "${initialData.race}"
- Symbol: "${initialData.symbolName}"
- Color: "${initialData.color}"

Your task is to:
1.  Generate a *specific* race that fits within the given Ancestry Category (e.g., if Ancestry is "Greenskins", you could generate "Orcs" or "Goblins").
2.  Using all the rolled elements as creative constraints, generate the remaining details for the faction.

Respond with a single JSON object.`;
        
        const responseSchema: any = {
            type: Type.OBJECT,
            properties: {
                factionName: { type: Type.STRING, description: "A creative name for the faction." },
                race: { type: Type.STRING, description: "A specific race for the faction, consistent with the rolled ancestry category." },
                theme: { type: Type.STRING, description: "A short, punchy phrase for the faction's theme." },
                description: { type: Type.STRING, description: "A 2-3 sentence description of the faction's culture, values, and general outlook." },
                emoji: { type: Type.STRING, description: "A single emoji character for the faction's map symbol." },
            },
            required: ['factionName', 'race', 'theme', 'description', 'emoji']
        };

        if (!isNeighbor) {
            responseSchema.properties.leaderName = { type: Type.STRING, description: "A fantasy name for the faction's first leader." };
            responseSchema.properties.capitalName = { type: Type.STRING, description: "A thematic name for their capital city." };
            responseSchema.required.push('leaderName', 'capitalName');
        }

        generate(prompt, userInput, { responseMimeType: "application/json", responseSchema });
    };

    const isAiDisabled = isLoading || name.trim() !== '' || theme.trim() !== '' || description.trim() !== '' || (!isNeighbor && (leaderName.trim() !== '' || capitalName.trim() !== ''));

    return (
        <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={componentStyles.form.label}>Race (from roll: {initialData.race})</label>
                    <input type="text" value={race} onChange={e => setRace(e.target.value)} required placeholder="e.g., Orcs, Goblins" className={componentStyles.input.base} />
                </div>
                 <div>
                    <label className={componentStyles.form.label}>Symbol</label>
                    <input type="text" value={symbolName} onChange={e => setSymbolName(e.target.value)} required className={componentStyles.input.base} disabled />
                </div>
                 <div>
                    <label className={componentStyles.form.label}>Color</label>
                    <input type="text" value={color} onChange={e => setColor(e.target.value)} required className={componentStyles.input.base} disabled />
                </div>
                <div>
                    <label htmlFor="faction-name" className={componentStyles.form.label}>Faction Name</label>
                    <input type="text" id="faction-name" value={name} onChange={e => setName(e.target.value)} required className={componentStyles.input.base} />
                </div>
            </div>
            {!isNeighbor && (
                <div>
                    <label htmlFor="capital-name" className={componentStyles.form.label}>Capital Name (Rule 3.1)</label>
                    <input type="text" id="capital-name" value={capitalName} onChange={e => setCapitalName(e.target.value)} required placeholder="e.g., Ironhold, Glimmerwood" className={componentStyles.input.base} />
                </div>
            )}
            <div className="relative">
                <label htmlFor="faction-emoji" className={componentStyles.form.label}>Map Emoji</label>
                <button ref={triggerRef} type="button" id="faction-emoji" onClick={() => setIsPickerOpen(!isPickerOpen)} className={cn(componentStyles.input.base, "text-center text-2xl")} aria-haspopup="true" aria-expanded={isPickerOpen}>{emoji}</button>
                <EmojiPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onSelect={setEmoji} triggerRef={triggerRef} />
            </div>
            <div>
                <label htmlFor="faction-theme" className={componentStyles.form.label}>Theme</label>
                <input type="text" id="faction-theme" value={theme} onChange={e => setTheme(e.target.value)} required placeholder="e.g., Nomadic horse-riders, secretive forest-dwellers" className={componentStyles.input.base} />
            </div>
            <div>
                <label htmlFor="faction-description" className={componentStyles.form.label}>Description</label>
                <textarea id="faction-description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} placeholder="A short paragraph about the faction's culture, values, or general outlook." className={componentStyles.input.base} />
            </div>
            {!isNeighbor && (
                <div>
                    <label htmlFor="faction-leader" className={componentStyles.form.label}>First Leader</label>
                    <input type="text" id="faction-leader" value={leaderName} onChange={e => setLeaderName(e.target.value)} required placeholder="Name a hero to lead your people" className={componentStyles.input.base} />
                </div>
            )}
            
            <div className="flex gap-4 pt-4 border-t">
                <button type="button" onClick={handleClearForm} className={cn(componentStyles.button.base, componentStyles.button.secondary, "w-1/3")}>Clear Form</button>
                <button type="submit" className={cn(componentStyles.button.base, componentStyles.button.primary, "w-2/3")}>
                    Create {isNeighbor ? 'Neighbor' : 'Prime Faction'}
                </button>
            </div>

            <AIGenerationSection title="AI-Powered Generation">
                <AIContextInput
                    id="faction-ai-input"
                    label="Your Ideas (Optional)"
                    value={userInput}
                    onChange={setUserInput}
                    placeholder="e.g., 'a society built around honor and fire magic...'"
                    elements={elements}
                    rows={2}
                    tooltip="Reference existing elements by copying their ID from the Element Manager and pasting it here. The AI will use them as context."
                />
                <button type="button" onClick={handleAIGenerate} disabled={isAiDisabled} className={cn(componentStyles.button.base, componentStyles.button.primary, "w-full bg-blue-600 hover:bg-blue-700")}>
                    {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Generating...</> : 'Generate Details'}
                </button>
                    {isAiDisabled && !isLoading && (
                    <p className="text-xs text-center text-gray-500 mt-2">
                        Clear the main text fields (Name, Theme, Description, etc.) to enable AI generation.
                    </p>
                )}
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </AIGenerationSection>
        </form>
    );
};

export default FactionForm;
