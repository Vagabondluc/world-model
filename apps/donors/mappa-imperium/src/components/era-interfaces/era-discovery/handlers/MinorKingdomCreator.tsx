import React, { useState, useMemo } from 'react';
import type { Player, ElementCard, GameSettings, Faction, Settlement } from '../../types';
import SubRollHelper from '../../common/SubRollHelper';
import FactionForm from '../../era-foundation/FactionForm';
import SettlementForm from '../../era-foundation/SettlementForm';

const raceTable: Record<string, string> = {
    '2': 'Demonkind', '3': 'Seafolk', '4': 'Smallfolk', '5': 'Reptilian', '6': 'Dwarves',
    '7': 'Humans', '8': 'Elves', '9': 'Greenskins', '10': 'Animalfolk', '11': 'Giantkind', '12': 'Player\'s Choice'
};

interface MinorKingdomCreatorProps {
    currentPlayer: Player;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number) => void;
    gameSettings: GameSettings | null;
    onComplete: () => void;
}

const MinorKingdomCreator = ({ currentPlayer, elements, onCreateElement, gameSettings, onComplete }: MinorKingdomCreatorProps) => {
    const [step, setStep] = useState(1);
    const [kingdomRace, setKingdomRace] = useState<string | null>(null);
    const [settlementsCreated, setSettlementsCreated] = useState(0);

    const primeFaction = useMemo(() => elements.find(el => el.owner === currentPlayer.playerNumber && el.type === 'Faction' && !(el.data as any).isNeighbor), [elements, currentPlayer]);

    const handleRaceRoll = (result: string) => {
        setKingdomRace(result);
        setStep(2);
    };

    const handleFactionCreate = (factionData: Omit<Faction, 'id'>) => {
        if (!gameSettings) return;

        const turnDuration = gameSettings.turnDuration;
        const era3Years = 30;
        const completedTurns = elements.filter(el => el.owner === currentPlayer.playerNumber && el.era === 4 && el.creationStep === '4.1 Exploration' && !el.isDebug).length;
        const turn = completedTurns + 1;
        const startYear = era3Years + ((turn - 1) * turnDuration) + 1;

        onCreateElement({
            type: 'Faction',
            name: factionData.name,
            owner: currentPlayer.playerNumber,
            era: 4,
            data: { ...factionData, id: `data-${crypto.randomUUID()}` }
        }, startYear);
        setStep(3);
    };
    
    const handleSettlementCreate = (settlementData: Omit<Settlement, 'id'>) => {
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
            data: { ...settlementData, id: `data-${crypto.randomUUID()}` }
        }, startYear);
    };
    
    const onSettlementFormComplete = () => {
        const newCount = settlementsCreated + 1;
        setSettlementsCreated(newCount);
        if (newCount >= 2) {
            onComplete();
        }
    };


    return (
        <div className="space-y-4">
            {step === 1 && (
                <SubRollHelper
                    title="Step 1: Roll for Kingdom's Race (Race Table 3.1)"
                    diceType="2d6"
                    table={raceTable}
                    onRoll={handleRaceRoll}
                    disabled={!!kingdomRace}
                />
            )}

            {step === 2 && kingdomRace && (
                 <div className="animate-fade-in-slide-up">
                    <h3 className="text-lg font-semibold mb-2">Step 2: Create the Kingdom ({kingdomRace})</h3>
                    <FactionForm
                        onCreate={handleFactionCreate}
                        isNeighbor={true}
                        currentPlayer={currentPlayer}
                    />
                 </div>
            )}
            
            {step === 3 && (
                 <div className="animate-fade-in-slide-up space-y-4">
                    <h3 className="text-lg font-semibold">Step 3: Create 2 Settlements for the Kingdom</h3>
                    {settlementsCreated < 2 && (
                         <SettlementForm
                            title={`Create Settlement #${settlementsCreated + 1}`}
                            primeFaction={primeFaction} // Pass for context
                            onCreate={handleSettlementCreate}
                            onComplete={onSettlementFormComplete}
                        />
                    )}
                    {settlementsCreated > 0 && settlementsCreated < 2 && (
                        <p className="text-center text-gray-500">Create one more settlement.</p>
                    )}
                 </div>
            )}
        </div>
    );
};

export default MinorKingdomCreator;
