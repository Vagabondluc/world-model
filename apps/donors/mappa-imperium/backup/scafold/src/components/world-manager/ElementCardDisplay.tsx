import React, { useState, useRef } from 'react';
import type { ElementCard, Resource, Deity, Location, Player, GameRole, Faction, Settlement, Event, Character, War, Monument } from '../../types';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import ElementTooltip from '../shared/ElementTooltip';

interface ElementCardDisplayProps {
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

const ElementCardDisplay = ({ 
    card, 
    ownerName, 
    currentPlayer, 
    gameRole, 
    onEdit, 
    onView, 
    onDelete,
    onExportHtml,
    onExportMarkdown 
}: ElementCardDisplayProps) => {
    const [isIdCopied, setIsIdCopied] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(menuRef, () => setIsMenuOpen(false));

    const handleCopyId = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
        e.stopPropagation();
        if (isIdCopied) return;
        navigator.clipboard.writeText(id).then(() => {
            setIsIdCopied(true);
            setTimeout(() => setIsIdCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy ID: ', err);
        });
    };

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

    const buttonId = `menu-button-${card.id}`;

    return (
        <ElementTooltip element={card}>
            <div
                className="card-base card-interactive h-full justify-between"
                onClick={() => onView(card)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onView(card); } }}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${card.name}`}
            >
                <div>
                    <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-4xl shadow-inner" title={card.type}>
                            {getEmoji()}
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <h4 className="text-lg font-bold text-gray-800 truncate" title={card.name}>
                                {card.name}
                            </h4>
                            <div className="text-sm text-gray-500">
                                <span>
                                    {typeIcons[card.type]} {card.type} | Era {card.era} {card.creationStep ? `(${card.creationStep.split(' ')[0]})` : ''}
                                    {card.createdYear && ` | Year ${card.createdYear}`}
                                </span>
                            </div>
                            <div className="mt-1 text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block">
                                Owner: {ownerName}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                    <div 
                        className="flex items-center text-xs text-gray-500 group" 
                        onClick={(e) => handleCopyId(e, card.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCopyId(e, card.id); } }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Copy ID: ${card.id}`}
                    >
                        <span className="font-mono truncate max-w-[120px]" title={card.id}>{card.id}</span>
                        <span
                            className="ml-2 p-1 rounded-md bg-gray-100 group-hover:bg-gray-200 text-gray-700 transition-colors"
                            aria-hidden="true"
                        >
                            {isIdCopied ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}
                        </span>
                    </div>
                    <div className="relative" ref={menuRef}>
                         <button
                            id={buttonId}
                            onClick={handleMenuToggle}
                            className="btn btn-secondary flex items-center gap-1 text-sm"
                            aria-haspopup="true"
                            aria-expanded={isMenuOpen}
                            aria-controls={`menu-${card.id}`}
                        >
                            Actions
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {isMenuOpen && (
                            <div id={`menu-${card.id}`} className="dropdown-menu top-full right-0 mt-2 w-48 animate-fade-in-down" role="menu" aria-orientation="vertical" aria-labelledby={buttonId}>
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
            </div>
        </ElementTooltip>
    );
};

export default ElementCardDisplay;