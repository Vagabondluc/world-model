import React, { useState } from 'react';
import type { ElementCard, Faction, Player, Settlement } from '../../../types';
import FactionForm from './FactionForm';
import DiceRoller from './DiceRoller';
import { ancestryTable, symbolTables, simpleColorTable } from '../../../data/factionTables';

interface PrimeFactionCreatorProps {
    currentPlayer: Player;
    onCreateElement: (element: Omit<ElementCard, 'id'>) => void;
}

const PrimeFactionCreator = ({ currentPlayer, onCreateElement }: PrimeFactionCreatorProps) => {
    const [factionData, setFactionData] = useState<Partial<Faction>>({});
    const [isCreated, setIsCreated] = useState(false);

    // State for Symbol Roll
    const [symbolRow, setSymbolRow] = useState<number | null>(null);
    const [symbolCol, setSymbolCol] = useState<number | null>(null);

    // State for Color Roll
    const [colorRow, setColorRow] = useState<number | null>(null);
    const [colorCol, setColorCol] = useState<number | null>(null);

    const handleCreate = (finalFactionData: Omit<Faction, 'id' | 'capitalName'> & { capitalName?: string }) => {
        const fullFactionData = { ...factionData, ...finalFactionData, isNeighbor: false };

        const newFactionElement: Omit<ElementCard, 'id'> = {
            type: 'Faction',
            name: fullFactionData.name as string,
            owner: currentPlayer.playerNumber,
            era: 3,
            data: { id: `data-${crypto.randomUUID()}`, ...fullFactionData } as Faction,
        };
        onCreateElement(newFactionElement);

        if (finalFactionData.capitalName) {
            const newCapitalData: Omit<Settlement, 'id'> = {
                name: finalFactionData.capitalName,
                purpose: 'Capital',
                description: `The capital of the ${fullFactionData.name}.`,
            };
            const newCapitalElement: Omit<ElementCard, 'id'> = {
                type: 'Settlement',
                name: newCapitalData.name,
                owner: currentPlayer.playerNumber,
                era: 3,
                data: { id: `data-${crypto.randomUUID()}`, ...newCapitalData },
            };
            onCreateElement(newCapitalElement);
        }
        setIsCreated(true);
    };

    if (isCreated) {
        return (
            <div className="p-8 text-center bg-green-50 text-green-800 rounded-lg">
                <h2 className="text-2xl font-bold">Prime Faction Created!</h2>
                <p>You can now proceed to establish a neighbor.</p>
            </div>
        );
    }

    const handleSymbolRoll = (table: 'row' | 'col') => (result: string, roll: number) => {
        if (table === 'row') setSymbolRow(roll);
        if (table === 'col') setSymbolCol(roll);
        if (symbolRow && table === 'col') setFactionData(prev => ({ ...prev, symbolName: symbolTables[symbolRow][roll] }));
        if (symbolCol && table === 'row') setFactionData(prev => ({ ...prev, symbolName: symbolTables[roll][symbolCol] }));
    };
    
    const handleColorRoll = (table: 'row' | 'col') => (result: string, roll: number) => {
        if (table === 'row') setColorRow(roll);
        if (table === 'col') setColorCol(roll);
        if (colorRow && table === 'col') setFactionData(prev => ({ ...prev, color: simpleColorTable[colorRow][roll - 1] }));
        if (colorCol && table === 'row') setFactionData(prev => ({ ...prev, color: simpleColorTable[roll][colorCol - 1] }));
    };
    
    const allRollsComplete = !!factionData.race && !!factionData.symbolName && !!factionData.color;

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-amber-800">Step 1: Create Your Prime Faction</h2>
                <p className="mt-2 text-lg text-gray-600">Define the race, culture, and leadership of the empire you will guide through the ages. This will also create your capital city.</p>
            </header>

            <DiceRoller
                title="3.1 Determine Ancestry"
                diceNotation="2d6"
                resultTable={ancestryTable}
                onRoll={(result) => setFactionData(prev => ({ ...prev, race: result }))}
            />

            <div className="p-4 border rounded-lg bg-gray-50/80 shadow-inner space-y-3">
                 <h4 className="font-semibold text-gray-800">3.2 Determine Symbol</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <DiceRoller title="Roll for Row" diceNotation="1d6" resultTable={{}} onRoll={handleSymbolRoll('row')} buttonText="Roll Row" hideResult/>
                    <DiceRoller title="Roll for Column" diceNotation="1d6" resultTable={{}} onRoll={handleSymbolRoll('col')} buttonText="Roll Column" hideResult/>
                </div>
                 {factionData.symbolName && (
                    <div className="p-3 bg-amber-100 border-l-4 border-amber-500 rounded-r-md text-amber-900">
                        <p><strong>Result:</strong> {factionData.symbolName}</p>
                    </div>
                )}
            </div>
            
            <div className="p-4 border rounded-lg bg-gray-50/80 shadow-inner space-y-3">
                 <h4 className="font-semibold text-gray-800">3.2 Determine Color</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <DiceRoller title="Roll for Row" diceNotation="1d6" resultTable={{}} onRoll={handleColorRoll('row')} buttonText="Roll Row" hideResult/>
                    <DiceRoller title="Roll for Column" diceNotation="1d6" resultTable={{}} onRoll={handleColorRoll('col')} buttonText="Roll Column" hideResult/>
                </div>
                 {factionData.color && (
                    <div className="p-3 bg-amber-100 border-l-4 border-amber-500 rounded-r-md text-amber-900">
                        <p><strong>Result:</strong> {factionData.color}</p>
                    </div>
                )}
            </div>

            {allRollsComplete ? (
                 <FactionForm
                    onCreate={handleCreate}
                    isNeighbor={false}
                    currentPlayer={currentPlayer}
                    initialData={factionData}
                />
            ) : (
                <div className="p-8 text-center bg-gray-100 text-gray-500 rounded-lg border-2 border-dashed">
                    <p className="font-semibold">Please complete all dice rolls above to proceed with faction creation.</p>
                </div>
            )}
        </div>
    );
};

export default PrimeFactionCreator;