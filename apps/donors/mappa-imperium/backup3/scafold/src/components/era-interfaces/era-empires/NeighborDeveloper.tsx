import React, { useState, useMemo } from 'react';
import type { Player, ElementCard, Faction, Event as EventType, GameSettings } from '../../../types';
import SubRollHelper from '../common/SubRollHelper';
import FactionCard from '../era-foundation/FactionCard';
import AIContextInput from '../../shared/AIContextInput';
import AIGenerationSection from '../../shared/AIGenerationSection';
import { useAI } from '../../../contexts/AIContext';
import { Type } from "@google/genai";

const neighborDevelopTables: Record<string, Record<string, string>> = {
    "Minor Faction": { '1':'Expand: Add a settlement','2':'Colonize: Build a new coastal settlement','3':'Militarize: Draw in a new fort or military settlement','4':'Union: Select a nearby tribe and merge them into the minor faction, becoming one nation.','5':'Epic Construction: A new academy, altar, tower? Draw in a new construction','6':'Expand: Connect a road to a neighbor and build a trade post.' },
    "Tribe": { '1':'Monster!: A new Legendary Monster has been discovered.','2':'Warpath: War! Select a neighbor and roll on the War! Table','3':'Advancement: Upgrade to a Minor Faction.','4':'Expand: Add a settlement','5':'Floating Village: Create a floating village in a nearby sea or lake','6':'Invasion: Take one nearby settlement and switch control to the tribe.' },
    "Hive": { '1':'Swarm: Place a new Hive somewhere else on the map.','2':'Expand: Add a new hive settlement/den/nest nearby','3':'Raid: Attack a nearby settlement (1d6: Odd=destroyed, Even=defended)','4':'Infest: Attack and replace a nearby settlement with a new nest.','5':'Spawn: The hive has bred a new Legendary Monster','6':'Expand: Add a new hive settlement/den/nest nearby' },
    "Magic User": { '1':'Minions: A group of followers has joined. Build a settlement camp nearby.','2':'Raid: Attack a nearby settlement (1d6: Odd=destroyed, Even=defended)','3':'Expand: Build a new resource camp settlement nearby.','4':'Construction: A monolith, shrine, or portal? Draw in a new construction.','5':'Alter Land: Alter the lands nearby.','6':'Corruption: Taint the land nearby.' },
    "Cult": { '1':'Expand: Add a settlement','2':'Worship: Draw a new Temple nearby and select a deity','3':'Epic Construction: A new dungeon, tower, altar? Draw in a new construction nearby','4':'Infiltrate: The Cult has taken control of a nearby settlement.','5':'Ransack: A nearby settlement has something valuable.','6':'Expand: Add a settlement' },
    "Monster": { '1':'Raid: Attack a nearby settlement (1d6: Odd=destroyed, Even=defended)','2':'Treasure: The monster has accumulated vast amounts of wealth.','3':'Raid: Attack a nearby settlement (1d6: Odd=destroyed, Even=defended)','4':'Ascension: Add it to the list of gods.','5':'Lair Building: Create a proper lair or den.','6':'Fury: Unleash rage onto a nearby settlement, destroy and replace it with a ruin' }
};

// Maps the neighborType from Era 3 to the correct table key
const getDevelopmentTableKey = (neighborType: string | undefined): string | null => {
    if (!neighborType) return 'Minor Faction'; // Fallback
    const typeLower = neighborType.toLowerCase();
    if (typeLower.includes('tribe') || typeLower.includes('bandits') || typeLower.includes('pirates')) return 'Tribe';
    if (typeLower.includes('hive')) return 'Hive';
    if (typeLower.includes('magic user')) return 'Magic User';
    if (typeLower.includes('cult') || typeLower.includes('lair') || typeLower.includes('order')) return 'Cult';
    if (typeLower.includes('monster')) return 'Monster';
    if (typeLower.includes('minor kingdom')) return 'Minor Faction';
    return 'Minor Faction'; // Default for any other minor factions
};


interface NeighborDeveloperProps {
    currentPlayer: Player;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number, creationStep?: string) => void;
    onUpdateElement: (element: ElementCard) => void;
    gameSettings: GameSettings | null;
}

interface DevelopmentFormState {
    factionType: string;
    developmentEvent: string | null;
    developmentTrigger: string;
    relationshipImpact: string;
    definingMoment: string;
    leadership: string;
    eventCatalyst: string;
    territorialChanges: string;
    factionSpecific: string;
    chronicle: string;
    year: number | '';
}

const NeighborDeveloper = ({ currentPlayer, elements, onCreateElement, onUpdateElement, gameSettings }: NeighborDeveloperProps) => {
    const [developingNeighborId, setDevelopingNeighborId] = useState<string | null>(null);
    const [formState, setFormState] = useState<DevelopmentFormState>({
        factionType: '', developmentEvent: null, developmentTrigger: '', relationshipImpact: '', definingMoment: '',
        leadership: '', eventCatalyst: '', territorialChanges: '', factionSpecific: '', chronicle: '', year: ''
    });
    const { result, isLoading, error, generate, clear, elements: aiElements } = useAI();
    const inputClasses = "input-base";

    const { neighbors, developedNeighborIds, yearRange } = useMemo(() => {
        const neighborFactions = elements.filter(el => el.owner === currentPlayer.playerNumber && el.type === 'Faction' && (el.data as Faction).isNeighbor);
        const developmentEvents = elements.filter(el => el.owner === currentPlayer.playerNumber && el.era === 5 && el.creationStep === '5.2 Neighbor Development');
        const developedIds = new Set(developmentEvents.map(event => (event.data as any).factionId));

        let startYear = 0, endYear = 0;
        if (gameSettings) {
            const turnsPerEra: Record<GameSettings['length'], { 4: number; 5: number }> = { Short: { 4: 3, 5: 4 }, Standard: { 4: 6, 5: 6 }, Long: { 4: 8, 5: 8 }, Epic: { 4: 11, 5: 12 } };
            const turnDuration = gameSettings.turnDuration;
            const era3Years = 30;
            const era4Years = (turnsPerEra[gameSettings.length][4] || 0) * turnDuration;
            const precedingYears = era3Years + era4Years;
            const totalTurns = turnsPerEra[gameSettings.length][5] || 0;
            startYear = precedingYears + 1;
            endYear = precedingYears + totalTurns * turnDuration;
        }

        return { neighbors: neighborFactions, developedNeighborIds: developedIds, yearRange: { start: startYear, end: endYear } };
    }, [elements, currentPlayer, gameSettings]);

    const handleDevelopClick = (neighbor: ElementCard) => {
        const isCurrentlyDeveloping = developingNeighborId === neighbor.id;
        if (isCurrentlyDeveloping) {
            setDevelopingNeighborId(null);
            return;
        }

        const factionData = neighbor.data as Faction;
        const tableKey = getDevelopmentTableKey(factionData.neighborType);
        
        setDevelopingNeighborId(neighbor.id);
        setFormState({
            factionType: tableKey || 'Minor Faction', // Fallback to minor faction
            developmentEvent: null,
            developmentTrigger: '',
            relationshipImpact: '',
            definingMoment: '',
            leadership: '',
            eventCatalyst: '',
            territorialChanges: '',
            factionSpecific: '',
            chronicle: '',
            year: yearRange.start > 0 ? yearRange.start : ''
        });
    };

    const handleRoll = (resultText: string) => {
        setFormState(prev => ({ ...prev, developmentEvent: resultText }));
    };

    const handleGenerate = () => {
        const neighbor = elements.find(el => el.id === developingNeighborId);
        if (!neighbor || !formState.developmentEvent) return;
        const factionData = neighbor.data as Faction;

        const basePrompt = `
Faction: ${neighbor.name} (${(factionData.theme)})
Development Event: ${formState.developmentEvent}

Context: ${formState.developmentTrigger}
Relationship Impact: ${formState.relationshipImpact}

Origins and Identity: ${formState.definingMoment}
Power Structure: ${formState.leadership}
Current Event Development: ${formState.eventCatalyst}
Environmental Impact: ${formState.territorialChanges}
Faction Specifics: ${formState.factionSpecific}

Generate a rich narrative chronicle describing this development. Respond with a single JSON object containing a 'chronicle' field.`;
        
        const responseSchema = { type: Type.OBJECT, properties: { chronicle: { type: Type.STRING } }, required: ['chronicle'] };
        generate(basePrompt, '', { responseMimeType: 'application/json', responseSchema });
    };

    React.useEffect(() => {
        if (result) {
            try {
                const parsed = JSON.parse(result);
                setFormState(prev => ({...prev, chronicle: parsed.chronicle}));
                clear();
            } catch (e) {
                console.error("Failed to parse AI response:", e);
                setFormState(prev => ({...prev, chronicle: result })); // fallback
            }
        }
    }, [result, clear]);

    const handleCreateEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!developingNeighborId || !formState.chronicle || typeof formState.year !== 'number') return;

        const eventName = `Development: ${formState.developmentEvent?.split(':')[0] || 'Progress'}`;

        onCreateElement({
            type: 'Event',
            name: eventName,
            owner: currentPlayer.playerNumber,
            era: 5,
            data: { id: `data-${crypto.randomUUID()}`, name: eventName, description: formState.chronicle, factionId: developingNeighborId } as EventType,
        }, formState.year, '5.2 Neighbor Development');

        setDevelopingNeighborId(null);
    };

    const isComplete = neighbors.length > 0 && neighbors.length === developedNeighborIds.size;
    
    const renderFactionSpecificQuestion = () => {
        const { factionType } = formState;
        const factionTypeLower = factionType.toLowerCase();

        let question = { label: '', placeholder: '' };
        if (factionTypeLower.includes('magic')) {
            question = { label: "How does magic manifest in their society?", placeholder: "Their magic appears as... and costs them..." };
        } else if (factionTypeLower.includes('hive')) {
            question = { label: "How does the collective function and grow?", placeholder: "The hive operates by... and expands through..." };
        } else if (['tribe', 'bandits', 'pirates'].some(t => factionTypeLower.includes(t))) {
            question = { label: "What traditions define your people?", placeholder: "They are known for... and mark their territory with..." };
        } else if (['cult', 'lair'].some(t => factionTypeLower.includes(t))) {
            question = { label: "What dark truths drive their devotion?", placeholder: "They believe that... and their rituals have revealed..." };
        } else if (factionTypeLower.includes('monster')) {
            question = { label: "What makes their presence legendary?", placeholder: "Their legend began when... and they mark territory by..." };
        } else {
            return null;
        }

        return (
            <div>
                <label className="form-label">{question.label}</label>
                <textarea value={formState.factionSpecific} onChange={e => setFormState(p => ({ ...p, factionSpecific: e.target.value }))} rows={2} className={inputClasses} placeholder={question.placeholder} />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <header>
                <p className="mt-2 text-lg text-gray-600">Each of your minor factions develops during this era. Roll once on the appropriate table for each neighbor.</p>
            </header>

            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                <p className="text-xl font-semibold text-amber-800">
                    Progress: <span className="font-bold">{developedNeighborIds.size} / {neighbors.length}</span> neighbors developed.
                </p>
                {isComplete && <p className="mt-1 font-bold text-green-700">All neighbors have been developed for this era!</p>}
            </div>

            <div className="space-y-4">
                {neighbors.map(neighbor => {
                    const isDeveloped = developedNeighborIds.has(neighbor.id);
                    return (
                        <div key={neighbor.id} className="bg-white p-4 rounded-lg shadow-sm border">
                            <FactionCard element={neighbor} onEdit={() => {}} onDelete={() => {}} onExportHtml={() => {}} onExportMarkdown={() => {}} />
                            <div className="mt-2 pt-2 border-t flex justify-end">
                                {isDeveloped ? (
                                    <span className="pill-badge bg-green-100 text-green-800">Developed</span>
                                ) : (
                                    <button onClick={() => handleDevelopClick(neighbor)} className="btn btn-secondary bg-blue-100 hover:bg-blue-200 text-blue-800">
                                        {developingNeighborId === neighbor.id ? 'Cancel' : 'Develop'}
                                    </button>
                                )}
                            </div>
                            
                            {developingNeighborId === neighbor.id && (
                                <form onSubmit={handleCreateEvent} className="mt-4 p-4 border-t border-dashed space-y-4 animate-fade-in">
                                    <h4 className="text-xl font-semibold text-amber-900">Develop {neighbor.name}</h4>
                                     <div>
                                        <p className="form-label">Faction Type: <span className="font-bold text-amber-700">{(neighbor.data as Faction).neighborType}</span></p>
                                    </div>
                                    
                                    <SubRollHelper title={`Roll on the "${formState.factionType}" Table`} diceType="1d6" table={neighborDevelopTables[formState.factionType]} onRoll={handleRoll} disabled={!!formState.developmentEvent} />
                                    

                                    {formState.developmentEvent && (
                                        <div className="space-y-4 pt-4 border-t animate-fade-in-slide-up">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="form-label">What might have caused this development?</label>
                                                    <textarea value={formState.developmentTrigger} onChange={e => setFormState(p => ({...p, developmentTrigger: e.target.value}))} rows={2} className={inputClasses} placeholder="New leadership, recent conflict..."/>
                                                </div>
                                                <div>
                                                    <label className="form-label">How does this affect your relationship?</label>
                                                    <textarea value={formState.relationshipImpact} onChange={e => setFormState(p => ({...p, relationshipImpact: e.target.value}))} rows={2} className={inputClasses} placeholder="Bigger threat, better ally..."/>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="form-label">What defining moment shaped this faction?</label>
                                                <textarea value={formState.definingMoment} onChange={e => setFormState(p => ({ ...p, definingMoment: e.target.value }))} rows={2} className={inputClasses} placeholder="A great betrayal, natural disaster..." />
                                            </div>
                                            <div>
                                                <label className="form-label">Who leads this faction and how did they rise to power?</label>
                                                <textarea value={formState.leadership} onChange={e => setFormState(p => ({ ...p, leadership: e.target.value }))} rows={2} className={inputClasses} placeholder="Name the leader and describe their rise..." />
                                            </div>
                                            <div>
                                                <label className="form-label">How does this event flow from the faction's story?</label>
                                                <textarea value={formState.eventCatalyst} onChange={e => setFormState(p => ({ ...p, eventCatalyst: e.target.value }))} rows={2} className={inputClasses} placeholder="What triggered this development..." />
                                            </div>
                                            <div>
                                                <label className="form-label">How does this faction change their surroundings?</label>
                                                <textarea value={formState.territorialChanges} onChange={e => setFormState(p => ({ ...p, territorialChanges: e.target.value }))} rows={2} className={inputClasses} placeholder="Fortifications built, trade routes established..." />
                                            </div>
                                            {renderFactionSpecificQuestion()}
                                            <AIGenerationSection title="AI Chronicle Generation">
                                                <button type="button" onClick={handleGenerate} disabled={isLoading} className="w-full btn btn-primary bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
                                                    {isLoading ? 'Generating...' : '✨ Generate Chronicle'}
                                                </button>
                                                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                                            </AIGenerationSection>
                                             <div>
                                                 <label className="form-label">Chronicle of the Event</label>
                                                <textarea value={formState.chronicle} onChange={e => setFormState(p => ({...p, chronicle: e.target.value}))} required rows={5} className={inputClasses} />
                                            </div>
                                             <div>
                                                <label className="form-label">Year of Development</label>
                                                <input type="number" value={formState.year} onChange={e => setFormState(p => ({...p, year: e.target.value === '' ? '' : parseInt(e.target.value)}))} min={yearRange.start} max={yearRange.end} required className={inputClasses} />
                                            </div>
                                            <button type="submit" className="w-full btn btn-primary">Finalize Development</button>
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>
                    );
                })}
                 {neighbors.length === 0 && (
                     <div className="p-8 text-center bg-gray-50 text-gray-500 rounded-lg">
                        You have no neighboring factions to develop.
                    </div>
                )}
            </div>
        </div>
    );
};

export default NeighborDeveloper;