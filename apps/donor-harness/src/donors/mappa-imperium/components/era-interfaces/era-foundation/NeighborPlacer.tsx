
import React, { useState } from 'react';
import type { ElementCard, Faction, Player } from '@mi/types';
import FactionForm from './FactionForm';
import DiceRoller from './DiceRoller';
import { neighborTable } from '../../../data/factionTables';

interface NeighborPlacerProps {
    currentPlayer: Player;
    onCreateElement: (element: Omit<ElementCard, 'id'>) => void;
}

const attitudeTable: Record<number, string> = {
    1: "Hostile (War)",
    2: "Unfriendly (Rivalry)",
    3: "Neutral (Cautious)",
    4: "Neutral (Open)",
    5: "Friendly (Trade)",
    6: "Ally (Pact)"
};

const strengthTable: Record<number, string> = {
    1: "Much Weaker (Vassal state?)",
    2: "Weaker",
    3: "Equal Strength",
    4: "Equal Strength",
    5: "Stronger",
    6: "Much Stronger (Threat)"
};

const NeighborPlacer = ({ currentPlayer, onCreateElement }: NeighborPlacerProps) => {
    const [neighborData, setNeighborData] = useState<Partial<Faction>>({});
    const [isCreated, setIsCreated] = useState(false);

    // Roll States
    const [typeRolled, setTypeRolled] = useState(false);
    const [attitudeRolled, setAttitudeRolled] = useState(false);
    const [strengthRolled, setStrengthRolled] = useState(false);

    const handleCreate = (finalFactionData: Omit<Faction, 'id' | 'capitalName'> & { capitalName?: string }) => {
        const fullFactionData = {
            ...neighborData,
            ...finalFactionData,
            isNeighbor: true
        };

        const newNeighborElement: Omit<ElementCard, 'id'> = {
            type: 'Faction',
            name: fullFactionData.name as string,
            owner: currentPlayer.playerNumber,
            era: 3,
            data: { id: `data-${crypto.randomUUID()}`, ...fullFactionData } as Faction,
        };
        onCreateElement(newNeighborElement);
        setIsCreated(true);
    };

    if (isCreated) {
        return (
            <div className="p-8 text-center bg-green-50 text-green-800 rounded-lg">
                <h2 className="text-2xl font-bold">Neighbor Established!</h2>
                <p>You can now proceed to place your settlements.</p>
            </div>
        );
    }



    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-amber-800">Rule 3.3: Establish a Neighbor</h2>
                <p className="mt-2 text-lg text-gray-600">You are not alone. Define the neighbor that shares your borders.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-4">
                <DiceRoller
                    title="Neighbor Type"
                    diceNotation="1d6"
                    resultTable={neighborTable}
                    onRoll={(result) => {
                        setNeighborData(prev => ({ ...prev, race: String(result) }));
                        setTypeRolled(true);
                    }}
                />
                <DiceRoller
                    title="Attitude"
                    diceNotation="1d6"
                    resultTable={attitudeTable}
                    onRoll={(result) => {
                        setNeighborData(prev => ({ ...prev, description: (prev.description || "") + ` Attitude: ${result}.` }));
                        setAttitudeRolled(true);
                    }}
                />
                <DiceRoller
                    title="Strength"
                    diceNotation="1d6"
                    resultTable={strengthTable}
                    onRoll={(result) => {
                        setNeighborData(prev => ({ ...prev, description: (prev.description || "") + ` Strength: ${result}.` }));
                        setStrengthRolled(true);
                    }}
                />
            </div>

            <div className="mt-8">
                <h3 className="text-2xl font-bold text-amber-800 mb-4">Define Neighbor Details</h3>
                <FactionForm
                    onCreate={handleCreate}
                    isNeighbor={true}
                    currentPlayer={currentPlayer}
                    initialData={neighborData}
                />
            </div>
        </div>
    );
};

export default NeighborPlacer;
