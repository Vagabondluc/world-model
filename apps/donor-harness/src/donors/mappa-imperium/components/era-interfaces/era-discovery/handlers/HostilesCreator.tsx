import React, { useState } from 'react';
import type { Player, ElementCard, GameSettings, Faction } from '@mi/types';
import SubRollHelper from '../../common/SubRollHelper';
import FactionForm from '../../era-foundation/FactionForm';

const neighborsTable: Record<string, string> = {
    '1': 'Hive or Swarm',
    '2': 'Tribe or Clan',
    '3': 'Minor Kingdom',
    '4': 'Magic User',
    '5': 'Cult/Order/Lair',
    '6': 'Legendary Monster',
};

const raceTable: Record<string, string> = {
    '2': 'Demonkind', '3': 'Seafolk', '4': 'Smallfolk', '5': 'Reptilian', '6': 'Dwarves',
    '7': 'Humans', '8': 'Elves', '9': 'Greenskins', '10': 'Animalfolk', '11': 'Giantkind', '12': 'Player\'s Choice'
};

const needsRaceRoll = ['Tribe or Clan', 'Minor Kingdom', 'Legendary Monster'];

interface HostilesCreatorProps {
    currentPlayer: Player;
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number) => void;
    gameSettings: GameSettings | null;
}

const HostilesCreator = ({ currentPlayer, onCreateElement, gameSettings }: HostilesCreatorProps) => {
    const [hostileType, setHostileType] = useState<string | null>(null);
    const [hostileRace, setHostileRace] = useState<string | null>(null);

    const handleTypeRoll = (result: string) => {
        setHostileType(result);
        if (!needsRaceRoll.includes(result)) {
            setHostileRace('N/A'); // Skip race roll
        }
    };

    const handleRaceRoll = (result: string) => {
        setHostileRace(result);
    };

    const handleCreate = (factionData: Omit<Faction, 'id'>) => {
        if (!gameSettings) return;

        const turnDuration = gameSettings.turnDuration;
        const era3Years = 30;
        const completedTurns = 0; // Simplified for this context
        const turn = completedTurns + 1;
        const startYear = era3Years + ((turn - 1) * turnDuration) + 1;

        onCreateElement({
            type: 'Faction',
            name: factionData.name,
            owner: currentPlayer.playerNumber,
            era: 4,
            data: { ...factionData, id: `data-${crypto.randomUUID()}` }
        }, startYear);
    };

    return (
        <div className="space-y-4">
            <SubRollHelper
                title="Roll for Hostile Type (Neighbor Table 3.3)"
                diceType="1d6"
                table={neighborsTable}
                onRoll={handleTypeRoll}
                disabled={!!hostileType}
            />
            {hostileType && needsRaceRoll.includes(hostileType) && (
                 <div className="animate-fade-in-slide-up">
                    <SubRollHelper
                        title="Roll for Hostile Race (Race Table 3.1)"
                        diceType="2d6"
                        table={raceTable}
                        onRoll={handleRaceRoll}
                        disabled={!!hostileRace}
                    />
                </div>
            )}
            {hostileRace && (
                <div className="animate-fade-in-slide-up">
                     <FactionForm
                        onCreate={handleCreate}
                        isNeighbor={true}
                        currentPlayer={currentPlayer}
                    />
                </div>
            )}
        </div>
    );
};

export default HostilesCreator;
