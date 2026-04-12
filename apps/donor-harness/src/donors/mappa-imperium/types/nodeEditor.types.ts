/**
 * Node Editor Types
 * Defines the core data structures for the node-based visual editor.
 */

import type { ElementCard } from '@mi/types';

// --- Core Identifiers ---

export type NodeId = string;
export type PortId = string;
export type ConnectionId = string;

// --- Node Taxonomy ---

export type NodeType =
    // Element Nodes
    | 'resource'
    | 'resourceInput'
    | 'deity'
    | 'deityInput'
    | 'location'
    | 'locationInput'
    | 'faction'
    | 'factionInput'
    | 'settlement'
    | 'settlementInput'
    | 'event'
    | 'eventInput'
    | 'character'
    | 'characterInput'
    | 'war'
    | 'warInput'
    | 'monument'
    | 'monumentInput'
    // Logic/Utility Nodes
    | 'progress'
    | 'segment'
    | 'eraGoal'
    | 'transform'
    | 'aggregate'
    | 'filter'
    | 'conditional'
    | 'logic'   // Generic logic node
    | 'style'   // Style configuration
    | 'table'   // Table output
    | 'dataInput' // Manual data input
    // Interactive Nodes
    | 'diceRoll'
    | 'form'
    | 'choice'
    // Workflow Nodes
    | 'step'
    | 'eraGate';

export type NodeCategory =
    | 'element'
    | 'input'
    | 'progress'
    | 'logic'
    | 'output'
    | 'interactive'
    | 'workflow';

// --- Port System ---

export type PortDataType =
    | 'elementData'    // ElementCard object
    | 'progressData'   // Progress tracking data
    | 'number'
    | 'string'
    | 'boolean'
    | 'array'
    | 'object'
    | 'tableRow';      // Row data for tables

export interface PortDefinition {
    id: PortId;
    label: string;
    dataType: PortDataType;
    required: boolean;
}

// --- Node Data Structures ---

export interface NodeConfig {
    category: NodeCategory;
    label: string;
    icon: string;       // Lucide icon name
    description?: string;

    // Style override
    color?: string;
    width?: number;
    height?: number;
}

export interface NodeDefinition {
    id: NodeId;
    type: NodeType;
    position: { x: number; y: number };

    data: NodeData;
    inputs: PortDefinition[];
    outputs: PortDefinition[];

    config: NodeConfig;

    // Visual state (not persisted in schema usually, but tracked in runtime)
    selected?: boolean;
    expanded?: boolean;
}

// --- Node Data Unions ---

// 1. Element Node Data
export interface ElementNodeData {
    elementId?: string; // If linked to existing element
    element?: Partial<ElementCard>; // Editing state
}

// Specific subtypes can extend this if needed
export type ResourceNodeData = ElementNodeData;
export type DeityNodeData = ElementNodeData;
export type LocationNodeData = ElementNodeData;
export type FactionNodeData = ElementNodeData;
export type SettlementNodeData = ElementNodeData;
export type EventNodeData = ElementNodeData;
export type CharacterNodeData = ElementNodeData;
export type WarNodeData = ElementNodeData;
export type MonumentNodeData = ElementNodeData;

// 2. Element Input Node Data
export interface ElementInputNodeData {
    sourceType: 'manual' | 'query';
    query?: string; // Query string for filtering existing elements
    manualData?: Partial<ElementCard>[];
}

// 3. Progress Node Data
export interface ProgressNodeData {
    label: string;
    value: number | 'auto';
    max: number | 'auto';
    color?: string;
    style: ProgressStyle;
    showPercentage: boolean;
    showLabel: boolean;
    segments?: ProgressSegment[];
}

export interface SegmentNodeData {
    label: string;
    value: number;
    color: string;
}

export interface ProgressSegment {
    id: string;
    label: string;
    value: number;
    color: string;
    pattern?: 'solid' | 'striped' | 'gradient';
}

export interface ProgressStyle {
    height: number;
    borderRadius: number;
    backgroundColor: string;
    fillColor: string;
    textColor: string;
    fontSize: number;
    fontWeight: 'normal' | 'bold' | 'lighter';
}


// 4. Logic/Utility Node Data
export interface LogicNodeData {
    operation: 'AND' | 'OR' | 'NOT' | 'XOR' | 'IF';
    value?: any;
}

export interface TransformNodeData {
    transformationType: 'map' | 'pick' | 'omit';
    fields?: string[];
}

export interface FilterNodeData {
    field: string;
    operator: 'equals' | 'contains' | 'gt' | 'lt';
    value: any;
}

export interface TableNodeData {
    label?: string;
    columns?: string[];
    headers: { id: string; label: string; width?: number | 'auto'; align?: 'left' | 'center' | 'right'; sortable?: boolean }[];
    rowHeight?: number;
    rowsPerPage?: number;
    showBorders?: boolean;
    stripeRows?: boolean;
}

export interface DataInputNodeData {
    dataType: PortDataType;
    value: any;
}

export interface StyleNodeData {
    height?: number;
    radius?: number;
    borderRadius?: number;
    backgroundColor?: string;
    fillColor?: string;
    textColor?: string;
    fontSize?: number;
    fontWeight?: string;
    cssClasses?: string;
    styleObject?: Record<string, string | number>;
}

// 5. Interactive Node Data
export interface DiceRollNodeData {
    diceNotation: string; // e.g. "1d6", "2d6"
    buttonText?: string;
    resultTable?: Record<number, string>; // Map roll total to result text
}

export interface FormNodeData {
    schema?: any; // JSON schema or similar definition
    title?: string;
    description?: string;
    submitLabel?: string;
    fields: {
        id: string;
        label: string;
        type: 'text' | 'number' | 'select' | 'boolean' | 'textarea';
        options?: { label: string; value: any }[];
        required?: boolean;
        defaultValue?: any;
    }[];
}

export interface ChoiceNodeData {
    message: string;
    options: {
        id: string;
        label: string;
        value: any;
        variant?: 'primary' | 'secondary' | 'danger';
    }[];
}

// 6. Workflow Node Data
export interface StepNodeData {
    stepId: string;
    label: string;
    description?: string;
    skippable?: boolean;
}

export interface EraGateNodeData {
    targetEra: number; // The era we are trying to reach (e.g. 3 for Era III)
    label: string;
    criteriaDescription?: string;
}

// Union of all node data
export type NodeData =
    | ElementNodeData
    | ElementInputNodeData
    | ProgressNodeData
    | SegmentNodeData
    | LogicNodeData
    | TransformNodeData
    | FilterNodeData
    | TableNodeData
    | DataInputNodeData
    | StyleNodeData
    | DiceRollNodeData
    | FormNodeData
    | ChoiceNodeData
    | StepNodeData
    | EraGateNodeData
    | Record<string, any>; // Fallback

// --- Connections ---

export interface ConnectionDefinition {
    id: ConnectionId;
    sourceNodeId: NodeId;
    sourcePortId: PortId;
    targetNodeId: NodeId;
    targetPortId: PortId;

    // Visual state
    selected?: boolean;
    animated?: boolean;
}

// --- Schema (Export/Import) ---

export interface GlobalSettings {
    theme: 'light' | 'dark';
    snapToGrid: boolean;
    gridSize: number;
}

export interface SchemaMetadata {
    name: string;
    description: string;
    createdAt: string;
    modifiedAt: string;
    author?: string;
}

export interface NodeEditorSchema {
    version: string;
    metadata: SchemaMetadata;
    nodes: NodeDefinition[];
    connections: ConnectionDefinition[];
    globalSettings: GlobalSettings;
}

export interface GraphError {
    type: 'node' | 'connection' | 'graph' | 'error' | 'warning';
    id?: string;
    message: string;
}

// --- Era Storage ---

export interface SavedEraGraph {
    id: string;
    eraId: number;
    name: string;
    schema: NodeEditorSchema;
    timestamp: string;
    version: string;
}

export const ERA_NAMES: Record<number, string> = {
    1: 'Era of Myth',
    2: 'Era of Foundation',
    3: 'Era of Discovery',
    4: 'Era of Creation',
    5: 'Era of Empires',
    6: 'Era of Collapse',
    7: 'Era Home',
};

// --- Execution / Runtime ---

export type ExecutionStatus = 'completed' | 'suspended' | 'failed';

export interface SuspensionData {
    nodeId: NodeId;
    reason: 'input_required' | 'timer' | 'era_gate';
    requiredInput?: any; // Schema or description of what's needed
}

export interface NodeExecutionResult {
    status: ExecutionStatus;
    output: any;
    suspension?: SuspensionData;
    error?: string;
}
