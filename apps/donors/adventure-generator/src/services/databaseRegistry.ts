
import { MonsterIndexEntry } from '../types/npc';

// Registry mapping database IDs to their index and manifest loaders.
// This allows the app to dynamically load content based on the Campaign Configuration.

interface DatabaseDefinition {
    loadIndex: () => Promise<MonsterIndexEntry[]>;
    manifestPath?: string; // Path hint for the monster loader
}

// Cache for the fetched SRD index
let srdIndexCache: MonsterIndexEntry[] | null = null;

export const DATABASE_REGISTRY: Record<string, DatabaseDefinition> = {
    'srd5.1': {
        loadIndex: async (): Promise<MonsterIndexEntry[]> => {
            if (srdIndexCache) {
                return srdIndexCache;
            }
            try {
                // Fetch the static JSON index instead of importing a large JS array.
                const response = await fetch('./data/srd_monster_index.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch monster index: ${response.statusText}`);
                }
                const index = await response.json() as MonsterIndexEntry[];

                // Process and cache the result
                const processedIndex = index.map(m => ({ ...m, source: 'srd5.1', isSrd: true }));
                srdIndexCache = processedIndex;

                return processedIndex;
            } catch (e) {
                console.error("Could not load SRD monster index:", e);
                return []; // Return empty array on failure
            }
        }
    },
    'imported': {
        loadIndex: async (): Promise<MonsterIndexEntry[]> => {
            try {
                // Dynamic import to avoid circular dependency issues at top level if any
                const { db } = await import('./db');
                const allImported = await db.bestiary.toArray();
                return allImported.map(m => ({
                    id: m.id,
                    name: m.name,
                    type: m.profile?.table?.creatureType || 'Unknown',
                    size: m.profile?.table?.size || 'Medium',
                    cr: m.profile?.table?.challengeRating?.split(' ')[0] || '?',
                    isSrd: false,
                    source: m.source || 'user-import'
                }));
            } catch (err) {
                console.error("Failed to load imported bestiary:", err);
                return [];
            }
        }
    },
    // --- PLACEHOLDERS FOR EXPANSION ---
    // To add Level Up A5E, create data/a5eMonsterIndex.ts and uncomment:
    /*
    'a5esrd': {
        loadIndex: async () => {
            try {
                const mod = await import('../data/a5eMonsterIndex');
                return mod.a5eMonsterIndex.map(m => ({ ...m, source: 'a5esrd' }));
            } catch (e) { console.warn('A5E Index not found'); return []; }
        }
    },
    */
    // To add Black Flag, create data/bfrdMonsterIndex.ts and uncomment:
    /*
    'bfrd': {
        loadIndex: async () => {
            try {
                const mod = await import('../data/bfrdMonsterIndex');
                return mod.bfrdMonsterIndex.map(m => ({ ...m, source: 'bfrd' }));
            } catch (e) { console.warn('BFRD Index not found'); return []; }
        }
    },
    */
    // To add Kobold Press, create data/kpMonsterIndex.ts and uncomment:
    /*
    'kp-ogl': {
        loadIndex: async () => {
            try {
                const mod = await import('../data/kpMonsterIndex');
                return mod.kpMonsterIndex.map(m => ({ ...m, source: 'kp-ogl' }));
            } catch (e) { console.warn('KP Index not found'); return []; }
        }
    },
    */
};

// Helper to get readable names for badges
export const SOURCE_LABELS: Record<string, string> = {
    'srd5.1': 'SRD 5.1',
    'a5e': 'Level Up A5E',
    'tome-of-beasts-1-2023': 'Tome of Beasts 1',
    'black-flag': 'Black Flag',
    'forge-of-foes': 'Forge of Foes',
    'user-import': 'Imported',
    'user': 'Homebrew'
};
