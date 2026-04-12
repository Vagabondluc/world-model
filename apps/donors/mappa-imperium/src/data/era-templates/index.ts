import { NodeEditorSchema, NodeDefinition, ConnectionDefinition } from '@/types/nodeEditor.types';

// Helper to create a basic schema structure
const createSchema = (name: string, description: string, nodes: NodeDefinition[], connections: ConnectionDefinition[] = []): NodeEditorSchema => ({
    version: '1.0.0',
    metadata: {
        name,
        description,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
    },
    nodes,
    connections,
    globalSettings: {
        theme: 'light',
        snapToGrid: true,
        gridSize: 20
    }
});

// --- Era 1: Myth ---
const mythNodes: NodeDefinition[] = [
    {
        id: 'deity-input-1',
        type: 'deityInput',
        position: { x: 100, y: 100 },
        data: { label: 'Primary Deity', sourceType: 'manual' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'Deity', dataType: 'elementData', required: true }],
        config: { category: 'input', label: 'Primary Deity', icon: 'Sparkles' }
    },
    {
        id: 'location-input-1',
        type: 'locationInput',
        position: { x: 100, y: 300 },
        data: { label: 'Sacred Site', sourceType: 'manual' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'Location', dataType: 'elementData', required: true }],
        config: { category: 'input', label: 'Sacred Site', icon: 'MapPin' }
    }
];

// --- Era 2: Foundation (Chains from Myth) ---
const foundationNodes: NodeDefinition[] = [
    // Input from Era 1
    {
        id: 'deity-input-ref',
        type: 'deityInput',
        position: { x: 100, y: 100 },
        // Query specific deities if needed, or just manual input for now acting as bridge
        data: { label: 'Pantheon (from Era 1)', sourceType: 'query', query: 'era=1' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'Deities', dataType: 'elementData', required: false }],
        config: { category: 'input', label: 'Pantheon', icon: 'Sparkles', color: '#e2e8f0' }
    },
    {
        id: 'faction-input-1',
        type: 'factionInput',
        position: { x: 100, y: 300 },
        data: { label: 'Major Faction', sourceType: 'manual' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'Faction', dataType: 'elementData', required: true }],
        config: { category: 'input', label: 'Major Faction', icon: 'Flag' }
    },
    {
        id: 'settlement-input-1',
        type: 'settlementInput',
        position: { x: 400, y: 300 },
        data: { label: 'Capital City', sourceType: 'manual' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'Settlement', dataType: 'elementData', required: true }],
        config: { category: 'input', label: 'Capital City', icon: 'Castle' }
    }
];

// --- Era 3: Discovery (Chains from Foundation) ---
const discoveryNodes: NodeDefinition[] = [
    // Input from Era 2
    {
        id: 'faction-input-ref',
        type: 'factionInput',
        position: { x: 100, y: 100 },
        data: { label: 'Empires (from Era 2)', sourceType: 'query', query: 'era=2' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'Factions', dataType: 'elementData', required: false }],
        config: { category: 'input', label: 'Empires', icon: 'Flag', color: '#e2e8f0' }
    },
    {
        id: 'location-input-new',
        type: 'locationInput',
        position: { x: 100, y: 300 },
        data: { label: 'Discovered Land', sourceType: 'manual' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'Location', dataType: 'elementData', required: true }],
        config: { category: 'input', label: 'Discovered Land', icon: 'Compass' }
    },
    {
        id: 'event-input-1',
        type: 'eventInput',
        position: { x: 400, y: 300 },
        data: { label: 'Discovery Event', sourceType: 'manual' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'Event', dataType: 'elementData', required: true }],
        config: { category: 'input', label: 'Discovery Event', icon: 'Scroll' }
    }
];

// --- Era 4: Creation (Chains from Discovery) ---
const creationNodes: NodeDefinition[] = [
    {
        id: 'location-input-ref',
        type: 'locationInput',
        position: { x: 100, y: 100 },
        data: { label: 'Known World (Era 3)', sourceType: 'query', query: 'era=3' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'Locations', dataType: 'elementData', required: false }],
        config: { category: 'input', label: 'Known World', icon: 'Map', color: '#e2e8f0' }
    },
    {
        id: 'resource-input-1',
        type: 'resourceInput',
        position: { x: 100, y: 300 },
        data: { label: 'New Resource', sourceType: 'manual' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'Resource', dataType: 'elementData', required: true }],
        config: { category: 'input', label: 'New Resource', icon: 'Gem' }
    }
];

// --- Era 5: Empires ---
const empiresNodes: NodeDefinition[] = [
    {
        id: 'war-input-1',
        type: 'warInput',
        position: { x: 100, y: 100 },
        data: { label: 'Conflict', sourceType: 'manual' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'War', dataType: 'elementData', required: true }],
        config: { category: 'input', label: 'Conflict', icon: 'Swords' }
    },
    {
        id: 'faction-input-2',
        type: 'factionInput',
        position: { x: 100, y: 300 },
        data: { label: 'Rising Power', sourceType: 'manual' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'Faction', dataType: 'elementData', required: true }],
        config: { category: 'input', label: 'Rising Power', icon: 'Flag' }
    }
];

// --- Era 6: Collapse ---
const collapseNodes: NodeDefinition[] = [
    {
        id: 'event-input-cataclysm',
        type: 'eventInput',
        position: { x: 100, y: 100 },
        data: { label: 'Cataclysmic Event', sourceType: 'manual' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'Event', dataType: 'elementData', required: true }],
        config: { category: 'input', label: 'Cataclysmic Event', icon: 'AlertTriangle' }
    }
];

// --- Era 7: Home (End/Restart) ---
const homeNodes: NodeDefinition[] = [
    {
        id: 'character-input-hero',
        type: 'characterInput',
        position: { x: 100, y: 100 },
        data: { label: 'Current Hero', sourceType: 'manual' },
        inputs: [],
        outputs: [{ id: 'out-1', label: 'Character', dataType: 'elementData', required: true }],
        config: { category: 'input', label: 'Current Hero', icon: 'User' }
    }
];

export const ERA_TEMPLATES: Record<number, NodeEditorSchema> = {
    1: createSchema('Myth Template', 'Initial setup for Era of Myth', mythNodes),
    2: createSchema('Foundation Template', 'Structure for Era of Foundation', foundationNodes),
    3: createSchema('Discovery Template', 'Exploration setup for Era of Discovery', discoveryNodes),
    4: createSchema('Creation Template', 'Development setup for Era of Creation', creationNodes),
    5: createSchema('Empires Template', 'Conflict setup for Era of Empires', empiresNodes),
    6: createSchema('Collapse Template', 'Endgame setup for Era of Collapse', collapseNodes),
    7: createSchema('Home Template', 'Wrap-up setup for Era Home', homeNodes),
};
