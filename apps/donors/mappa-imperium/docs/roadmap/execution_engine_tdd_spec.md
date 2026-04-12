# Execution Engine TDD Specification

## Overview

This Test-Driven Development specification defines test cases for the Execution Engine component of the node-based visual editor. The Execution Engine is responsible for executing node graphs, caching results, and providing data to the preview pane.

## UI-Node Taxonomy Reference

This specification references the [UI-Node Taxonomy](./ui_node_taxonomy.md) for comprehensive visual component definitions, including:

- **Visual Component Taxonomy** - Defines how all UI elements are rendered
- **Data Schema Mapping** - Links visual representations to data structures
- **Behavioral Expectations** - Interaction patterns and states
- **Dynamic Node Creation** - JSON schema for custom node types

All test cases in this specification must align with the visual behaviors and rendering expectations defined in the taxonomy.

## Table of Contents

1. [ExecutionEngine Class](#executionengine-class)
2. [NodeExecutor](#nodeexecutor)
3. [ResultCache](#resultcache)
4. [Execution Order Calculation](#execution-order-calculation)

---

## ExecutionEngine Class

### Test Suite: Engine Initialization

**File**: `src/components/node-editor/engine/ExecutionEngine.test.ts`

#### Test: ExecutionEngine initializes with empty graph
```typescript
test('ExecutionEngine initializes with empty graph', () => {
    const engine = new DefaultExecutionEngine([], []);
    
    expect(engine.getExecutionOrder()).toEqual([]);
});
```

#### Test: ExecutionEngine initializes with nodes and connections
```typescript
test('ExecutionEngine initializes with nodes and connections', () => {
    const mockNodes = [createMockNode('node-1', 'dataInput')];
    const mockConnections = [];
    
    const engine = new DefaultExecutionEngine(mockNodes, mockConnections);
    
    expect(engine.getExecutionOrder()).toHaveLength(1);
});
```

### Test Suite: Node Execution

#### Test: executeNode executes DataInputNode correctly
```typescript
test('executeNode executes DataInputNode correctly', async () => {
    const mockNode: NodeDefinition = {
        id: 'data-1',
        type: 'dataInput',
        position: { x: 0, y: 0 },
        data: {
            sourceType: 'manual',
            jsonData: [{ id: 1, value: 50 }, { id: 2, value: 75 }]
        },
        inputs: [],
        outputs: [{ id: 'data', label: 'Data', dataType: 'array', required: true }],
        config: NODE_REGISTRY.dataInput
    };
    
    const engine = new DefaultExecutionEngine([mockNode], []);
    const result = await engine.executeNode('data-1');
    
    expect(result.nodeId).toBe('data-1');
    expect(result.data).toEqual([{ id: 1, value: 50 }, { id: 2, value: 75 }]);
    expect(result.error).toBeUndefined();
});
```

#### Test: executeNode executes ProgressNode correctly
```typescript
test('executeNode executes ProgressNode correctly', async () => {
    const mockNode: NodeDefinition = {
        id: 'progress-1',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: {
            label: 'Completion',
            value: 75,
            max: 100,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        },
        inputs: [{ id: 'value', label: 'Value', dataType: 'number', required: true }],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const engine = new DefaultExecutionEngine([mockNode], []);
    // Provide input value
    engine.setInputValue('progress-1', 'value', 75);
    
    const result = await engine.executeNode('progress-1');
    
    expect(result.nodeId).toBe('progress-1');
    expect(result.data).toEqual({
        label: 'Completion',
        value: 75,
        max: 100,
        progress: 0.75
    });
});
```

#### Test: executeNode executes SegmentNode correctly
```typescript
test('executeNode executes SegmentNode correctly', async () => {
    const parentNode: NodeDefinition = {
        id: 'progress-1',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: {
            label: 'Total',
            value: 100,
            max: 100,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        },
        inputs: [],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const segmentNode: NodeDefinition = {
        id: 'segment-1',
        type: 'segment',
        position: { x: 0, y: 0 },
        data: {
            id: 'seg-1',
            label: 'Done',
            value: 50,
            color: '#10b981'
        },
        inputs: [{ id: 'parent', label: 'Parent Progress', dataType: 'progressData', required: true }],
        outputs: [{ id: 'segment', label: 'Segment', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.segment
    };
    
    const connection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'progress-1',
        sourcePortId: 'progress',
        targetNodeId: 'segment-1',
        targetPortId: 'parent'
    };
    
    const engine = new DefaultExecutionEngine([parentNode, segmentNode], [connection]);
    const result = await engine.executeNode('segment-1');
    
    expect(result.nodeId).toBe('segment-1');
    expect(result.data).toEqual({
        id: 'seg-1',
        label: 'Done',
        value: 50,
        color: '#10b981',
        parentProgress: expect.any(Object)
    });
});
```

#### Test: executeNode executes StyleNode correctly
```typescript
test('executeNode executes StyleNode correctly', async () => {
    const targetNode: NodeDefinition = {
        id: 'progress-1',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: {
            label: 'Test',
            value: 50,
            max: 100,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        },
        inputs: [],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const styleNode: NodeDefinition = {
        id: 'style-1',
        type: 'style',
        position: { x: 0, y: 0 },
        data: {
            height: 32,
            borderRadius: 8,
            backgroundColor: '#1f2937',
            fillColor: '#f59e0b',
            textColor: '#f9fafb',
            fontSize: 16,
            fontWeight: 'bold'
        },
        inputs: [{ id: 'target', label: 'Target', dataType: 'progressData', required: false }],
        outputs: [{ id: 'styled', label: 'Styled', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.style
    };
    
    const connection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'progress-1',
        sourcePortId: 'progress',
        targetNodeId: 'style-1',
        targetPortId: 'target'
    };
    
    const engine = new DefaultExecutionEngine([targetNode, styleNode], [connection]);
    const result = await engine.executeNode('style-1');
    
    expect(result.nodeId).toBe('style-1');
    expect(result.data).toEqual({
        label: 'Test',
        value: 50,
        max: 100,
        progress: 0.5,
        style: {
            height: 32,
            borderRadius: 8,
            backgroundColor: '#1f2937',
            fillColor: '#f59e0b',
            textColor: '#f9fafb',
            fontSize: 16,
            fontWeight: 'bold'
        }
    });
});
```

#### Test: executeNode executes LogicNode correctly
```typescript
test('executeNode executes LogicNode correctly', async () => {
    const mockNode: NodeDefinition = {
        id: 'logic-1',
        type: 'logic',
        position: { x: 0, y: 0 },
        data: {
            condition: 'value > 50'
        },
        inputs: [
            { id: 'condition', label: 'Condition', dataType: 'boolean', required: true },
            { id: 'trueValue', label: 'True', dataType: 'any', required: false },
            { id: 'falseValue', label: 'False', dataType: 'any', required: false }
        ],
        outputs: [{ id: 'result', label: 'Result', dataType: 'any', required: true }],
        config: NODE_REGISTRY.logic
    };
    
    const engine = new DefaultExecutionEngine([mockNode], []);
    engine.setInputValue('logic-1', 'condition', true);
    engine.setInputValue('logic-1', 'trueValue', 'Yes');
    engine.setInputValue('logic-1', 'falseValue', 'No');
    
    const result = await engine.executeNode('logic-1');
    
    expect(result.nodeId).toBe('logic-1');
    expect(result.data).toBe('Yes');
});
```

#### Test: executeNode returns error for missing required input
```typescript
test('executeNode returns error for missing required input', async () => {
    const mockNode: NodeDefinition = {
        id: 'progress-1',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: {
            label: 'Test',
            value: 50,
            max: 100,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        },
        inputs: [{ id: 'value', label: 'Value', dataType: 'number', required: true }],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const engine = new DefaultExecutionEngine([mockNode], []);
    // Don't provide input value
    
    const result = await engine.executeNode('progress-1');
    
    expect(result.nodeId).toBe('progress-1');
    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('Missing required input');
});
```

### Test Suite: Graph Execution

#### Test: executeGraph executes nodes in correct order
```typescript
test('executeGraph executes nodes in correct order', async () => {
    const dataNode: NodeDefinition = {
        id: 'data-1',
        type: 'dataInput',
        position: { x: 0, y: 0 },
        data: { sourceType: 'manual', jsonData: [{ value: 75 }] },
        inputs: [],
        outputs: [{ id: 'data', label: 'Data', dataType: 'array', required: true }],
        config: NODE_REGISTRY.dataInput
    };
    
    const progressNode: NodeDefinition = {
        id: 'progress-1',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: {
            label: 'Test',
            value: 0,
            max: 100,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        },
        inputs: [{ id: 'value', label: 'Value', dataType: 'number', required: true }],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const connection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'data-1',
        sourcePortId: 'data',
        targetNodeId: 'progress-1',
        targetPortId: 'value'
    };
    
    const engine = new DefaultExecutionEngine([dataNode, progressNode], [connection]);
    const executionOrder: string[] = [];
    
    // Mock executeNode to track order
    const originalExecuteNode = engine.executeNode.bind(engine);
    engine.executeNode = jest.fn(async (nodeId: string) => {
        executionOrder.push(nodeId);
        return originalExecuteNode(nodeId);
    });
    
    await engine.executeGraph();
    
    expect(executionOrder).toEqual(['data-1', 'progress-1']);
});
```

#### Test: executeGraph returns GraphResult with table data
```typescript
test('executeGraph returns GraphResult with table data', async () => {
    const dataNode: NodeDefinition = {
        id: 'data-1',
        type: 'dataInput',
        position: { x: 0, y: 0 },
        data: {
            sourceType: 'manual',
            jsonData: [
                { name: 'Item 1', value: 50 },
                { name: 'Item 2', value: 75 }
            ]
        },
        inputs: [],
        outputs: [{ id: 'data', label: 'Data', dataType: 'array', required: true }],
        config: NODE_REGISTRY.dataInput
    };
    
    const tableNode: NodeDefinition = {
        id: 'table-1',
        type: 'table',
        position: { x: 0, y: 0 },
        data: {
            headers: [
                { id: 'col-1', label: 'Name', width: 'auto', align: 'left', sortable: true },
                { id: 'col-2', label: 'Value', width: 100, align: 'right', sortable: true }
            ],
            rowHeight: 40,
            showBorders: true,
            stripeRows: true
        },
        inputs: [{ id: 'rows', label: 'Rows', dataType: 'array', required: true }],
        outputs: [],
        config: NODE_REGISTRY.table
    };
    
    const connection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'data-1',
        sourcePortId: 'data',
        targetNodeId: 'table-1',
        targetPortId: 'rows'
    };
    
    const engine = new DefaultExecutionEngine([dataNode, tableNode], [connection]);
    const result = await engine.executeGraph();
    
    expect(result.table).toBeDefined();
    expect(result.table?.rows).toHaveLength(2);
    expect(result.table?.headers).toHaveLength(2);
});
```

#### Test: executeGraph returns GraphResult with progress bars
```typescript
test('executeGraph returns GraphResult with progress bars', async () => {
    const dataNode: NodeDefinition = {
        id: 'data-1',
        type: 'dataInput',
        position: { x: 0, y: 0 },
        data: { sourceType: 'manual', jsonData: [{ value: 75 }] },
        inputs: [],
        outputs: [{ id: 'data', label: 'Data', dataType: 'array', required: true }],
        config: NODE_REGISTRY.dataInput
    };
    
    const progressNode: NodeDefinition = {
        id: 'progress-1',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: {
            label: 'Completion',
            value: 0,
            max: 100,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        },
        inputs: [{ id: 'value', label: 'Value', dataType: 'number', required: true }],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const connection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'data-1',
        sourcePortId: 'data',
        targetNodeId: 'progress-1',
        targetPortId: 'value'
    };
    
    const engine = new DefaultExecutionEngine([dataNode, progressNode], [connection]);
    const result = await engine.executeGraph();
    
    expect(result.progressBars).toBeDefined();
    expect(result.progressBars).toHaveLength(1);
    expect(result.progressBars?.[0]).toEqual(
        expect.objectContaining({
            label: 'Completion',
            value: 75,
            max: 100,
            progress: 0.75
        })
    );
});
```

---

## NodeExecutor

### Test Suite: Node Execution Logic

**File**: `src/components/node-editor/engine/NodeExecutor.test.ts`

#### Test: NodeExecutor handles DataInputNode type
```typescript
test('NodeExecutor handles DataInputNode type', async () => {
    const mockNode = createMockNode('data-1', 'dataInput', {
        sourceType: 'manual',
        jsonData: [{ id: 1, value: 50 }]
    });
    
    const executor = new NodeExecutor();
    const result = await executor.execute(mockNode, new Map());
    
    expect(result.data).toEqual([{ id: 1, value: 50 }]);
});
```

#### Test: NodeExecutor handles ProgressNode type with auto value
```typescript
test('NodeExecutor handles ProgressNode type with auto value', async () => {
    const mockNode = createMockNode('progress-1', 'progress', {
        label: 'Test',
        value: 'auto',
        max: 'auto',
        style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
        showPercentage: true,
        showLabel: true
    });
    
    const inputs = new Map([['value', 75]]);
    const executor = new NodeExecutor();
    const result = await executor.execute(mockNode, inputs);
    
    expect(result.data.value).toBe(75);
    expect(result.data.max).toBe(75);
});
```

#### Test: NodeExecutor handles SegmentNode type
```typescript
test('NodeExecutor handles SegmentNode type', async () => {
    const mockNode = createMockNode('segment-1', 'segment', {
        id: 'seg-1',
        label: 'Done',
        value: 50,
        color: '#10b981'
    });
    
    const parentProgress = { label: 'Total', value: 100, max: 100, progress: 1 };
    const inputs = new Map([['parent', parentProgress]]);
    const executor = new NodeExecutor();
    const result = await executor.execute(mockNode, inputs);
    
    expect(result.data).toEqual(
        expect.objectContaining({
            id: 'seg-1',
            label: 'Done',
            value: 50,
            color: '#10b981',
            parentProgress
        })
    );
});
```

#### Test: NodeExecutor handles StyleNode type
```typescript
test('NodeExecutor handles StyleNode type', async () => {
    const mockNode = createMockNode('style-1', 'style', {
        height: 32,
        borderRadius: 8,
        backgroundColor: '#1f2937',
        fillColor: '#f59e0b',
        textColor: '#f9fafb',
        fontSize: 16,
        fontWeight: 'bold'
    });
    
    const targetData = { label: 'Test', value: 50, max: 100, progress: 0.5 };
    const inputs = new Map([['target', targetData]]);
    const executor = new NodeExecutor();
    const result = await executor.execute(mockNode, inputs);
    
    expect(result.data).toEqual(
        expect.objectContaining({
            ...targetData,
            style: mockNode.data
        })
    );
});
```

#### Test: NodeExecutor handles LogicNode type
```typescript
test('NodeExecutor handles LogicNode type', async () => {
    const mockNode = createMockNode('logic-1', 'logic', {
        condition: 'value > 50'
    });
    
    const inputs = new Map([
        ['condition', true],
        ['trueValue', 'Yes'],
        ['falseValue', 'No']
    ]);
    const executor = new NodeExecutor();
    const result = await executor.execute(mockNode, inputs);
    
    expect(result.data).toBe('Yes');
});
```

---

## ResultCache

### Test Suite: Cache Operations

**File**: `src/components/node-editor/engine/ResultCache.test.ts`

#### Test: ResultCache stores and retrieves results
```typescript
test('ResultCache stores and retrieves results', () => {
    const cache = new ResultCache();
    const nodeResult: NodeResult = {
        nodeId: 'node-1',
        data: { value: 50 }
    };
    
    cache.set('node-1', nodeResult);
    const retrieved = cache.get('node-1');
    
    expect(retrieved).toEqual(nodeResult);
});
```

#### Test: ResultCache returns undefined for non-existent key
```typescript
test('ResultCache returns undefined for non-existent key', () => {
    const cache = new ResultCache();
    
    const retrieved = cache.get('non-existent');
    
    expect(retrieved).toBeUndefined();
});
```

#### Test: ResultCache invalidates cached result
```typescript
test('ResultCache invalidates cached result', () => {
    const cache = new ResultCache();
    const nodeResult: NodeResult = {
        nodeId: 'node-1',
        data: { value: 50 }
    };
    
    cache.set('node-1', nodeResult);
    cache.invalidate('node-1');
    
    const retrieved = cache.get('node-1');
    expect(retrieved).toBeUndefined();
});
```

#### Test: ResultCache clears all cached results
```typescript
test('ResultCache clears all cached results', () => {
    const cache = new ResultCache();
    
    cache.set('node-1', { nodeId: 'node-1', data: { value: 50 } });
    cache.set('node-2', { nodeId: 'node-2', data: { value: 75 } });
    
    cache.clear();
    
    expect(cache.get('node-1')).toBeUndefined();
    expect(cache.get('node-2')).toBeUndefined();
});
```

#### Test: ResultCache checks if result exists
```typescript
test('ResultCache checks if result exists', () => {
    const cache = new ResultCache();
    
    expect(cache.has('node-1')).toBe(false);
    
    cache.set('node-1', { nodeId: 'node-1', data: { value: 50 } });
    
    expect(cache.has('node-1')).toBe(true);
});
```

---

## Execution Order Calculation

### Test Suite: Topological Sort

**File**: `src/components/node-editor/engine/ExecutionEngine.test.ts` (continued)

#### Test: getExecutionOrder returns empty array for no nodes
```typescript
test('getExecutionOrder returns empty array for no nodes', () => {
    const engine = new DefaultExecutionEngine([], []);
    
    expect(engine.getExecutionOrder()).toEqual([]);
});
```

#### Test: getExecutionOrder handles single node
```typescript
test('getExecutionOrder handles single node', () => {
    const mockNode = createMockNode('node-1', 'dataInput');
    const engine = new DefaultExecutionEngine([mockNode], []);
    
    expect(engine.getExecutionOrder()).toEqual(['node-1']);
});
```

#### Test: getExecutionOrder handles linear dependency chain
```typescript
test('getExecutionOrder handles linear dependency chain', () => {
    const node1 = createMockNode('node-1', 'dataInput');
    const node2 = createMockNode('node-2', 'progress');
    const node3 = createMockNode('node-3', 'table');
    
    const connections: ConnectionDefinition[] = [
        {
            id: 'conn-1',
            sourceNodeId: 'node-1',
            sourcePortId: 'data',
            targetNodeId: 'node-2',
            targetPortId: 'value'
        },
        {
            id: 'conn-2',
            sourceNodeId: 'node-2',
            sourcePortId: 'progress',
            targetNodeId: 'node-3',
            targetPortId: 'rows'
        }
    ];
    
    const engine = new DefaultExecutionEngine([node1, node2, node3], connections);
    const order = engine.getExecutionOrder();
    
    expect(order).toEqual(['node-1', 'node-2', 'node-3']);
});
```

#### Test: getExecutionOrder handles branching dependencies
```typescript
test('getExecutionOrder handles branching dependencies', () => {
    const node1 = createMockNode('node-1', 'dataInput');
    const node2 = createMockNode('node-2', 'progress');
    const node3 = createMockNode('node-3', 'progress');
    const node4 = createMockNode('node-4', 'table');
    
    const connections: ConnectionDefinition[] = [
        {
            id: 'conn-1',
            sourceNodeId: 'node-1',
            sourcePortId: 'data',
            targetNodeId: 'node-2',
            targetPortId: 'value'
        },
        {
            id: 'conn-2',
            sourceNodeId: 'node-1',
            sourcePortId: 'data',
            targetNodeId: 'node-3',
            targetPortId: 'value'
        },
        {
            id: 'conn-3',
            sourceNodeId: 'node-2',
            sourcePortId: 'progress',
            targetNodeId: 'node-4',
            targetPortId: 'rows'
        },
        {
            id: 'conn-4',
            sourceNodeId: 'node-3',
            sourcePortId: 'progress',
            targetNodeId: 'node-4',
            targetPortId: 'rows'
        }
    ];
    
    const engine = new DefaultExecutionEngine([node1, node2, node3, node4], connections);
    const order = engine.getExecutionOrder();
    
    expect(order[0]).toBe('node-1');
    expect(order).toContain('node-2');
    expect(order).toContain('node-3');
    expect(order[3]).toBe('node-4');
});
```

#### Test: getExecutionOrder detects circular dependencies
```typescript
test('getExecutionOrder detects circular dependencies', () => {
    const node1 = createMockNode('node-1', 'progress');
    const node2 = createMockNode('node-2', 'progress');
    
    const connections: ConnectionDefinition[] = [
        {
            id: 'conn-1',
            sourceNodeId: 'node-1',
            sourcePortId: 'progress',
            targetNodeId: 'node-2',
            targetPortId: 'value'
        },
        {
            id: 'conn-2',
            sourceNodeId: 'node-2',
            sourcePortId: 'progress',
            targetNodeId: 'node-1',
            targetPortId: 'value'
        }
    ];
    
    const engine = new DefaultExecutionEngine([node1, node2], connections);
    
    expect(() => engine.getExecutionOrder()).toThrow('Circular dependency detected');
});
```

---

## Helper Functions

```typescript
// Test helper functions
function createMockNode(id: string, type: NodeType, data: any = {}): NodeDefinition {
    return {
        id,
        type,
        position: { x: 0, y: 0 },
        data: { label: `Node ${id}`, ...data },
        inputs: getDefaultInputs(type),
        outputs: getDefaultOutputs(type),
        config: NODE_REGISTRY[type]
    };
}

function getDefaultInputs(type: NodeType): PortDefinition[] {
    switch (type) {
        case 'dataInput':
            return [];
        case 'progress':
        case 'segment':
            return [{ id: 'value', label: 'Value', dataType: 'number', required: true }];
        case 'style':
            return [{ id: 'target', label: 'Target', dataType: 'progressData', required: false }];
        case 'logic':
            return [
                { id: 'condition', label: 'Condition', dataType: 'boolean', required: true },
                { id: 'trueValue', label: 'True', dataType: 'any', required: false },
                { id: 'falseValue', label: 'False', dataType: 'any', required: false }
            ];
        case 'table':
            return [{ id: 'rows', label: 'Rows', dataType: 'array', required: true }];
        default:
            return [];
    }
}

function getDefaultOutputs(type: NodeType): PortDefinition[] {
    switch (type) {
        case 'dataInput':
            return [{ id: 'data', label: 'Data', dataType: 'array', required: true }];
        case 'progress':
        case 'segment':
        case 'style':
            return [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }];
        case 'logic':
            return [{ id: 'result', label: 'Result', dataType: 'any', required: true }];
        case 'table':
            return [];
        default:
            return [];
    }
}
```
