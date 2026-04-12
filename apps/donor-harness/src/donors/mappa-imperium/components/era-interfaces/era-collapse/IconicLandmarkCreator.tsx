import React, { useState } from 'react';
import type { Player, ElementCard, GameSettings, Location } from '@mi/types';
import { useAI } from '../../../contexts/AIContext';
import { Type } from "@google/genai";
import AIGenerationSection from '../../shared/AIGenerationSection';

interface IconicLandmarkCreatorProps {
    currentPlayer: Player;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number, creationStep?: string) => void;
    gameSettings: GameSettings | null;
}

const IconicLandmarkCreator = ({ currentPlayer, elements, onCreateElement, gameSettings }: IconicLandmarkCreatorProps) => {
    const [formState, setFormState] = useState({ name: '', description: '' });
    const { result, isLoading, error, generate, clear } = useAI();
    const inputClasses = "input-base";

    const isComplete = React.useMemo(() =>
        elements.some(el => el.owner === currentPlayer.playerNumber && el.era === 6 && el.creationStep === '6.2 Iconic Landmark')
        , [elements, currentPlayer]);

    React.useEffect(() => {
        if (result) {
            try {
                const parsed = JSON.parse(result);
                setFormState(prev => ({ ...prev, description: parsed.description }));
                clear();
            } catch (e) {
                console.error("Failed to parse AI response for Landmark:", e);
                setFormState(prev => ({ ...prev, description: result }));
            }
        }
    }, [result, clear]);

    const handleGenerate = () => {
        const prompt = `Based on Mappa Imperium rules (6.2 Iconic Landmarks), generate a rich historical narrative for a landmark named "${formState.name}". The landmark should feel pivotal to the empire's story. Respond with a JSON object containing a 'description' field.`;
        const responseSchema = { type: Type.OBJECT, properties: { description: { type: Type.STRING } }, required: ['description'] };
        generate(prompt, '', { responseMimeType: 'application/json', responseSchema });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const year = gameSettings ? 30 + (gameSettings.turnDuration * 20) : 230; // Approx end of game

        onCreateElement({
            type: 'Location',
            name: formState.name,
            owner: currentPlayer.playerNumber,
            era: 6,
            data: { id: `data-${crypto.randomUUID()}`, name: formState.name, description: formState.description, siteType: 'Iconic Landmark', symbol: '⭐' } as Location
        }, year, '6.2 Iconic Landmark');
    };

    if (isComplete) {
        return <div className="p-8 text-center bg-green-50 text-green-800 rounded-lg">You have already defined your iconic landmark for this era.</div>;
    }

    return (
        <div className="space-y-6">
            <header>
                <p className="mt-2 text-lg text-gray-600">Name one location on the map that was an important part of your Prime Faction's story. This can be a battlefield, a sacred site, or the place a great hero was born.</p>
            </header>
            <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
                <div>
                    <label htmlFor="landmark-name" className="form-label">Landmark Name</label>
                    <input type="text" id="landmark-name" value={formState.name} onChange={e => setFormState(p => ({ ...p, name: e.target.value }))} required className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="landmark-desc" className="form-label">Historical Significance</label>
                    <textarea id="landmark-desc" value={formState.description} onChange={e => setFormState(p => ({ ...p, description: e.target.value }))} required rows={8} className={inputClasses} placeholder="Describe the key events and people that made this place important..." />
                </div>

                <AIGenerationSection title="AI-Powered Generation">
                    <button type="button" onClick={handleGenerate} disabled={isLoading || !formState.name} className="w-full btn btn-primary bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
                        {isLoading ? 'Generating...' : '✨ Generate Historical Narrative'}
                    </button>
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                </AIGenerationSection>

                <div className="pt-4 border-t">
                    <button type="submit" disabled={!formState.name || !formState.description} className="w-full btn btn-primary disabled:bg-gray-400">
                        Designate Iconic Landmark
                    </button>
                </div>
            </form>
        </div>
    );
};

export default IconicLandmarkCreator;
