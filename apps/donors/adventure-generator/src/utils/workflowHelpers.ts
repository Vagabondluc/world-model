
import { GeneratedAdventure, Scene, Location, NPC, Faction, CompendiumEntry } from '../schemas';
import { useAdventureDataStore } from '../stores/adventureDataStore';
import { useCompendiumStore } from '../stores/compendiumStore';
import { useHistoryStore } from '../stores/historyStore';
import { useWorkflowStore } from '../stores/workflowStore';
import { OriginContext } from '../schemas/common';

/**
 * Serializes the current state of the adventure into a string for AI context.
 * Excludes the full details of a specific entity to prevent the AI from just copying it.
 */
export const serializeAdventureBlueprint = (exclude?: { type: string, id: string }): string => {
    const { selectedHook, currentAdventureCompendiumIds } = useAdventureDataStore.getState();
    const { compendiumEntries } = useCompendiumStore.getState();
    const currentEntries = compendiumEntries.filter(e => currentAdventureCompendiumIds.includes(e.id));
    
    if (!selectedHook) return "";
    let blueprint = "--- CURRENT ADVENTURE BLUEPRINT ---\nThis document contains the established, approved details for the adventure. Use it to ensure any new content you generate is consistent.\n\n";
    const hookTitle = selectedHook.type === 'simple' ? selectedHook.premise : selectedHook.title;
    blueprint += `**Adventure Hook:** "${hookTitle}"\n\n`;

    const serialize = (title: string, category: CompendiumEntry['category'], formatter: (item: CompendiumEntry) => string) => {
        const items = currentEntries.filter(e => e.category === category);
        if (items.length > 0) {
            blueprint += `**${title}**\n`;
            items.forEach((item) => { blueprint += formatter(item); });
            blueprint += "\n";
        }
    };

    const formatWithDetails = (item: CompendiumEntry, itemType: string) => {
        let itemString = `- ${item.title} (ID: ${item.id}): ${item.summary}\n`;
        if (item.fullContent && item.fullContent !== '{}' && !(exclude?.type === itemType && exclude.id === item.id)) {
            itemString += `  - **Generated Details Summary:** A detailed description for this item has been generated.\n`;
        }
        return itemString;
    };
    
    serialize("Key Locations:", 'location', (item) => formatWithDetails(item, 'location'));
    serialize("Key NPCs:", 'npc', (item) => formatWithDetails(item, 'npc'));
    serialize("Key Factions:", 'faction', (item) => formatWithDetails(item, 'faction'));
    serialize("Adventure Scenes:", 'event', (item) => formatWithDetails(item, 'scene'));

    blueprint += "-------------------------------------\n\n";
    return blueprint;
};

/**
 * Commits a generated or processed adventure outline to the various stores.
 * This function is the single point of entry for adding a new adventure structure to the app state.
 */
export const commitOutline = ({ newScenes, newLocations, newNpcs, newFactions, selectedHook }: { newScenes: Scene[], newLocations: Location[], newNpcs: NPC[], newFactions: Faction[], selectedHook: GeneratedAdventure | null }) => {
    const { addCompendiumEntries } = useCompendiumStore.getState();
    
    const label = selectedHook?.type === 'simple' ? selectedHook.premise : (selectedHook?.title || 'Custom Outline');
    
    // We must add history FIRST to get the ID for the origin link
    useHistoryStore.getState().addHistoryEntry('outline', { scenes: newScenes, locations: newLocations, npcs: newNpcs, factions: newFactions, selectedHook }, `Outline: ${label}`);
    const historyStateId = useHistoryStore.getState().generationHistory[0]?.id;

    const origin: OriginContext = {
        type: 'generator',
        generatorStep: 'outline',
        historyStateId: historyStateId,
        sourceId: selectedHook ? (selectedHook.type === 'simple' ? selectedHook.premise : selectedHook.title) : 'unknown'
    };

    const now = new Date();
    const newEntries: CompendiumEntry[] = [];

    newScenes.forEach(s => newEntries.push({
        id: s.id, category: 'event', title: s.title, summary: s.challenge, fullContent: s.details ? JSON.stringify(s.details) : '{}',
        tags: [s.type, 'draft', 'adventure-assets'], relationships: { connectedEntries: s.locationId ? [s.locationId] : [], mentionedIn: [] },
        visibility: 'dm-only', importance: 'major', createdAt: now, lastModified: now, origin
    }));
    newLocations.forEach(l => newEntries.push({
        id: l.id, category: 'location', title: l.name, summary: l.description, fullContent: l.details ? JSON.stringify(l.details) : '{}',
        tags: [l.type, 'draft', 'adventure-assets'], relationships: { connectedEntries: [], mentionedIn: [] },
        visibility: 'dm-only', importance: 'major', createdAt: now, lastModified: now, origin
    }));
    newNpcs.forEach(n => newEntries.push({
        id: n.id, category: 'npc', title: n.name, summary: n.description, fullContent: n.details ? JSON.stringify(n.details) : '{}',
        tags: [n.type, 'draft', 'adventure-assets'], relationships: { connectedEntries: n.factionId ? [n.factionId] : [], mentionedIn: [] },
        visibility: 'dm-only', importance: 'major', createdAt: now, lastModified: now, origin
    }));
    newFactions.forEach(f => newEntries.push({
        id: f.id, category: 'faction', title: f.name, summary: f.goal, fullContent: f.details ? JSON.stringify(f.details) : '{}',
        tags: [f.category, 'draft', 'adventure-assets'], relationships: { connectedEntries: [], mentionedIn: [] },
        visibility: 'dm-only', importance: 'major', createdAt: now, lastModified: now, origin
    }));

    addCompendiumEntries(newEntries);
    
    useAdventureDataStore.setState({
        selectedHook,
        currentAdventureCompendiumIds: newEntries.map(e => e.id),
        adventures: [],
        matrix: null,
    });
};
