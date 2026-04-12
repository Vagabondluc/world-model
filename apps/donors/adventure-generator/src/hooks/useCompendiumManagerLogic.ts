
import { useState, useMemo } from 'react';
import { LoreEntry, CompendiumEntry } from '../types/compendium';
import { useCompendiumStore } from '../stores/compendiumStore';
import { useCampaignStore } from '../stores/campaignStore';
import { generateId } from '../utils/helpers';
import { CompendiumTab } from '../components/compendium/CompendiumNavigation';

export const useCompendiumManagerLogic = () => {
    // Store State
    const {
        loreEntries,
        compendiumEntries,
        addLoreEntry,
        updateLoreEntry,
        deleteLoreEntry,
        navigationStack,
        historyIndex,
        openEntry,
        pushEntry,
        closeDetails
    } = useCompendiumStore();

    const bestiary = useCampaignStore(s => s.bestiary);
    const refreshEnabledDatabases = useCampaignStore(s => s.refreshEnabledDatabases);
    const areDatabasesLoaded = useCampaignStore(s => s.areDatabasesLoaded);

    // Local UI State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<LoreEntry | null>(null);
    const [activeTab, setActiveTab] = useState<CompendiumTab>('lore');

    // Derived Navigation State
    const currentEntryId = navigationStack[historyIndex];
    const selectedEntry = useMemo(() => {
        if (!currentEntryId) return null;
        return loreEntries.find(e => e.id === currentEntryId) || null;
    }, [currentEntryId, loreEntries]);

    // Helpers
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        loreEntries.forEach(entry => entry.tags.forEach(tag => tagSet.add(tag)));
        compendiumEntries.forEach(entry => entry.tags.forEach(tag => tagSet.add(tag)));
        return Array.from(tagSet).sort();
    }, [loreEntries, compendiumEntries]);

    const hazards = useMemo(() => {
        return compendiumEntries.filter(e => e.category === 'hazard');
    }, [compendiumEntries]);

    const loreTypes = [
        { value: 'legend', label: 'Legend', icon: '📜' },
        { value: 'history', label: 'History', icon: '📚' },
        { value: 'culture', label: 'Culture', icon: '🎭' },
        { value: 'religion', label: 'Religion', icon: '⛪' },
        { value: 'organization', label: 'Organization', icon: '🏛️' },
        { value: 'custom', label: 'Custom', icon: '📝' }
    ];

    // Handlers
    const handleSaveLore = (loreData: Partial<LoreEntry>) => {
        if (loreData.id) {
            updateLoreEntry({ ...loreData, lastModified: new Date() } as LoreEntry);
        } else {
            const newLore: LoreEntry = {
                id: generateId(),
                type: loreData.type || 'custom',
                title: loreData.title || 'New Lore Entry',
                content: loreData.content || '',
                tags: loreData.tags || [],
                relatedLocationIds: loreData.relatedLocationIds || [],
                relatedNpcIds: loreData.relatedNpcIds || [],
                relatedFactionsIds: loreData.relatedFactionsIds || [],
                isPublicKnowledge: loreData.isPublicKnowledge ?? true,
                sources: loreData.sources || [],
                createdAt: new Date(),
                lastModified: new Date()
            };
            addLoreEntry(newLore);
        }
        setIsFormOpen(false);
        setEditingEntry(null);
    };

    const handleStartCreate = () => {
        closeDetails();
        setEditingEntry(null);
        setIsFormOpen(true);
    };

    const handleStartEdit = (entry: LoreEntry) => {
        setEditingEntry(entry);
        setIsFormOpen(true);
    };

    const handleDeleteLore = (loreId: string) => {
        if (window.confirm("Are you sure you want to delete this lore entry?")) {
            deleteLoreEntry(loreId);
            setIsFormOpen(false);
            closeDetails();
        }
    };

    const handleNavigate = (id: string) => {
        pushEntry(id);
    };

    return {
        // State
        loreEntries,
        compendiumEntries,
        bestiary,
        hazards,
        areDatabasesLoaded,
        isFormOpen,
        editingEntry,
        activeTab,
        selectedEntry,
        allTags,
        loreTypes,

        // Setters
        setIsFormOpen,
        setEditingEntry,
        setActiveTab,

        // Actions
        openEntry,
        refreshEnabledDatabases,
        closeDetails,

        // Handlers
        handleSaveLore,
        handleStartCreate,
        handleStartEdit,
        handleDeleteLore,
        handleNavigate
    };
};
