import React, { useState, useMemo, useRef } from 'react';
import type { Player, ElementCard, GameSettings, Location, Faction } from '../../../../types';
import SubRollHelper from '../../common/SubRollHelper';
import FactionForm from '../../era-foundation/FactionForm';
import EmojiPicker from '../../../shared/EmojiPicker';
import SettlementForm from '../../era-foundation/SettlementForm';

const raceTable: Record<string, string> = {
    '2': 'Demonkind', '3': 'Seafolk', '4': 'Smallfolk', '5': 'Reptilian', '6': 'Dwarves',
    '7': 'Humans', '8': 'Elves', '9': 'Greenskins', '10': 'Animalfolk', '11': 'Giantkind', '12': 'Player\'s Choice'
};

interface LandmarkAndTribeCreatorProps {
    currentPlayer: Player;
    elements: ElementCard[];
    onCreateElement: (element: Omit<ElementCard, 'id'>, createdYear?: number) => void;
    gameSettings: GameSettings | null;
    onComplete: () => void;
}

const LandmarkAndTribeCreator = ({ currentPlayer, elements, onCreateElement, gameSettings, onComplete }: LandmarkAndTribeCreatorProps) => {
    const [step, setStep] = useState(1);
    const [landmarkName, setLandmarkName] = useState('');
    const [landmarkDesc, setLandmarkDesc] = useState('');
    const [landmarkSymbol, setLandmarkSymbol] = useState('🗿');
    const [tribeRace, setTribeRace] = useState<string | null>(null);

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 bg-white text-gray-900";

    const primeFaction = useMemo(() => elements.find(el => el.owner === currentPlayer.playerNumber && el.type === 'Faction' && !(el.data as any).isNeighbor), [elements, currentPlayer]);

    const handleLandmarkSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!gameSettings) return;

        const turnDuration = gameSettings.turnDuration;
        const era3Years = 30;
        const completedTurns = elements.filter(el => el.owner === currentPlayer.playerNumber && el.era === 4 && el.creationStep === '4.1 Exploration' && !el.isDebug).length;
        const turn = completedTurns + 1;
        const startYear = era3Years + ((turn - 1) * turnDuration) + 1;

        const landmarkData: Omit<Location, 'id'> = {
            name: landmarkName,
            siteType: 'natural',
            description: landmarkDesc,
            symbol: landmarkSymbol,
        };

        onCreateElement({
            type: 'Location',
            name: landmarkName,
            owner: currentPlayer.playerNumber,
            era: 4,
            data: { id: `data-${crypto.randomUUID()}`, ...landmarkData }
        }, startYear);
        setStep(2);
    };

    const handleRaceRoll = (result: string) => {
        setTribeRace(result);
        setStep(3);
    };

    const handleTribeCreate = (factionData: Omit<Faction, 'id'>) => {
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
        setStep(4);
    };
    
    const handleSettlementCreate = (settlementData: any) => {
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

    return (
        <div className="space-y-4">
            {step === 1 && (
                <form onSubmit={handleLandmarkSubmit} className="p-6 border rounded-lg bg-white shadow-sm space-y-4 animate-fade-in-slide-up">
                    <h3 className="text-lg font-semibold">Step 1: Create the Landmark</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                             <label htmlFor="landmark-name" className="block text-sm font-medium text-gray-700">Landmark Name</label>
                            <input type="text" id="landmark-name" value={landmarkName} onChange={e => setLandmarkName(e.target.value)} required className={inputClasses} />
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700">Symbol</label>
                            <button ref={triggerRef} type="button" onClick={() => setIsPickerOpen(true)} className={`${inputClasses} text-2xl`}>{landmarkSymbol}</button>
                            <EmojiPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onSelect={setLandmarkSymbol} triggerRef={triggerRef} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="landmark-desc" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="landmark-desc" value={landmarkDesc} onChange={e => setLandmarkDesc(e.target.value)} rows={4} required className={inputClasses} />
                    </div>
                    <button type="submit" className="w-full bg-amber-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-700">Create Landmark & Proceed</button>
                </form>
            )}

            {step === 2 && (
                <div className="animate-fade-in-slide-up">
                    <SubRollHelper
                        title="Step 2: Roll for Tribe's Race (Race Table 3.1)"
                        diceType="2d6"
                        table={raceTable}
                        onRoll={handleRaceRoll}
                        disabled={!!tribeRace}
                    />
                </div>
            )}
            
            {step === 3 && tribeRace && (
                 <div className="animate-fade-in-slide-up">
                    <h3 className="text-lg font-semibold mb-2">Step 3: Create the Tribe ({tribeRace})</h3>
                    <FactionForm
                        onCreate={handleTribeCreate}
                        isNeighbor={true}
                        currentPlayer={currentPlayer}
                    />
                 </div>
            )}

            {step === 4 && (
                <div className="animate-fade-in-slide-up">
                    <SettlementForm
                        title="Step 4: Create the Tribe's Settlement"
                        primeFaction={primeFaction} // Pass prime faction for context, even though this is a neighbor
                        onCreate={handleSettlementCreate}
                        onComplete={onComplete}
                    />
                </div>
            )}
        </div>
    );
};

export default LandmarkAndTribeCreator;