import React, { useState } from 'react';
import type { ElementCard, Faction, Player } from '../../../types';
import FactionForm from './FactionForm';
import DiceRoller from './DiceRoller';
import { neighborTable, ancestryTable } from '../../../data/factionTables';

const needsRaceRoll = ['Tribe or Clan', 'Minor Kingdom', 'Legendary Monster'];

interface NeighborPlacerProps {
    currentPlayer: Player;
    onCreateElement: (element: Omit<ElementCard, 'id'>) => void;
}

const NeighborPlacer = ({ currentPlayer, onCreateElement }: NeighborPlacerProps) => {
    const [neighborData, setNeighborData] = useState<Partial<Faction>>({});
    const [isCreated, setIsCreated] = useState(false);

    const handleCreate = (finalFactionData: Omit<Faction, 'id'>) => {
        const fullFactionData = { ...neighborData, ...finalFactionData, isNeighbor: true };

        const newElement: Omit<ElementCard, 'id'> = {
            type: 'Faction',
            name: fullFactionData.name as string,
            owner: currentPlayer.playerNumber,
            era: 3,
            data: { id: `data-${crypto.randomUUID()}`, ...fullFactionData } as Faction
        };
        onCreateElement(newElement);
        setIsCreated(true);
    };

    if (isCreated) {
        return (
            <div className="p-8 text-center bg-green-50 text-green-800 rounded-lg">
                <h2 className="text-2xl font-bold">Neighbor Created!</h2>
                <p>You can now proceed to place your early settlements.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-amber-800">Step 2: Establish a Neighbor</h2>
                <p className="mt-2 text-lg text-gray-600">Roll for a neighbor type in your home region. They can be friend or foe.</p>
            </header>

            <DiceRoller
                title="3.3 Determine Neighbor Type"
                diceNotation="1d6"
                resultTable={neighborTable}
                onRoll={(result) => setNeighborData(prev => ({...prev, theme: result, neighborType: result}))}
            />

            {neighborData.theme && needsRaceRoll.includes(neighborData.theme) && (
                <div className="animate-fade-in">
                    <DiceRoller
                        title="Determine Neighbor Race"
                        diceNotation="2d6"
                        resultTable={ancestryTable}
                        onRoll={(result) => setNeighborData(prev => ({ ...prev, race: result }))}
                    />
                </div>
            )}
            
            <FactionForm 
                onCreate={handleCreate} 
                isNeighbor={true} 
                currentPlayer={currentPlayer} 
                initialData={neighborData}
            />
        </div>
    );
};

export default NeighborPlacer;