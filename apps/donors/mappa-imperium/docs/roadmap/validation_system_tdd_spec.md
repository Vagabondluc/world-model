# Validation System TDD Specification

## Overview

This Test-Driven Development specification defines test cases for the Validation System component of the node-based visual editor. The Validation System is responsible for validating node configurations, connections, and detecting errors in the node graph.

## UI-Node Taxonomy Reference

This specification references the [UI-Node Taxonomy](./ui_node_taxonomy.md) for comprehensive visual component definitions, including:

- **Visual Component Taxonomy** - Error visualization states, node body rendering
- **Data Schema Mapping** - How validation errors map to data structures
- **Behavioral Expectations** - Error state interaction patterns
- **Error Visualization** - Visual feedback for validation failures

All test cases in this specification must align with the error visualization and validation expectations defined in the taxonomy.

## Table of Contents

1. [NodeValidator](#nodevalidator)
2. [ConnectionValidator](#connectionvalidator)
3. [GraphValidator](#graphvalidator)
4. [ErrorOverlay Component](#erroroverlay-component)
5. [ErrorCard Component](#errorcard-component)

---

## NodeValidator

### Test Suite: Node Configuration Validation

**File**: `src/components/node-editor/validator/NodeValidator.test.ts`

#### Test: validateNode returns valid result for properly configured node
```typescript
test('validateNode returns valid result for properly configured node', () => {
    const mockNode: NodeDefinition = {
        id: 'node-1',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: {
            label: 'Test',
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
    
    const validator = new DefaultNodeValidator();
    const result = validator.validateNode(mockNode);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
});
```

#### Test: validateNode returns error for missing required input connection
```typescript
test('validateNode returns error for missing required input connection', () => {
    const mockNode: NodeDefinition = {
        id: 'node-1',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: {
            label: 'Test',
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
    
    const mockGraph: NodeGraph = {
        nodes: [mockNode],
        connections: [] // No connection to required input
    };
    
    const validator = new DefaultNodeValidator();
    const result = validator.validateNode(mockNode, mockGraph);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].errorType).toBe('missingInput');
    expect(result.errors[0].message).toContain('Required input "value" is not connected');
});
```

#### Test: validateNode returns error for invalid data type on input
```typescript
test('validateNode returns error for invalid data type on input', () => {
    const mockNode: NodeDefinition = {
        id: 'node-1',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: {
            label: 'Test',
            value: 'invalid', // Should be number
            max: 100,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        },
        inputs: [{ id: 'value', label: 'Value', dataType: 'number', required: true }],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const validator = new DefaultNodeValidator();
    const result = validator.validateNode(mockNode);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].errorType).toBe('data');
    expect(result.errors[0].message).toContain('Invalid data type for "value"');
});
```

#### Test: validateNode returns warning for value exceeding max
```typescript
test('validateNode returns warning for value exceeding max', () => {
    const mockNode: NodeDefinition = {
        id: 'node-1',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: {
            label: 'Test',
            value: 150, // Exceeds max
            max: 100,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        },
        inputs: [{ id: 'value', label: 'Value', dataType: 'number', required: true }],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const validator = new DefaultNodeValidator();
    const result = validator.validateNode(mockNode);
    
    expect(result.isValid).toBe(true); // Still valid, just warning
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].severity).toBe('warning');
    expect(result.warnings[0].message).toContain('Value (150) exceeds max (100)');
});
```

#### Test: validateNode returns error for negative value
```typescript
test('validateNode returns error for negative value', () => {
    const mockNode: NodeDefinition = {
        id: 'node-1',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: {
            label: 'Test',
            value: -10, // Negative value
            max: 100,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        },
        inputs: [{ id: 'value', label: 'Value', dataType: 'number', required: true }],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const validator = new DefaultNodeValidator();
    const result = validator.validateNode(mockNode);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].errorType).toBe('data');
    expect(result.errors[0].message).toContain('Value cannot be negative');
});
```

#### Test: validateNode validates segment values sum to parent value
```typescript
test('validateNode validates segment values sum to parent value', () => {
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
            value: 150, // Exceeds parent value
            color: '#10b981'
        },
        inputs: [{ id: 'parent', label: 'Parent Progress', dataType: 'progressData', required: true }],
        outputs: [{ id: 'segment', label: 'Segment', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.segment
    };
    
    const mockGraph: NodeGraph = {
        nodes: [parentNode, segmentNode],
        connections: [{
            id: 'conn-1',
            sourceNodeId: 'progress-1',
            sourcePortId: 'progress',
            targetNodeId: 'segment-1',
            targetPortId: 'parent'
        }]
    };
    
    const validator = new DefaultNodeValidator();
    const result = validator.validateNode(segmentNode, mockGraph);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].errorType).toBe('data');
    expect(result.errors[0].message).toContain('Segment value (150) exceeds parent value (100)');
});
```

---

## ConnectionValidator

### Test Suite: Connection Validation

**File**: `src/components/node-editor/validator/ConnectionValidator.test.ts`

#### Test: validateConnection returns valid result for valid connection
```typescript
test('validateConnection returns valid result for valid connection', () => {
    const mockConnection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'node-1',
        sourcePortId: 'output-1',
        targetNodeId: 'node-2',
        targetPortId: 'input-1'
    };
    
    const sourceNode: NodeDefinition = {
        id: 'node-1',
        type: 'dataInput',
        position: { x: 0, y: 0 },
        data: { sourceType: 'manual', jsonData: [] },
        inputs: [],
        outputs: [{ id: 'output-1', label: 'Data', dataType: 'array', required: true }],
        config: NODE_REGISTRY.dataInput
    };
    
    const targetNode: NodeDefinition = {
        id: 'node-2',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: { label: 'Test', value: 0, max: 100, style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' }, showPercentage: true, showLabel: true },
        inputs: [{ id: 'input-1', label: 'Value', dataType: 'number', required: true }],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const mockGraph: NodeGraph = {
        nodes: [sourceNode, targetNode],
        connections: []
    };
    
    const validator = new DefaultConnectionValidator();
    const result = validator.validateConnection(mockConnection, mockGraph);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
});
```

#### Test: validateConnection returns error for non-existent source node
```typescript
test('validateConnection returns error for non-existent source node', () => {
    const mockConnection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'non-existent',
        sourcePortId: 'output-1',
        targetNodeId: 'node-2',
        targetPortId: 'input-1'
    };
    
    const targetNode: NodeDefinition = {
        id: 'node-2',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: { label: 'Test', value: 0, max: 100, style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' }, showPercentage: true, showLabel: true },
        inputs: [{ id: 'input-1', label: 'Value', dataType: 'number', required: true }],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const mockGraph: NodeGraph = {
        nodes: [targetNode],
        connections: []
    };
    
    const validator = new DefaultConnectionValidator();
    const result = validator.validateConnection(mockConnection, mockGraph);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].errorType).toBe('connection');
    expect(result.errors[0].message).toContain('Source node "non-existent" does not exist');
});
```

#### Test: validateConnection returns error for non-existent target node
```typescript
test('validateConnection returns error for non-existent target node', () => {
    const mockConnection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'node-1',
        sourcePortId: 'output-1',
        targetNodeId: 'non-existent',
        targetPortId: 'input-1'
    };
    
    const sourceNode: NodeDefinition = {
        id: 'node-1',
        type: 'dataInput',
        position: { x: 0, y: 0 },
        data: { sourceType: 'manual', jsonData: [] },
        inputs: [],
        outputs: [{ id: 'output-1', label: 'Data', dataType: 'array', required: true }],
        config: NODE_REGISTRY.dataInput
    };
    
    const mockGraph: NodeGraph = {
        nodes: [sourceNode],
        connections: []
    };
    
    const validator = new DefaultConnectionValidator();
    const result = validator.validateConnection(mockConnection, mockGraph);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].errorType).toBe('connection');
    expect(result.errors[0].message).toContain('Target node "non-existent" does not exist');
});
```

#### Test: validateConnection returns error for non-existent source port
```typescript
test('validateConnection returns error for non-existent source port', () => {
    const mockConnection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'node-1',
        sourcePortId: 'non-existent',
        targetNodeId: 'node-2',
        targetPortId: 'input-1'
    };
    
    const sourceNode: NodeDefinition = {
        id: 'node-1',
        type: 'dataInput',
        position: { x: 0, y: 0 },
        data: { sourceType: 'manual', jsonData: [] },
        inputs: [],
        outputs: [{ id: 'output-1', label: 'Data', dataType: 'array', required: true }],
        config: NODE_REGISTRY.dataInput
    };
    
    const targetNode: NodeDefinition = {
        id: 'node-2',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: { label: 'Test', value: 0, max: 100, style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' }, showPercentage: true, showLabel: true },
        inputs: [{ id: 'input-1', label: 'Value', dataType: 'number', required: true }],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const mockGraph: NodeGraph = {
        nodes: [sourceNode, targetNode],
        connections: []
    };
    
    const validator = new DefaultConnectionValidator();
    const result = validator.validateConnection(mockConnection, mockGraph);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].errorType).toBe('connection');
    expect(result.errors[0].message).toContain('Source port "non-existent" does not exist on node "node-1"');
});
```

#### Test: validateConnection returns error for non-existent target port
```typescript
test('validateConnection returns error for non-existent target port', () => {
    const mockConnection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'node-1',
        sourcePortId: 'output-1',
        targetNodeId: 'node-2',
        targetPortId: 'non-existent'
    };
    
    const sourceNode: NodeDefinition = {
        id: 'node-1',
        type: 'dataInput',
        position: { x: 0, y: 0 },
        data: { sourceType: 'manual', jsonData: [] },
        inputs: [],
        outputs: [{ id: 'output-1', label: 'Data', dataType: 'array', required: true }],
        config: NODE_REGISTRY.dataInput
    };
    
    const targetNode: NodeDefinition = {
        id: 'node-2',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: { label: 'Test', value: 0, max: 100, style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' }, showPercentage: true, showLabel: true },
        inputs: [{ id: 'input-1', label: 'Value', dataType: 'number', required: true }],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const mockGraph: NodeGraph = {
        nodes: [sourceNode, targetNode],
        connections: []
    };
    
    const validator = new DefaultConnectionValidator();
    const result = validator.validateConnection(mockConnection, mockGraph);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].errorType).toBe('connection');
    expect(result.errors[0].message).toContain('Target port "non-existent" does not exist on node "node-2"');
});
```

#### Test: validateConnection returns error for incompatible data types
```typescript
test('validateConnection returns error for incompatible data types', () => {
    const mockConnection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'node-1',
        sourcePortId: 'output-1',
        targetNodeId: 'node-2',
        targetPortId: 'input-1'
    };
    
    const sourceNode: NodeDefinition = {
        id: 'node-1',
        type: 'dataInput',
        position: { x: 0, y: 0 },
        data: { sourceType: 'manual', jsonData: [] },
        inputs: [],
        outputs: [{ id: 'output-1', label: 'Data', dataType: 'array', required: true }],
        config: NODE_REGISTRY.dataInput
    };
    
    const targetNode: NodeDefinition = {
        id: 'node-2',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: { label: 'Test', value: 0, max: 100, style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' }, showPercentage: true, showLabel: true },
        inputs: [{ id: 'input-1', label: 'Value', dataType: 'number', required: true }], // Expects number, gets array
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const mockGraph: NodeGraph = {
        nodes: [sourceNode, targetNode],
        connections: []
    };
    
    const validator = new DefaultConnectionValidator();
    const result = validator.validateConnection(mockConnection, mockGraph);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].errorType).toBe('connection');
    expect(result.errors[0].message).toContain('Incompatible data types: array cannot connect to number');
});
```

#### Test: validateConnection returns error for output to output connection
```typescript
test('validateConnection returns error for output to output connection', () => {
    const mockConnection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'node-1',
        sourcePortId: 'output-1',
        targetNodeId: 'node-2',
        targetPortId: 'output-2' // Output to output
    };
    
    const sourceNode: NodeDefinition = {
        id: 'node-1',
        type: 'dataInput',
        position: { x: 0, y: 0 },
        data: { sourceType: 'manual', jsonData: [] },
        inputs: [],
        outputs: [{ id: 'output-1', label: 'Data', dataType: 'array', required: true }],
        config: NODE_REGISTRY.dataInput
    };
    
    const targetNode: NodeDefinition = {
        id: 'node-2',
        type: 'dataInput',
        position: { x: 0, y: 0 },
        data: { sourceType: 'manual', jsonData: [] },
        inputs: [],
        outputs: [{ id: 'output-2', label: 'Data', dataType: 'array', required: true }],
        config: NODE_REGISTRY.dataInput
    };
    
    const mockGraph: NodeGraph = {
        nodes: [sourceNode, targetNode],
        connections: []
    };
    
    const validator = new DefaultConnectionValidator();
    const result = validator.validateConnection(mockConnection, mockGraph);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].errorType).toBe('connection');
    expect(result.errors[0].message).toContain('Cannot connect output port to output port');
});
```

#### Test: validateConnection returns error for input to input connection
```typescript
test('validateConnection returns error for input to input connection', () => {
    const mockConnection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'node-1',
        sourcePortId: 'input-1', // Input to input
        targetNodeId: 'node-2',
        targetPortId: 'input-2'
    };
    
    const sourceNode: NodeDefinition = {
        id: 'node-1',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: { label: 'Test', value: 0, max: 100, style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' }, showPercentage: true, showLabel: true },
        inputs: [{ id: 'input-1', label: 'Value', dataType: 'number', required: true }],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const targetNode: NodeDefinition = {
        id: 'node-2',
        type: 'progress',
        position: { x: 0, y: 0 },
        data: { label: 'Test', value: 0, max: 100, style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' }, showPercentage: true, showLabel: true },
        inputs: [{ id: 'input-2', label: 'Value', dataType: 'number', required: true }],
        outputs: [{ id: 'progress', label: 'Progress', dataType: 'progressData', required: true }],
        config: NODE_REGISTRY.progress
    };
    
    const mockGraph: NodeGraph = {
        nodes: [sourceNode, targetNode],
        connections: []
    };
    
    const validator = new DefaultConnectionValidator();
    const result = validator.validateConnection(mockConnection, mockGraph);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].errorType).toBe('connection');
    expect(result.errors[0].message).toContain('Cannot connect input port to input port');
});
```

---

## GraphValidator

### Test Suite: Graph Validation

**File**: `src/components/node-editor/validator/GraphValidator.test.ts`

#### Test: validateGraph returns valid result for valid graph
```typescript
test('validateGraph returns valid result for valid graph', () => {
    const mockNodes: NodeDefinition[] = [
        createMockNode('node-1', 'dataInput'),
        createMockNode('node-2', 'progress')
    ];
    
    const mockConnections: ConnectionDefinition[] = [
        {
            id: 'conn-1',
            sourceNodeId: 'node-1',
            sourcePortId: 'data',
            targetNodeId: 'node-2',
            targetPortId: 'value'
        }
    ];
    
    const mockGraph: NodeGraph = {
        nodes: mockNodes,
        connections: mockConnections
    };
    
    const validator = new DefaultGraphValidator();
    const result = validator.validateGraph(mockGraph);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
});
```

#### Test: validateGraph detects circular dependencies
```typescript
test('validateGraph detects circular dependencies', () => {
    const mockNodes: NodeDefinition[] = [
        createMockNode('node-1', 'progress'),
        createMockNode('node-2', 'progress')
    ];
    
    const mockConnections: ConnectionDefinition[] = [
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
            targetPortId: 'value' // Creates circular dependency
        }
    ];
    
    const mockGraph: NodeGraph = {
        nodes: mockNodes,
        connections: mockConnections
    };
    
    const validator = new DefaultGraphValidator();
    const result = validator.validateGraph(mockGraph);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].errorType).toBe('circular');
    expect(result.errors[0].message).toContain('Circular dependency detected');
});
```

#### Test: validateGraph detects orphaned nodes
```typescript
test('validateGraph detects orphaned nodes', () => {
    const mockNodes: NodeDefinition[] = [
        createMockNode('node-1', 'dataInput'),
        createMockNode('node-2', 'progress'),
        createMockNode('node-3', 'progress') // Orphaned - no connections
    ];
    
    const mockConnections: ConnectionDefinition[] = [
        {
            id: 'conn-1',
            sourceNodeId: 'node-1',
            sourcePortId: 'data',
            targetNodeId: 'node-2',
            targetPortId: 'value'
        }
    ];
    
    const mockGraph: NodeGraph = {
        nodes: mockNodes,
        connections: mockConnections
    };
    
    const validator = new DefaultGraphValidator();
    const result = validator.validateGraph(mockGraph);
    
    expect(result.isValid).toBe(false);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].errorType).toBe('validation');
    expect(result.warnings[0].message).toContain('Node "node-3" is orphaned (no connections)');
});
```

#### Test: validateGraph validates all nodes in graph
```typescript
test('validateGraph validates all nodes in graph', () => {
    const mockNodes: NodeDefinition[] = [
        createMockNode('node-1', 'dataInput'),
        createMockNode('node-2', 'progress'),
        createMockNode('node-3', 'progress')
    ];
    
    const mockConnections: ConnectionDefinition[] = [
        {
            id: 'conn-1',
            sourceNodeId: 'node-1',
            sourcePortId: 'data',
            targetNodeId: 'node-2',
            targetPortId: 'value'
        }
    ];
    
    const mockGraph: NodeGraph = {
        nodes: mockNodes,
        connections: mockConnections
    };
    
    const validator = new DefaultGraphValidator();
    const result = validator.validateGraph(mockGraph);
    
    // node-3 is orphaned
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].nodeId).toBe('node-3');
});
```

---

## ErrorOverlay Component

### Test Suite: ErrorOverlay Rendering

**File**: `src/components/node-editor/error/ErrorOverlay.test.tsx`

#### Test: ErrorOverlay renders all errors
```typescript
test('ErrorOverlay renders all errors', () => {
    const mockErrors: NodeError[] = [
        {
            nodeId: 'node-1',
            errorType: 'missingInput',
            message: 'Required input not connected',
            severity: 'error',
            timestamp: new Date().toISOString()
        },
        {
            nodeId: 'node-2',
            errorType: 'data',
            message: 'Invalid data type',
            severity: 'warning',
            timestamp: new Date().toISOString()
        }
    ];
    
    render(<ErrorOverlay errors={mockErrors} onDismiss={jest.fn()} onFix={jest.fn()} />);
    
    expect(screen.getByText('Required input not connected')).toBeInTheDocument();
    expect(screen.getByText('Invalid data type')).toBeInTheDocument();
});
```

#### Test: ErrorOverlay applies error styling
```typescript
test('ErrorOverlay applies error styling', () => {
    const mockErrors: NodeError[] = [
        {
            nodeId: 'node-1',
            errorType: 'missingInput',
            message: 'Test error',
            severity: 'error',
            timestamp: new Date().toISOString()
        }
    ];
    
    const { container } = render(<ErrorOverlay errors={mockErrors} onDismiss={jest.fn()} onFix={jest.fn()} />);
    const errorCard = container.querySelector('.error-card');
    
    expect(errorCard).toHaveClass('error-severity-error');
});
```

#### Test: ErrorOverlay applies warning styling
```typescript
test('ErrorOverlay applies warning styling', () => {
    const mockErrors: NodeError[] = [
        {
            nodeId: 'node-1',
            errorType: 'data',
            message: 'Test warning',
            severity: 'warning',
            timestamp: new Date().toISOString()
        }
    ];
    
    const { container } = render(<ErrorOverlay errors={mockErrors} onDismiss={jest.fn()} onFix={jest.fn()} />);
    const errorCard = container.querySelector('.error-card');
    
    expect(errorCard).toHaveClass('error-severity-warning');
});
```

### Test Suite: ErrorOverlay Interaction

#### Test: ErrorOverlay calls onDismiss when dismiss button is clicked
```typescript
test('ErrorOverlay calls onDismiss when dismiss button is clicked', () => {
    const mockOnDismiss = jest.fn();
    const mockErrors: NodeError[] = [
        {
            nodeId: 'node-1',
            errorType: 'missingInput',
            message: 'Test error',
            severity: 'error',
            timestamp: new Date().toISOString()
        }
    ];
    
    render(<ErrorOverlay errors={mockErrors} onDismiss={mockOnDismiss} onFix={jest.fn()} />);
    
    const dismissButton = screen.getByLabelText('Dismiss error');
    fireEvent.click(dismissButton);
    
    expect(mockOnDismiss).toHaveBeenCalledWith('node-1');
});
```

#### Test: ErrorOverlay calls onFix when fix button is clicked
```typescript
test('ErrorOverlay calls onFix when fix button is clicked', () => {
    const mockOnFix = jest.fn();
    const mockErrors: NodeError[] = [
        {
            nodeId: 'node-1',
            errorType: 'missingInput',
            message: 'Test error',
            severity: 'error',
            timestamp: new Date().toISOString()
        }
    ];
    
    render(<ErrorOverlay errors={mockErrors} onDismiss={jest.fn()} onFix={mockOnFix} />);
    
    const fixButton = screen.getByLabelText('Fix error');
    fireEvent.click(fixButton);
    
    expect(mockOnFix).toHaveBeenCalledWith('node-1');
});
```

---

## ErrorCard Component

### Test Suite: ErrorCard Rendering

**File**: `src/components/node-editor/error/ErrorCard.test.tsx`

#### Test: ErrorCard renders error message
```typescript
test('ErrorCard renders error message', () => {
    const mockError: NodeError = {
        nodeId: 'node-1',
        errorType: 'missingInput',
        message: 'Required input not connected',
        severity: 'error',
        timestamp: new Date().toISOString()
    };
    
    render(<ErrorCard error={mockError} onDismiss={jest.fn()} onFix={jest.fn()} />);
    
    expect(screen.getByText('Required input not connected')).toBeInTheDocument();
});
```

#### Test: ErrorCard renders node ID
```typescript
test('ErrorCard renders node ID', () => {
    const mockError: NodeError = {
        nodeId: 'node-1',
        errorType: 'missingInput',
        message: 'Test error',
        severity: 'error',
        timestamp: new Date().toISOString()
    };
    
    render(<ErrorCard error={mockError} onDismiss={jest.fn()} onFix={jest.fn()} />);
    
    expect(screen.getByText(/node-1/)).toBeInTheDocument();
});
```

#### Test: ErrorCard renders error type
```typescript
test('ErrorCard renders error type', () => {
    const mockError: NodeError = {
        nodeId: 'node-1',
        errorType: 'missingInput',
        message: 'Test error',
        severity: 'error',
        timestamp: new Date().toISOString()
    };
    
    render(<ErrorCard error={mockError} onDismiss={jest.fn()} onFix={jest.fn()} />);
    
    expect(screen.getByText('Missing Input')).toBeInTheDocument();
});
```

#### Test: ErrorCard renders timestamp
```typescript
test('ErrorCard renders timestamp', () => {
    const timestamp = new Date('2024-01-01T12:00:00.000Z').toISOString();
    const mockError: NodeError = {
        nodeId: 'node-1',
        errorType: 'missingInput',
        message: 'Test error',
        severity: 'error',
        timestamp
    };
    
    render(<ErrorCard error={mockError} onDismiss={jest.fn()} onFix={jest.fn()} />);
    
    expect(screen.getByText(/2024-01-01/)).toBeInTheDocument();
});
```

---

## Helper Functions

```typescript
// Test helper functions
function createMockNode(id: string, type: NodeType): NodeDefinition {
    return {
        id,
        type,
        position: { x: 0, y: 0 },
        data: { label: `Node ${id}` },
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
