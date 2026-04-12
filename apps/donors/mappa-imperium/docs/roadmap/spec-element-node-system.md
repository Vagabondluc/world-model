# Element Node System Specification

## Overview

This specification defines a node-based system for the Mappa Imperium game editor mode. The system establishes a parallel structure to the current Element-based implementation, enabling visual configuration of game entities through a drag-and-drop node graph interface. This specification strictly aligns with the [UI-Node Taxonomy](./ui_node_taxonomy.md) to ensure consistency in data definitions, terminology, and visual component mappings.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Node Type Taxonomy](#node-type-taxonomy)
3. [Data Schema Mapping](#data-schema-mapping)
4. [Visual Component Taxonomy](#visual-component-taxonomy)
5. [Node System Components](#node-system-components)
6. [Integration Points](#integration-points)
7. [Implementation Phases](#implementation-phases)

---

## Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     ElementNodeEditorApp                         │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  NodeCanvas  │  │  PreviewPane   │  │   Toolbar     │ │
│  │              │  │               │  │              │ │
│  │  ┌────────┐  │  ┌────────┐  │  │  ┌────────┐  │ │
│  │  │ Nodes  │  │  │ Table  │  │  │ │ Export │  │ │
│  │  │        │  │  │ Preview│  │  │ │ Import │  │ │
│  │  └────────┘  │  └────────┘  │  │  └────────┘  │ │
│  │  ┌────────┐  │  ┌────────┐  │  │  ┌────────┐  │ │
│  │  │Connect│  │  │ Element│  │  │ │ Clear  │  │ │
│  │  │ ions  │  │  │ Details│  │  │ │ Reset  │  │ │
│  │  └────────┘  │  └────────┘  │  │  └────────┘  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐                                          │
│  │ NodePalette  │                                          │
│  └──────────────┘                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Core Technologies

- **React 19.2** - Component framework (aligned with existing [`index.html`](../index.html:1))
- **Zustand** - State management (following existing [`gameStore.ts`](../src/stores/gameStore.ts:1) pattern)
- **TypeScript** - Type safety
- **SVG** - Connection rendering

---

## Node Type Taxonomy

### Element Node Types

The node system maps existing ElementCard types to visual node representations:

```typescript
type ElementNodeType = 
    // Resource Nodes
    | 'resource'      // Resource element
    | 'resourceInput'  // External resource source
    
    // Deity Nodes
    | 'deity'         // Deity element
    | 'deityInput'   // External deity source
    
    // Location Nodes
    | 'location'       // Location element
    | 'locationInput' // External location source
    
    // Faction Nodes
    | 'faction'        // Faction element
    | 'factionInput'  // External faction source
    
    // Settlement Nodes
    | 'settlement'     // Settlement element
    | 'settlementInput' // External settlement source
    
    // Event Nodes
    | 'event'          // Event element
    | 'eventInput'    // External event source
    
    // Character Nodes
    | 'character'       // Character element
    | 'characterInput' // External character source
    
    // War Nodes
    | 'war'            // War element
    | 'warInput'       // External war source
    
    // Monument Nodes
    | 'monument'        // Monument element
    | 'monumentInput'  // External monument source
    
    // Progress Nodes
    | 'progress'        // Progress tracking node
    | 'eraGoal'        // Era goal definition node
    
    // Logic Nodes
    | 'transform'       // Data transformation
    | 'aggregate'       // Data aggregation
    | 'filter'          // Data filtering
    | 'conditional'     // Conditional logic
```

### Node Categories

```typescript
type NodeCategory = 
    | 'element'        // Game element nodes (resource, deity, location, etc.)
    | 'input'          // Input source nodes
    | 'progress'       // Progress tracking nodes
    | 'logic'          // Logic/processing nodes
    | 'output'         // Output display nodes;
```

---

## Data Schema Mapping

### Node Definition Schema

```typescript
interface NodeDefinition {
    // Visual Properties
    id: string;                    // Unique identifier
    type: ElementNodeType;            // Node type from taxonomy
    category: NodeCategory;            // Node category for grouping
    position: { x: number; y: number };  // Canvas position
    
    // Data Properties
    data: NodeData;                // Node-specific configuration
    inputs: PortDefinition[];       // Input ports
    outputs: PortDefinition[];      // Output ports
    config: NodeConfig;             // Registry configuration
}
```

### Port Definition Schema

```typescript
interface PortDefinition {
    // Visual Properties
    id: string;              // Port identifier
    label: string;           // Display label
    dataType: PortDataType;  // Type of data (visualized via color)
    required: boolean;       // Whether connection is required
    
    // Visual Mapping
    // dataType maps to visual color:
    // 'elementData' → Blue (#3B82F6)
    // 'progressData' → Green (#10B981)
    // 'number' → Amber (#F59E0B)
    // 'string' → Purple (#8B5CF6)
    // 'boolean' → Red (#EF4444)
    // 'array' → Indigo (#6366F1)
    // 'object' → Pink (#EC4899)
}

type PortDataType = 
    | 'elementData'    // Element card data
    | 'progressData'   // Progress tracking data
    | 'number'          // Numeric values
    | 'string'          // Text values
    | 'boolean'         // Boolean values
    | 'array'           // Array of values
    | 'object'          // Object data;
```

### Node Data Union Type

```typescript
type NodeData = 
    | ResourceNodeData
    | DeityNodeData
    | LocationNodeData
    | FactionNodeData
    | SettlementNodeData
    | EventNodeData
    | CharacterNodeData
    | WarNodeData
    | MonumentNodeData
    | ResourceInputNodeData
    | DeityInputNodeData
    | LocationInputNodeData
    | FactionInputNodeData
    | SettlementInputNodeData
    | EventInputNodeData
    | CharacterInputNodeData
    | WarInputNodeData
    | MonumentInputNodeData
    | ProgressNodeData
    | EraGoalNodeData
    | TransformNodeData
    | AggregateNodeData
    | FilterNodeData
    | ConditionalNodeData;
```

### Element Node Data Types

```typescript
// Resource Node Data
interface ResourceNodeData {
    element: Omit<ElementCard, 'id'>;
    isEditable: boolean;
}

// Deity Node Data
interface DeityNodeData {
    element: Omit<ElementCard, 'id'>;
    isEditable: boolean;
}

// Location Node Data
interface LocationNodeData {
    element: Omit<ElementCard, 'id'>;
    isEditable: boolean;
}

// Faction Node Data
interface FactionNodeData {
    element: Omit<ElementCard, 'id'>;
    isEditable: boolean;
}

// Settlement Node Data
interface SettlementNodeData {
    element: Omit<ElementCard, 'id'>;
    isEditable: boolean;
}

// Event Node Data
interface EventNodeData {
    element: Omit<ElementCard, 'id'>;
    isEditable: boolean;
}

// Character Node Data
interface CharacterNodeData {
    element: Omit<ElementCard, 'id'>;
    isEditable: boolean;
}

// War Node Data
interface WarNodeData {
    element: Omit<ElementCard, 'id'>;
    isEditable: boolean;
}

// Monument Node Data
interface MonumentNodeData {
    element: Omit<ElementCard, 'id'>;
    isEditable: boolean;
}

// Input Node Data
interface ResourceInputNodeData {
    sourceType: 'manual' | 'existingElements';
    jsonData?: string;
    elementFilter?: ElementCard['type'];
}

interface DeityInputNodeData {
    sourceType: 'manual' | 'existingElements';
    jsonData?: string;
}

interface LocationInputNodeData {
    sourceType: 'manual' | 'existingElements';
    jsonData?: string;
}

interface FactionInputNodeData {
    sourceType: 'manual' | 'existingElements';
    jsonData?: string;
}

interface SettlementInputNodeData {
    sourceType: 'manual' | 'existingElements';
    jsonData?: string;
}

interface EventInputNodeData {
    sourceType: 'manual' | 'existingElements';
    jsonData?: string;
}

interface CharacterInputNodeData {
    sourceType: 'manual' | 'existingElements';
    jsonData?: string;
}

interface WarInputNodeData {
    sourceType: 'manual' | 'existingElements';
    jsonData?: string;
}

interface MonumentInputNodeData {
    sourceType: 'manual' | 'existingElements';
    jsonData?: string;
}

// Progress Node Data
interface ProgressNodeData {
    label: string;
    value: number | 'auto';
    max: number | 'auto';
    showPercentage: boolean;
    showLabel: boolean;
    style: ProgressStyle;
    animation?: ProgressAnimation;
}

interface EraGoalNodeData {
    eraId: number;
    eraName: string;
    getTaskCount: (player: Player, elements: ElementCard[]) => EraGoalTaskCount;
}

// Logic Node Data
interface TransformNodeData {
    transformFunction: string;
    inputMapping: Record<string, string>;
}

interface AggregateNodeData {
    aggregationFunction: 'sum' | 'average' | 'count' | 'max' | 'min';
    inputMapping: Record<string, string>;
}

interface FilterNodeData {
    filterFunction: string;
    filterCriteria: Record<string, any>;
}

interface ConditionalNodeData {
    condition: string;
    trueValue: any;
    falseValue: any;
}
```

### Progress Style Schema

```typescript
interface ProgressStyle {
    height: number;
    borderRadius: number;
    backgroundColor: string;
    fillColor: string;
    textColor: string;
    fontSize: number;
    fontWeight: 'normal' | 'bold' | 'lighter';
}

interface ProgressAnimation {
    type: 'none' | 'slide' | 'fade' | 'pulse';
    duration: number;
    easing: string;
}

interface EraGoalTaskCount {
    completed: number;
    total: number;
    normalizedCompleted?: number;
    normalizedTotal?: number;
}
```

### Connection Definition Schema

```typescript
interface ConnectionDefinition {
    id: string;
    sourceNodeId: string;
    sourcePortId: string;
    targetNodeId: string;
    targetPortId: string;
    style?: ConnectionStyle;
    state?: ConnectionState;
}

interface ConnectionStyle {
    color: string;
    width: number;
    type: 'straight' | 'bezier' | 'step';
    animated: boolean;
    dashPattern?: number[];
    dashSpeed?: number;
    glowEffect?: boolean;
}

type ConnectionState = 'default' | 'hover' | 'selected' | 'error' | 'creating';
```

### Schema Definition

```typescript
interface ElementNodeSchema {
    version: string;
    metadata: SchemaMetadata;
    nodes: NodeDefinition[];
    connections: ConnectionDefinition[];
    globalSettings: GlobalSettings;
}

interface SchemaMetadata {
    name: string;
    description: string;
    createdAt: string;
    modifiedAt: string;
    author?: string;
}

interface GlobalSettings {
    theme: 'light' | 'dark';
    defaultProgressStyle: ProgressStyle;
    elementCategories: ElementCategoryConfig[];
}
```

---

## Visual Component Taxonomy

### Node Body

**Purpose**: The main container representing a node in the canvas.

**Visual Properties**:
- **Color Coding**: Each node category has a distinct color from UI-Node Taxonomy
  - Element (resource, deity, location, faction, settlement, event, character, war, monument): `#3B82F6` (Blue)
  - Input (resourceInput, deityInput, etc.): `#10B981` (Green)
  - Progress (progress, eraGoal): `#F59E0B` (Amber)
  - Logic (transform, aggregate, filter, conditional): `#EF4444` (Red)
  - Output: `#6366F1` (Indigo)

- **Iconography**: Each node displays an emoji icon representing its function
  - Resource: 📦
  - Deity: 🙏
  - Location: 📍
  - Faction: 🏰
  - Settlement: 🏘
  - Event: 📜
  - Character: 👤
  - War: ⚔️
  - Monument: 🗿
  - Input: 📥
  - Progress: 📊
  - Transform: 🔄
  - Aggregate: ➕
  - Filter: 🔍
  - Conditional: ⚡

- **Border Styling**:
  - Default: 2px solid `--border-default`
  - Selected: 2px solid `--c-primary-600` with ring-4 ring-amber-300 ring-offset-2
  - Error: 2px solid `--c-red-600`

- **Shadow**: `shadow-lg` with elevation based on selection state

**Behavioral Expectations**:
- **Draggable**: Entire node body responds to mouse drag events
- **Selectable**: Click anywhere on node body to select
- **Positioning**: Absolute positioning based on `{ x, y }` coordinates
- **Z-Index**: Selected nodes have higher z-index (100) than unselected (50)

### Node Header

**Purpose**: Displays node type label and provides quick actions.

**Visual Properties**:
- **Label**: Node type name (e.g., "Resource", "Deity", "Progress Bar")
- **Font**: `font-semibold text-sm`
- **Color**: `--text-heading`

**Interactive Elements**:
- **Delete Button**: Trash icon (🗑️) in top-right corner
  - Visible only when node is selected
  - Hover state: `--c-red-700` background
  - Click triggers `onDelete(nodeId)` callback
- **Duplicate Button**: Copy icon (📋) in top-right corner
  - Visible only when node is selected
  - Hover state: `--c-primary-700` background
  - Click creates copy of node with new ID
- **Edit Button**: Edit icon (✏️) in top-right corner
  - Visible only when node is editable
  - Hover state: `--c-primary-700` background
  - Click opens element configuration modal

### Node Ports

**Purpose**: Connection points for data flow between nodes.

**Visual Properties**:

#### Input Ports (Left Side)
- **Shape**: Circle with 16px diameter
- **Color**: 
  - Default: `--c-blue-500` background, `--c-blue-700` border
  - Connected: `--c-green-500` background, `--c-green-700` border
  - Error: `--c-red-500` background, `--c-red-700` border
- **Position**: Left edge of node body, vertically centered relative to port's position in definition
- **Label**: Port name displayed above the port (e.g., "Element", "Progress", "Value")
- **Required Indicator**: Small asterisk (*) in red for required ports

#### Output Ports (Right Side)
- **Shape**: Circle with 16px diameter
- **Color**:
  - Default: `--c-green-500` background, `--c-green-700` border
  - Connected: `--c-blue-500` background, `--c-blue-700` border
  - Error: `--c-red-500` background, `--c-red-700` border
- **Position**: Right edge of node body, vertically centered
- **Label**: Port name displayed above the port (e.g., "Data", "Result")

**Port Geometries**:
- **Circle**: `w-4 h-4 rounded-full border-2`
- **Hover State**: `scale-125 transition-transform`
- **Active State**: `ring-2 ring-amber-400` when connection is being created

**Behavioral Expectations**:
- **Connection Start**: Mouse down on output port initiates connection creation
- **Connection End**: Mouse up on input port completes connection
- **Hover Tooltip**: Shows port data type and label
- **Validation Feedback**: Visual indication of connection validity during drag

### Node Content Area

**Purpose**: Displays node-specific configuration and data.

**Visual Properties**:
- **Background**: `--bg-card`
- **Padding**: `p-3`
- **Border**: Bottom border separating content from ports

**Content Types by Node Type**:

#### Resource Node Content
- **Element Display**: Shows element name, type, and properties
- **Edit Button**: Opens element configuration modal
- **Delete Button**: Removes element from game

#### Deity Node Content
- **Element Display**: Shows deity name, domain, symbol, emoji, description
- **Edit Button**: Opens deity configuration modal
- **Delete Button**: Removes deity from game

#### Location Node Content
- **Element Display**: Shows location name, site type, description, symbol
- **Edit Button**: Opens location configuration modal
- **Delete Button**: Removes location from game

#### Faction Node Content
- **Element Display**: Shows faction name, race, symbol, emoji, theme, description
- **Edit Button**: Opens faction configuration modal
- **Delete Button**: Removes faction from game

#### Settlement Node Content
- **Element Display**: Shows settlement name, purpose, description, notes
- **Edit Button**: Opens settlement configuration modal
- **Delete Button**: Removes settlement from game

#### Event Node Content
- **Element Display**: Shows event name, description
- **Edit Button**: Opens event configuration modal
- **Delete Button**: Removes event from game

#### Character Node Content
- **Element Display**: Shows character name, description
- **Edit Button**: Opens character configuration modal
- **Delete Button**: Removes character from game

#### War Node Content
- **Element Display**: Shows war name, description, attackers, defenders
- **Edit Button**: Opens war configuration modal
- **Delete Button**: Removes war from game

#### Monument Node Content
- **Element Display**: Shows monument name, description, location
- **Edit Button**: Opens monument configuration modal
- **Delete Button**: Removes monument from game

#### Input Node Content
- **Source Type Toggle**: Radio buttons for "Manual" vs "Existing Elements"
- **Element Filter**: Dropdown to filter by element type
- **JSON Editor**: Textarea for manual JSON entry
- **Preview**: Collapsible section showing parsed data structure
- **Element Count**: Badge showing number of items

#### Progress Node Content
- **Label Input**: Text input for progress bar label
- **Value Input**: Number input for current value
- **Max Input**: Number input for maximum value
- **Auto Toggle**: Checkbox to use "auto" value from connected input
- **Percentage Toggle**: Checkbox to show/hide percentage
- **Label Toggle**: Checkbox to show/hide label
- **Style Preview**: Mini preview of progress bar with current settings

#### Era Goal Node Content
- **Era Selector**: Dropdown to select era (1-6)
- **Task Definition**: Text area for task count logic
- **Preview**: Shows expected task count for each player

#### Transform Node Content
- **Transform Function**: Dropdown for transformation type (map, filter, reduce)
- **Input Mapping**: Table mapping input ports to output ports
- **Preview**: Shows transformation result

#### Aggregate Node Content
- **Aggregation Function**: Dropdown for aggregation type (sum, average, count, max, min)
- **Input Mapping**: Table mapping input ports to output ports
- **Preview**: Shows aggregation result

#### Filter Node Content
- **Filter Function**: Text input for filter expression
- **Filter Criteria**: Table of filter conditions
- **Preview**: Shows filtered result

#### Conditional Node Content
- **Condition Input**: Text input for boolean expression
- **True Value Input**: Any input for true branch
- **False Value Input**: Any input for false branch
- **Preview**: Shows conditional result

### Connection Lines

**Purpose**: Visual representation of data flow between nodes.

**Visual Properties**:
- **Type**: Bezier curves by default, with options for "straight" or "step"
- **Color**: `--c-neutral-500` by default, configurable per connection
- **Width**: 2px by default, configurable
- **Animation**: Optional flowing dash animation for active connections

**Connection States**:
- **Default**: Solid line with no animation
- **Hover**: Thicker line (3px) with highlight color
- **Selected**: Different color (`--c-primary-600`) with glow effect
- **Error**: Red dashed line indicating invalid connection
- **Creating**: Temporary line following cursor during drag

**Bezier Curve Parameters**:
- **Control Point 1**: 50% horizontal from source, same Y as source
- **Control Point 2**: 50% horizontal from target, same Y as target
- **Smoothness**: Cubic bezier for smooth curves

---

## Node System Components

### Component File Structure

```
src/components/element-editor/
├── nodes/
│   ├── BaseNode.tsx              # Base node component
│   ├── ElementNode.tsx           # Element display nodes
│   ├── InputNode.tsx             # Input source nodes
│   ├── ProgressNode.tsx           # Progress tracking nodes
│   └── LogicNode.tsx             # Logic/processing nodes
├── connections/
│   ├── Port.tsx                  # Port component
│   ├── ConnectionLine.tsx        # Connection rendering
│   └── ConnectionManager.tsx      # Connection management
├── canvas/
│   ├── NodeCanvas.tsx            # Main canvas component
│   └── NodePalette.tsx           # Node palette
├── preview/
│   ├── PreviewPane.tsx            # Preview panel
│   ├── ElementPreview.tsx          # Element details preview
│   └── ProgressPreview.tsx         # Progress bar preview
└── hooks/
    ├── useNodeGraph.ts            # Node graph state management
    ├── useDragManager.ts          # Drag and drop management
    └── useConnectionManager.ts    # Connection management
```

### Store Integration

```typescript
// src/stores/slices/elementEditorSlice.ts
interface ElementEditorSlice {
    // Graph State
    nodes: NodeDefinition[];
    connections: ConnectionDefinition[];
    selectedNodeId: string | null;
    selectedConnectionId: string | null;
    
    // Actions
    addNode: (node: NodeDefinition) => void;
    updateNode: (nodeId: string, updates: Partial<NodeDefinition>) => void;
    deleteNode: (nodeId: string) => void;
    addConnection: (connection: ConnectionDefinition) => void;
    deleteConnection: (connectionId: string) => void;
    selectNode: (nodeId: string | null) => void;
    selectConnection: (connectionId: string | null) => void;
    clearGraph: () => void;
    importSchema: (schema: ElementNodeSchema) => void;
    exportSchema: () => string;
}

// Integration with existing gameStore
interface GameStore {
    // Existing slices
    ...SessionSlice;
    ...GameplaySlice;
    ...UiSlice;
    ...DebugSlice;
    
    // New element editor slice
    ...ElementEditorSlice;
}
```

---

## Integration Points

### Integration with Existing Element System

The node system integrates with the existing Element-based system through:

1. **Element Creation**: Nodes can create new ElementCard instances
2. **Element Updates**: Nodes can update existing ElementCard data
3. **Element Deletion**: Nodes can delete ElementCard instances
4. **Progress Tracking**: Progress nodes calculate era completion based on ElementCard data
5. **Resource Calculation**: Aggregate nodes calculate resource totals from Resource elements

### Integration with Existing Styling System

The node system uses the existing [`componentStyles`](../src/design/tokens.ts:2) object:

```typescript
// Existing styles
const componentStyles = {
    button: {
        base: 'px-4 py-2 rounded-lg font-semibold...',
        primary: 'bg-amber-700 text-white...',
        // ...
    },
    progressBar: {
        track: 'w-full bg-gray-600 rounded-full h-4',
        fill: 'bg-green-500 h-full rounded-full transition-all duration-500',
    },
    // ...
};

// Node system extensions
const nodeStyles = {
    nodeBody: 'bg-white p-4 rounded-lg shadow-sm border flex flex-col',
    nodeSelected: 'ring-4 ring-amber-300 ring-offset-2 border-amber-600',
    nodeError: 'border-red-600',
    port: 'w-4 h-4 rounded-full border-2 cursor-pointer',
    portInput: 'bg-blue-500 border-blue-700',
    portOutput: 'bg-green-500 border-green-700',
    portError: 'bg-red-500 border-red-700',
    connection: 'stroke-neutral-500 stroke-2 fill-none',
    connectionSelected: 'stroke-primary-600 stroke-3',
    connectionError: 'stroke-red-500 stroke-2 stroke-dashed',
};
```

### Integration with Existing Progress System

The node system integrates with the existing progress tracking system:

```typescript
// src/utils/elementProgressUtils.ts
export const calculateElementProgress = (
    elements: ElementCard[],
    players: Player[],
    currentEraId: number,
    eraGoals: EraGoals
): ElementProgressResult => {
    // Calculate progress based on node graph configuration
    const progressNodes = nodes.filter(n => n.type === 'progress');
    
    // Execute progress nodes to get era completion
    const eraProgress = progressNodes.map(node => {
        const eraGoalNode = node.data as EraGoalNodeData;
        const eraId = eraGoalNode.eraId;
        const eraGoal = eraGoals[eraId];
        
        return {
            eraId,
            completed: eraGoal.getTaskCount(players, elements).completed,
            total: eraGoal.getTaskCount(players, elements).total,
            progress: eraGoal.getTaskCount(players, elements).total > 0 
                ? Math.min(1, eraGoal.getTaskCount(players, elements).completed / eraGoal.getTaskCount(players, elements).total)
                : 0
        };
    });
    
    return {
        eraProgress,
        totalGameProgress: calculateOverallProgress(eraProgress)
    };
};
```

---

## Implementation Phases

### Phase 1: Foundation

**Goal**: Establish core infrastructure for the node system

**Tasks**:
1. Create type definitions in `src/types/elementEditor.types.ts`
2. Create store slice in `src/stores/slices/elementEditorSlice.ts`
3. Integrate element editor slice into main `gameStore.ts`
4. Create base node component `BaseNode.tsx`
5. Create port component `Port.tsx`
6. Create connection line component `ConnectionLine.tsx`

**Deliverables**:
- Type definitions aligned with UI-Node Taxonomy
- State management infrastructure
- Basic node components
- Port and connection components

### Phase 2: Element Nodes

**Goal**: Implement element display nodes

**Tasks**:
1. Create `ElementNode.tsx` component for all element types
2. Implement element configuration modal
3. Create element preview component
4. Integrate with existing element creation/update logic

**Deliverables**:
- Element node components for all element types
- Element configuration modals
- Element preview functionality

### Phase 3: Input Nodes

**Goal**: Implement input source nodes

**Tasks**:
1. Create `InputNode.tsx` component
2. Implement JSON editor for manual input
3. Implement element filtering from existing elements
4. Create data preview functionality

**Deliverables**:
- Input node component
- JSON editor with validation
- Element filtering functionality
- Data preview

### Phase 4: Progress Nodes

**Goal**: Implement progress tracking nodes

**Tasks**:
1. Create `ProgressNode.tsx` component
2. Create `EraGoalNode.tsx` component
3. Integrate with existing progress utilities
4. Implement progress bar preview

**Deliverables**:
- Progress node component
- Era goal node component
- Progress bar preview
- Integration with progress utilities

### Phase 5: Logic Nodes

**Goal**: Implement logic/processing nodes

**Tasks**:
1. Create `LogicNode.tsx` component
2. Implement transform node logic
3. Implement aggregate node logic
4. Implement filter node logic
5. Implement conditional node logic

**Deliverables**:
- Transform node component
- Aggregate node component
- Filter node component
- Conditional node component

### Phase 6: Canvas and Palette

**Goal**: Implement main canvas and node palette

**Tasks**:
1. Create `NodeCanvas.tsx` component
2. Create `NodePalette.tsx` component
3. Implement drag and drop functionality
4. Implement node selection and manipulation
5. Implement connection creation and management

**Deliverables**:
- Node canvas component
- Node palette component
- Drag and drop functionality
- Connection management

### Phase 7: Preview System

**Goal**: Implement preview system

**Tasks**:
1. Create `PreviewPane.tsx` component
2. Create `ElementPreview.tsx` component
3. Create `ProgressPreview.tsx` component
4. Implement real-time preview updates
5. Implement error state display

**Deliverables**:
- Preview pane component
- Element preview component
- Progress preview component
- Real-time preview updates
- Error state display

### Phase 8: Export/Import

**Goal**: Implement schema export and import

**Tasks**:
1. Create schema export functionality
2. Create schema import functionality
3. Implement schema validation
4. Create export/import UI

**Deliverables**:
- Schema export functionality
- Schema import functionality
- Schema validation
- Export/import UI

---

## Error Handling

### Node-Level Errors

**Visual Indicators**:
- **Error Border**: Red border (2px solid `--c-red-600`)
- **Error Icon**: Warning icon (⚠️) in node header
- **Error Badge**: Red badge with error count in top-right corner
- **Tooltip**: Hover shows error message

**Error States**:
- **Validation Error**: Invalid configuration (e.g., negative value)
- **Connection Error**: Missing required input connection
- **Execution Error**: Runtime error during graph execution

### Port-Level Errors

**Visual Indicators**:
- **Error Color**: Red background for port
- **Error Border**: Red border
- **Pulse Animation**: Pulsing effect for unconnected required ports

### Connection-Level Errors

**Visual Indicators**:
- **Error Style**: Red dashed line
- **Error Icon**: X icon at connection midpoint
- **Error Message**: Tooltip showing error reason

---

## Accessibility Considerations

### Keyboard Navigation

- **Tab**: Navigate between nodes
- **Arrow Keys**: Move selected node
- **Delete/Backspace**: Delete selected node or connection
- **Escape**: Cancel current operation (drag, edit)
- **Enter**: Confirm action

### Screen Reader Support

- **ARIA Labels**: All interactive elements have descriptive labels
- **Roles**: Semantic roles for nodes (`role="button"`, `role="listitem"`)
- **States**: ARIA states for selection (`aria-selected`), error (`aria-invalid`)
- **Live Regions**: Announce dynamic changes (connection created, error occurred)

### Focus Management

- **Focus Ring**: Visible focus indicator (`focus:ring-2`)
- **Focus Order**: Logical tab order through node elements
- **Focus Traps**: None - all interactive elements reachable

---

## Theme Integration

### Color Tokens

All UI elements use CSS custom properties from the existing design system:

```css
:root {
    /* Node Colors */
    --node-element-bg: #3B82F6;
    --node-input-bg: #10B981;
    --node-progress-bg: #F59E0B;
    --node-logic-bg: #EF4444;
    --node-output-bg: #6366F1;
    
    /* Port Colors */
    --port-input-default: #3B82F6;
    --port-output-default: #10B981;
    --port-error: #EF4444;
    
    /* Status Colors */
    --status-valid: #10B981;
    --status-warning: #F59E0B;
    --status-error: #EF4444;
}
```

### Dark Mode Support

All colors automatically invert when `data-theme="dark"` is set on the `<html>` element.

---

## Related Specifications

This specification references:
- [UI-Node Taxonomy](./ui_node_taxonomy.md) - Visual component definitions
- [spec-node-editor.md](./spec-node-editor.md) - Main node editor specification
- [specifications_critique.md](./specifications_critique.md) - Issues and recommendations
- Existing element system in [`src/types/element.types.ts`](../src/types/element.types.ts:1)
- Existing progress system in [`src/types/progress.types.ts`](../src/types/progress.types.ts:1)
- Existing styling system in [`src/design/tokens.ts`](../src/design/tokens.ts:1)
