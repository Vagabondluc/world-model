import React from 'react';

interface DicePipProps {
    value: number;
}

const pipLayout: { [key: number]: string[] } = {
    1: ['center middle'],
    2: ['top-left', 'bottom-right'],
    3: ['top-left', 'center middle', 'bottom-right'],
    4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    5: ['top-left', 'top-right', 'center middle', 'bottom-left', 'bottom-right'],
    6: ['top-left', 'top-right', 'center-left', 'center-right', 'bottom-left', 'bottom-right'],
};

const positionClasses: { [key: string]: string } = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'center middle': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'center-left': 'top-1/2 left-2 -translate-y-1/2',
    'center-right': 'top-1/2 right-2 -translate-y-1/2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
};

const DicePip = ({ value }: DicePipProps) => {
    const pips = pipLayout[value] || [];

    return (
        <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-gray-300 p-1 relative shadow-sm" aria-label={`Dice showing ${value}`}>
            {pips.map(pos => (
                <div key={pos} className={`absolute w-2 h-2 bg-gray-700 rounded-full ${positionClasses[pos]}`}></div>
            ))}
        </div>
    );
};

export default DicePip;
