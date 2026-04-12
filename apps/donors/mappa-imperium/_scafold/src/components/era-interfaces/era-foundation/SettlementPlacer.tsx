import React from 'react';
import type { ElementCard, Settlement, Player } from '../../../types';
import SettlementForm from './SettlementForm';

interface SettlementPlacerProps {
    currentPlayer: Player;
    primeFaction: ElementCard | null;
    onCreateElement: (element: Omit<ElementCard, 'id'>) => void;
    settlements: ElementCard[];
}

const SettlementPlacer = ({ currentPlayer, primeFaction, onCreateElement, settlements }: SettlementPlacerProps) => {
    const regularSettlements = settlements.filter(s => (s.data as Settlement).purpose !== 'Capital');
    const settlementsNeeded = 2;
    const isComplete = regularSettlements.length >= settlementsNeeded;

    const handleCreate = (settlementData: Omit<Settlement, 'id'>) => {
        const newElement: Omit<ElementCard, 'id'> = {
            type: 'Settlement',
            name: settlementData.name,
            owner: currentPlayer.playerNumber,
            era: 3,
            data: { id: `data-${crypto.randomUUID()}`, ...settlementData }
        };
        onCreateElement(newElement);
    };
    
    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-amber-800">Step 3: Place Early Settlements</h2>
                <p className="mt-2 text-lg text-gray-600">Your faction needs places to live and work. Create your first two settlements in addition to your capital.</p>
            </header>
            
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                <p className="text-xl font-semibold text-amber-800">
                    Progress: <span className="font-bold">{regularSettlements.length} / {settlementsNeeded}</span> additional settlements placed.
                </p>
                {isComplete && <p className="mt-1 font-bold text-green-700">All settlements have been placed!</p>}
            </div>
            
            <SettlementForm
                title={`Create Settlement #${regularSettlements.length + 1}`}
                primeFaction={primeFaction}
                onCreate={handleCreate}
                disabled={isComplete}
                onComplete={() => {}}
            />
        </div>
    );
};

export default SettlementPlacer;
