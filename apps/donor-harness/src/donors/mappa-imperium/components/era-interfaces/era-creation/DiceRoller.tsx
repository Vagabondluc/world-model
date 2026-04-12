import React, { useState } from 'react';
import type { GeographyType } from '@mi/types';

interface DiceRollerProps {
    onRoll: (roll: number, type: GeographyType) => void;
    disabled: boolean;
}

const geographyMap: { [key: number]: GeographyType } = {
    2: 'Savanna', 3: 'Wetlands', 4: 'Hills', 5: 'Lake', 6: 'River', 7: 'Forest',
    8: 'Mountains', 9: 'Desert', 10: 'Jungle', 11: 'Canyon', 12: 'Volcano'
};

const DiceRoller = ({ onRoll, disabled }: DiceRollerProps) => {
    const [isRolling, setIsRolling] = useState(false);
    const [rollHistory, setRollHistory] = useState<{ roll: number, type: GeographyType }[]>([]);

    const handleRoll = () => {
        setIsRolling(true);
        setTimeout(() => {
            const die1 = Math.floor(Math.random() * 6) + 1;
            const die2 = Math.floor(Math.random() * 6) + 1;
            const total = die1 + die2;
            const type = geographyMap[total];
            
            onRoll(total, type);
            setRollHistory(prev => [{ roll: total, type }, ...prev]);
            setIsRolling(false);
        }, 500); // Animation delay
    };

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Dice Roller</h3>
            <button
                onClick={handleRoll}
                disabled={disabled || isRolling}
                className="w-full bg-amber-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-700 transition-all transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
                {isRolling ? 'Rolling...' : 'Roll for Geography (2d6)'}
            </button>
            
            {rollHistory.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold text-gray-600 border-b pb-2 mb-2">Roll History</h4>
                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {rollHistory.map((item, index) => (
                            <li key={index} className={`p-2 rounded-md ${index === 0 ? 'bg-amber-100' : 'bg-gray-50'}`}>
                                <span className="font-bold text-amber-800">{item.roll}:</span> {item.type}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DiceRoller;
