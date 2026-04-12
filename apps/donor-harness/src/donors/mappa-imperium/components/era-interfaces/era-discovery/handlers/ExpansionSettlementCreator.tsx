import React, { useState, useMemo } from 'react';
import type { Player, ElementCard, GameSettings, Settlement } from '@mi/types';
import SubRollHelper from '../../common/SubRollHelper';
import SettlementForm from '../../era-foundation/SettlementForm';

const settlementTable: Record<string, string> = {
    '1': 'Food (farm, fish, forage)',
    '2': 'Mining (stone quarry, clay pit, metal mine)',
    '3': 'Industry (goods production, textile, factory)',
    '4': 'Trade (market, port, caravan stop)',
    '5': 'Military (frontier fort, barracks, academy)',
    '6': 'Religion (monastery, temple, shrine)',
};

interface ExpansionSettlementCreatorProps {
    currentPlayer: Player;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number) => void;
    gameSettings: GameSettings | null;
    onComplete: () => void;
}

const ExpansionSettlementCreator = ({ currentPlayer, elements, onCreateElement, gameSettings, onComplete }: ExpansionSettlementCreatorProps) => {
    const [rolledPurpose, setRolledPurpose] = useState<string | null>(null);
    const primeFaction = useMemo(() => elements.find(el => el.owner === currentPlayer.playerNumber && el.type === 'Faction' && !(el.data as any).isNeighbor) ?? null, [elements, currentPlayer]);

    const handleRoll = (result: string) => {
        const purpose = result.split(' ')[0];
        setRolledPurpose(purpose);
    };

    const handleCreate = (settlementData: Omit<Settlement, 'id'>) => {
        if (!gameSettings) return;

        const turnDuration = gameSettings.turnDuration;
        const era3Years = 30;
        const completedTurns = elements.filter(el => el.owner === currentPlayer.playerNumber && el.era === 4 && el.creationStep === '4.1 Exploration' && !el.isDebug).length;
        const turn = completedTurns + 1;
        const startYear = era3Years + ((turn - 1) * turnDuration) + 1;

        onCreateElement({
            type: 'Settlement',
            name: settlementData.name,
            owner: currentPlayer.playerNumber,
            era: 4,
            data: { id: `data-${crypto.randomUUID()}`, ...settlementData }
        }, startYear);
    };

    return (
        <div className="space-y-4">
            <SubRollHelper
                title="Roll for Settlement Purpose (Rule 3.4)"
                diceType="1d6"
                table={settlementTable}
                onRoll={handleRoll}
                disabled={!!rolledPurpose}
            />

            {rolledPurpose && (
                <div className="animate-fade-in-slide-up">
                    <SettlementForm
                        title="Create New Settlement"
                        primeFaction={primeFaction}
                        onCreate={handleCreate}
                        preselectedPurpose={rolledPurpose}
                        onComplete={onComplete}
                    />
                </div>
            )}
        </div>
    );
};

export default ExpansionSettlementCreator;
