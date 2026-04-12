import React, { useState } from 'react';
import DicePip from '../../shared/DicePip';

interface SubRollHelperProps {
    title: string;
    diceType: '1d6' | '2d6' | '3d6';
    table: Record<string, string>;
    onRoll: (result: string, roll: number) => void;
    disabled?: boolean;
}

const SubRollHelper = ({ title, diceType, table, onRoll, disabled }: SubRollHelperProps) => {
    const [diceValues, setDiceValues] = useState<number[]>([1]);
    const [result, setResult] = useState<string | null>(null);

    const handleRoll = () => {
        let total = 0;
        let dice: number[] = [];
        const numDice = parseInt(diceType.charAt(0), 10);
        for(let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            total += roll;
            dice.push(roll);
        }
        setDiceValues(dice);

        const rollResult = table[total] || 'No result for this roll.';
        setResult(rollResult);
        onRoll(rollResult, total);
    };

    return (
        <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
            <h4 className="font-semibold text-gray-800">{title}</h4>
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={handleRoll}
                    disabled={disabled}
                    className="bg-amber-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors shadow disabled:bg-gray-400"
                >
                    Roll {diceType}
                </button>
                <div className="flex items-center gap-2">
                    {diceValues.map((val, i) => <DicePip key={i} value={val} />)}
                </div>
            </div>
            {result && (
                <div className="p-3 bg-amber-100 border-l-4 border-amber-500 rounded-r-md text-amber-900">
                    <p><strong>Result:</strong> {result}</p>
                </div>
            )}
        </div>
    );
};

export default SubRollHelper;
