
import { CompendiumEntry } from '../types/compendium';
import { GraphData, GraphNode, GraphLink } from '../types/graph';

/**
 * Transforms an array of CompendiumEntry objects into a data structure
 * suitable for a force-directed graph visualization.
 * @param entries - The array of compendium entries.
 * @returns An object containing arrays of nodes and links.
 */
export function transformToGraphData(entries: CompendiumEntry[]): GraphData {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const entryIds = new Set(entries.map(e => e.id));

    for (const entry of entries) {
        // Add a node for the current entry.
        nodes.push({
            id: entry.id,
            label: entry.title,
            category: entry.category,
            // Assign a value for node size based on importance
            val: entry.importance === 'critical' ? 3 : entry.importance === 'major' ? 2 : 1,
        });

        // Create links based on relationships.
        for (const targetId of entry.relationships.connectedEntries) {
            // Ensure the target of the link exists in our dataset to avoid dangling links.
            if (entryIds.has(targetId)) {
                // To avoid duplicate links in an undirected graph, we can add a check.
                // However, for a directed graph or simpler implementation, we can add all.
                // For now, let's add them all and let the graph library handle duplicates if needed.
                links.push({
                    source: entry.id,
                    target: targetId,
                });
            }
        }
    }

    return { nodes, links };
}
