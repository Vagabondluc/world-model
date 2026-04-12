import { GeneratedAdventure } from '../schemas/adventure';
import { EncounterWorkflowState } from '../schemas/encounter';
import { Delve, DelveSceneNode } from '../types/delve';
import yaml from 'js-yaml';

export type AppObjectType = 'adventure-hook' | 'narrative-encounter' | 'quick-delve' | 'dungeon-room';

export interface NodeConnection {
    to: string; // The ID/Path of the target node
    label: string; // e.g., "North Door", "Secret Passage"
}

export interface NodeMetadata {
    type: AppObjectType;
    version: string;
    id: string;
    label: string;
    data: unknown;
    contained_by?: string; // ID of the parent node (e.g., the Dungeon master file)
    referenced_node?: string; // If this node points to an external file (e.g., a room replaced by an encounter)
    connections: NodeConnection[];
    generatedAt: string;
}

export class PersistenceMappingService {
    /**
     * Serializes an application object into a Markdown string with YAML frontmatter.
     */
    static serializeToMarkdown(metadata: Partial<NodeMetadata>): string {
        const fullMetadata: NodeMetadata = {
            type: 'adventure-hook',
            version: '1.1',
            id: '',
            label: '',
            data: {},
            connections: [],
            generatedAt: new Date().toISOString(),
            ...metadata
        } as NodeMetadata;

        const frontmatter = yaml.dump({ node_metadata: fullMetadata }).trim();
        const content = metadata.label ? `# ${metadata.label}\n\n` : "";

        return `---\n${frontmatter}\n---\n\n${content}`;
    }

    /**
     * Deserializes a Markdown string (with frontmatter) into a NodeMetadata object.
     */
    static deserializeFromMarkdown(frontmatter: string): NodeMetadata | null {
        try {
            const parsed = yaml.load(frontmatter) as { node_metadata?: NodeMetadata } | undefined;
            if (parsed && parsed.node_metadata) {
                return parsed.node_metadata;
            }
        } catch (e) {
            console.error("Failed to parse node metadata from frontmatter:", e);
        }
        return null;
    }

    /**
     * Helpers for specific types
     */
    static adventureToMarkdown(adventure: GeneratedAdventure): string {
        const title = adventure.type === 'simple' ? adventure.premise : adventure.title;
        let body = "";
        if (adventure.type === 'simple') {
            body = `**Premise:** ${adventure.premise}\n\n**Origin:** ${adventure.origin}\n\n**Positioning:** ${adventure.positioning}\n\n**Stakes:** ${adventure.stakes}`;
        } else {
            body = `**Hook:** ${adventure.hook}\n\n**Player Buy-In:** ${adventure.player_buy_in}\n\n**Starter Scene:** ${adventure.starter_scene}\n\n**GM Notes:**\n* Escalation: ${adventure.gm_notes.escalation}\n* Twists: ${adventure.gm_notes.twists_applied.join(', ')}`;
        }

        return this.serializeToMarkdown({
            type: 'adventure-hook',
            id: title,
            label: title,
            data: adventure
        }) + body;
    }

    static encounterToMarkdown(state: EncounterWorkflowState, title: string, parentId?: string): string {
        let body = `**Location:** ${state.locationContext || 'Unknown'}\n`;
        body += `**Factions:** ${state.factionContext?.join(', ') || 'None'}\n\n`;

        state.nodes.forEach(node => {
            body += `### Stage: ${node.stage}\n`;
            body += `${node.narrative}\n\n`;
        });

        return this.serializeToMarkdown({
            type: 'narrative-encounter',
            id: title,
            label: title,
            data: state,
            contained_by: parentId
        }) + body;
    }

    static roomToMarkdown(room: DelveSceneNode, dungeonId: string, connections: NodeConnection[]): string {
        const body = `> ${room.narrative}\n\n**Sensory:** ${Object.values(room.sensory).join(' ')}`;

        return this.serializeToMarkdown({
            type: 'dungeon-room',
            id: room.id,
            label: room.title,
            data: room,
            contained_by: dungeonId,
            connections
        }) + body;
    }

    static delveToMarkdown(delve: Delve): string {
        return this.serializeToMarkdown({
            type: 'quick-delve',
            id: delve.id,
            label: delve.title,
            data: { ...delve, rooms: [] } // Metadata only stores the "Master" info, rooms are separate nodes
        });
    }
}
