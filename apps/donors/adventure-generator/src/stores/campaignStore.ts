
import { create } from 'zustand';
import { CampaignConfiguration, CampaignStateExport, CampaignConfigUpdater } from '../types/campaign';
import { SavedMonster, MonsterIndexEntry } from '../types/npc';
import { BiomeData, BiomeType } from '../types/location';
import { DEFAULT_CAMPAIGN_CONFIG } from '../data/constants';
import { DATABASE_REGISTRY } from '../services/databaseRegistry';

export type ActiveView = 'adventure' | 'monsters' | 'npcs' | 'history' | 'maps' | 'compendium' | 'traps' | 'encounter' | 'tavern' | 'encounter-designer' | 'ensemble' | 'library' | 'ledger' | 'backend' | 'narrative-scripts';

export type DrawerType = 'settings' | 'ai' | 'dice' | null;

export interface CampaignState {
    rootPath: string | null; // NEW: Active File System Root
    config: CampaignConfiguration;
    activeView: ActiveView;
    activeDrawer: DrawerType;
    bestiary: SavedMonster[];

    // Replaces static srdMonsterIndex
    loadedMonsterIndex: MonsterIndexEntry[];
    areDatabasesLoaded: boolean;

    biomeData: BiomeData;
    systemMessage: { type: 'success' | 'error', text: string } | null;

    // Actions
    setRootPath: (path: string | null) => void;
    setConfig: (config: CampaignConfiguration) => void;
    updateConfig: CampaignConfigUpdater;
    setActiveView: (view: ActiveView) => void;
    openDrawer: (drawer: DrawerType) => void;
    closeDrawer: () => void;
    addToBestiary: (monster: SavedMonster) => void;
    updateBestiaryMonster: (monster: SavedMonster) => void;
    removeFromBestiary: (monsterId: string) => void;
    setBestiary: (bestiary: SavedMonster[]) => void;

    // New Action for dynamic loading
    refreshEnabledDatabases: () => Promise<void>;

    // Biome Actions
    setBiomeData: (data: BiomeData) => void;
    addCreatureToBiome: (biome: BiomeType, creatureId: string) => void;
    removeCreatureFromBiome: (biome: BiomeType, creatureId: string) => void;

    // UI Actions
    showSystemMessage: (type: 'success' | 'error', text: string) => void;
    clearSystemMessage: () => void;

    // Session Management
    exportState: () => CampaignStateExport;
    importState: (state: Partial<CampaignStateExport & { campaignConfig: CampaignConfiguration }>) => void;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
    rootPath: null,
    config: DEFAULT_CAMPAIGN_CONFIG,
    activeView: 'adventure',
    activeDrawer: null,
    bestiary: [],
    loadedMonsterIndex: [],
    areDatabasesLoaded: false,
    biomeData: {},
    systemMessage: null,

    setRootPath: (path) => set({ rootPath: path }),

    setConfig: (config) => {
        set({ config });
        // Trigger reload if databases might have changed
        get().refreshEnabledDatabases();
    },

    updateConfig: (field, value) => {
        set((state) => ({
            config: { ...state.config, [field]: value }
        }));
        if (field === 'enabledDatabases') {
            get().refreshEnabledDatabases();
        }
    },

    setActiveView: (view) => set({ activeView: view }),
    openDrawer: (drawer) => set({ activeDrawer: drawer }),
    closeDrawer: () => set({ activeDrawer: null }),

    addToBestiary: (monster) => set((state) => ({
        bestiary: [...state.bestiary, monster]
    })),

    updateBestiaryMonster: (monster) => set((state) => ({
        bestiary: state.bestiary.map(m => m.id === monster.id ? monster : m)
    })),

    removeFromBestiary: (id) => set((state) => ({
        bestiary: state.bestiary.filter(m => m.id !== id)
    })),

    setBestiary: (bestiary) => set({ bestiary }),

    refreshEnabledDatabases: async () => {
        const { enabledDatabases } = get().config;
        const databasesToLoad = enabledDatabases && enabledDatabases.length > 0
            ? enabledDatabases
            : ['srd5.1']; // Default fallback

        let combinedIndex: MonsterIndexEntry[] = [];

        for (const dbId of databasesToLoad) {
            const loader = DATABASE_REGISTRY[dbId];
            if (loader) {
                try {
                    const index = await loader.loadIndex();
                    combinedIndex = [...combinedIndex, ...index];
                } catch (e) {
                    console.error(`Failed to load database index for ${dbId}`, e);
                }
            }
        }

        set({
            loadedMonsterIndex: combinedIndex.sort((a, b) => a.name.localeCompare(b.name)),
            areDatabasesLoaded: true
        });
    },

    setBiomeData: (data) => set({ biomeData: data }),

    addCreatureToBiome: (biome, creatureId) => set((state) => {
        const currentData = state.biomeData[biome] || { creatureIds: [] };
        if (currentData.creatureIds.includes(creatureId)) return state;
        return {
            biomeData: {
                ...state.biomeData,
                [biome]: { ...currentData, creatureIds: [...currentData.creatureIds, creatureId] }
            }
        };
    }),

    removeCreatureFromBiome: (biome, creatureId) => set((state) => {
        const currentData = state.biomeData[biome];
        if (!currentData) return state;
        return {
            biomeData: {
                ...state.biomeData,
                [biome]: { ...currentData, creatureIds: currentData.creatureIds.filter(id => id !== creatureId) }
            }
        };
    }),

    showSystemMessage: (type, text) => set({ systemMessage: { type, text } }),
    clearSystemMessage: () => set({ systemMessage: null }),

    exportState: (): CampaignStateExport => {
        const { config, activeView, bestiary, biomeData } = get();
        return { config, activeView, bestiary, biomeData };
    },

    importState: (state) => {
        const loadedConfig = { ...DEFAULT_CAMPAIGN_CONFIG, ...(state.config || state.campaignConfig) };

        let viewToLoad = state.activeView as string | undefined;
        // Logic to migrate old view names if any
        if ((viewToLoad as string) === 'locations') {
            viewToLoad = 'maps';
        }
        if (['ai', 'settings', 'databases'].includes(viewToLoad as string)) {
            viewToLoad = 'adventure';
        }
        if ((viewToLoad as string) === 'bestiary') {
            viewToLoad = 'compendium';
        }

        const resolvedView: ActiveView = ([
            'adventure',
            'monsters',
            'npcs',
            'history',
            'maps',
            'compendium',
            'traps',
            'encounter',
            'tavern',
            'encounter-designer',
            'ensemble',
            'library',
            'ledger',
            'backend',
            'narrative-scripts'
        ] as const).includes(viewToLoad as ActiveView)
            ? (viewToLoad as ActiveView)
            : 'adventure';

        set({
            config: loadedConfig,
            activeView: resolvedView,
            bestiary: state.bestiary || [],
            biomeData: state.biomeData || {},
        });
        // Ensure databases are reloaded based on new config
        get().refreshEnabledDatabases();
    }
}));
