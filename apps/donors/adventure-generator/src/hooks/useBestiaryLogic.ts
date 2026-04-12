
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCampaignStore } from '../stores/campaignStore';
import { loadSrdMonster } from '../services/monsterLoader';
import { SavedMonster, MonsterIndexEntry } from '../types/npc';
import { getMonsterCR, getMonsterType } from '../utils/monsterHelpers';
import { useDebounce } from './useDebounce';
import { ViewMode, SortOption } from '../components/bestiary/BestiaryToolbar';

export const useBestiaryLogic = () => {
    const userMonsters = useCampaignStore(s => s.bestiary);
    const loadedMonsterIndex = useCampaignStore(s => s.loadedMonsterIndex);
    const removeFromBestiary = useCampaignStore(s => s.removeFromBestiary);
    const areDatabasesLoaded = useCampaignStore(s => s.areDatabasesLoaded);
    const refreshEnabledDatabases = useCampaignStore(s => s.refreshEnabledDatabases);

    const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null);
    const [detailedMonster, setDetailedMonster] = useState<SavedMonster | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [selectedType, setSelectedType] = useState('');
    const [minCr, setMinCr] = useState('');
    const [maxCr, setMaxCr] = useState('');
    const debouncedMinCr = useDebounce(minCr, 300);
    const debouncedMaxCr = useDebounce(maxCr, 300);
    const [sortBy, setSortBy] = useState<SortOption>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        if (!areDatabasesLoaded) {
            refreshEnabledDatabases();
        }
    }, [areDatabasesLoaded, refreshEnabledDatabases]);

    useEffect(() => {
        if (!selectedMonsterId) {
            setDetailedMonster(null);
            return;
        }

        const loadDetails = async () => {
            setIsLoadingDetails(true);
            const userMonster = userMonsters.find(m => m.id === selectedMonsterId);
            if (userMonster) {
                setDetailedMonster(userMonster);
            } else {
                const monster = await loadSrdMonster(selectedMonsterId);
                setDetailedMonster(monster);
            }
            setIsLoadingDetails(false);
        };
        loadDetails();
    }, [selectedMonsterId, userMonsters]);

    const allMonstersForList = useMemo(() => {
        const userMonsterIndexItems: MonsterIndexEntry[] = userMonsters.map(m => ({
            id: m.id,
            name: m.name,
            cr: m.profile.table.challengeRating?.split(' ')[0] || '?',
            type: getMonsterType(m),
            size: m.profile.table.size,
            isSrd: false,
            source: 'user'
        }));

        return [...userMonsterIndexItems, ...loadedMonsterIndex];
    }, [userMonsters, loadedMonsterIndex]);

    const handleDelete = useCallback((id: string) => {
        if (window.confirm("Are you sure you want to delete this monster?")) {
            removeFromBestiary(id);
            if (selectedMonsterId === id) setSelectedMonsterId(null);
        }
    }, [removeFromBestiary, selectedMonsterId]);

    // OPTIMIZATION: Pre-calculate numeric CR to speed up filtering and sorting.
    const monstersWithNumericCR = useMemo(() => {
        return allMonstersForList.map(monster => ({
            ...monster,
            numericCR: getMonsterCR(monster),
        }));
    }, [allMonstersForList]);

    const enabledSources = useCampaignStore(s => s.config.enabledContentSources);

    const filteredAndSortedMonsters = useMemo(() => {
        const lowercasedQuery = debouncedSearchQuery.toLowerCase();

        const filtered = monstersWithNumericCR.filter(monster => {
            // Source Filter
            if (enabledSources && enabledSources.length > 0) {
                // Must be in enabled sources, unless it is user-generated (always visible)
                if (monster.source !== 'user' && !enabledSources.includes(monster.source || 'unknown')) {
                    return false;
                }
            }

            if (lowercasedQuery && !monster.name.toLowerCase().includes(lowercasedQuery)) return false;
            if (selectedType && monster.type !== selectedType) return false;

            const cr = monster.numericCR;
            if (debouncedMinCr !== '' && cr < parseFloat(debouncedMinCr)) return false;
            if (debouncedMaxCr !== '' && cr > parseFloat(debouncedMaxCr)) return false;
            return true;
        });

        return [...filtered].sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name': comparison = a.name.localeCompare(b.name); break;
                case 'cr': comparison = a.numericCR - b.numericCR; break;
                case 'type': comparison = a.type.localeCompare(b.type); break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [monstersWithNumericCR, debouncedSearchQuery, selectedType, debouncedMinCr, debouncedMaxCr, sortBy, sortDirection]);

    return {
        areDatabasesLoaded,
        loadedMonsterIndex,
        allMonstersForList,
        filteredAndSortedMonsters,

        selectedMonsterId,
        detailedMonster,
        isLoadingDetails,

        viewMode,
        searchQuery,
        selectedType,
        minCr,
        maxCr,
        sortBy,
        sortDirection,

        setSelectedMonsterId,
        setViewMode,
        setSearchQuery,
        setSelectedType,
        setMinCr,
        setMaxCr,
        setSortBy,
        setSortDirection: () => setSortDirection(p => p === 'asc' ? 'desc' : 'asc'),
        handleDelete
    };
};