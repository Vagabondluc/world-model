/**
 * Node Registry
 * Central configuration for all available node types in the editor.
 */

import { NodeConfig, NodeCategory, NodeType } from '@/types/nodeEditor.types';

// Registry record mapping NodeType to NodeConfig
export const NODE_REGISTRY: Record<NodeType, NodeConfig> = {
    // Interactive Nodes
    diceRoll: {
        category: 'interactive',
        label: 'Dice Roll',
        icon: 'Dices', // Changed from Dice
        description: 'Rolls dice and outputs the result based on a lookup table.',
        color: '#f59e0b', // amber-500
        width: 256
    },
    form: {
        category: 'interactive',
        label: 'Form Input',
        icon: 'FormInput',
        description: 'Collects user input via a structured form.',
        color: '#3b82f6', // blue-500
        width: 320
    },
    choice: {
        category: 'interactive',
        label: 'Choice',
        icon: 'Split',
        description: 'Presents a binary or multiple choice decision.',
        color: '#8b5cf6', // violet-500
        width: 200
    },
    // --- Workflow Nodes ---
    step: {
        category: 'workflow',
        label: 'Workflow Step',
        icon: 'Circle',
        description: 'A distinct step in the era workflow.',
        color: '#3b82f6', // blue-500
        width: 280
    },
    eraGate: {
        category: 'workflow',
        label: 'Era Gate',
        icon: 'DoorOpen',
        description: 'Transition point to the next Era.',
        color: '#8b5cf6', // violet-500, maybe different?
        width: 240
    },
    // --- Element Nodes ---
    resource: {
        category: 'element',
        label: 'Resource',
        icon: 'Gem',
        description: 'Define a resource element',
        color: '#3B82F6'
    },
    resourceInput: {
        category: 'input',
        label: 'Resource Input',
        icon: 'Gem', // Dashed border usually handled by component
        description: 'Reference an existing resource',
        color: '#3B82F6'
    },
    deity: {
        category: 'element',
        label: 'Deity',
        icon: 'Sun',
        description: 'Define a deity element',
        color: '#F59E0B'
    },
    deityInput: {
        category: 'input',
        label: 'Deity Input',
        icon: 'Sun',
        description: 'Reference an existing deity',
        color: '#F59E0B'
    },
    location: {
        category: 'element',
        label: 'Location',
        icon: 'MapPin',
        description: 'Define a location element',
        color: '#10B981'
    },
    locationInput: {
        category: 'input',
        label: 'Location Input',
        icon: 'MapPin',
        description: 'Reference an existing location',
        color: '#10B981'
    },
    faction: {
        category: 'element',
        label: 'Faction',
        icon: 'Flag',
        description: 'Define a faction element',
        color: '#EF4444'
    },
    factionInput: {
        category: 'input',
        label: 'Faction Input',
        icon: 'Flag',
        description: 'Reference an existing faction',
        color: '#EF4444'
    },
    settlement: {
        category: 'element',
        label: 'Settlement',
        icon: 'Home',
        description: 'Define a settlement element',
        color: '#8B5CF6'
    },
    settlementInput: {
        category: 'input',
        label: 'Settlement Input',
        icon: 'Home',
        description: 'Reference an existing settlement',
        color: '#8B5CF6'
    },
    event: {
        category: 'element',
        label: 'Event',
        icon: 'Calendar',
        description: 'Define an event',
        color: '#EC4899'
    },
    eventInput: {
        category: 'input',
        label: 'Event Input',
        icon: 'Calendar',
        description: 'Reference an existing event',
        color: '#EC4899'
    },
    character: {
        category: 'element',
        label: 'Character',
        icon: 'User',
        description: 'Define a character',
        color: '#6366F1'
    },
    characterInput: {
        category: 'input',
        label: 'Character Input',
        icon: 'User',
        description: 'Reference an existing character',
        color: '#6366F1'
    },
    war: {
        category: 'element',
        label: 'War',
        icon: 'Swords',
        description: 'Define a war',
        color: '#DC2626'
    },
    warInput: {
        category: 'input',
        label: 'War Input',
        icon: 'Swords',
        description: 'Reference an existing war',
        color: '#DC2626'
    },
    monument: {
        category: 'element',
        label: 'Monument',
        icon: 'Landmark',
        description: 'Define a monument',
        color: '#FCD34D'
    },
    monumentInput: {
        category: 'input',
        label: 'Monument Input',
        icon: 'Landmark',
        description: 'Reference an existing monument',
        color: '#FCD34D'
    },

    // --- Logic / Utility Nodes ---
    progress: {
        category: 'progress',
        label: 'Progress Bar',
        icon: 'BarChart3',
        description: 'Create a progress bar',
        color: '#10B981'
    },
    segment: {
        category: 'progress',
        label: 'Segment',
        icon: 'PieChart',
        description: 'Define a progress segment',
        color: '#F59E0B'
    },
    eraGoal: {
        category: 'progress',
        label: 'Era Goal',
        icon: 'Target',
        description: 'Define an era goal',
        color: '#F59E0B'
    },
    transform: {
        category: 'logic',
        label: 'Transform',
        icon: 'ArrowRightLeft',
        description: 'Transform data structure',
        color: '#64748B'
    },
    aggregate: {
        category: 'logic',
        label: 'Aggregate',
        icon: 'Sigma',
        description: 'Aggregate multiple inputs',
        color: '#64748B'
    },
    filter: {
        category: 'logic',
        label: 'Filter',
        icon: 'Filter',
        description: 'Filter data based on conditions',
        color: '#64748B'
    },
    conditional: {
        category: 'logic',
        label: 'Conditional',
        icon: 'GitBranch',
        description: 'Branch logic flow',
        color: '#64748B'
    },
    logic: {
        category: 'logic',
        label: 'Logic Gate',
        icon: 'Cpu',
        description: 'Boolean logic operations',
        color: '#64748B'
    },
    style: {
        category: 'logic',
        label: 'Style Style',
        icon: 'Palette',
        description: 'Define visual styles',
        color: '#EC4899'
    },
    table: {
        category: 'output',
        label: 'Table',
        icon: 'Table',
        description: 'Display data in a table',
        color: '#3B82F6'
    },
    dataInput: {
        category: 'input',
        label: 'Manual Input',
        icon: 'Keyboard',
        description: 'Manually enter data',
        color: '#94A3B8'
    }
};

/**
 * Get configuration for a specific node type
 */
export const getNodeConfig = (type: NodeType): NodeConfig => {
    return NODE_REGISTRY[type];
};

/**
 * Get all registered node types
 */
export const getAllNodeTypes = (): NodeType[] => {
    return Object.keys(NODE_REGISTRY) as NodeType[];
};

/**
 * Get all node types belonging to a specific category
 */
export const getNodesByCategory = (category: NodeCategory): NodeType[] => {
    return (Object.keys(NODE_REGISTRY) as NodeType[]).filter(
        type => NODE_REGISTRY[type].category === category
    );
};
