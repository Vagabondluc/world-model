import { FileSystemStore } from './fileSystemStore';
import { NarrativeScriptMetadata, NarrativeScriptCategory } from '../types/narrative';

export class NarrativeScriptService {
    private static SCRIPTS_PATH = 'docs/Narrative Scripts/mockups/wireframes';

    /**
     * Scans the narrative scripts directory and extracts metadata.
     */
    static async getScripts(): Promise<NarrativeScriptMetadata[]> {
        const scripts: NarrativeScriptMetadata[] = [];

        const possiblePaths = [
            'docs/Narrative Scripts/mockups/wireframes',
        ];

        let activePath = '';
        for (const p of possiblePaths) {
            if (await FileSystemStore.fileExists(p)) {
                activePath = p;
                break;
            }
        }

        if (!activePath) return [];

        try {
            const entries = await FileSystemStore.readDirectory(activePath);
            for (const entry of entries) {
                if (!entry.isDirectory && entry.name.endsWith('-wireframe.md')) {
                    const metadata = await this.parseScriptMetadata(activePath, entry.name);
                    scripts.push(metadata);
                }
            }
        } catch (e) {
            console.error("Failed to scan narrative scripts", e);
        }

        return scripts;
    }

    /**
     * Reads the full content of a script file.
     */
    static async getScriptContent(filePath: string): Promise<string> {
        try {
            return await FileSystemStore.readFileContent(filePath);
        } catch (e) {
            console.error(`Failed to read script content at ${filePath}`, e);
            throw e;
        }
    }

    private static async parseScriptMetadata(dir: string, fileName: string): Promise<NarrativeScriptMetadata> {
        const fullPath = `${dir}/${fileName}`;
        const id = fileName.replace('-wireframe.md', '');
        let title = id.replace(/_/g, ' ');
        let description = "No description available.";
        let category: NarrativeScriptCategory = 'Other';

        try {
            const content = await FileSystemStore.readFileContent(fullPath);

            // Heuristic Parsing of ASCII Wireframes
            const titleMatch = content.match(/\[(.*?)\]/);
            if (titleMatch) {
                title = titleMatch[1].split(':')[0].trim();
            }

            // Category logic based on filename
            const lowerId = id.toLowerCase();
            if (lowerId.includes('npc')) category = 'NPC';
            else if (lowerId.includes('dungeon')) category = 'Dungeon';
            else if (lowerId.includes('encounter')) category = 'Encounter';
            else if (lowerId.includes('mystery')) category = 'Mystery';
            else if (lowerId.includes('location') || lowerId.includes('city') || lowerId.includes('settlement')) category = 'Location';
            else if (lowerId.includes('adventure')) category = 'Adventure';
            else if (lowerId.includes('trap')) category = 'Trap';

            // Extract description if it looks like there's a block
            const descMatch = content.match(/DESCRIPTION.*?\n\| (.*?) \|/s);
            if (descMatch) {
                description = descMatch[1].replace(/\[|\]|"/g, '').trim();
            }

        } catch (e) {
            console.error(`Failed to parse script metadata for ${fileName}`, e);
        }

        return {
            id,
            title,
            description,
            category,
            filePath: fullPath
        };
    }
}
