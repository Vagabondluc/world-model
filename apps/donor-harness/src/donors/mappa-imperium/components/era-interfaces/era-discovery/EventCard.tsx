import React, { useState, useRef, useMemo } from 'react';
import type { ElementCard, Event } from '@mi/types';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

interface EventCardProps {
    element: ElementCard;
    elements: ElementCard[];
    onEdit: (element: ElementCard) => void;
    onDelete: (elementId: string, elementName: string) => void;
    onExportHtml: (element: ElementCard) => void;
    onExportMarkdown: (element: ElementCard) => void;
}

const EventCard = ({ element, elements, onEdit, onDelete, onExportHtml, onExportMarkdown }: EventCardProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(menuRef, () => setIsMenuOpen(false));

    if (element.type !== 'Event') return null;
    const eventData = element.data as Event;

    const ownerFaction = useMemo(() => {
        if (eventData.factionId) {
            return elements.find(el => el.id === eventData.factionId);
        }
        return null;
    }, [eventData.factionId, elements]);

    const buttonId = `menu-button-event-${element.id}`;
    
    return (
        <div className="card-base border-l-4 border-amber-500 flex-col gap-4">
            <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-4xl shadow-inner">
                    📜
                </div>
                <div className="flex-grow">
                     <div className="flex justify-between items-start">
                        <h4 className="text-xl font-bold text-gray-800">{eventData.name}</h4>
                        <div className="relative" ref={menuRef}>
                            <button id={buttonId} onClick={() => setIsMenuOpen(!isMenuOpen)} className="btn-menu-trigger" aria-haspopup="true" aria-expanded={isMenuOpen} aria-controls={`menu-event-${element.id}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                            </button>
                            {isMenuOpen && (
                                <div id={`menu-event-${element.id}`} className="dropdown-menu w-48 animate-fade-in-down" role="menu" aria-orientation="vertical" aria-labelledby={buttonId}>
                                    <div className="py-1 text-gray-800" role="none">
                                        <button role="menuitem" onClick={() => { onEdit(element); setIsMenuOpen(false); }} className="dropdown-item">Edit</button>
                                        <hr className="my-1"/>
                                        <button role="menuitem" onClick={() => { onExportHtml(element); setIsMenuOpen(false); }} className="dropdown-item">Export HTML</button>
                                        <button role="menuitem" onClick={() => { onExportMarkdown(element); setIsMenuOpen(false); }} className="dropdown-item">Export Markdown</button>
                                        <hr className="my-1"/>
                                        <button role="menuitem" onClick={() => { onDelete(element.id, element.name); setIsMenuOpen(false); }} className="dropdown-item text-red-600 hover:bg-red-50">Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="mt-1 text-gray-600 whitespace-pre-wrap text-sm">{eventData.description}</p>
                    {ownerFaction && (
                        <p className="mt-2 text-xs text-gray-500">
                            Related Faction: <strong>{ownerFaction.name}</strong>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;
