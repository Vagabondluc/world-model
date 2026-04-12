import React, { useState, useMemo } from 'react';
import type { Player, ElementCard, GameSettings, Faction } from '../../../../types';
import SubRollHelper from '../../common/SubRollHelper';

interface NeighborDevelopHandlerProps {
    currentPlayer: Player;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number) => void;
    onUpdateElement: (element: ElementCard) => void;
    gameSettings: GameSettings | null;
    onComplete: () => void;
}

const neighborTypes = [ "Minor Faction", "Tribe / Bandits / Pirates", "Hive", "Magic User", "Cult / Lair / Order", "Monster" ];
const tables: Record<string, Record<string, string>> = {
    "Minor Faction": { '1':'Expand','2':'Colonize','3':'Militarize','4':'Union','5':'Epic Construction','6':'Expand' },
    "Tribe / Bandits / Pirates": { '1':'Monster!','2':'Warpath','3':'Advancement','4':'Expand','5':'Floating Village','6':'Invasion' },
    "Hive": { '1':'Swarm','2':'Expand','3':'Raid','4':'Infest','5':'Spawn','6':'Expand' },
    "Magic User": { '1':'Minions','2':'Raid','3':'Expand','4':'Construction','5':'Alter Land','6':'Corruption' },
    "Cult / Lair / Order": { '1':'Expand','2':'Worship','3':'Epic Construction','4':'Infiltrate','5':'Ransack','6':'Expand' },
    "Monster": { '1':'Raid','2':'Treasure','3':'Raid','4':'Ascension','5':'Lair Building','6':'Fury' }
};

const NeighborDevelopHandler = ({ currentPlayer, elements, onCreateElement, onUpdateElement, gameSettings, onComplete }: NeighborDevelopHandlerProps) => {
    const [selectedNeighborId, setSelectedNeighborId] = useState('');
    const [neighborType, setNeighborType] = useState('');
    const [rollResult, setRollResult] = useState<string | null>(null);

    const neighborFactions = useMemo(() =>
        elements.filter(el => el.owner === currentPlayer.playerNumber && el.type === 'Faction' && (el.data as Faction).isNeighbor)
    , [elements, currentPlayer]);

    const handleRoll = (result: string) => {
        setRollResult(result);
        // Here you would add logic to handle the outcome, which might involve creating new elements,
        // updating the neighbor faction, or just being a narrative event.
        // For now, we just complete the turn.
        // TODO: Implement specific outcomes.
        onComplete();
    };

    const selectedNeighbor = elements.find(el => el.id === selectedNeighborId);

    return (
        <div className="space-y-4 p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold">Develop a Neighboring Faction</h3>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="neighbor-select" className="block text-sm font-medium text-gray-700">1. Select Neighbor</label>
                    <select
                        id="neighbor-select"
                        value={selectedNeighborId}
                        onChange={e => {
                            setSelectedNeighborId(e.target.value);
                            setNeighborType('');
                            setRollResult(null);
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md"
                    >
                        <option value="">-- Choose a neighbor --</option>
                        {neighborFactions.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>
                {selectedNeighbor && (
                    <div>
                        <label htmlFor="neighbor-type-select" className="block text-sm font-medium text-gray-700">2. Confirm Neighbor Type</label>
                        <select
                            id="neighbor-type-select"
                            value={neighborType}
                            onChange={e => setNeighborType(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md"
                        >
                            <option value="">-- Select type from Rule 3.3 --</option>
                            {neighborTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                         <p className="text-xs text-gray-500 mt-1">This is needed because the specific neighbor type isn't stored. Choose the one that best fits.</p>
                    </div>
                )}
            </div>
            
            {neighborType && tables[neighborType] && (
                <div className="animate-fade-in pt-4 border-t">
                    <SubRollHelper
                        title={`3. Roll on the "${neighborType}" Development Table`}
                        diceType="1d6"
                        table={tables[neighborType]}
                        onRoll={handleRoll}
                        disabled={!!rollResult}
                    />
                </div>
            )}

            {rollResult && (
                <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-r-md">
                    <p className="font-bold">Development Complete!</p>
                    <p>The event "{rollResult}" has occurred for {selectedNeighbor?.name}. This turn is now complete.</p>
                    <p className="text-xs mt-2">(Note: Automatic element creation/updates for these outcomes are not yet implemented.)</p>
                </div>
            )}
        </div>
    );
};

export default NeighborDevelopHandler;
