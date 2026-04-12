import { SavedEraGraph, NodeDefinition, NodeType } from '@/types/nodeEditor.types';

// Helper to create a node
const createNode = (id: string, type: string, label: string, x: number, y: number, config: any = {}): NodeDefinition => ({
    id,
    type: type as NodeType,
    position: { x, y },
    data: { label, ...config.data },
    inputs: [],
    outputs: [{ id: `${id}-out`, label: 'Output', dataType: 'elementData', required: true }],
    config: { label, ...config }
});

// --- Era 1: Myth (3 Deities, 3 Sites) ---
const mythNodes: NodeDefinition[] = [
    createNode('d1', 'deityInput', 'Zeus (Primary)', 100, 100, { icon: 'Zap' }),
    createNode('d2', 'deityInput', 'Poseidon', 100, 250, { icon: 'Waves' }),
    createNode('d3', 'deityInput', 'Hades', 100, 400, { icon: 'Skull' }),
    createNode('s1', 'locationInput', 'Mt. Olympus (Sacred Site)', 400, 100, { icon: 'Mountain' }),
    createNode('s2', 'locationInput', 'Atlantis (Sacred Site)', 400, 250, { icon: 'Waves' }),
    createNode('s3', 'locationInput', 'Underworld Gate (Sacred Site)', 400, 400, { icon: 'Skull' }),
];

// --- Era 2: Foundation (Prime Faction, Neighbor, Capital, Settlements) ---
const foundationNodes: NodeDefinition[] = [
    // Inputs from Era 1
    createNode('in-d1', 'deityInput', 'Deities (from Era 1)', 50, 50, { data: { sourceType: 'query', query: 'era=1' }, color: '#cbd5e1' }),

    createNode('f1', 'factionInput', 'Mycenaeans (Prime)', 100, 200, { icon: 'Flag' }),
    createNode('f2', 'factionInput', 'Trojans (Neighbor)', 100, 350, { icon: 'Flag' }),

    createNode('set1', 'settlementInput', 'Mycenae (Capital)', 400, 200, { icon: 'Castle' }),
    createNode('set2', 'settlementInput', 'Argos (Settlement)', 400, 350, { icon: 'Home' }),
    createNode('set3', 'settlementInput', 'Troy (Neighbor Capital)', 400, 500, { icon: 'Castle' }),
];

// --- Era 3: Discovery (Exploration, Colonies, Heroes) ---
const discoveryNodes: NodeDefinition[] = [
    createNode('in-f1', 'factionInput', 'Factions (from Era 2)', 50, 50, { data: { sourceType: 'query', query: 'era=2' }, color: '#cbd5e1' }),

    createNode('loc1', 'locationInput', 'Crete (Discovered)', 300, 100, { icon: 'Map' }),
    createNode('loc2', 'locationInput', 'Sicily (Discovered)', 300, 250, { icon: 'Map' }),
    createNode('loc3', 'locationInput', 'Black Sea Coast (Discovered)', 300, 400, { icon: 'Map' }),

    createNode('hero1', 'characterInput', 'Odysseus (Explorer)', 600, 100, { icon: 'User' }),
    createNode('col1', 'settlementInput', 'Syracuse (Colony)', 600, 250, { icon: 'Anchor' }),

    createNode('event1', 'eventInput', 'Great Voyage', 600, 400, { icon: 'Ship' }),
];

// --- Era 4: Creation (Resources, Monuments) ---
const creationNodes: NodeDefinition[] = [
    createNode('res1', 'resourceInput', 'Bronze', 100, 100, { icon: 'Pickaxe' }),
    createNode('res2', 'resourceInput', 'Marble', 100, 250, { icon: 'Pickaxe' }),

    createNode('mon1', 'monumentInput', 'Colossus', 400, 100, { icon: 'Landmark' }),
    createNode('mon2', 'monumentInput', 'Great Library', 400, 250, { icon: 'Book' }),
];

// --- Era 5: Empires (Wars, Conquests) ---
const empiresNodes: NodeDefinition[] = [
    createNode('f-rising', 'factionInput', 'Persian Empire (Rising)', 100, 100, { icon: 'Flag' }),
    createNode('war1', 'warInput', 'Persian War', 400, 100, { icon: 'Swords' }),
    createNode('bat1', 'eventInput', 'Battle of Marathon', 400, 250, { icon: 'Skull' }),
];

// --- Era 6: Collapse (Cataclysm) ---
const collapseNodes: NodeDefinition[] = [
    createNode('event-cat', 'eventInput', 'Sea Peoples Invasion', 100, 100, { icon: 'AlertTriangle' }),
    createNode('ruin1', 'locationInput', 'Mycenae Ruins', 400, 100, { icon: 'Skull' }),
];

// --- Era 7: Home (End) ---
const homeNodes: NodeDefinition[] = [
    createNode('hero-end', 'characterInput', 'The Last Chronicler', 100, 100, { icon: 'Feather' }),
];

// Construct the full project structure
const createSavedEra = (eraId: number, name: string, nodes: NodeDefinition[]): SavedEraGraph => ({
    id: `sample-era-${eraId}`,
    eraId,
    name,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    schema: {
        version: '1.0.0',
        metadata: {
            name,
            description: `Sample graph for Era ${eraId}`,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
        },
        nodes,
        connections: [],
        globalSettings: { theme: 'light', snapToGrid: true, gridSize: 20 }
    }
});

export const SAMPLE_PROJECT_DATA = {
    version: '1.0.0',
    metadata: {
        exportedAt: new Date().toISOString(),
        totalSaves: 7,
        name: "Main App Mirror"
    },
    saves: [
        createSavedEra(1, "Myth (Sample)", mythNodes),
        createSavedEra(2, "Foundation (Sample)", foundationNodes),
        createSavedEra(3, "Discovery (Sample)", discoveryNodes),
        createSavedEra(4, "Creation (Sample)", creationNodes),
        createSavedEra(5, "Empires (Sample)", empiresNodes),
        createSavedEra(6, "Collapse (Sample)", collapseNodes),
        createSavedEra(7, "Home (Sample)", homeNodes),
    ]
};
