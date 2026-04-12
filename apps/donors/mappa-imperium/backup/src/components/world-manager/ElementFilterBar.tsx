
import React from 'react';
import type { Player } from '../../types';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';

interface ElementFilterBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterOwner: string;
    setFilterOwner: (owner: string) => void;
    filterEra: string;
    setFilterEra: (era: string) => void;
    filterType: string;
    setFilterType: (type: string) => void;
    viewMode: 'grid' | 'list' | 'timeline';
    setViewMode: (mode: 'grid' | 'list' | 'timeline') => void;
    players: Player[];
    elementEras: number[];
    elementTypes: string[];
}

const ElementFilterBar = ({
    searchTerm, setSearchTerm,
    filterOwner, setFilterOwner,
    filterEra, setFilterEra,
    filterType, setFilterType,
    viewMode, setViewMode,
    players, elementEras, elementTypes
}: ElementFilterBarProps) => {
    return (
        <div className={componentStyles.layout.filterBar}>
            <div className="flex-grow w-full">
                <input
                    type="search"
                    placeholder="Search by name, type, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={componentStyles.input.base}
                />
            </div>
            <div className="flex-shrink-0 flex items-center gap-4 flex-wrap">
                <select
                    value={filterOwner}
                    onChange={(e) => setFilterOwner(e.target.value)}
                    className={componentStyles.input.base}
                    aria-label="Filter by owner"
                >
                    <option value="">All Owners</option>
                    {players.map(p => <option key={p.playerNumber} value={p.playerNumber}>{p.name}</option>)}
                </select>
                <select
                    value={filterEra}
                    onChange={(e) => setFilterEra(e.target.value)}
                    className={componentStyles.input.base}
                    aria-label="Filter by era"
                >
                    <option value="">All Eras</option>
                    {elementEras.map(era => <option key={era} value={era}>Era {era}</option>)}
                </select>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className={componentStyles.input.base}
                    aria-label="Filter by type"
                >
                    <option value="">All Types</option>
                    {elementTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <div className={componentStyles.toggleGroup}>
                    <button onClick={() => setViewMode('grid')} className={cn(componentStyles.toggleBtn, viewMode === 'grid' && componentStyles.toggleBtnActive)} aria-label="Grid View">Grid</button>
                    <button onClick={() => setViewMode('list')} className={cn(componentStyles.toggleBtn, viewMode === 'list' && componentStyles.toggleBtnActive)} aria-label="List View">List</button>
                    <button onClick={() => setViewMode('timeline')} className={cn(componentStyles.toggleBtn, viewMode === 'timeline' && componentStyles.toggleBtnActive)} aria-label="Timeline View">Timeline</button>
                </div>
            </div>
        </div>
    );
};

export default ElementFilterBar;
