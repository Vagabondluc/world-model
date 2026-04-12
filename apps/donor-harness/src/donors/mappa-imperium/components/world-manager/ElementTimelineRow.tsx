import React from 'react';
import type { ElementCard } from '@mi/types';

interface ElementTimelineRowProps {
    card: ElementCard;
    ownerName: string;
    onView: (el: ElementCard) => void;
    [key: string]: any;
}

const ElementTimelineRow: React.FC<ElementTimelineRowProps> = ({ card, ownerName, onView }) => {
    return (
        <div className="flex gap-4 items-center" onClick={() => onView(card)}>
            <div className="w-24 text-right text-sm font-bold text-gray-400">Era {card.era}</div>
            <div className="border-l-2 border-gray-300 pl-4 py-2 flex-grow hover:bg-gray-50 cursor-pointer transition-colors rounded-r">
                <h4 className="font-bold">{card.name}</h4>
                <p className="text-xs text-gray-500">{card.type}</p>
            </div>
        </div>
    );
};

export default ElementTimelineRow;
