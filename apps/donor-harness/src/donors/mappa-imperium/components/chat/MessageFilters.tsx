import React from 'react';
import { cn } from '../../utils/cn';

interface MessageFiltersProps {
    currentFilter: 'all' | 'system' | 'player' | 'action';
    onFilterChange: (filter: 'all' | 'system' | 'player' | 'action') => void;
}

const MessageFilters: React.FC<MessageFiltersProps> = ({ currentFilter, onFilterChange }) => {
    const filters: { id: 'all' | 'system' | 'player' | 'action'; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'system', label: 'System' },
        { id: 'player', label: 'Player' },
        { id: 'action', label: 'Action' },
    ];

    return (
        <div className="flex bg-stone-100 p-1 rounded-md mb-2">
            {filters.map(filter => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={cn(
                        "flex-1 text-xs py-1 px-2 rounded transition-colors font-medium",
                        currentFilter === filter.id
                            ? "bg-white text-stone-800 shadow-sm"
                            : "text-stone-500 hover:text-stone-700 hover:bg-stone-200"
                    )}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
};

export default MessageFilters;
