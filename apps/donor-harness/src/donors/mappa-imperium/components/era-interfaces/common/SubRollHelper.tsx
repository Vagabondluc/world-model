import React, { useState } from 'react';

const SubRollHelper = ({ title, diceType, table, onRoll, disabled }: any) => {
    const [rollValue, setRollValue] = useState<number | null>(null);

    const handleRoll = () => {
        if (disabled) return;
        const val = Math.floor(Math.random() * 6) + 1;
        setRollValue(val);
        const result = table[val.toString()] || "Unknown Result";
        onRoll(result);
    };

    return (
        <div className="p-4 border rounded bg-gray-50">
            <h4 className="font-bold mb-2">{title}</h4>
            <div className="flex items-center gap-4">
                <button onClick={handleRoll} disabled={disabled} className="bg-amber-600 text-white px-3 py-1 rounded disabled:opacity-50">Roll {diceType}</button>
                {rollValue && <span className="font-bold">Result: {rollValue}</span>}
            </div>
        </div>
    );
};

export default SubRollHelper;
