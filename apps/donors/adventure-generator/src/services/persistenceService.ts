import { db, CampaignConfigEntity } from './db';
import { useCampaignStore, type CampaignState } from '../stores/campaignStore';
import { useLocationStore } from '../stores/locationStore';
import { useCompendiumStore, type CompendiumState } from '../stores/compendiumStore';
import { useAdventureDataStore } from '../stores/adventureDataStore';
import { useGeneratorConfigStore } from '../stores/generatorConfigStore';
import { useHistoryStore } from '../stores/historyStore';
import { useHubFiltersStore } from '../stores/hubFiltersStore';
import {
    ManagedLocationSchema,
    RegionSchema,
    SavedMonsterSchema,
    LoreEntrySchema
} from '../schemas';
import { DEFAULT_CAMPAIGN_CONFIG } from '../data/constants';
import { debounce } from '../utils/helpers';
import { FileSystemStore } from './fileSystemStore';
import type { AdventureDataState } from '../stores/adventureDataStore';
import { applyAdventureSessionState, loadAdventureWorldModelSession } from './adventureWorldModelPersistence';

export class PersistenceService {
    private static isHydrated = false;
    private static unsubscribers: Array<() => void> = [];

    static async hydrate(): Promise<void> {
        // if (this.isHydrated) return; // Allow re-hydration if rootPath changes? 
        // For now, assume a full reload/remount handles major changes, but inside App effect we might re-run.

        const rootPath = useCampaignStore.getState().rootPath;
        if (!rootPath) {
            console.warn("Cannot hydrate without rootPath");
            return;
        }

        try {
            // 1. Load Campaign Config
            const config = await FileSystemStore.loadConfig(rootPath);
            useCampaignStore.getState().setConfig(config);

            // 2. Load Bestiary
            const monsters = await FileSystemStore.loadAllMonsters(rootPath);
            useCampaignStore.getState().setBestiary(monsters);

            // 3. Load Lore
            const lore = await FileSystemStore.loadAllLore(rootPath);
            useCompendiumStore.getState().setLoreEntries(lore);

            // 4. Load Narrative Kit Data (Traps, NPCs, Encounters) - Simplified single-file store for now
            const narrativeData = await FileSystemStore.loadJson(rootPath, 'narrative_kit_data.json') as Partial<AdventureDataState> | null;
            if (narrativeData) {
                if (narrativeData.activeTraps) useAdventureDataStore.getState().setActiveTraps(narrativeData.activeTraps);
                if (narrativeData.npcPersonas) useAdventureDataStore.getState().setNpcPersonas(narrativeData.npcPersonas);
                if (narrativeData.encounterDesigns) useAdventureDataStore.getState().setEncounterDesigns(narrativeData.encounterDesigns);
            }

            // 5. Load Locations
            const locationState = await FileSystemStore.loadLocationState(rootPath);
            if (locationState) {
                useLocationStore.getState().importState(locationState);
            }

            // 6. Load Assets (Biome Data)
            const biomeData = await FileSystemStore.loadBiomeData(rootPath);
            if (biomeData) {
                useCampaignStore.getState().setBiomeData(biomeData);
            }

            const canonicalFallback = {
                version: 2 as const,
                campaignState: useCampaignStore.getState().exportState(),
                locationState: useLocationStore.getState().exportState(),
                compendiumState: useCompendiumStore.getState().exportState(),
                generatorState: {
                    ...useAdventureDataStore.getState().exportState(),
                    ...useGeneratorConfigStore.getState().exportState(),
                    ...useHistoryStore.getState().exportState(),
                    ...useHubFiltersStore.getState().exportState(),
                },
            };

            const canonicalSession = await loadAdventureWorldModelSession(rootPath, canonicalFallback);
            if (canonicalSession) {
                applyAdventureSessionState(canonicalSession);
                console.info(`Canonical world-model session hydrated successfully from ${rootPath}`);
            }

            this.isHydrated = true;
            console.info(`App hydrated successfully from ${rootPath}`);

            // Optional: Sync to IDB cache for querying if needed
            // await this.syncToCache(config, monsters, lore);

        } catch (error) {
            console.error("Failed to hydrate application state:", error);
        }
    }

    static enableAutoSave(): void {
        const rootPath = useCampaignStore.getState().rootPath;
        if (!this.isHydrated || !rootPath) {
            console.warn("Cannot enable auto-save before hydration is complete and rootPath is set.");
            return;
        }

        this.unsubscribers.forEach(unsub => unsub());
        this.unsubscribers = [];

        const SAVE_DELAY = 1500;

        const saveCampaign = debounce((state: CampaignState, prevState: CampaignState) => {
            if (state.config !== prevState.config) {
                FileSystemStore.saveConfig(rootPath, state.config).catch(e => console.error("FS Save Failed (Config)", e));
            }
            if (state.biomeData !== prevState.biomeData) {
                FileSystemStore.saveBiomeData(rootPath, state.biomeData).catch(e => console.error("FS Save Failed (Biome Data)", e));
            }
        }, SAVE_DELAY);

        const saveBestiary = debounce((state: CampaignState, prevState: CampaignState) => {
            if (state.bestiary === prevState.bestiary) return;
            const currentRoot = useCampaignStore.getState().rootPath;
            if (!currentRoot) return;
            Promise.all(
                (state.bestiary || []).map((monster) => FileSystemStore.saveMonster(currentRoot, monster))
            ).catch(e => console.error("FS Save Failed (Bestiary)", e));
        }, SAVE_DELAY);

        // TODO: Re-implement granular saves. 
        // For now, we might rely on manual "Save" actions for Monsters/Lore if we move away from strict auto-save 
        // OR implement specific "upsert" calls in the store actions themselves?
        // The original PersistenceService used `subscribe` which is generic.

        // For Campaign Config, it's small, so saving is fine.
        this.unsubscribers.push(useCampaignStore.subscribe(saveCampaign));
        this.unsubscribers.push(useCampaignStore.subscribe(saveBestiary));

        const saveLoreEntries = debounce((state: CompendiumState, prevState: CompendiumState) => {
            if (state.loreEntries === prevState.loreEntries) return;
            const currentRoot = useCampaignStore.getState().rootPath;
            if (!currentRoot) return;
            Promise.all(
                (state.loreEntries || []).map((entry) => FileSystemStore.saveLore(currentRoot, entry))
            ).catch(e => console.error("FS Save Failed (Lore)", e));
        }, SAVE_DELAY);

        this.unsubscribers.push(useCompendiumStore.subscribe(saveLoreEntries));

        const saveLocations = debounce((state, prevState) => {
            if (
                state.maps !== prevState.maps ||
                state.activeMapId !== prevState.activeMapId ||
                state.locations !== prevState.locations ||
                state.regions !== prevState.regions ||
                state.layers !== prevState.layers ||
                state.viewSettings !== prevState.viewSettings
            ) {
                FileSystemStore.saveLocationState(rootPath, useLocationStore.getState().exportState())
                    .catch(e => console.error("FS Save Failed (Locations)", e));
            }
        }, SAVE_DELAY);

        this.unsubscribers.push(useLocationStore.subscribe(saveLocations));

        // Auto-save Narrative Kit Data on change
        const saveNarrativeKit = debounce(async (state: AdventureDataState, prevState: AdventureDataState) => {
            // Check if relevant fields changed
            if (state.activeTraps !== prevState.activeTraps ||
                state.npcPersonas !== prevState.npcPersonas ||
                state.encounterDesigns !== prevState.encounterDesigns) {

                const data = {
                    activeTraps: state.activeTraps,
                    npcPersonas: state.npcPersonas,
                    encounterDesigns: state.encounterDesigns
                };
                await FileSystemStore.saveJson(rootPath, 'narrative_kit_data.json', data);
            }
        }, 2000);

        // We need to dynamically import or accept the store to avoid circular dependency issues if possible
        // But since we are inside a method, it's safer.
        this.unsubscribers.push(useAdventureDataStore.subscribe(saveNarrativeKit));

        // We'll trust explicit save actions for Monsters for now to avoid massive diffing overhead
        // or add back granular subscription logic later.

        console.info("Auto-save enabled (Config, Bestiary, Lore, Narrative Kit).");
    }

    static async clearDatabase(): Promise<void> {
        if (this.unsubscribers.length > 0) {
            this.unsubscribers.forEach(unsub => unsub());
            this.unsubscribers = [];
            console.info("Auto-save disabled for session clear.");
        }

        try {
            await db.delete();
            console.info("IndexedDB database deleted successfully.");
        } catch (error) {
            console.error("Failed to delete IndexedDB:", error);
            throw new Error("Could not clear database.");
        }
    }
}
