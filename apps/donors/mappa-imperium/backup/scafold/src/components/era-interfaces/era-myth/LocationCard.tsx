import React, { useState, useRef } from 'react';
import type { ElementCard, Location } from '../../../types';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

interface LocationCardProps {
    element: ElementCard;
    onEdit: (element: ElementCard) => void;
    onDelete: (elementId: string, elementName: string) => void;
    onExportHtml: (element: ElementCard) => void;
    onExportMarkdown: (element: ElementCard) => void;
}

const LocationCard = ({ element, onEdit, onDelete, onExportHtml, onExportMarkdown }: LocationCardProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(menuRef, () => setIsMenuOpen(false));

    if (element.type !== 'Location') return null;
    const location = element.data as Location;
    
    const buttonId = `menu-button-location-${element.id}`;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-green-500 flex flex-col gap-4">
            <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-4xl shadow-inner">
                    {location.symbol}
                </div>
                <div className="flex-grow">
                     <div className="flex justify-between items-start">
                        <h4 className="text-xl font-bold text-gray-800">{location.name}</h4>
                        <div className="relative" ref={menuRef}>
                            <button id={buttonId} onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors" aria-haspopup="true" aria-expanded={isMenuOpen} aria-controls={`menu-location-${element.id}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                            </button>
                            {isMenuOpen && (
                                <div id={`menu-location-${element.id}`} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10 animate-fade-in-down" role="menu" aria-orientation="vertical" aria-labelledby={buttonId}>
                                    <div className="py-1 text-gray-800" role="none">
                                        <button role="menuitem" onClick={() => { onEdit(element); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Edit</button>
                                        <hr/>
                                        <button role="menuitem" onClick={() => { onExportHtml(element); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export HTML</button>
                                        <button role="menuitem" onClick={() => { onExportMarkdown(element); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export Markdown</button>
                                        <hr/>
                                        <button role="menuitem" onClick={() => { onDelete(element.id, element.name); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <span className="text-sm font-semibold text-green-800 bg-green-100 px-2 py-0.5 rounded-full inline-block capitalize">
                        {location.siteType}
                    </span>
                    <p className="mt-2 text-gray-600 whitespace-pre-wrap text-sm">{location.description}</p>
                </div>
            </div>
        </div>
    );
};

export default LocationCard;
