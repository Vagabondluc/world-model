# Node-Based Visual Editor Specification

## Overview

This specification defines a comprehensive node-based visual editor system for creating complex, nested progress bars within dynamic data tables. The editor enables users to visually configure data transformations, progress calculations, and table layouts through a drag-and-drop node graph interface.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [JSON Interpreter Schema](#json-interpreter-schema)
3. [Node System](#node-system)
4. [Drag-and-Drop System](#drag-and-drop-system)
5. [Real-Time Preview Pane](#real-time-preview-pane)
6. [Error Handling System](#error-handling-system)
7. [Export Functionality](#export-functionality)
8. [Component File Structure](#component-file-structure)
9. [Integration Points](#integration-points)
10. [Implementation Phases](#implementation-phases)

---

## Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     NodeEditorApp                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  NodeCanvas  │  │ PreviewPane   │  │   Toolbar    │ │
│  │              │  │              │  │              │ │
│  │  ┌────────┐  │  │  ┌────────┐  │  │  ┌────────┐  │ │
│  │  │ Nodes  │  │  │  Table  │  │  │ │ Export │  │ │
│  │  │        │  │  │  Preview│  │  │ │ Import │  │ │
│  │  └────────┘  │  │  └────────┘  │  │  └────────┘  │ │
│  │  ┌────────┐  │  │  ┌────────┐  │  │  ┌────────┐  │ │
│  │  │ Connect│  │  │ Progress│  │  │ │ Clear  │  │ │
│  │  │ ions   │  │  │  Bars  │  │  │ │ Reset  │  │ │
│  │  └────────┘  │  │  └────────┘  │  │  └────────┘  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐                                          │
│  │ NodePalette  │                                          │
│  └──────────────┘                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Core Technologies

- **React 19.2** - Component framework
- **Zustand** - State management (following existing [`gameStore.ts`](../src/stores/gameStore.ts:1) pattern)
- **TypeScript** - Type safety
- **SVG** - Connection rendering

---

## JSON Interpreter Schema

### Root Schema

```typescript
interface NodeEditorSchema {
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
}
```

### Global Settings

```typescript
interface GlobalSettings {
    theme: 'light' | 'dark';
    defaultProgressStyle: ProgressStyle;
    tableConfig: TableConfig;
}

interface TableConfig {
    headers: TableColumn[];
    rowHeight: number;
    showBorders: boolean;
    stripeRows: boolean;
}

interface TableColumn {
    id: string;
    label: string;
    width: number | 'auto';
    align: 'left' | 'center' | 'right';
    sortable: boolean;
}
```

### Node Definition

```typescript
interface NodeDefinition {
    id: string;
    type: NodeType;
    position: { x: number; y: number };
    data: NodeData;
    inputs: PortDefinition[];
    outputs: PortDefinition[];
    config: NodeConfig;
}

type NodeType =
    | 'dataInput'
    | 'progress'
    | 'segment'
    | 'style'
    | 'logic'
    | 'table'
    | 'transform'
    | 'aggregate'
    | 'filter'
    | 'chart'           // Chart output (future)
    | 'export';         // Export node (future)

interface PortDefinition {
    id: string;
    label: string;
    dataType: PortDataType;
    required: boolean;
}

type PortDataType = 
    | 'array'
    | 'object'
    | 'number'
    | 'string'
    | 'boolean'
    | 'progressData'
    | 'tableRow';
```

### Progress Node Data

```typescript
interface ProgressNodeData {
    label: string;
    value: number | 'auto';
    max: number | 'auto';
    segments?: ProgressSegment[];
    style: ProgressStyle;
    showPercentage: boolean;
    showLabel: boolean;
    animation?: ProgressAnimation;
}

interface ProgressSegment {
    id: string;
    label: string;
    value: number;
    color: string;
    pattern?: 'solid' | 'striped' | 'gradient';
}

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
```

### Node Data Union Type

```typescript
type NodeData =
    | DataInputNodeData
    | ProgressNodeData
    | SegmentNodeData
    | StyleNodeData
    | LogicNodeData
    | TableNodeData
    | TransformNodeData
    | AggregateNodeData
    | FilterNodeData;
```

### Connection Definition

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

### Error Type Definitions

```typescript
interface ValidationError {
    nodeId: string;
    portId?: string;
    errorType: 'missingInput' | 'invalidDataType' | 'circularDependency' | 'invalidConfig';
    message: string;
    severity: 'error' | 'warning';
}

interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
}
```

---

## Node System

### Node Type Hierarchy

```
BaseNode (abstract)
├── DataInputNode
├── ProgressNode
├── SegmentNode
├── StyleNode
├── LogicNode
└── TableNode
```

### Node Registry

Each node type is registered with configuration:

```typescript
type NodeCategory = 'dataInput' | 'progress' | 'logic' | 'output';

interface NodeConfig {
    type: NodeType;
    category: NodeCategory;
    label: string;
    icon: string;
    color: string;
    inputs: PortDefinition[];
    outputs: PortDefinition[];
    defaultData: NodeData;
}
```

### Node Component Interface

```typescript
interface BaseNodeProps {
    node: NodeDefinition;
    isSelected: boolean;
    onSelect: (nodeId: string) => void;
    onUpdate: (node: NodeDefinition) => void;
    onDelete: (nodeId: string) => void;
    onConnectStart: (portId: string) => void;
    onConnectEnd: (portId: string) => void;
}
```

---

## Drag-and-Drop System

### Drag State Management

```typescript
interface DragState {
    isDragging: boolean;
    draggedNode: string | null;
    dragOffset: { x: number; y: number };
    draggedPort: { nodeId: string; portId: string } | null;
}
```

### Drag Manager Interface

```typescript
interface UseDragManagerReturn {
    dragState: DragState;
    startNodeDrag: (nodeId: string, event: MouseEvent) => void;
    handleNodeDrag: (event: MouseEvent) => void;
    endNodeDrag: () => void;
    startPortDrag: (nodeId: string, portId: string) => void;
    handlePortDrag: (event: MouseEvent) => void;
    endPortDrag: () => void;
}
```

### Connection Manager

Handles rendering and interaction of node connections:

```typescript
interface ConnectionManagerProps {
    connections: ConnectionDefinition[];
    nodes: NodeDefinition[];
    onUpdateConnection: (connection: ConnectionDefinition) => void;
    onDeleteConnection: (connectionId: string) => void;
    onConnectionCreate: (source: PortRef, target: PortRef) => void;
}

interface PortRef {
    nodeId: string;
    portId: string;
}
```

---

## Real-Time Preview Pane

### Execution Engine

```typescript
interface ExecutionEngine {
    executeNode(nodeId: string): Promise<NodeResult>;
    executeGraph(): Promise<GraphResult>;
    invalidateCache(nodeId: string): void;
    getExecutionOrder(): string[];
}

interface NodeResult {
    nodeId: string;
    data: any;
    error?: Error;
}

interface GraphResult {
    table?: TableResult;
    progressBars?: ProgressResult[];
    errors: NodeError[];
}
```

### Preview Component

```typescript
interface PreviewPaneProps {
    graphResult: GraphResult | null;
    isLoading: boolean;
    error: Error | null;
}
```

### Debouncing

Preview updates are debounced (300ms) to prevent excessive re-renders during drag operations.

---

## Error Handling System

### Error Types

```typescript
interface NodeError {
    nodeId: string;
    errorType: ErrorType;
    message: string;
    severity: 'error' | 'warning' | 'info';
    timestamp: string;
    context?: Record<string, any>;
}

type ErrorType =
    | 'validation'
    | 'connection'
    | 'execution'
    | 'data'
    | 'circular'
    | 'missingInput';
```

### Validation Interface

```typescript
interface ValidationResult {
    isValid: boolean;
    errors: NodeError[];
    warnings: NodeError[];
}

interface NodeValidator {
    validateNode(node: NodeDefinition): ValidationResult;
    validateConnection(connection: ConnectionDefinition, graph: NodeGraph): ValidationResult;
    validateGraph(graph: NodeGraph): ValidationResult;
}
```

---

## Export Functionality

### Export Service

```typescript
interface NodeExportService {
    exportNodeSchema(schema: NodeEditorSchema): string;
    importNodeSchema(jsonString: string): NodeEditorSchema;
    exportNodeSchemaToFile(schema: NodeEditorSchema, filename?: string): void;
}
```

### Schema Validation

```typescript
interface SchemaValidator {
    validateNodeSchema(schema: any): void;
}
```

---

## Component File Structure

```
src/
├── components/
│   └── node-editor/
│       ├── NodeEditorApp.tsx
│       ├── NodeCanvas.tsx
│       ├── NodePalette.tsx
│       ├── Toolbar.tsx
│       ├── preview/
│       │   ├── PreviewPane.tsx
│       │   ├── TablePreview.tsx
│       │   ├── ProgressBarsPreview.tsx
│       │   └── PreviewStates.tsx
│       ├── nodes/
│       │   ├── BaseNode.tsx
│       │   ├── DataInputNode.tsx
│       │   ├── ProgressNode.tsx
│       │   ├── SegmentNode.tsx
│       │   ├── StyleNode.tsx
│       │   ├── LogicNode.tsx
│       │   ├── TableNode.tsx
│       │   └── NodeRegistry.ts
│       ├── connections/
│       │   ├── ConnectionManager.tsx
│       │   ├── ConnectionLine.tsx
│       │   └── Port.tsx
│       ├── error/
│       │   ├── ErrorOverlay.tsx
│       │   ├── ErrorCard.tsx
│       │   └── ErrorTooltip.tsx
│       ├── engine/
│       │   ├── ExecutionEngine.ts
│       │   ├── NodeExecutor.ts
│       │   └── ResultCache.ts
│       ├── validator/
│       │   ├── NodeValidator.ts
│       │   ├── ConnectionValidator.ts
│       │   └── GraphValidator.ts
│       └── hooks/
│           ├── useDragManager.ts
│           ├── useNodeExecution.ts
│           ├── useValidation.ts
│           └── useDebounce.ts
├── stores/
│   └── nodeEditorStore.ts
├── types/
│   └── nodeEditor.types.ts
├── services/
│   └── nodeExportService.ts
└── utils/
    ├── nodeUtils.ts
    └── connectionUtils.ts
```

---

## Integration Points

### Reusing Existing Patterns

| Existing Component | Integration Point |
|-------------------|-------------------|
| [`progressUtils.ts`](../src/utils/progressUtils.ts:1) | Extend for node-based progress calculations |
| [`progress.types.ts`](../src/types/progress.types.ts:1) | Reuse `EraProgressDetail`, `PlayerProgress` types |
| [`tokens.ts`](../src/design/tokens.ts:1) | Extend with node editor styles |
| [`gameStore.ts`](../src/stores/gameStore.ts:1) | Follow Zustand store pattern |
| [`RuleTable.tsx`](../src/components/era-interfaces/common/RuleTable.tsx:8) | Extend for table rendering |
| [`CompletionTracker`](../src/components/layout/CompletionTracker.tsx:1) | Reuse progress bar rendering pattern |
| [`exportService.ts`](../src/services/exportService.ts:1) | Extend for node schema export |

### Style Extensions

```typescript
// Extend existing componentStyles
export const componentStyles = {
    // ... existing styles ...
    
    nodeEditor: {
        canvas: 'relative w-full h-full bg-gray-100 overflow-hidden',
        node: 'absolute bg-white rounded-lg shadow-lg border-2 cursor-move',
        nodeSelected: 'border-amber-500 ring-2 ring-amber-300',
        port: 'w-4 h-4 rounded-full border-2 hover:scale-125 transition-transform',
        portInput: 'bg-blue-500 border-blue-700',
        portOutput: 'bg-green-500 border-green-700',
        connection: 'fill-none stroke-2 pointer-events-none',
    },
    
    preview: {
        pane: 'bg-white rounded-lg shadow-md p-4 overflow-auto',
        table: 'w-full border-collapse',
        progressRow: 'flex items-center gap-4 py-2',
    },
    
    error: {
        overlay: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50',
        card: 'bg-white rounded-lg shadow-xl p-4 max-w-md',
        error: 'text-red-600 font-semibold',
        warning: 'text-amber-600 font-semibold',
    }
};
```

---

## Implementation Phases

### Phase 1: Core Foundation
- [ ] Type definitions ([`nodeEditor.types.ts`](../src/types/nodeEditor.types.ts:1))
- [ ] Store setup ([`nodeEditorStore.ts`](../src/stores/nodeEditorStore.ts:1))
- [ ] Base node component ([`BaseNode.tsx`](../src/components/node-editor/nodes/BaseNode.tsx:1))
- [ ] Node registry ([`NodeRegistry.ts`](../src/components/node-editor/nodes/NodeRegistry.ts:1))

### Phase 2: Canvas & Drag-Drop
- [ ] Node canvas component ([`NodeCanvas.tsx`](../src/components/node-editor/NodeCanvas.tsx:1))
- [ ] Drag manager hook ([`useDragManager.ts`](../src/components/node-editor/hooks/useDragManager.ts:1))
- [ ] Connection manager ([`ConnectionManager.tsx`](../src/components/node-editor/connections/ConnectionManager.tsx:1))
- [ ] Port component ([`Port.tsx`](../src/components/node-editor/connections/Port.tsx:1))

### Phase 3: Node Implementations
- [ ] Data input node ([`DataInputNode.tsx`](../src/components/node-editor/nodes/DataInputNode.tsx:1))
- [ ] Progress node ([`ProgressNode.tsx`](../src/components/node-editor/nodes/ProgressNode.tsx:1))
- [ ] Segment node ([`SegmentNode.tsx`](../src/components/node-editor/nodes/SegmentNode.tsx:1))
- [ ] Style node ([`StyleNode.tsx`](../src/components/node-editor/nodes/StyleNode.tsx:1))
- [ ] Logic node ([`LogicNode.tsx`](../src/components/node-editor/nodes/LogicNode.tsx:1))
- [ ] Table node ([`TableNode.tsx`](../src/components/node-editor/nodes/TableNode.tsx:1))

### Phase 4: Execution Engine
- [ ] Execution engine ([`ExecutionEngine.ts`](../src/components/node-editor/engine/ExecutionEngine.ts:1))
- [ ] Node executor ([`NodeExecutor.ts`](../src/components/node-editor/engine/NodeExecutor.ts:1))
- [ ] Result cache ([`ResultCache.ts`](../src/components/node-editor/engine/ResultCache.ts:1))

### Phase 5: Preview System
- [ ] Preview pane ([`PreviewPane.tsx`](../src/components/node-editor/preview/PreviewPane.tsx:1))
- [ ] Table preview ([`TablePreview.tsx`](../src/components/node-editor/preview/TablePreview.tsx:1))
- [ ] Progress bars preview ([`ProgressBarsPreview.tsx`](../src/components/node-editor/preview/ProgressBarsPreview.tsx:1))
- [ ] Preview states ([`PreviewStates.tsx`](../src/components/node-editor/preview/PreviewStates.tsx:1))

### Phase 6: Validation & Error Handling
- [ ] Node validator ([`NodeValidator.ts`](../src/components/node-editor/validator/NodeValidator.ts:1))
- [ ] Connection validator ([`ConnectionValidator.ts`](../src/components/node-editor/validator/ConnectionValidator.ts:1))
- [ ] Graph validator ([`GraphValidator.ts`](../src/components/node-editor/validator/GraphValidator.ts:1))
- [ ] Error overlay ([`ErrorOverlay.tsx`](../src/components/node-editor/error/ErrorOverlay.tsx:1))

### Phase 7: Export/Import
- [ ] Export service ([`nodeExportService.ts`](../src/services/nodeExportService.ts:1))
- [ ] Schema validator ([`nodeSchemaValidator.ts`](../src/services/nodeSchemaValidator.ts:1))
- [ ] Toolbar with export/import buttons ([`Toolbar.tsx`](../src/components/node-editor/Toolbar.tsx:1))

### Phase 8: Integration
- [ ] Main app component ([`NodeEditorApp.tsx`](../src/components/node-editor/NodeEditorApp.tsx:1))
- [ ] Node palette ([`NodePalette.tsx`](../src/components/node-editor/NodePalette.tsx:1))
- [ ] Integration with existing progress utilities
- [ ] Integration with existing component styles

---

## Related TDD Specifications

- [Node System TDD](./node_system_tdd_spec.md)
- [Drag-and-Drop System TDD](./drag_drop_tdd_spec.md)
- [Execution Engine TDD](./execution_engine_tdd_spec.md)
- [Preview System TDD](./preview_system_tdd_spec.md)
- [Validation System TDD](./validation_system_tdd_spec.md)
- [Export/Import System TDD](./export_import_tdd_spec.md)

## UI-Node Taxonomy

The comprehensive UI-Node Taxonomy defines the visual language and component structure for the node-based visual editor. It serves as the definitive bridge between user intent and system data, establishing a unified language across all components.

**Reference**: [UI-Node Taxonomy](./ui_node_taxonomy.md)

### Key Taxonomy Elements

1. **Visual Component Taxonomy** - Defines how all UI elements are rendered
   - Node bodies with color coding and iconography
   - Port geometries and connection states
   - Interactive handles and selection states

2. **Data Schema Mapping** - Links visual representations to data structures
   - Port data types mapped to colors
   - Node type definitions with execution logic
   - Custom node type registration via JSON schema

3. **Behavioral Expectations** - Defines interaction behaviors
   - Drag and drop operations
   - Selection and editing workflows
   - Error visualization patterns

4. **Dynamic Node Creation** - Supports extending the editor with custom node types
   - JSON schema for defining new node types
   - Registration process for custom nodes
   - Visual and functional property mapping

### Integration Points

All TDD specifications reference the UI-Node Taxonomy for:
- Visual component rendering expectations
- Port interaction behaviors
- Node selection and drag states
- Error visualization requirements
- Custom node type definitions

The taxonomy is mandatory for all component implementations and must be referenced when creating or modifying UI elements.
