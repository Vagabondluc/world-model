import React from 'react';
import type { ElementCard } from '@mi/types';

interface ElementCardDisplayProps {
    card: ElementCard;
    ownerName: string;
    onEdit: (el: ElementCard) => void;
    onView: (el: ElementCard) => void;
    onDelete: (id: string, name: string) => void;
    onExportHtml: (el: ElementCard) => void;
    onExportMarkdown: (el: ElementCard) => void;
    [key: string]: any;
}

const ElementCardDisplay: React.FC<ElementCardDisplayProps> = ({ card, ownerName, onView }) => {
    return (
        <div className="border rounded p-4 shadow bg-white cursor-pointer hover:shadow-md transition-shadow" onClick={() => onView(card)}>
            <h3 className="font-bold text-lg mb-1">{card.name}</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{card.type} • {ownerName}</p>
            <p className="text-sm text-gray-700 line-clamp-3">{card.desc}</p>
        </div>
    );
};

export default ElementCardDisplay;
