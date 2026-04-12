
import React, { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useAIGeneration } from '../../hooks/useAIGeneration';
import type { Player, AIPersonality } from '../../types';
import { Type } from "@google/genai";
import AIGenerationSection from '../shared/AIGenerationSection';
import AIContextInput from '../shared/AIContextInput';
import { aiProfileTemplates } from '../../data/aiProfiles';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';

interface PersonalitySliderProps {
    label: string;
    value: number;
    description: string;
    onChange: (value: number) => void;
}

const PersonalitySlider = ({ label, value, description, onChange }: PersonalitySliderProps) => (
    <div>
        <label className={cn(componentStyles.form.label, "flex justify-between")}>
            <span>{label}</span>
            <span className="font-bold text-amber-700">{value}</span>
        </label>
        <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className={componentStyles.input.range}
            title={description}
        />
        <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
);

const AiPlayerSetup = () => {
    const { gameSettings, configureAiPlayers, backToSetup, elements: gameElements } = useGameStore();
    const { generate, result, isLoading, error, clear } = useAIGeneration();
    
    const [aiPlayers, setAiPlayers] = useState<Player[]>([]);
    const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
    const [generatingForPlayer, setGeneratingForPlayer] = useState<number | null>(null);
    const [generationInputs, setGenerationInputs] = useState<Record<number, string>>({});

    useEffect(() => {
        if (!gameSettings) return;
        const initialAiPlayers = Array.from({ length: gameSettings.aiPlayers }, (_, i) => {
            const playerNumber = gameSettings.players + i + 1;
            return {
                playerNumber: playerNumber,
                name: ``, // Start with empty name
                isOnline: true,
                isAi: true,
                playStyle: 'Standard' as Player['playStyle'],
                aiPersonality: {
                    openness: Math.floor(Math.random() * 101),
                    conscientiousness: Math.floor(Math.random() * 101),
                    extraversion: Math.floor(Math.random() * 101),
                    agreeableness: Math.floor(Math.random() * 101),
                    neuroticism: Math.floor(Math.random() * 101),
                    persona: 'A flexible AI ready to adopt any role based on its core traits.',
                    biography: 'A newly formed consciousness, its personality yet unwritten, ready to shape and be shaped by the nascent world.',
                },
            };
        });
        setAiPlayers(initialAiPlayers);
    }, [gameSettings?.aiPlayers, gameSettings?.players]);
    
     useEffect(() => {
        if (result && generatingForPlayer !== null) {
            try {
                const parsed = JSON.parse(result);
                if (parsed.name && parsed.persona && parsed.biography) {
                    const playerIndex = aiPlayers.findIndex(p => p.playerNumber === generatingForPlayer);
                    if (playerIndex !== -1) {
                        setAiPlayers(prev => {
                            const updatedPlayers = [...prev];
                            updatedPlayers[playerIndex] = {
                                ...updatedPlayers[playerIndex],
                                name: parsed.name,
                                aiPersonality: {
                                    ...updatedPlayers[playerIndex].aiPersonality!,
                                    persona: parsed.persona,
                                    biography: parsed.biography
                                }
                            };
                            return updatedPlayers;
                        });
                    }
                }
            } catch (e) {
                console.error("Failed to parse AI response for AI Player setup:", e);
            }
            setGeneratingForPlayer(null);
            clear();
        }
    }, [result, clear, aiPlayers, generatingForPlayer]);


    const isConfigurationComplete = useMemo(() => {
        return aiPlayers.every(player => player.name.trim() !== '');
    }, [aiPlayers]);

    const handlePersonalityChange = (index: number, newPersonality: Partial<AIPersonality>) => {
        setAiPlayers(prev => {
            const newPlayers = [...prev];
            newPlayers[index].aiPersonality = { ...newPlayers[index].aiPersonality!, ...newPersonality };
            return newPlayers;
        });
    };

    const handlePlayerPropertyChange = (index: number, newProps: Partial<Player>) => {
        setAiPlayers(prev => {
            const newPlayers = [...prev];
            newPlayers[index] = { ...newPlayers[index], ...newProps };
            return newPlayers;
        });
    };
    
    const handleProfileLoad = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const profileName = e.target.value;
        if (profileName === 'random') {
             setAiPlayers(prev => {
                const newPlayers = [...prev];
                newPlayers[selectedPlayerIndex].aiPersonality = {
                    ...newPlayers[selectedPlayerIndex].aiPersonality!,
                    openness: Math.floor(Math.random() * 101),
                    conscientiousness: Math.floor(Math.random() * 101),
                    extraversion: Math.floor(Math.random() * 101),
                    agreeableness: Math.floor(Math.random() * 101),
                    neuroticism: Math.floor(Math.random() * 101),
                };
                return newPlayers;
            });
            return;
        }

        const template = aiProfileTemplates.find(p => p.name === profileName);
        if (template) {
            setAiPlayers(prev => {
                const newPlayers = [...prev];
                newPlayers[selectedPlayerIndex].name = template.name;
                newPlayers[selectedPlayerIndex].aiPersonality = template.personality;
                return newPlayers;
            });
        }
    };
    
    const handleGenerateFullPersona = (player: Player) => {
        const personality = player.aiPersonality!;
        setGeneratingForPlayer(player.playerNumber);
        const userInput = generationInputs[player.playerNumber] || '';
        const prompt = `Generate a complete fantasy character profile for an AI player in a worldbuilding game. This character's personality is defined by the Big Five traits (scores 0-100).
- Openness to Experience: ${personality.openness} (Inventive/Curious vs. Consistent/Cautious)
- Conscientiousness: ${personality.conscientiousness} (Efficient/Organized vs. Easy-going/Careless)
- Extraversion: ${personality.extraversion} (Outgoing/Energetic vs. Solitary/Reserved)
- Agreeableness: ${personality.agreeableness} (Friendly/Compassionate vs. Challenging/Detached)
- Neuroticism: ${personality.neuroticism} (Sensitive/Nervous vs. Secure/Confident)
Based on these scores, generate a JSON object with the following fields:
- "name": A unique, thematic fantasy name.
- "persona": A concise, one-sentence summary of the character's core identity and approach. This will act as a directive for the AI.
- "biography": A short, 2-3 sentence narrative backstory for the character.`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: { name: { type: Type.STRING }, persona: { type: Type.STRING }, biography: { type: Type.STRING }, },
            required: ['name', 'persona', 'biography']
        };
        generate(prompt, userInput, { responseMimeType: "application/json", responseSchema });
    };

    const handleFinalize = () => configureAiPlayers(aiPlayers);
    
    const playStyleDescriptions: Record<string, string> = {
        'Standard': 'The default. This AI follows the same rules as human players, ensuring a balanced game.',
        'Asymmetric': 'This AI acts as a "wildcard" or "Game Master," capable of using more powerful, alternate rules to introduce dramatic, world-altering events. It\'s designed for a more unpredictable narrative.',
        'Avatar': 'This AI represents a human player from our world who has become an entity within the game. This is a narrative flag suggesting the character has fourth-wall awareness, potentially leading to strange and prescient actions within the lore.'
    };

    if (!gameSettings) return <div className="p-4 text-center text-red-500">Error: Game settings missing.</div>;
    
    const selectedPlayer = aiPlayers[selectedPlayerIndex];
    if (!selectedPlayer) return <div>Loading AI Players...</div>;

    const personality = selectedPlayer.aiPersonality!;
    const currentPlayStyle = selectedPlayer.playStyle || 'Standard';

    return (
        <div className={componentStyles.layout.centeredCard}>
             <div className={cn(componentStyles.card.page, "max-w-4xl")}>
                 <h1 className="text-4xl font-bold text-amber-800 mb-2 text-center">AI Player Configuration</h1>
                <p className="text-center text-gray-600 mb-8">Define the personalities of the AI players who will join your world.</p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="ai-select" className={componentStyles.form.label}>Configure Player</label>
                        <select id="ai-select" value={selectedPlayerIndex} onChange={e => setSelectedPlayerIndex(Number(e.target.value))} className={componentStyles.input.base}>
                            {aiPlayers.map((p, index) => <option key={p.playerNumber} value={index}>AI Player {p.playerNumber}{p.name ? ` (${p.name})` : ''}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="profile-select" className={componentStyles.form.label}>Load Profile</label>
                        <select id="profile-select" onChange={handleProfileLoad} className={componentStyles.input.base} defaultValue="">
                            <option value="" disabled>-- Load a template --</option>
                            <option value="random">Randomize Traits</option>
                            {aiProfileTemplates.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="p-6 border rounded-lg bg-gray-50/50 shadow-inner space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                    <div className="grid md:grid-cols-2 gap-x-6 items-start">
                        <div>
                            <label htmlFor={`ai-name-${selectedPlayer.playerNumber}`} className={componentStyles.form.label}>Custom Name</label>
                            <input id={`ai-name-${selectedPlayer.playerNumber}`} type="text" value={selectedPlayer.name} onChange={(e) => handlePlayerPropertyChange(selectedPlayerIndex, { name: e.target.value })} className={cn(componentStyles.input.base, "text-xl")} placeholder={`Enter name for AI Player ${selectedPlayer.playerNumber}`} />
                        </div>
                        <div>
                            <label htmlFor={`ai-playstyle-${selectedPlayer.playerNumber}`} className={componentStyles.form.label}>Play Style</label>
                            <select
                                id={`ai-playstyle-${selectedPlayer.playerNumber}`}
                                value={currentPlayStyle}
                                onChange={(e) => handlePlayerPropertyChange(selectedPlayerIndex, { playStyle: e.target.value as Player['playStyle'] })}
                                className={componentStyles.input.base}
                            >
                                <option value="Standard">Standard AI</option>
                                <option value="Asymmetric">Asymmetric AI</option>
                                <option value="Avatar">Avatar Player</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                {playStyleDescriptions[currentPlayStyle]}
                            </p>
                        </div>
                    </div>

                    <details className="group pt-4" open>
                        <summary className="text-lg font-bold text-amber-900 cursor-pointer list-none flex justify-between items-center">Personality Traits<span className="text-sm text-gray-500 transition-transform group-open:rotate-180">▼</span></summary>
                        <div className="mt-4 pt-4 border-t space-y-4">
                            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                                <PersonalitySlider label="Openness" value={personality.openness} description="Inventive/Curious vs. Consistent/Cautious" onChange={val => handlePersonalityChange(selectedPlayerIndex, {openness: val})} />
                                <PersonalitySlider label="Conscientiousness" value={personality.conscientiousness} description="Efficient/Organized vs. Easy-going/Careless" onChange={val => handlePersonalityChange(selectedPlayerIndex, {conscientiousness: val})} />
                                <PersonalitySlider label="Extraversion" value={personality.extraversion} description="Outgoing/Energetic vs. Solitary/Reserved" onChange={val => handlePersonalityChange(selectedPlayerIndex, {extraversion: val})} />
                                <PersonalitySlider label="Agreeableness" value={personality.agreeableness} description="Friendly/Compassionate vs. Challenging/Detached" onChange={val => handlePersonalityChange(selectedPlayerIndex, {agreeableness: val})} />
                                <PersonalitySlider label="Neuroticism" value={personality.neuroticism} description="Sensitive/Nervous vs. Secure/Confident" onChange={val => handlePersonalityChange(selectedPlayerIndex, {neuroticism: val})} />
                            </div>
                        </div>
                    </details>
                    
                    <details className="group pt-4">
                        <summary className="text-lg font-bold text-amber-900 cursor-pointer list-none flex justify-between items-center">Biography & Persona<span className="text-sm text-gray-500 transition-transform group-open:rotate-180">▼</span></summary>
                        <div className="mt-4 pt-4 border-t space-y-4">
                             <div>
                                <label htmlFor={`ai-persona-${selectedPlayer.playerNumber}`} className={componentStyles.form.label}>Persona Summary</label>
                                <textarea id={`ai-persona-${selectedPlayer.playerNumber}`} value={personality.persona} onChange={(e) => handlePersonalityChange(selectedPlayerIndex, { persona: e.target.value })} rows={2} className={componentStyles.input.base} placeholder="A one-sentence directive for the AI." />
                            </div>
                            <div>
                                <label htmlFor={`ai-bio-${selectedPlayer.playerNumber}`} className={componentStyles.form.label}>Biography</label>
                                <textarea id={`ai-bio-${selectedPlayer.playerNumber}`} value={personality.biography} onChange={(e) => handlePersonalityChange(selectedPlayerIndex, { biography: e.target.value })} rows={3} className={componentStyles.input.base} placeholder="A short backstory." />
                            </div>
                            <AIGenerationSection title="AI-Powered Generation">
                                <AIContextInput id={`ai-generation-input-${selectedPlayer.playerNumber}`} label="Inject Ideas into AI Generation" value={generationInputs[selectedPlayer.playerNumber] || ''} onChange={(val) => setGenerationInputs(prev => ({...prev, [selectedPlayer.playerNumber]: val }))} elements={gameElements} placeholder="e.g., 'themed around fire', 'from a lost lineage'..." rows={2} />
                                <button type="button" onClick={() => handleGenerateFullPersona(selectedPlayer)} disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all shadow disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {isLoading && generatingForPlayer === selectedPlayer.playerNumber ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Generating...</> : 'Generate Name, Persona & Bio'}
                                </button>
                                {error && generatingForPlayer === selectedPlayer.playerNumber && <p className="text-sm text-red-600 mt-2">{error}</p>}
                            </AIGenerationSection>
                        </div>
                    </details>
                </div>

                 <div className="mt-8 pt-4 border-t flex items-center gap-4">
                     <button onClick={backToSetup} className={cn(componentStyles.button.base, componentStyles.button.secondary, "w-1/3")}>&larr; Back to Setup</button>
                    <button onClick={handleFinalize} className={cn(componentStyles.button.base, componentStyles.button.primary, "w-2/3")} disabled={!isConfigurationComplete} title={!isConfigurationComplete ? 'All AI players must have a name.' : 'Proceed to player selection'}>
                        {isConfigurationComplete ? 'Finalize & Continue' : 'Name All AI Players'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiPlayerSetup;
