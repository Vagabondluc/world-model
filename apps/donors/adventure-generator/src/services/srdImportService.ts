
import { z } from 'zod';
import yaml from 'js-yaml';
import matter from 'gray-matter';

import { FileSystemStore } from './fileSystemStore';
import { CreatureDetailsSchema, SavedMonsterSchema } from '../schemas/npc';
import { LoreEntrySchema, CompendiumEntrySchema } from '../schemas/lore';
import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import { RuleCurator } from './ruleCurator';
import type { SavedMonster } from '../types/npc';

interface DirectoryImportReport {
    monsters: number;
    lore: number;
    collections: number;
    errors: string[];
}

interface RulesetImportReport {
    monsters: number;
    spells: number;
    lore: number;
    errors: string[];
}

/**
 * Options for filtering imported content.
 */
export interface ImportOptions {
    includeSpells: boolean;
    spellLevels: number[]; // e.g. [0, 1, 2]
    includeMonsters: boolean;
    monsterCRs: string[]; // e.g. ["0", "1/4", "1"]
    includeLore: boolean;
}


export class SrdImportService {

    /**
     * Import a directory of SRD files
     * @param directoryPath Absolute path to the directory
     * @returns Import report
     */
    async importFromDirectory(directoryPath: string) {
        let report: DirectoryImportReport = {
            monsters: 0,
            lore: 0,
            collections: 0,
            errors: [] as string[]
        };

        try {
            const processDirectory = async (currentPath: string) => {
                const entries = await FileSystemStore.readDirectory(currentPath);

                for (const entry of entries) {
                    const fullPath = `${currentPath}/${entry.name}`;

                    if (entry.isDirectory) {
                        // Recursively process subdirectories
                        await processDirectory(fullPath);
                        continue;
                    }

                    const name = entry.name.toLowerCase();

                    try {
                        // Only read interesting files
                        if (!name.endsWith('.yaml') && !name.endsWith('.yml') && !name.endsWith('.md') && !name.endsWith('.json')) {
                            continue;
                        }

                        const content = await FileSystemStore.readFileContent(fullPath);

                        if (name.endsWith('.yaml') || name.endsWith('.yml')) {
                            await this.parseAndSaveMonster(content, entry.name);
                            report.monsters++;
                        } else if (name.endsWith('.md')) {
                            await this.parseAndSaveLore(content, entry.name);
                            report.lore++;
                        } else if (name.endsWith('.json')) {
                            await this.parseAndSaveCollection(content);
                            report.collections++;
                        }
                    } catch (err) {
                        // Log but continue
                        console.warn(`Failed to process ${entry.name}:`, err);
                        report.errors.push(`Failed to process ${entry.name}: ${err}`);
                    }
                }
            };

            await processDirectory(directoryPath);

        } catch (err) {
            report.errors.push(`Critical failure reading directory: ${err}`);
        }

        return report;
    }

    /**
     * Import a ruleset from a source directory into the campaign folder.
     * @param sourcePath Path to the source data (e.g. SRD export).
     * @param campaignRoot Path to the active campaign folder.
     * @param options Filtering options.
     */
    async importRuleset(sourcePath: string, campaignRoot: string, options: ImportOptions) {
        let report: RulesetImportReport = {
            monsters: 0,
            spells: 0,
            lore: 0,
            errors: [] as string[]
        };

        try {
            // Recursive scan of source
            const processSource = async (currentPath: string) => {
                const entries = await FileSystemStore.readDirectory(currentPath);

                for (const entry of entries) {
                    const fullPath = `${currentPath}/${entry.name}`;

                    if (entry.isDirectory) {
                        console.log(`Scanning subfolder: ${entry.name}`);
                        await processSource(fullPath);
                        continue;
                    }

                    const name = entry.name.toLowerCase();

                    try {
                        const content = await FileSystemStore.readFileContent(fullPath);

                        if (options.includeMonsters && (name.endsWith('.yaml') || name.endsWith('.yml'))) {
                            await this.processMonster(content, campaignRoot, options, report);
                        } else if (name.endsWith('.json')) {
                            // Check content type (Spell, Item, etc.)
                            await this.processJsonCollection(content, campaignRoot, options, report);
                        }
                        // Lore logic if needed
                    } catch (err) {
                        console.warn(`Failed to process ${entry.name}`, err);
                        report.errors.push(`${entry.name}: ${err}`);
                    }
                }
            };

            console.log(`Starting source scan at: ${sourcePath}`);
            await processSource(sourcePath);
            console.log(`Import finished. Monsters: ${report.monsters}, Spells: ${report.spells}, Errors: ${report.errors.length}`);
        } catch (err) {
            console.error(`Critical import failure: ${err}`);
            report.errors.push(`Critical import failure: ${err}`);
        }

        return report;
    }

    private async parseAndSaveMonster(content: string, filename: string) {
        // Load YAML. It could be a single object or an array.
        const data = yaml.load(content);

        const items = Array.isArray(data) ? data : [data];

        for (const item of items) {
            // Validate against schema parts. 
            // The SRD standard expects fields matching `CreatureDetailsSchema` 
            // plus top level name, id, etc.

            // We map the SRD format to `SavedMonster` format
            const monsterData: SavedMonster = {
                id: item.id || uuidv4(),
                name: item.name || filename.replace(/\.(yaml|yml)$/, ''),
                description: item.description || '',
                statblock: item.statblock || '',
                profile: (item.details || {}) as SavedMonster['profile'], // Verify this section matches schema
                source: item.source, // Map source from YAML
                origin: {
                    type: 'import',
                    sourceId: 'user-import'
                }
            };

            const validation = SavedMonsterSchema.safeParse(monsterData);
            if (!validation.success) {
                console.warn(`Invalid monster schema for ${monsterData.name}:`, validation.error);
                continue;
            }

            await db.bestiary.put(validation.data);
        }
    }

    private async parseAndSaveLore(content: string, filename: string) {
        const parsed = matter(content);
        const frontmatter = parsed.data;
        const body = parsed.content;

        const loreEntry = {
            id: frontmatter.id || uuidv4(),
            type: frontmatter.type || 'history',
            title: frontmatter.title || filename.replace(/\.md$/, ''),
            content: body,
            tags: frontmatter.tags || [],
            relatedLocationIds: frontmatter.relatedLocationIds || [],
            relatedNpcIds: frontmatter.relatedNpcIds || [],
            relatedFactionsIds: frontmatter.relatedFactionsIds || [],
            isPublicKnowledge: frontmatter.isPublicKnowledge ?? true,
            sources: frontmatter.sources || ['Imported'],
            createdAt: new Date(),
            lastModified: new Date(),
            origin: {
                type: 'import' as const,
                sourceId: 'user-import',
                historyStateId: undefined,
                generatorStep: undefined
            }
        };

        const validation = LoreEntrySchema.safeParse(loreEntry);
        if (!validation.success) {
            console.warn(`Invalid lore schema for ${loreEntry.title}:`, validation.error);
            return;
        }

        await db.lore.put(validation.data);
    }

    private async parseAndSaveCollection(content: string) {
        const data = JSON.parse(content);
        if (!Array.isArray(data)) return; // Strict array requirement for JSON batches

        for (const item of data) {
            // Basic detection of type based on 'category' or similar fields
            // The Standard defines 'category' for Compendium items.

            if (item.category) {
                // Assume Compendium Entry
                const entry = {
                    id: item.id || uuidv4(),
                    ...item,
                    source: item.source, // Ensure source is mapped
                    createdAt: new Date(),
                    lastModified: new Date()
                };
                // Add defaults if missing
                if (!entry.relationships) entry.relationships = { connectedEntries: [], mentionedIn: [] };

                const validation = CompendiumEntrySchema.safeParse(entry);
                if (!validation.success) {
                    console.warn(`Invalid compendium entry for ${entry.title || entry.id}:`, validation.error);
                    continue;
                }
                await db.compendium.put(validation.data); // Note: db.compendium in schema check
            }
        }
    }

    private async processMonster(content: string, root: string, options: ImportOptions, report: RulesetImportReport) {
        const data = yaml.load(content);
        const items = Array.isArray(data) ? data : [data];

        for (const item of items) {
            // Filter by CR
            // Ensure we robustly handle CR being a number or string
            const rawCR = item.details?.table?.challengeRating;
            const cr = rawCR !== undefined ? String(rawCR) : "0";

            // Normalize CRs in options for comparison too (just in case)
            const allowedCRs = options.monsterCRs.map(String);

            if (allowedCRs.length > 0 && !allowedCRs.includes(cr)) {
                // console.log(`Skipping ${item.name} (CR ${cr})`);
                continue;
            }

            // Map to SavedMonster
            const monster: SavedMonster = {
                id: item.id || uuidv4(),
                name: item.name,
                description: item.description || '',
                profile: (item.details || {}) as SavedMonster['profile'],
                source: item.source || 'imported',
                origin: {
                    type: 'import',
                    sourceId: 'srd-import',
                    historyStateId: undefined,
                    generatorStep: undefined
                }
            };

            const validation = SavedMonsterSchema.safeParse(monster);
            if (!validation.success) {
                console.warn(`Invalid monster schema for ${monster.name}:`, validation.error);
                report.errors.push(`Invalid monster schema for ${monster.name}`);
                continue;
            }

            // Calculate Path
            const destPath = RuleCurator.getMonsterPath(root, validation.data);

            // Write to FS
            // Ensure directory exists
            try {
                const destDir = destPath.substring(0, destPath.lastIndexOf('/'));
                if (!await FileSystemStore.fileExists(destDir)) {
                    await FileSystemStore.createDirectory(destDir);
                }
                await FileSystemStore.writeFileContent(destPath, yaml.dump(validation.data));
                report.monsters++;
            } catch (err) {
                console.error(`Failed to write monster ${monster.name}:`, err);
                report.errors.push(`Write failed for ${monster.name}: ${err}`);
            }
        }
    }

    // Placeholder for processJsonCollection (Spells)
    private async processJsonCollection(content: string, root: string, options: ImportOptions, report: RulesetImportReport) {
        const data = JSON.parse(content);
        if (!Array.isArray(data)) return;

        for (const item of data) {
            if (item.category === 'spell' && options.includeSpells) {
                if (options.spellLevels.length > 0 && !options.spellLevels.includes(item.level)) continue;

                // Save Spell
                const destPath = RuleCurator.getSpellPath(root, item);
                const destDir = destPath.substring(0, destPath.lastIndexOf('/'));
                if (!await FileSystemStore.fileExists(destDir)) {
                    await FileSystemStore.createDirectory(destDir);
                }
                await FileSystemStore.writeFileContent(destPath, JSON.stringify(item, null, 2));
                report.spells++;
            }
        }
    }
}
