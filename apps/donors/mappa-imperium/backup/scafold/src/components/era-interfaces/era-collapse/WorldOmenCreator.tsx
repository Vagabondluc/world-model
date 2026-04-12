import React, { useState } from 'react';
import type { Player, ElementCard, GameSettings, Event as EventType } from '../../../types';
import { useAI } from '../../../contexts/AIContext';
import { Type } from "@google/genai";
import AIGenerationSection from '../../shared/AIGenerationSection';
import DiceRoller from '../era-foundation/DiceRoller';

interface WorldOmenCreatorProps {
    currentPlayer: Player;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number, creationStep?: string) => void;
    gameSettings: GameSettings | null;
}

const omensTable: Record<number, string> = {
    2: "Black Smoke", 3: "Abyss", 4: "Blinding Light", 5: "Silence", 6: "River of Blood", 7: "Comet",
    8: "They Know Something", 9: "Stench", 10: "Howl", 11: "Terror", 12: "Meteor Storm"
};

const WorldOmenCreator = ({ currentPlayer, onCreateElement, gameSettings, elements }: WorldOmenCreatorProps) => {
    const [rolledOmen, setRolledOmen] = useState<string | null>(null);
    const [formState, setFormState] = useState({ name: '', description: '' });
    const { result, isLoading, error, generate, clear } = useAI();
    const inputClasses = "input-base";

    const isComplete = React.useMemo(() => 
        elements.some(el => el.era === 6 && el.creationStep === '6.3 World Omen')
    , [elements]);

    const handleRoll = (resultText: string) => {
        setRolledOmen(resultText);
        setFormState(prev => ({ ...prev, name: `The Omen: ${resultText}`}));
    };

    React.useEffect(() => {
        if (result) {
            try {
                const parsed = JSON.parse(result);
                setFormState(prev => ({ ...prev, description: parsed.description }));
                clear();
            } catch (e) {
                console.error("Failed to parse AI response for Omen:", e);
                setFormState(prev => ({ ...prev, description: result }));
            }
        }
    }, [result, clear]);

    const handleGenerate = () => {
        if (!rolledOmen) return;
        const prompt = `Based on Mappa Imperium rules (6.3 Omens), generate an epic narrative describing the world-ending omen: "${rolledOmen}". Describe its manifestation, immediate effects, and greater meaning for the future. Respond with a JSON object containing a 'description' field.`;
        const responseSchema = { type: Type.OBJECT, properties: { description: { type: Type.STRING } }, required: ['description'] };
        generate(prompt, '', { responseMimeType: 'application/json', responseSchema });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const year = gameSettings ? 30 + (gameSettings.turnDuration * 21) : 240; // Approx end of game + 1

        onCreateElement({
            type: 'Event',
            name: formState.name,
            owner: currentPlayer.playerNumber, // Attributed to the roller
            era: 6,
            data: { id: `data-${crypto.randomUUID()}`, name: formState.name, description: formState.description } as EventType,
        }, year, '6.3 World Omen');
    };

    if (isComplete) {
        return <div className="p-8 text-center bg-green-50 text-green-800 rounded-lg">The world's final omen has been recorded. The chronicle is complete.</div>;
    }

    return (
        <div className="space-y-6">
            <header>
                <p className="mt-2 text-lg text-gray-600">As a group, select one player to make the final roll that will determine the fate of this age.</p>
            </header>
            
            <DiceRoller
                title="Roll for the World Omen"
                diceNotation="2d6"
                resultTable={omensTable}
                onRoll={handleRoll}
                disabled={!!rolledOmen}
            />

            {rolledOmen && (
                <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-white shadow-sm space-y-4 animate-fade-in-slide-up">
                    <h3 className="text-xl font-bold">Chronicle the Omen: {rolledOmen}</h3>
                    <div>
                        <label htmlFor="omen-desc" className="form-label">Describe its manifestation and meaning</label>
                        <textarea id="omen-desc" value={formState.description} onChange={e => setFormState(p => ({...p, description: e.target.value}))} required rows={8} className={inputClasses} />
                    </div>

                    <AIGenerationSection title="AI-Powered Generation">
                        <button type="button" onClick={handleGenerate} disabled={isLoading} className="w-full btn btn-primary bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
                            {isLoading ? 'Generating...' : '✨ Generate Epic Narrative'}
                        </button>
                        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    </AIGenerationSection>

                    <div className="pt-4 border-t">
                        <button type="submit" disabled={!formState.description} className="w-full btn btn-primary disabled:bg-gray-400">
                            Record the Final Omen
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default WorldOmenCreator;