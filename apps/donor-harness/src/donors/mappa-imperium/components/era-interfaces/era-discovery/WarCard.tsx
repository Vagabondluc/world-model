import React, { useState, useRef } from 'react';
import type { ElementCard, War } from '@mi/types';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

interface WarCardProps {
    element: ElementCard;
    onEdit: (element: ElementCard) => void;
    onDelete: (elementId: string, elementName: string) => void;
    onExportHtml: (element: ElementCard) => void;
    onExportMarkdown: (element: ElementCard) => void;
}

const WarCard = ({ element, onEdit, onDelete, onExportHtml, onExportMarkdown }: WarCardProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(menuRef, () => setIsMenuOpen(false));

    if (element.type !== 'War') return null;
    const warData = element.data as War;

    const buttonId = `menu-button-war-${element.id}`;
    
    return (
        <div className="card-base border-l-4 border-amber-500 flex-col gap-4">
            <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-4xl shadow-inner">
                    ⚔️
                </div>
                <div className="flex-grow">
                     <div className="flex justify-between items-start">
                        <h4 className="text-xl font-bold text-gray-800">{warData.name}</h4>
                        <div className="relative" ref={menuRef}>
                            <button id={buttonId} onClick={() => setIsMenuOpen(!isMenuOpen)} className="btn-menu-trigger" aria-haspopup="true" aria-expanded={isMenuOpen} aria-controls={`menu-war-${element.id}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                            </button>
                            {isMenuOpen && (
                                <div id={`menu-war-${element.id}`} className="dropdown-menu w-48 animate-fade-in-down" role="menu" aria-orientation="vertical" aria-labelledby={buttonId}>
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
                    <p className="mt-1 text-gray-600 whitespace-pre-wrap text-sm">{warData.description}</p>
                </div>
            </div>
        </div>
    );
};

export default WarCard;
