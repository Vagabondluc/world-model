import React, { useState, useRef } from 'react';
import type { ElementCard, Resource } from '../../types';
import useOnClickOutside from '../../../../hooks/useOnClickOutside';

interface ResourceCardProps {
    element: ElementCard;
    onEdit: (element: ElementCard) => void;
    onDelete: (elementId: string, elementName: string) => void;
    onExportHtml: (element: ElementCard) => void;
    onExportMarkdown: (element: ElementCard) => void;
}

const typeStyles: { [key in Resource['type']]: { bg: string, text: string } } = {
    mineral: { bg: 'bg-gray-200', text: 'text-gray-800' },
    flora: { bg: 'bg-green-200', text: 'text-green-800' },
    fauna: { bg: 'bg-orange-200', text: 'text-orange-800' },
    magical: { bg: 'bg-purple-200', text: 'text-purple-800' },
    other: { bg: 'bg-blue-200', text: 'text-blue-800' },
};

const ResourceCard = ({ element, onEdit, onDelete, onExportHtml, onExportMarkdown }: ResourceCardProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(menuRef, () => setIsMenuOpen(false));
    
    if (element.type !== 'Resource') {
        return null; // This card is only for Resources
    }

    const resource = element.data as Resource; // Safely cast after check
    const { bg, text } = typeStyles[resource.type];
    
    const handleAction = (action: () => void) => {
        action();
        setIsMenuOpen(false);
    };

    const buttonId = `menu-button-resource-${element.id}`;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-orange-500 flex flex-col gap-4">
            <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-4xl shadow-inner">
                    {resource.symbol}
                </div>
                <div className="flex-grow">
                     <div className="flex justify-between items-start">
                        <h4 className="text-xl font-bold text-gray-800">{resource.name}</h4>
                        <div className="relative" ref={menuRef}>
                            <button
                                id={buttonId}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                                aria-haspopup="true"
                                aria-expanded={isMenuOpen}
                                aria-controls={`menu-resource-${element.id}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                            </button>
                            {isMenuOpen && (
                                <div id={`menu-resource-${element.id}`} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10 animate-fade-in-down" role="menu" aria-orientation="vertical" aria-labelledby={buttonId}>
                                    <div className="py-1 text-gray-800" role="none">
                                        <button role="menuitem" onClick={() => handleAction(() => onEdit(element))} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Edit</button>
                                        <hr/>
                                        <button role="menuitem" onClick={() => handleAction(() => onExportHtml(element))} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export as HTML</button>
                                        <button role="menuitem" onClick={() => handleAction(() => onExportMarkdown(element))} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export as Markdown</button>
                                        <hr/>
                                        <button role="menuitem" onClick={() => handleAction(() => onDelete(element.id, element.name))} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bg} ${text} capitalize`}>
                        {resource.type}
                    </span>
                    <p className="mt-1 text-gray-600 whitespace-pre-wrap">{resource.properties}</p>
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
