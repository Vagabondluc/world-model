import React, { useState } from 'react';
import DiceRoller from '../era-foundation/DiceRoller';

interface PantheonSetupProps {
    onCountSelect: (count: number) => void;
}

const PantheonSetup: React.FC<PantheonSetupProps> = ({ onCountSelect }) => {
    const [hasRolled, setHasRolled] = useState(false);
    const [result, setResult] = useState<number | null>(null);

    const handleRollComplete = (total: number) => {
        setResult(total);
        setHasRolled(true);
        // Wait a brief moment so user sees the dice result before auto-confirming? 
        // Or present a "Confirm" button?
        // Let's settle on auto-confirming or providing a button to proceed.
        // User feedback implies: "roll an d6 and you might have 1 to 4 god"
        // For now, let's map 1-6 directly. If result > 6 (impossible for d6), cap it.
    };

    const handleConfirm = () => {
        if (result !== null) {
            onCountSelect(result); // Using raw d6 result for now as per plan
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg border shadow-sm">
            <h3 className="text-xl font-bold mb-2">Pantheon Setup</h3>
            <p className="text-gray-600 mb-6">Roll a d6 to determine how many deities will inhabit your pantheon.</p>

            <div className="flex flex-col items-center justify-center gap-6">
                {!hasRolled ? (
                    <div className="w-full max-w-xs">
                        <DiceRoller
                            diceCount={1}
                            diceType={6}
                            onRollComplete={handleRollComplete}
                            buttonLabel="Roll for Deities (d6)"
                        />
                    </div>
                ) : (
                    <div className="text-center space-y-4 animate-in fade-in duration-500">
                        <div className="text-5xl font-bold text-amber-600 mb-2">{result}</div>
                        <p className="text-lg font-medium text-gray-800">Your pantheon will have {result} deities.</p>
                        <button
                            onClick={handleConfirm}
                            className="bg-amber-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-amber-700 transition-colors shadow-lg"
                        >
                            Accept & Begin Creation
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PantheonSetup;
