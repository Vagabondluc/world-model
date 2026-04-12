
import React, { useState } from 'react';
import type { ElementCard, Player, Settlement } from '../../types';
import DiceRoller from './DiceRoller';
import SettlementForm from './SettlementForm';

interface SettlementPlacerProps {
    currentPlayer: Player;
    primeFaction: ElementCard | null;
    onCreateElement: (element: Omit<ElementCard, 'id'>) => void;
    settlements: ElementCard[];
}

const settlementPurposeTable: Record<number, string> = {
    1: "Food",
    2: "Mining",
    3: "Industry",
    4: "Trade",
    5: "Military",
    6: "Religion"
};

const SettlementPlacer = ({ currentPlayer, primeFaction, onCreateElement, settlements }: SettlementPlacerProps) => {
    // Filter out Capital from count (Capital is created with Prime Faction)
    // Wait, EraFoundationContent passed `playerSettlements` which includes Capital?
    // Let's check EraFoundationContent.
    // Line 48: const settlementProgress = pSettlements.filter(s => (s.data as Settlement).purpose !== 'Capital').length;
    // So 'settlements' prop here likely includes Capital.

    const nonCapitalSettlements = settlements.filter(s => (s.data as Settlement).purpose !== 'Capital');
    const count = nonCapitalSettlements.length;
    const isComplete = count >= 2;

    const [rolledPurpose, setRolledPurpose] = useState<string | null>(null);

    const handleCreate = (data: Omit<Settlement, 'id'>) => {
        const newSettlementElement: Omit<ElementCard, 'id'> = {
            type: 'Settlement',
            name: data.name,
            owner: currentPlayer.playerNumber,
            era: 3,
            data: { id: `data-${crypto.randomUUID()}`, ...data, factionId: primeFaction?.id },
        };
        onCreateElement(newSettlementElement);
        setRolledPurpose(null); // Reset for next one
    };

    if (isComplete) {
        return (
            <div className="p-8 text-center bg-green-50 text-green-800 rounded-lg">
                <h2 className="text-2xl font-bold">Settlements Established ({count}/2)</h2>
                <p>Your people have found new homes. The foundation is set.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-amber-800">Rule 3.4: Establish Settlements</h2>
                <p className="mt-2 text-lg text-gray-600">
                    Your faction grows. Establish two smaller settlements to support your capital.
                    <br />
                    <span className="font-semibold text-amber-700">Progress: {count} / 2</span>
                </p>
            </header>

            {!rolledPurpose ? (
                <div className="p-6 bg-white border rounded shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Settlement #{count + 1}: Determine Purpose</h3>
                    <DiceRoller
                        title="Roll Usage"
                        diceNotation="1d6"
                        resultTable={settlementPurposeTable}
                        onRoll={(result) => setRolledPurpose(result)}
                    />
                </div>
            ) : (
                <div className="animate-fade-in">
                    <div className="mb-4 p-4 bg-blue-50 text-blue-800 rounded border border-blue-200">
                        <p className="font-bold">Required Purpose: {rolledPurpose}</p>
                    </div>
                    <SettlementForm
                        title={`Define Settlement #${count + 1}`}
                        primeFaction={primeFaction}
                        onCreate={handleCreate}
                        preselectedPurpose={rolledPurpose}
                        onComplete={() => { }}
                    />
                </div>
            )}
        </div>
    );
};

export default SettlementPlacer;
