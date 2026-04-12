
import { useMemo } from 'react';
import { CompendiumEntry } from '../types/compendium';

// Helper type for parsed entries
type ParsedCompendiumEntry = CompendiumEntry & { parsedDetails: any };

export const useFilteredEntities = (
    adventureEntries: CompendiumEntry[],
    searchQuery: string,
    filterLocationId: string,
    filterFactionId: string
) => {
    // Step 1: Pre-parse all JSON content once.
    const parsedEntries: ParsedCompendiumEntry[] = useMemo(() => {
        try {
            return adventureEntries.map(e => ({
                ...e,
                parsedDetails: e.fullContent && e.fullContent !== '{}' ? JSON.parse(e.fullContent) : null,
            }));
        } catch (error) {
            console.error("Failed to parse compendium entries:", error);
            return adventureEntries.map(e => ({ ...e, parsedDetails: null }));
        }
    }, [adventureEntries]);

    // Step 2: Memoize the categorized lists.
    const scenes = useMemo(() => parsedEntries.filter(e => e.category === 'event'), [parsedEntries]);
    const locations = useMemo(() => parsedEntries.filter(e => e.category === 'location'), [parsedEntries]);
    const npcs = useMemo(() => parsedEntries.filter(e => e.category === 'npc'), [parsedEntries]);
    const factions = useMemo(() => parsedEntries.filter(e => e.category === 'faction'), [parsedEntries]);
    
    // Step 3: Create fast lookup maps for relationships to optimize filtering.
    const locationToNpcTitlesMap = useMemo(() => {
        const map = new Map<string, Set<string>>();
        scenes.forEach(scene => {
            const locationId = scene.relationships.connectedEntries[0];
            if (locationId && scene.parsedDetails?.npcs) {
                if (!map.has(locationId)) {
                    map.set(locationId, new Set());
                }
                const npcTitlesSet = map.get(locationId)!;
                scene.parsedDetails.npcs.forEach((n: { name: string }) => npcTitlesSet.add(n.name));
            }
        });
        return map;
    }, [scenes]);

    const npcTitleToFactionIdMap = useMemo(() => {
        const map = new Map<string, string>();
        npcs.forEach(npc => {
            if (npc.relationships.connectedEntries.length > 0) {
                map.set(npc.title, npc.relationships.connectedEntries[0]);
            }
        });
        return map;
    }, [npcs]);

    const locationToFactionIdsMap = useMemo(() => {
        const map = new Map<string, Set<string>>();
        for (const [locationId, npcTitles] of locationToNpcTitlesMap.entries()) {
            const factionIds = new Set<string>();
            for (const npcTitle of npcTitles) {
                const factionId = npcTitleToFactionIdMap.get(npcTitle);
                if (factionId) {
                    factionIds.add(factionId);
                }
            }
            if (factionIds.size > 0) {
                map.set(locationId, factionIds);
            }
        }
        return map;
    }, [locationToNpcTitlesMap, npcTitleToFactionIdMap]);


    // Step 4: Apply optimized filtering logic.
    const filteredOutline = useMemo(() => {
        return scenes.filter(scene => {
            const matchesSearch = !searchQuery || scene.title.toLowerCase().includes(searchQuery.toLowerCase()) || scene.summary.toLowerCase().includes(searchQuery.toLowerCase());
            const locationId = scene.relationships.connectedEntries[0];
            const matchesLocation = !filterLocationId || locationId === filterLocationId;
            return matchesSearch && matchesLocation;
        });
    }, [scenes, searchQuery, filterLocationId]);

    const filteredLocations = useMemo(() => {
        return locations.filter(loc => {
            const matchesSearch = !searchQuery || loc.title.toLowerCase().includes(searchQuery.toLowerCase()) || loc.summary.toLowerCase().includes(searchQuery.toLowerCase());
            // This logic was complex; simplifying to a direct filter. If a faction is selected, locations are filtered by whether they contain NPCs of that faction.
            if (filterFactionId) {
                const factionsInLocation = locationToFactionIdsMap.get(loc.id);
                if (!factionsInLocation || !factionsInLocation.has(filterFactionId)) {
                    return false;
                }
            }
            return matchesSearch;
        });
    }, [locations, searchQuery, filterFactionId, locationToFactionIdsMap]);

    const filteredNpcs = useMemo(() => {
        return npcs.filter(npc => {
            const matchesSearch = !searchQuery || npc.title.toLowerCase().includes(searchQuery.toLowerCase()) || npc.summary.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFaction = !filterFactionId || (npc.relationships.connectedEntries[0] === filterFactionId);
            
            const inFilteredLocation = !filterLocationId || (locationToNpcTitlesMap.get(filterLocationId)?.has(npc.title) ?? false);
            
            return matchesSearch && matchesFaction && inFilteredLocation;
        });
    }, [npcs, searchQuery, filterLocationId, filterFactionId, locationToNpcTitlesMap]);

    const filteredFactions = useMemo(() => {
        return factions.filter(fac => {
            const matchesSearch = !searchQuery || fac.title.toLowerCase().includes(searchQuery.toLowerCase()) || fac.summary.toLowerCase().includes(searchQuery.toLowerCase());
            if (filterLocationId) {
                const factionsInLocation = locationToFactionIdsMap.get(filterLocationId);
                if (!factionsInLocation || !factionsInLocation.has(fac.id)) {
                    return false;
                }
            }
            return matchesSearch;
        });
    }, [factions, searchQuery, filterLocationId, locationToFactionIdsMap]);

    return { filteredOutline, filteredLocations, filteredNpcs, filteredFactions };
};
