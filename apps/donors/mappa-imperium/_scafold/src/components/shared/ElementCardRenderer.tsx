import React from 'react';
import type { ElementCard } from '../../types';
import ResourceCard from '../era-interfaces/era-creation/resources/ResourceCard';
import DeityCard from '../era-interfaces/era-myth/DeityCard';
import LocationCard from '../era-interfaces/era-myth/LocationCard';
import FactionCard from '../era-interfaces/era-foundation/FactionCard';
import SettlementCard from '../era-interfaces/era-foundation/SettlementCard';
import CharacterCard from '../era-interfaces/era-discovery/CharacterCard';
import EventCard from '../era-interfaces/era-discovery/EventCard';
import WarCard from '../era-interfaces/era-discovery/WarCard';
import MonumentCard from '../era-interfaces/era-discovery/MonumentCard';

// Assume generic cards for types without a custom component yet
const GenericCard = ({ element, ...props }: { element: ElementCard, [key: string]: any }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h4 className="font-bold">{element.name}</h4>
        <p className="text-sm text-gray-500">{element.type}</p>
        <pre className="text-xs mt-2 bg-gray-50 p-2 rounded">
            {JSON.stringify(element.data, null, 2)}
        </pre>
    </div>
);


interface ElementCardRendererProps {
    element: ElementCard;
    elements?: ElementCard[]; // For cards that need context, like SettlementCard
    onEdit: (element: ElementCard) => void;
    onDelete: (elementId: string, elementName: string) => void;
    onExportHtml: (element: ElementCard) => void;
    onExportMarkdown: (element: ElementCard) => void;
}

const ElementCardRenderer = ({ element, ...props }: ElementCardRendererProps) => {
    switch (element.type) {
        case 'Resource':
            return <ResourceCard element={element} onEdit={props.onEdit} onDelete={props.onDelete} onExportHtml={props.onExportHtml} onExportMarkdown={props.onExportMarkdown} />;
        case 'Deity':
            return <DeityCard element={element} onEdit={props.onEdit} onDelete={props.onDelete} onExportHtml={props.onExportHtml} onExportMarkdown={props.onExportMarkdown} />;
        case 'Location':
            return <LocationCard element={element} onEdit={props.onEdit} onDelete={props.onDelete} onExportHtml={props.onExportHtml} onExportMarkdown={props.onExportMarkdown} />;
        case 'Faction':
            return <FactionCard element={element} onEdit={props.onEdit} onDelete={props.onDelete} onExportHtml={props.onExportHtml} onExportMarkdown={props.onExportMarkdown} />;
        case 'Settlement':
            return <SettlementCard element={element} elements={props.elements || []} {...props} />;
        case 'Character':
            return <CharacterCard element={element} {...props} />;
        case 'Event':
            return <EventCard element={element} elements={props.elements || []} {...props} />;
        case 'War':
            return <WarCard element={element} {...props} />;
        case 'Monument':
            return <MonumentCard element={element} {...props} />;
        default:
            return <div>Unknown element type: {element.type}</div>;
    }
};

export default ElementCardRenderer;