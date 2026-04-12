
import { useState, useMemo } from 'react';
import type { ElementCard, Resource, Deity, Location, Faction, Settlement, Event, Character, War, Monument } from '../../../types';

export const useElementFilters = (elements: ElementCard[]) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOwner, setFilterOwner] = useState('');
    const [filterEra, setFilterEra] = useState('');
    const [filterType, setFilterType] = useState('');

    const elementTypes = useMemo(() => Array.from(new Set(elements.map(el => el.type))), [elements]);
    const elementEras = useMemo(() => Array.from(new Set(elements.map(el => el.era))).sort((a, b) => a - b), [elements]);

    const filteredElements = useMemo(() => {
        const filtered = elements.filter(el => {
            const lowerSearch = searchTerm.toLowerCase();
            let searchableText = '';

            switch (el.type) {
                case 'Resource': searchableText = (el.data as Resource).properties; break;
                case 'Deity': searchableText = `${(el.data as Deity).description} ${(el.data as Deity).domain}`; break;
                case 'Location': searchableText = (el.data as Location).description; break;
                case 'Faction':
                    const faction = el.data as Faction;
                    searchableText = `${faction.race} ${faction.theme} ${faction.leaderName} ${faction.symbolName} ${faction.description} ${faction.industry} ${faction.industryDescription}`;
                    break;
                case 'Settlement':
                    const settlement = el.data as Settlement;
                    searchableText = `${settlement.purpose} ${settlement.description}`;
                    break;
                case 'Event': searchableText = (el.data as Event).description; break;
                case 'Character': searchableText = (el.data as Character).description; break;
                case 'War': searchableText = (el.data as War).description; break;
                case 'Monument': searchableText = (el.data as Monument).description; break;
            }

            const searchMatch = lowerSearch === '' ||
                el.name.toLowerCase().includes(lowerSearch) ||
                el.type.toLowerCase().includes(lowerSearch) ||
                (searchableText && searchableText.toLowerCase().includes(lowerSearch));

            const ownerMatch = filterOwner === '' || el.owner === parseInt(filterOwner, 10);
            const eraMatch = filterEra === '' || el.era === parseInt(filterEra, 10);
            const typeMatch = filterType === '' || el.type === filterType;

            return searchMatch && ownerMatch && eraMatch && typeMatch;
        });

        if (viewMode === 'timeline') {
            return filtered.sort((a, b) => (a.createdYear || Infinity) - (b.createdYear || Infinity));
        }
        return filtered;
    }, [elements, searchTerm, filterOwner, filterEra, filterType, viewMode]);

    return {
        viewMode, setViewMode,
        searchTerm, setSearchTerm,
        filterOwner, setFilterOwner,
        filterEra, setFilterEra,
        filterType, setFilterType,
        filteredElements,
        elementTypes,
        elementEras
    };
};
