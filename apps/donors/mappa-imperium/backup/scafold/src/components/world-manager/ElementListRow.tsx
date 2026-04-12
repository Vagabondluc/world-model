import React, { useState, useRef } from 'react';
import type { ElementCard, Resource, Deity, Location, Player, GameRole, Faction, Settlement } from '../../types';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import ElementTooltip from '../shared/ElementTooltip';

interface ElementListRowProps {
    card: ElementCard;
    ownerName: string;
    currentPlayer: Player | null;
    gameRole: GameRole;
    onEdit: (card: ElementCard) => void;
    onView: (card: ElementCard) => void;
    onDelete: (cardId: string, cardName: string) => void;
    onExportHtml: (element: ElementCard) => void;
    onExportMarkdown: (element: ElementCard) => void;
}

const typeIcons: { [key in ElementCard['type']]: string } = {
    Resource: '💎',
    Deity: '✨',
    Location: '🏞️',
    Faction: '🛡️',
    Settlement: '🏠',
    Event: '📜',
    Character: '👤',
    War: '⚔️',
    Monument: '🏛️',
};

const ElementListRow = ({ 
    card, 
    ownerName, 
    currentPlayer, 
    gameRole, 
    onEdit, 
    onView, 
    onDelete,
    onExportHtml,
    onExportMarkdown
}: ElementListRowProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(menuRef, () => setIsMenuOpen(false));

    const getEmoji = () => {
         switch (card.type) {
            case 'Resource': return (card.data as Resource).symbol || typeIcons.Resource;
            case 'Deity': return (card.data as Deity).emoji || typeIcons.Deity;
            case 'Location': return (card.data as Location).symbol || typeIcons.Location;
            case 'Faction': return (card.data as Faction).emoji || typeIcons.Faction;
            default: return typeIcons[card.type];
        }
    };

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
        setIsMenuOpen(false);
    };

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(prev => !prev);
    }

    const canEdit = gameRole === 'player' && (card.isDebug || (currentPlayer?.playerNumber === card.owner));

    const buttonId = `menu-button-list-${card.id}`;

    return (
        <ElementTooltip element={card}>
            <div
                className="card-base card-interactive flex-row items-center gap-4 p-3"
                onClick={() => onView(card)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onView(card); } }}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${card.name}`}
            >
                <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-2xl flex-shrink-0">
                    {getEmoji()}
                </div>
                <div className="flex-grow grid grid-cols-4 gap-4 items-center">
                    <div className="font-bold text-gray-800 truncate" title={card.name}>{card.name}</div>
                    <div className="text-sm text-gray-600">{typeIcons[card.type]} {card.type}</div>
                    <div className="text-sm text-gray-600">Era {card.era}</div>
                    <div className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block w-fit">
                        {ownerName}
                    </div>
                </div>
                <div className="flex-shrink-0 relative" ref={menuRef}>
                    <button
                        id={buttonId}
                        onClick={handleMenuToggle}
                        className="btn btn-secondary flex items-center gap-1 text-sm"
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen}
                        aria-controls={`menu-list-${card.id}`}
                    >
                        Actions
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {isMenuOpen && (
                        <div id={`menu-list-${card.id}`} className="dropdown-menu top-full right-0 mt-2 w-48 animate-fade-in-down" role="menu" aria-orientation="vertical" aria-labelledby={buttonId}>
                            <div className="py-1" role="none">
                                <button role="menuitem" onClick={(e) => handleAction(e, () => onView(card))} className="dropdown-item">View</button>
                                {canEdit && <button role="menuitem" onClick={(e) => handleAction(e, () => onEdit(card))} className="dropdown-item">Edit</button>}
                                <hr className="my-1"/>
                                <button role="menuitem" onClick={(e) => handleAction(e, () => onExportHtml(card))} className="dropdown-item">Export as HTML</button>
                                <button role="menuitem" onClick={(e) => handleAction(e, () => onExportMarkdown(card))} className="dropdown-item">Export as Markdown</button>
                                {canEdit && <hr className="my-1"/>}
                                {canEdit && <button role="menuitem" onClick={(e) => handleAction(e, () => onDelete(card.id, card.name))} className="dropdown-item text-red-600 hover:bg-red-50">Delete</button>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ElementTooltip>
    );
};

export default ElementListRow;
