import React from 'react';
import type { ElementCard } from '@mi/types';

interface ElementCardRendererProps {
    element: ElementCard;
    elements: ElementCard[];
    onEdit: (element: ElementCard) => void;
    onDelete: (id: string, name: string) => void;
    onExportHtml: (element: ElementCard) => void;
    onExportMarkdown: (element: ElementCard) => void;
}

const ElementCardRenderer: React.FC<ElementCardRendererProps> = ({ element, onEdit, onDelete }) => {
    return (
        <div className="border rounded p-3 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-amber-900 truncate">{element.name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{element.type}</p>
                    {element.desc && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{element.desc}</p>
                    )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                    <button
                        onClick={() => onEdit(element)}
                        className="text-xs px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                        title="Edit"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(element.id, element.name)}
                        className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                        title="Delete"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ElementCardRenderer;
