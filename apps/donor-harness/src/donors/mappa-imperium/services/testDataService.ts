import { NodeDefinition, ConnectionDefinition } from '@mi/types/nodeEditor.types';
import { ElementCard } from '@mi/types/element.types';

/**
 * Service to convert Node Editor graph into Game Test Data (ElementCards).
 * This allows using the visual editor to create seed data for development/testing.
 */
export const TestDataService = {

    /**
     * Converts the current graph nodes into a flat array of ElementCards.
     * Relationships (connections) are currently implicit via ID references in data,
     * but future versions could traverse connections to auto-link IDs.
     */
    convertGraphToTestData: (nodes: NodeDefinition[], _connections: ConnectionDefinition[]): ElementCard[] => {
        const elements: ElementCard[] = [];

        nodes.forEach(node => {
            // Filter for only Element nodes
            if (!isElementNode(node.type)) return;

            // Extract the element data stored in the node
            // The ElementNode component stores data in `node.data.element`
            const nodeData = node.data as any;
            const elementData = nodeData.element;

            if (!elementData) {
                console.warn(`Node ${node.id} (${node.type}) has no element data.`);
                return;
            }

            // Map Node Type to Element Type
            // e.g. 'resource' -> 'Resource', 'factionInput' -> 'Faction'
            const type = mapNodeTypeToElementType(node.type);
            if (!type) return;

            // Construct the ElementCard
            const card: ElementCard = {
                id: node.id, // Keep Node ID as Element ID for consistency during session
                type: type,
                name: nodeData.label || 'Unnamed Element',
                owner: 0, // Default to System/Neutral
                era: 1,   // Default to Era 1
                data: elementData, // The specific data (Resource, Deity, etc.)
                isDebug: true,      // Mark as debug/test data
                createdYear: 0,
                creationStep: 'test-data-export'
            };

            elements.push(card);
        });

        return elements;
    },

    /**
     * Downloads the generated elements as a JSON file.
     */
    downloadTestData: (elements: ElementCard[]) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ elements }, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "test-data-elements.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
};

// Helper: Check if node type is an element
function isElementNode(type: string): boolean {
    const elementTypes = [
        'resource', 'resourceInput',
        'deity', 'deityInput',
        'location', 'locationInput',
        'faction', 'factionInput',
        'settlement', 'settlementInput',
        'event', 'eventInput',
        'character', 'characterInput',
        'war', 'warInput',
        'monument', 'monumentInput'
    ];
    return elementTypes.includes(type);
}

// Helper: Map node type string to ElementCard 'type'
function mapNodeTypeToElementType(nodeType: string): ElementCard['type'] | null {
    const coreType = nodeType.replace('Input', '');
    // Capitalize first letter
    const capitalized = coreType.charAt(0).toUpperCase() + coreType.slice(1);

    // Validate against ElementCard type union if needed, but casting usually suffices if naming is consistent
    return capitalized as ElementCard['type'];
}
