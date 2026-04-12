import React from 'react';
import type { ElementCard, Deity } from '../../../types';
import DeityCreatorForm from './DeityCreatorForm';
import DeityCard from './DeityCard';

interface DeityCreatorProps {
    deityCount: number;
    playerDeities: ElementCard[];
    onDeityCreated: (deity: Omit<Deity, 'id'>, year: number) => void;
    onProceed: () => void;
    onStartOver: () => void;
}

const DeityCreator = ({
    deityCount,
    playerDeities,
    onDeityCreated,
    onProceed,
    onStartOver
}: DeityCreatorProps) => {
    const isPantheonComplete = playerDeities.length >= deityCount && deityCount > 0;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-amber-800">2.2 Create Your Pantheon</h2>
                    <p className="mt-2 text-lg text-gray-600">Define the deities that will shape your world's destiny.</p>
                </div>
                <button onClick={onStartOver} className="text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors">Start Over</button>
            </header>
            
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                <p className="text-xl font-semibold text-amber-800">
                    Progress: <span className="font-bold">{playerDeities.length} / {deityCount}</span> deities created.
                </p>
                {isPantheonComplete && 
                    <div className="mt-2 flex items-center gap-4">
                        <p className="font-bold text-green-700">Pantheon complete!</p>
                        <button onClick={onProceed} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-all shadow">
                            Proceed to Sacred Sites →
                        </button>
                    </div>
                }
            </div>

            <DeityCreatorForm 
                existingDeities={playerDeities}
                onCreate={onDeityCreated}
                disabled={isPantheonComplete}
            />
        </div>
    );
};

export default DeityCreator;