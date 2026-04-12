
import { srdMonsterManifest } from '../data/srdMonsterManifest';
import { SavedMonster } from '../types/npc';

// A cache for loaded monsters to avoid re-fetching
const monsterCache = new Map<string, SavedMonster>();

/**
 * Asynchronously loads a single SRD monster's full data.
 * It uses a dynamic import based on the monster manifest and caches the result.
 * @param id The SRD ID of the monster (e.g., "srd-goblin").
 * @returns A Promise that resolves to the full SavedMonster object, or null if not found.
 */
export async function loadSrdMonster(id: string): Promise<SavedMonster | null> {
    if (monsterCache.has(id)) {
        return monsterCache.get(id)!;
    }

    const manifestEntry = srdMonsterManifest.find(m => m.id === id);
    if (!manifestEntry) {
        console.error(`Monster with id "${id}" not found in manifest.`);
        return null;
    }

    try {
        // The /* @vite-ignore */ comment is crucial for build-less environments
        // that might otherwise try to statically analyze this dynamic import.
        // The path is relative to this file's location in `services/`.
        const module = await import(/* @vite-ignore */ `../data/${manifestEntry.path}`);
        
        // The monster files use a default export
        const monster = module.default as SavedMonster; 
        
        if (monster) {
            monsterCache.set(id, monster);
        }
        return monster;
    } catch (e) {
        console.error(`Failed to lazy-load monster module for id "${id}":`, e);
        return null;
    }
}
