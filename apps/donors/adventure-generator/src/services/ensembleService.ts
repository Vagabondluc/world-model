import { isTauri } from '../utils/envUtils';
import { FileSystemStore } from './fileSystemStore';
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useEnsembleStore, FileNode } from "../stores/ensembleStore";
import type { FileGraphEdge, FileGraphNode } from "../types/graph";
import { PersistenceMappingService, AppObjectType, type NodeConnection } from "./persistenceMappingService";
import type { Delve, DelveSceneNode } from "../types/delve";
import type { GeneratedAdventure } from "../schemas/adventure";
import type { EncounterWorkflowState } from "../schemas/encounter";

export interface MarkdownFile {
    frontmatter: string;
    content: string;
}

type AppObjectData = GeneratedAdventure | EncounterWorkflowState | Delve;

export class EnsembleService {
    /**
     * Start watching a directory for changes.
     */
    static async startWatching(path: string): Promise<void> {
        if (isTauri()) {
            await invoke("start_watching", { path });

            // Listen for changes
            await listen<string>("file-changed", (event) => {
                console.log("File changed event:", event.payload);
                this.handleFileChange(event.payload);
            });
        } else {
            // In browser, we just log once and skip watching
            console.info("EnsembleService: Browser mode detected. Manual refresh only.");
        }

        // Initial scan
        this.refreshFileTree();
    }

    private static async handleFileChange(eventKind: string) {
        console.info(`[EnsembleService] File system event: ${eventKind}`);
        // For broad changes, refresh the whole tree
        this.refreshFileTree();
    }

    static async refreshFileTree() {
        const rootPath = useEnsembleStore.getState().rootPath;
        if (!rootPath) return;

        const tree = await this.scanFileStructure(rootPath);
        useEnsembleStore.getState().setFileTree(tree);

        // Also refresh graph whenever tree changes
        this.refreshGraph();
    }

    private static normalizePath(path: string): string {
        const parts = path.split(/[\\/]/);
        const stack: string[] = [];
        for (const part of parts) {
            if (part === '.' || part === '') continue;
            if (part === '..') {
                if (stack.length > 0) stack.pop();
                continue;
            }
            stack.push(part);
        }
        // Handle Windows root if needed (e.g. C:)
        let result = stack.join('\\');
        if (path.startsWith('\\\\')) result = '\\\\' + result;
        else if (path.startsWith('/') || path.startsWith('\\')) result = '\\' + result;
        // Ensure drive letter has a backslash after it if it's the root
        if (stack.length === 1 && stack[0].endsWith(':')) result += '\\';
        return result;
    }

    static async refreshGraph() {
        const rootPath = useEnsembleStore.getState().rootPath;
        if (!rootPath) return;

        const nodes: FileGraphNode[] = [];
        const edges: FileGraphEdge[] = [];

        const processNode = async (path: string, name: string) => {
            const id = this.normalizePath(path);
            const data = await this.readMarkdown(path);
            const metadata = PersistenceMappingService.deserializeFromMarkdown(data.frontmatter);

            nodes.push({
                id,
                label: metadata?.label || name.replace('.md', ''),
                path: id,
                type: metadata?.type || 'file'
            });

            // 1. WikiLinks (Existing)
            const links = data.content.match(/\[\[(.*?)\]\]/g) || [];
            links.forEach(link => {
                const targetName = link.slice(2, -2).split('|')[0];
                const targetId = this.normalizePath(`${rootPath}/${targetName}.md`);
                edges.push({ id: `e-wiki-${id}-${targetId}`, source: id, target: targetId, label: 'mention' });
            });

            // 2. Hierarchical Connections (Contained By)
            if (metadata?.contained_by) {
                const parentId = this.normalizePath(
                    metadata.contained_by.startsWith('.')
                        ? `${path.substring(0, path.lastIndexOf('\\'))}\\${metadata.contained_by}`
                        : metadata.contained_by
                );

                edges.push({ id: `e-parent-${id}-${parentId}`, source: parentId, target: id, label: 'contains' });
            }

            // 3. Physical Connections (Passages)
            if (metadata?.connections) {
                metadata.connections.forEach(conn => {
                    const targetId = this.normalizePath(
                        conn.to.startsWith('.')
                            ? `${path.substring(0, path.lastIndexOf('\\'))}\\${conn.to}`
                            : conn.to
                    );
                    edges.push({ id: `e-phys-${id}-${targetId}`, source: id, target: targetId, label: conn.label });
                });
            }
        };

        const walk = async (path: string) => {
            const entries = await FileSystemStore.readDirectory(path);
            for (const entry of entries) {
                const fullPath = `${path}/${entry.name}`;
                if (entry.isDirectory) {
                    await walk(fullPath);
                } else if (entry.name.endsWith('.md')) {
                    await processNode(fullPath.replace(/\//g, '\\'), entry.name);
                }
            }
        };

        await walk(rootPath);
        useEnsembleStore.getState().setGraphData({ nodes, edges });
    }

    private static async scanFileStructure(path: string): Promise<FileNode[]> {
        try {
            const entries = await FileSystemStore.readDirectory(path);
            const nodes: FileNode[] = [];

            for (const entry of entries) {
                // Skip hidden files/folders
                if (entry.name.startsWith('.')) continue;

                const fullPath = `${path}/${entry.name}`;
                if (entry.isDirectory) {
                    nodes.push({
                        id: fullPath,
                        name: entry.name,
                        path: fullPath,
                        type: 'directory',
                        children: await this.scanFileStructure(fullPath)
                    });
                } else {
                    nodes.push({
                        id: fullPath,
                        name: entry.name,
                        path: fullPath,
                        type: 'file'
                    });
                }
            }
            return nodes.sort((a, b) => {
                if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
                return a.name.localeCompare(b.name);
            });
        } catch (e) {
            console.error(`Failed to scan dir ${path}`, e);
            return [];
        }
    }

    /**
     * Read a markdown file and split its frontmatter.
     */
    static async readMarkdown(path: string): Promise<MarkdownFile> {
        if (isTauri()) {
            return await invoke<MarkdownFile>("read_markdown_file", { path });
        } else {
            console.log(`[EnsembleService] Reading via FileSystemStore: ${path}`);
            try {
                const raw = await FileSystemStore.readFileContent(path);
                console.log(`[EnsembleService] Read raw content length: ${raw.length}`);

                const parts = raw.split(/^---$/m);
                if (parts.length >= 3) {
                    return {
                        frontmatter: parts[1].trim(),
                        content: parts.slice(2).join('---').trim()
                    };
                }

                return {
                    frontmatter: "",
                    content: raw
                };
            } catch (e) {
                console.error(`[EnsembleService] Failed to read markdown: ${path}`, e);
                throw e;
            }
        }
    }

    /**
     * Write a markdown file with optional frontmatter.
     */
    static async writeMarkdown(path: string, frontmatter: string, content: string): Promise<void> {
        if (isTauri()) {
            await invoke("write_markdown_file", { path, frontmatter, content });
        } else {
            console.log(`[EnsembleService] Writing via FileSystemStore: ${path}`);
            let safeContent = content;
            if (frontmatter && frontmatter.length > 0) {
                safeContent = `---\n${frontmatter}\n---\n${content}`;
            }
            await FileSystemStore.writeFileContent(path, safeContent);
        }
    }

    /**
     * Spawn the player view window.
     */
    static async spawnPlayerWindow(): Promise<void> {
        await invoke("spawn_player_window");
    }

    /**
     * Helper to load a file into the store.
     */
    static async loadFileIntoStore(path: string): Promise<void> {
        const fileContent = await this.readMarkdown(path);
        const metadata = PersistenceMappingService.deserializeFromMarkdown(fileContent.frontmatter);

        if (metadata && metadata.type === 'quick-delve') {
            // RECONSTRUCTION: If this is a master file, find all rooms belonging to it
            const rootPath = useEnsembleStore.getState().rootPath;
            if (rootPath) {
                const rooms: DelveSceneNode[] = [];
                const projectRoot = path.substring(0, path.lastIndexOf('\\'));

                const findRooms = async (dir: string) => {
                    const entries = await FileSystemStore.readDirectory(dir);
                    for (const entry of entries) {
                        const fullPath = `${dir}\\${entry.name}`;
                        if (entry.isDirectory) {
                            await findRooms(fullPath);
                        } else if (entry.name.endsWith('.md')) {
                            const content = await this.readMarkdown(fullPath);
                            const roomMeta = PersistenceMappingService.deserializeFromMarkdown(content.frontmatter);
                            // Check if this file is contained by the current master file
                            // We compare basename or relative path for robustness
                            if (roomMeta?.contained_by && (roomMeta.contained_by === 'index.md' || roomMeta.contained_by === path)) {
                                if (roomMeta.data && typeof roomMeta.data === 'object') {
                                    rooms.push({ ...(roomMeta.data as DelveSceneNode), id: fullPath });
                                }
                            }
                        }
                    }
                };

                await findRooms(projectRoot);
                // Sort rooms if they have indices in metadata or titles
                const quickDelve = (metadata.data && typeof metadata.data === 'object' ? metadata.data : {}) as Partial<Delve>;
                quickDelve.rooms = rooms.sort((a, b) => a.title.localeCompare(b.title));
                metadata.data = quickDelve;
            }
        }

        useEnsembleStore.getState().setCurrentFile(path);
        useEnsembleStore.getState().setFileContent(fileContent.frontmatter, fileContent.content, metadata);

        if (metadata) {
            console.info(`[EnsembleService] Detected typed object: ${metadata.type}`);
        }
    }

    /**
     * Saves a specialized application object (Adventures, Delves, etc.) to the workspace.
     */
    static async saveAppObject(type: AppObjectType, data: AppObjectData, title: string): Promise<string | null> {
        const rootPath = useEnsembleStore.getState().rootPath;
        if (!rootPath) return null;

        if (type === 'quick-delve') {
            return await this.saveDelveProject(data as Delve);
        }

        let markdown = "";
        switch (type) {
            case 'adventure-hook':
                markdown = PersistenceMappingService.adventureToMarkdown(data as GeneratedAdventure);
                break;
            case 'narrative-encounter': {
                const encounter = data as EncounterWorkflowState & { parentDungeonId?: string };
                markdown = PersistenceMappingService.encounterToMarkdown(encounter, title, encounter.parentDungeonId);
                break;
            }
        }

        const parts = markdown.split('---\n');
        const frontmatter = parts[1] || "";
        const content = parts.slice(2).join('---\n').trim();

        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safeTitle}.md`;
        const fullPath = `${rootPath}/${filename}`.replace(/\//g, '\\');

        try {
            await this.writeMarkdown(fullPath, frontmatter, content);
            await this.refreshFileTree();
            return fullPath;
        } catch (e) {
            console.error("Failed to save app object to workspace:", e);
            throw e;
        }
    }

    /**
     * Saves a Delve as a project folder with individual room files.
     */
    static async saveDelveProject(delve: Delve): Promise<string | null> {
        const rootPath = useEnsembleStore.getState().rootPath;
        if (!rootPath) return null;

        const safeTitle = delve.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const projectPath = `${rootPath}/${safeTitle}`.replace(/\//g, '\\');
        const roomsPath = `${projectPath}/rooms`.replace(/\//g, '\\');

        try {
            // 1. Save Master File
            const masterMd = PersistenceMappingService.delveToMarkdown(delve);
            const masterParts = masterMd.split('---\n');
            await this.writeMarkdown(`${projectPath}/index.md`, masterParts[1], masterParts.slice(2).join('---\n').trim());

            // 2. Save Room Files
            for (let i = 0; i < delve.rooms.length; i++) {
                const room = delve.rooms[i];
                const connections: NodeConnection[] = [];
                if (i > 0) connections.push({ to: `room_${i}.md`, label: "Back" });
                if (i < delve.rooms.length - 1) connections.push({ to: `room_${i + 2}.md`, label: "Next" });

                const roomMd = PersistenceMappingService.roomToMarkdown(room, `../index.md`, connections);
                const roomParts = roomMd.split('---\n');
                await this.writeMarkdown(`${roomsPath}/room_${i + 1}.md`, roomParts[1], roomParts.slice(2).join('---\n').trim());
            }

            await this.refreshFileTree();
            return `${projectPath}/index.md`;
        } catch (e) {
            console.error("Failed to save delve project:", e);
            throw e;
        }
    }

    static async exportVault(targetPath: string, format: 'hugo' | 'obsidian'): Promise<void> {
        const rootPath = useEnsembleStore.getState().rootPath;
        if (!rootPath) return;
        await invoke("export_vault", { sourcePath: rootPath, targetPath, format });
    }

    /**
     * Helper to save current store content to disk.
     */
    static async saveCurrentFile() {
        const state = useEnsembleStore.getState();
        if (!state.currentFile || !state.fileContent) return;

        try {
            await this.writeMarkdown(
                state.currentFile,
                state.fileContent.frontmatter,
                state.fileContent.content
            );
            state.setDirty(false);
        } catch (error) {
            console.error("Failed to save markdown file:", error);
            throw error;
        }
    }
}
