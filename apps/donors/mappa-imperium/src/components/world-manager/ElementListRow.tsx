import React from 'react';
import type { ElementCard } from '../../types';

interface ElementListRowProps {
    card: ElementCard;
    ownerName: string;
    onView: (el: ElementCard) => void;
    [key: string]: any;
}

const ElementListRow: React.FC<ElementListRowProps> = ({ card, ownerName, onView }) => {
    return (
        <div className="border rounded p-3 flex justify-between items-center bg-white hover:bg-gray-50 cursor-pointer" onClick={() => onView(card)}>
            <div>
                <span className="font-bold mr-2">{card.name}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{card.type}</span>
            </div>
            <div className="text-sm text-gray-500">{ownerName}</div>
        </div>
    );
};

export default ElementListRow;
