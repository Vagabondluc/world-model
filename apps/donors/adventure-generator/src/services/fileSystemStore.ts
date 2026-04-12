
import { isTauri } from '../utils/envUtils';

// Conditional imports to avoid errors in browser evaluation if the plugins do immediate checks
// Note: Usually tauri-apps-api is fine to import, but we'll be safe with our usage.
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile, readDir, mkdir, exists } from '@tauri-apps/plugin-fs';

import yaml from 'js-yaml';
import matter from 'gray-matter';
import { CampaignConfiguration } from '../types/campaign';
import { SavedMonster } from '../types/npc';
import { CompendiumEntry, LoreEntry } from '../types/compendium';
import type { LocationStateExport, BiomeData } from '../types/location';
import { DEFAULT_CAMPAIGN_CONFIG } from '../data/constants';
import { CampaignConfigurationSchema } from '../schemas/campaign';
import { LocationStateExportSchema, BiomeDataSchema } from '../schemas/location';

// Browser Mock Helpers
const MOCK_STORAGE_PREFIX = 'dnd_gen_mock_fs:';

const mockFileSystem = {
    exists: (path: string) => {
        return localStorage.getItem(MOCK_STORAGE_PREFIX + path) !== null ||
            Object.keys(localStorage).some(k => k.startsWith(MOCK_STORAGE_PREFIX + path + '/'));
    },
    readFile: (path: string) => {
        return localStorage.getItem(MOCK_STORAGE_PREFIX + path) || '';
    },
    writeFile: (path: string, content: string) => {
        localStorage.setItem(MOCK_STORAGE_PREFIX + path, content);
    },
    readDir: (path: string) => {
        const prefix = MOCK_STORAGE_PREFIX + path + '/';
        const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
        const entries = new Set<string>();
        keys.forEach(k => {
            const relative = k.substring(prefix.length);
            const part = relative.split('/')[0];
            entries.add(part);
        });
        return Array.from(entries).map(name => ({
            name,
            isDirectory: name.indexOf('.') === -1 // Naive check
        }));
    },
    mkdir: (path: string) => {
        // LocalStorage doesn't really have directories, so we just "create" by ensuring prefix exists?
        // Actually, we don't need to do much for mock mkdir.
        console.info(`Mock FS: mkdir ${path}`);
    }
};

/**
 * Service to handle file system operations with browser fallback.
 */
export class FileSystemStore {

    /**
     * Open a dialog to select a directory.
     * @returns The selected folder path or null if canceled.
     */
    static async openDirectoryDialog(title: string = "Select Directory"): Promise<string | null> {
        if (!isTauri()) {
            console.warn("FileSystemStore: Running in Browser mode. Using mock directory selection.");
            return "browser-user-data";
        }
        try {
            const selected = await open({
                directory: true,
                multiple: false,
                title: title
            });
            return selected as string | null;
        } catch (e) {
            console.error("Tauri Open Dialog Failed", e);
            return null;
        }
    }

    /**
     * Open a dialog to select a campaign folder.
     * @returns The selected folder path or null if canceled.
     */
    static async openCampaignDialog(): Promise<string | null> {
        return this.openDirectoryDialog("Open Campaign Folder");
    }

    /**
     * Open a dialog to select a file.
     * @returns The selected file path or null if canceled (browser returns null).
     */
    static async openFileDialog(title: string = "Select File", extensions: string[] = ['json']): Promise<string | null> {
        if (!isTauri()) {
            console.warn("FileSystemStore: Running in Browser mode. File dialog unavailable.");
            return null;
        }
        try {
            const selected = await open({
                multiple: false,
                title,
                filters: [
                    { name: 'Files', extensions }
                ]
            });
            return selected as string | null;
        } catch (e) {
            console.error("Tauri Open File Dialog Failed", e);
            return null;
        }
    }

    /**
     * Initialize a new campaign in the given folder.
     * Creates standard subdirectories and a default campaign.json.
     */
    static async initializeCampaign(rootPath: string, name: string): Promise<void> {
        // Create Subdirectories
        await this.ensureDir(`${rootPath}/monsters`);
        await this.ensureDir(`${rootPath}/lore`);
        await this.ensureDir(`${rootPath}/locations`);
        await this.ensureDir(`${rootPath}/assets`);
        await this.ensureDir(`${rootPath}/world-model`);

        // Create campaign.json if not exists
        const configPath = `${rootPath}/campaign.json`;
        if (!await this.fileExists(configPath)) {
            const config: CampaignConfiguration = {
                ...DEFAULT_CAMPAIGN_CONFIG,
                worldName: name
            };
            await this.writeFileContent(configPath, JSON.stringify(config, null, 2));
        }
    }

    /**
     * Internal helper for platform-aware existence check
     */
    static async fileExists(path: string): Promise<boolean> {
        if (isTauri()) {
            return await exists(path);
        }
        return mockFileSystem.exists(path);
    }

    /**
     * Internal helper for platform-aware write
     */
    static async writeFileContent(path: string, content: string): Promise<void> {
        if (isTauri()) {
            return await writeTextFile(path, content);
        }
        mockFileSystem.writeFile(path, content);
    }

    /**
     * Internal helper for platform-aware read
     */
    static async readFileContent(path: string): Promise<string> {
        if (isTauri()) {
            return await readTextFile(path);
        }
        return mockFileSystem.readFile(path);
    }

    /**
     * Load campaign configuration from file.
     */
    static async loadConfig(rootPath: string): Promise<CampaignConfiguration> {
        const configPath = `${rootPath}/campaign.json`;
        if (await this.fileExists(configPath)) {
            const content = await this.readFileContent(configPath);
            try {
                const raw = JSON.parse(content);
                const parsed = CampaignConfigurationSchema.safeParse(raw);
                if (parsed.success) {
                    return { ...DEFAULT_CAMPAIGN_CONFIG, ...parsed.data };
                }
                console.warn("Invalid campaign config. Falling back to defaults.", parsed.error);
            } catch (e) {
                console.warn("Failed to parse campaign config. Falling back to defaults.", e);
            }
        }
        return DEFAULT_CAMPAIGN_CONFIG;
    }

    /**
     * Ensure a directory exists, creating it if necessary.
     */
    static async ensureDir(path: string): Promise<void> {
        if (!await this.fileExists(path)) {
            await this.createDirectory(path);
        }
    }

    /**
     * Create a directory (recursive).
     */
    static async createDirectory(path: string): Promise<void> {
        if (isTauri()) {
            try {
                await mkdir(path, { recursive: true });
            } catch (e) {
                console.error(`Tauri Mkdir Failed for ${path}`, e);
            }
        } else {
            mockFileSystem.mkdir(path);
        }
    }

    /**
     * Save campaign configuration.
     */
    static async saveConfig(rootPath: string, config: CampaignConfiguration): Promise<void> {
        const configPath = `${rootPath}/campaign.json`;
        await this.writeFileContent(configPath, JSON.stringify(config, null, 2));
    }

    /**
     * Save a monster to YAML.
     */
    static async saveMonster(rootPath: string, monster: SavedMonster): Promise<void> {
        // Slugify name for filename
        const slug = monster.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const filePath = `${rootPath}/monsters/${slug}.yaml`;

        const yamlStr = yaml.dump(monster);
        await this.writeFileContent(filePath, yamlStr);
    }

    /**
     * Save lore to Markdown with frontmatter.
     */
    static async saveLore(rootPath: string, lore: CompendiumEntry): Promise<void> {
        const slug = lore.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const filePath = `${rootPath}/lore/${slug}.md`;

        const { content, ...metadata } = lore;

        // Use gray-matter stringify
        const fileContent = matter.stringify(content || '', metadata);

        await this.writeFileContent(filePath, fileContent);
    }

    /**
     * Internal helper for platform-aware readDir
     */
    static async readDirectory(path: string): Promise<Array<{ name: string, isDirectory: boolean }>> {
        if (isTauri()) {
            return await readDir(path);
        }
        return mockFileSystem.readDir(path);
    }

    /**
     * Load all monsters from the monsters directory (recursive).
     */
    static async loadAllMonsters(rootPath: string): Promise<SavedMonster[]> {
        const monsters: SavedMonster[] = [];
        const processDir = async (currentPath: string) => {
            if (!await this.fileExists(currentPath)) return;
            const entries = await this.readDirectory(currentPath);
            for (const entry of entries) {
                const fullPath = `${currentPath}/${entry.name}`;
                if (entry.isDirectory) {
                    await processDir(fullPath);
                } else if (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')) {
                    try {
                        const content = await this.readFileContent(fullPath);
                        const monster = yaml.load(content) as SavedMonster;
                        monsters.push(monster);
                    } catch (e) {
                        console.error(`Failed to load monster ${entry.name}`, e);
                    }
                }
            }
        };

        // Scan both user monsters and imported rules
        await processDir(`${rootPath}/monsters`);
        await processDir(`${rootPath}/rules/monsters`);

        return monsters;
    }

    /**
     * Load all lore from the lore directory (recursive).
     */
    static async loadAllLore(rootPath: string): Promise<LoreEntry[]> {
        const loreItems: LoreEntry[] = [];
        const processDir = async (currentPath: string) => {
            if (!await this.fileExists(currentPath)) return;
            const entries = await this.readDirectory(currentPath);
            for (const entry of entries) {
                const fullPath = `${currentPath}/${entry.name}`;
                if (entry.isDirectory) {
                    await processDir(fullPath);
                } else if (entry.name.endsWith('.md')) {
                    try {
                        const rawContent = await this.readFileContent(fullPath);
                        const parsed = matter(rawContent);
                        const entryData = {
                            ...parsed.data,
                            content: parsed.content,
                        } as LoreEntry;
                        loreItems.push(entryData);
                    } catch (e) {
                        console.error(`Failed to load lore ${entry.name}`, e);
                    }
                }
            }
        };

        await processDir(`${rootPath}/lore`);
        await processDir(`${rootPath}/rules/lore`);

        return loreItems;
    }

    /**
     * Save location state to JSON.
     */
    static async saveLocationState(rootPath: string, state: LocationStateExport): Promise<void> {
        await this.ensureDir(`${rootPath}/locations`);
        const filePath = `${rootPath}/locations/locations_state.json`;
        await this.writeFileContent(filePath, JSON.stringify(state, null, 2));
    }

    /**
     * Load location state from JSON.
     */
    static async loadLocationState(rootPath: string): Promise<LocationStateExport | null> {
        const filePath = `${rootPath}/locations/locations_state.json`;
        if (!await this.fileExists(filePath)) return null;
        const content = await this.readFileContent(filePath);
        try {
            const raw = JSON.parse(content);
            const parsed = LocationStateExportSchema.safeParse(raw);
            if (parsed.success) {
                return {
                    maps: parsed.data.maps ?? {},
                    activeMapId: parsed.data.activeMapId ?? null,
                    locations: parsed.data.locations ?? {},
                    regions: parsed.data.regions ?? {},
                    layers: (parsed.data.layers ?? {}) as LocationStateExport['layers'],
                    viewSettings: (parsed.data.viewSettings ?? {}) as LocationStateExport['viewSettings'],
                };
            }
            console.warn("Invalid locations state. Skipping load.", parsed.error);
            return null;
        } catch (e) {
            console.error(`Failed to parse locations_state.json`, e);
            return null;
        }
    }

    /**
     * Save biome data (assets) to JSON.
     */
    static async saveBiomeData(rootPath: string, data: BiomeData): Promise<void> {
        await this.ensureDir(`${rootPath}/assets`);
        const filePath = `${rootPath}/assets/biome_data.json`;
        await this.writeFileContent(filePath, JSON.stringify(data, null, 2));
    }

    /**
     * Load biome data (assets) from JSON.
     */
    static async loadBiomeData(rootPath: string): Promise<BiomeData | null> {
        const filePath = `${rootPath}/assets/biome_data.json`;
        if (!await this.fileExists(filePath)) return null;
        const content = await this.readFileContent(filePath);
        try {
            const raw = JSON.parse(content);
            const parsed = BiomeDataSchema.safeParse(raw);
            if (parsed.success) {
                const entries = Object.entries(parsed.data).map(([key, value]) => ([
                    key,
                    { creatureIds: value?.creatureIds ?? [] }
                ]));
                return Object.fromEntries(entries);
            }
            console.warn("Invalid biome data. Skipping load.", parsed.error);
            return null;
        } catch (e) {
            console.error(`Failed to parse biome_data.json`, e);
            return null;
        }
    }

    /**
     * Generic JSON saver
     */
    static async saveJson<T>(rootPath: string, filename: string, data: T): Promise<void> {
        const filePath = `${rootPath}/${filename}`;
        await this.writeFileContent(filePath, JSON.stringify(data, null, 2));
    }

    /**
     * Generic JSON loader
     */
    static async loadJson<T = unknown>(rootPath: string, filename: string): Promise<T | null> {
        const filePath = `${rootPath}/${filename}`;
        if (await this.fileExists(filePath)) {
            const content = await this.readFileContent(filePath);
            try {
                return JSON.parse(content) as T;
            } catch (e) {
                console.error(`Failed to parse JSON for ${filename}`, e);
                return null;
            }
        }
        return null;
    }
}
