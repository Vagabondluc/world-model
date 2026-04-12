import React, { useState, useEffect } from 'react';
import DicePip from '../../shared/DicePip';

interface DiceRollerProps {
    title: string;
    diceNotation: '1d6' | '2d6';
    resultTable: Record<number, string>;
    onRoll: (result: string, roll: number) => void;
    buttonText?: string;
    hideResult?: boolean;
    disabled?: boolean;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ title, diceNotation, resultTable, onRoll, buttonText = "Roll", hideResult = false, disabled = false }) => {
    const numDice = parseInt(diceNotation[0], 10);
    const [diceValues, setDiceValues] = useState<number[]>(Array(numDice).fill(1));
    const [manualRoll, setManualRoll] = useState<string>('');

    const handleRoll = () => {
        let total = 0;
        const newDiceValues = [];
        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            total += roll;
            newDiceValues.push(roll);
        }
        setDiceValues(newDiceValues);
        setManualRoll(total.toString());
        onRoll(resultTable[total], total);
    };

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numValue = parseInt(value, 10);
        setManualRoll(value);

        if (resultTable[numValue]) {
            onRoll(resultTable[numValue], numValue);
        } else {
            onRoll('', 0);
        }
    };
    
    const total = manualRoll !== '' ? parseInt(manualRoll, 10) : diceValues.reduce((a, b) => a + b, 0);
    const resultText = resultTable[total] || 'Invalid Roll';

    return (
        <div className="p-4 border rounded-lg bg-gray-50/80 shadow-inner space-y-3">
            <h4 className="font-semibold text-gray-800">{title}</h4>
            <div className="flex items-center gap-4 flex-wrap">
                <button 
                    type="button" 
                    onClick={handleRoll} 
                    disabled={disabled}
                    className="bg-amber-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {buttonText}
                </button>
                <div className="flex items-center gap-2">
                    {diceValues.map((val, i) => <DicePip key={i} value={val} />)}
                </div>
                <div>
                    <label htmlFor={`manual-roll-${title}`} className="text-sm font-medium text-gray-700">Override:</label>
                    <input
                        id={`manual-roll-${title}`}
                        type="number"
                        value={manualRoll}
                        onChange={handleManualChange}
                        className="ml-2 w-16 p-1 border border-gray-300 rounded-md text-center"
                        disabled={disabled}
                    />
                </div>
            </div>
            {!hideResult && total > 0 && resultText !== 'Invalid Roll' && (
                <div className="p-3 bg-amber-100 border-l-4 border-amber-500 rounded-r-md text-amber-900">
                    <p><strong>Result:</strong> {resultText}</p>
                </div>
            )}
        </div>
    );
};

export default DiceRoller;