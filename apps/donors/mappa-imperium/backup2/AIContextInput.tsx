import React, { useMemo } from 'react';
import type { ElementCard, Resource, Deity, Location, Faction, Settlement } from '../../types';
import HelpTooltip from './HelpTooltip';

interface AIContextInputProps {
    value: string;
    onChange: (value: string) => void;
    elements: ElementCard[];
    label: string;
    id: string;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    tooltip?: string;
}

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

const AIContextInput: React.FC<AIContextInputProps> = ({
    value,
    onChange,
    elements,
    label,
    id,
    placeholder,
    rows = 3,
    disabled = false,
    tooltip,
}) => {
    const referencedElements = useMemo(() => {
        if (!value) return [];
        const matches = value.match(UUID_REGEX);
        if (!matches) return [];
        const uniqueMatches = [...new Set(matches)];
        return uniqueMatches.map(uuid => {
            const element = elements.find(el => el.id.toLowerCase() === uuid.toLowerCase());
            if (element) {
                let symbol = '❓';
                switch (element.type) {
                    case 'Resource':
                        symbol = (element.data as Resource).symbol;
                        break;
                    case 'Deity':
                        symbol = (element.data as Deity).emoji;
                        break;
                    case 'Location':
                        symbol = (element.data as Location).symbol;
                        break;
                    case 'Faction':
                        symbol = (element.data as Faction).emoji;
                        break;
                    case 'Settlement':
                        symbol = '🏠';
                        break;
                    case 'Event':
                        symbol = '📜';
                        break;
                    case 'Character':
                        symbol = '👤';
                        break;
                    case 'War':
                        symbol = '⚔️';
                        break;
                    case 'Monument':
                        symbol = '🏛️';
                        break;
                }
                return {
                    id: element.id,
                    name: element.name,
                    type: element.type,
                    symbol: symbol || '❓'
                };
            }
            return { id: uuid, name: 'Unknown Element', type: 'Unknown', symbol: '❓' };
        });
    }, [value, elements]);

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {tooltip && <HelpTooltip text={tooltip} />}
            </label>
            <textarea
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-50 bg-white text-gray-900"
                disabled={disabled}
                aria-describedby={referencedElements.length > 0 ? `${id}-references` : undefined}
            />
            {referencedElements.length > 0 && (
                <div id={`${id}-references`} className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md" aria-live="polite">
                    <p className="text-xs font-semibold text-amber-800 mb-1">Referenced Elements:</p>
                    <ul className="flex flex-wrap gap-2">
                        {referencedElements.map(el => (
                            <li key={el.id} className="flex items-center gap-1 text-xs bg-amber-100 text-amber-900 px-2 py-1 rounded-full" title={`ID: ${el.id}`}>
                                <span>{el.symbol}</span>
                                <span className="font-medium">{el.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AIContextInput;