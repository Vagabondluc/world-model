# Drag-and-Drop System TDD Specification

## Overview

This Test-Driven Development specification defines test cases for the Drag-and-Drop System component of the node-based visual editor. The Drag-and-Drop System is responsible for managing node positioning, port connections, and user interactions within the canvas.

## UI-Node Taxonomy Reference

This specification references the [UI-Node Taxonomy](./ui_node_taxonomy.md) for comprehensive visual component definitions, including:

- **Visual Component Taxonomy** - Defines how all UI elements are rendered
- **Data Schema Mapping** - How visual elements map to data structures
- **Behavioral Expectations** - Interaction patterns and states
- **Dynamic Node Creation** - JSON schema for custom node types

All test cases in this specification must align with the visual behaviors and rendering expectations defined in the taxonomy.

## Table of Contents

1. [useDragManager Hook](#usedragmanager-hook)
2. [ConnectionManager Component](#connectionmanager-component)
3. [Port Component](#port-component)
4. [NodeCanvas Component](#nodecanvas-component)
5. [ConnectionLine Component](#connectionline-component)

---

## useDragManager Hook

### Test Suite: Node Dragging

**File**: `src/components/node-editor/hooks/useDragManager.test.ts`

#### Test: useDragManager initializes with default state
```typescript
test('useDragManager initializes with default state', () => {
    const { result } = renderHook(() => useDragManager());
    
    expect(result.current.dragState).toEqual({
        isDragging: false,
        draggedNode: null,
        dragOffset: { x: 0, y: 0 },
        draggedPort: null
    });
});
```

#### Test: startNodeDrag sets dragging state
```typescript
test('startNodeDrag sets dragging state', () => {
    const { result } = renderHook(() => useDragManager());
    
    act(() => {
        result.current.startNodeDrag('node-1', { clientX: 100, clientY: 100 } as MouseEvent);
    });
    
    expect(result.current.dragState.isDragging).toBe(true);
    expect(result.current.dragState.draggedNode).toBe('node-1');
});
```

#### Test: startNodeDrag calculates drag offset correctly
```typescript
test('startNodeDrag calculates drag offset correctly', () => {
    const { result } = renderHook(() => useDragManager());
    
    // Mock node position
    const mockNodes: NodeDefinition[] = [{
        id: 'node-1',
        type: 'progress',
        position: { x: 200, y: 150 },
        data: {},
        inputs: [],
        outputs: [],
        config: NODE_REGISTRY.progress
    }];
    
    act(() => {
        result.current.startNodeDrag('node-1', { clientX: 100, clientY: 100 } as MouseEvent);
    });
    
    expect(result.current.dragState.dragOffset).toEqual({ x: -100, y: -50 });
});
```

#### Test: handleNodeDrag updates node position
```typescript
test('handleNodeDrag updates node position', () => {
    const mockUpdateNode = jest.fn();
    const { result } = renderHook(() => useDragManager());
    
    act(() => {
        result.current.startNodeDrag('node-1', { clientX: 100, clientY: 100 } as MouseEvent);
        result.current.handleNodeDrag({ clientX: 150, clientY: 150 } as MouseEvent);
    });
    
    // Position should be updated by delta (50, 50)
    expect(mockUpdateNode).toHaveBeenCalledWith(
        'node-1',
        expect.objectContaining({
            position: { x: 150, y: 150 }
        })
    );
});
```

#### Test: endNodeDrag resets dragging state
```typescript
test('endNodeDrag resets dragging state', () => {
    const { result } = renderHook(() => useDragManager());
    
    act(() => {
        result.current.startNodeDrag('node-1', { clientX: 100, clientY: 100 } as MouseEvent);
        result.current.endNodeDrag();
    });
    
    expect(result.current.dragState).toEqual({
        isDragging: false,
        draggedNode: null,
        dragOffset: { x: 0, y: 0 },
        draggedPort: null
    });
});
```

### Test Suite: Port Dragging

#### Test: startPortDrag sets port dragging state
```typescript
test('startPortDrag sets port dragging state', () => {
    const { result } = renderHook(() => useDragManager());
    
    act(() => {
        result.current.startPortDrag('node-1', 'output-1');
    });
    
    expect(result.current.dragState.isDragging).toBe(true);
    expect(result.current.dragState.draggedPort).toEqual({
        nodeId: 'node-1',
        portId: 'output-1'
    });
});
```

#### Test: handlePortDrag updates temporary connection line
```typescript
test('handlePortDrag updates temporary connection line', () => {
    const { result } = renderHook(() => useDragManager());
    
    act(() => {
        result.current.startPortDrag('node-1', 'output-1');
        result.current.handlePortDrag({ clientX: 200, clientY: 200 } as MouseEvent);
    });
    
    // Temporary connection should be tracked for rendering
    expect(result.current.dragState).toEqual(
        expect.objectContaining({
            isDragging: true,
            draggedPort: { nodeId: 'node-1', portId: 'output-1' }
        })
    );
});
```

#### Test: endPortDrag creates connection when dropped on valid port
```typescript
test('endPortDrag creates connection when dropped on valid port', () => {
    const mockAddConnection = jest.fn();
    const { result } = renderHook(() => useDragManager());
    
    // Set up drop target
    const dropTarget = { nodeId: 'node-2', portId: 'input-1' };
    
    act(() => {
        result.current.startPortDrag('node-1', 'output-1');
        result.current.endPortDrag(dropTarget.nodeId, dropTarget.portId);
    });
    
    expect(mockAddConnection).toHaveBeenCalledWith(
        expect.objectContaining({
            sourceNodeId: 'node-1',
            sourcePortId: 'output-1',
            targetNodeId: 'node-2',
            targetPortId: 'input-1'
        })
    );
});
```

#### Test: endPortDrag does not create connection for invalid port type
```typescript
test('endPortDrag does not create connection for invalid port type', () => {
    const mockAddConnection = jest.fn();
    const { result } = renderHook(() => useDragManager());
    
    // Try to connect output to output (invalid)
    act(() => {
        result.current.startPortDrag('node-1', 'output-1');
        result.current.endPortDrag('node-2', 'output-2');
    });
    
    expect(mockAddConnection).not.toHaveBeenCalled();
});
```

#### Test: endPortDrag does not create connection to same node
```typescript
test('endPortDrag does not create connection to same node', () => {
    const mockAddConnection = jest.fn();
    const { result } = renderHook(() => useDragManager());
    
    act(() => {
        result.current.startPortDrag('node-1', 'output-1');
        result.current.endPortDrag('node-1', 'input-1');
    });
    
    expect(mockAddConnection).not.toHaveBeenCalled();
});
```

### Test Suite: Drag Constraints

#### Test: Node drag respects canvas boundaries
```typescript
test('Node drag respects canvas boundaries', () => {
    const mockUpdateNode = jest.fn();
    const { result } = renderHook(() => useDragManager());
    
    const canvasBounds = { width: 800, height: 600 };
    const nodeSize = { width: 200, height: 150 };
    
    act(() => {
        result.current.startNodeDrag('node-1', { clientX: 100, clientY: 100 } as MouseEvent);
        // Try to drag beyond right boundary
        result.current.handleNodeDrag({ clientX: 1000, clientY: 100 } as MouseEvent);
    });
    
    expect(mockUpdateNode).toHaveBeenCalledWith(
        'node-1',
        expect.objectContaining({
            position: {
                x: canvasBounds.width - nodeSize.width,  // Clamped to boundary
                y: expect.any(Number)
            }
        })
    );
});
```

#### Test: Node drag snaps to grid when enabled
```typescript
test('Node drag snaps to grid when enabled', () => {
    const mockUpdateNode = jest.fn();
    const { result } = renderHook(() => useDragManager());
    
    const gridSize = 20;
    
    act(() => {
        result.current.startNodeDrag('node-1', { clientX: 100, clientY: 100 } as MouseEvent);
        // Drag to position not on grid
        result.current.handleNodeDrag({ clientX: 135, clientY: 147 } as MouseEvent);
    });
    
    expect(mockUpdateNode).toHaveBeenCalledWith(
        'node-1',
        expect.objectContaining({
            position: {
                x: 140,  // Snapped to nearest 20
                y: 140   // Snapped to nearest 20
            }
        })
    );
});
```

---

## ConnectionManager Component

### Test Suite: Connection Rendering

**File**: `src/components/node-editor/connections/ConnectionManager.test.tsx`

#### Test: ConnectionManager renders all connections
```typescript
test('ConnectionManager renders all connections', () => {
    const mockConnections: ConnectionDefinition[] = [
        {
            id: 'conn-1',
            sourceNodeId: 'node-1',
            sourcePortId: 'output-1',
            targetNodeId: 'node-2',
            targetPortId: 'input-1'
        },
        {
            id: 'conn-2',
            sourceNodeId: 'node-3',
            sourcePortId: 'output-1',
            targetNodeId: 'node-4',
            targetPortId: 'input-1'
        }
    ];
    
    const mockNodes = createMockNodes(['node-1', 'node-2', 'node-3', 'node-4']);
    
    render(
        <ConnectionManager
            connections={mockConnections}
            nodes={mockNodes}
            onUpdateConnection={jest.fn()}
            onDeleteConnection={jest.fn()}
            onConnectionCreate={jest.fn()}
        />
    );
    
    const connectionLines = screen.getAllByTestId('connection-line');
    expect(connectionLines).toHaveLength(2);
});
```

#### Test: ConnectionManager renders bezier curve connections
```typescript
test('ConnectionManager renders bezier curve connections', () => {
    const mockConnection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'node-1',
        sourcePortId: 'output-1',
        targetNodeId: 'node-2',
        targetPortId: 'input-1',
        style: { type: 'bezier', color: '#6366f1', width: 2, animated: false }
    };
    
    const mockNodes = createMockNodes(['node-1', 'node-2']);
    
    const { container } = render(
        <ConnectionManager
            connections={[mockConnection]}
            nodes={mockNodes}
            onUpdateConnection={jest.fn()}
            onDeleteConnection={jest.fn()}
            onConnectionCreate={jest.fn()}
        />
    );
    
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('d', expect.stringContaining('C')); // Bezier curve command
});
```

#### Test: ConnectionManager renders straight line connections
```typescript
test('ConnectionManager renders straight line connections', () => {
    const mockConnection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'node-1',
        sourcePortId: 'output-1',
        targetNodeId: 'node-2',
        targetPortId: 'input-1',
        style: { type: 'straight', color: '#6366f1', width: 2, animated: false }
    };
    
    const mockNodes = createMockNodes(['node-1', 'node-2']);
    
    const { container } = render(
        <ConnectionManager
            connections={[mockConnection]}
            nodes={mockNodes}
            onUpdateConnection={jest.fn()}
            onDeleteConnection={jest.fn()}
            onConnectionCreate={jest.fn()}
        />
    );
    
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('d', expect.stringContaining('L')); // Line command
});
```

#### Test: ConnectionManager renders animated connections
```typescript
test('ConnectionManager renders animated connections', () => {
    const mockConnection: ConnectionDefinition = {
        id: 'conn-1',
        sourceNodeId: 'node-1',
        sourcePortId: 'output-1',
        targetNodeId: 'node-2',
        targetPortId: 'input-1',
        style: { type: 'bezier', color: '#6366f1', width: 2, animated: true }
    };
    
    const mockNodes = createMockNodes(['node-1', 'node-2']);
    
    const { container } = render(
        <ConnectionManager
            connections={[mockConnection]}
            nodes={mockNodes}
            onUpdateConnection={jest.fn()}
            onDeleteConnection={jest.fn()}
            onConnectionCreate={jest.fn()}
        />
    );
    
    const path = container.querySelector('path');
    expect(path).toHaveClass('animated-connection');
});
```

### Test Suite: Connection Interaction

#### Test: ConnectionManager highlights connection on hover
```typescript
test('ConnectionManager highlights connection on hover', () => {
    const mockConnection = createMockConnection('conn-1', 'node-1', 'node-2');
    const mockNodes = createMockNodes(['node-1', 'node-2']);
    
    render(
        <ConnectionManager
            connections={[mockConnection]}
            nodes={mockNodes}
            onUpdateConnection={jest.fn()}
            onDeleteConnection={jest.fn()}
            onConnectionCreate={jest.fn()}
        />
    );
    
    const connectionLine = screen.getByTestId('connection-line');
    fireEvent.mouseEnter(connectionLine);
    
    expect(connectionLine).toHaveClass('connection-highlighted');
});
```

#### Test: ConnectionManager shows delete button on selected connection
```typescript
test('ConnectionManager shows delete button on selected connection', () => {
    const mockConnection = createMockConnection('conn-1', 'node-1', 'node-2');
    const mockNodes = createMockNodes(['node-1', 'node-2']);
    
    render(
        <ConnectionManager
            connections={[mockConnection]}
            nodes={mockNodes}
            onUpdateConnection={jest.fn()}
            onDeleteConnection={jest.fn()}
            onConnectionCreate={jest.fn()}
            selectedConnectionId='conn-1'
        />
    );
    
    expect(screen.getByLabelText('Delete connection')).toBeInTheDocument();
});
```

#### Test: ConnectionManager calls onDeleteConnection when delete button clicked
```typescript
test('ConnectionManager calls onDeleteConnection when delete button clicked', () => {
    const mockDeleteConnection = jest.fn();
    const mockConnection = createMockConnection('conn-1', 'node-1', 'node-2');
    const mockNodes = createMockNodes(['node-1', 'node-2']);
    
    render(
        <ConnectionManager
            connections={[mockConnection]}
            nodes={mockNodes}
            onUpdateConnection={jest.fn()}
            onDeleteConnection={mockDeleteConnection}
            onConnectionCreate={jest.fn()}
            selectedConnectionId='conn-1'
        />
    );
    
    const deleteButton = screen.getByLabelText('Delete connection');
    fireEvent.click(deleteButton);
    
    expect(mockDeleteConnection).toHaveBeenCalledWith('conn-1');
});
```

### Test Suite: Connection Validation

#### Test: ConnectionManager prevents duplicate connections
```typescript
test('ConnectionManager prevents duplicate connections', () => {
    const mockOnConnectionCreate = jest.fn();
    const existingConnections: ConnectionDefinition[] = [
        {
            id: 'conn-1',
            sourceNodeId: 'node-1',
            sourcePortId: 'output-1',
            targetNodeId: 'node-2',
            targetPortId: 'input-1'
        }
    ];
    
    const mockNodes = createMockNodes(['node-1', 'node-2']);
    
    render(
        <ConnectionManager
            connections={existingConnections}
            nodes={mockNodes}
            onUpdateConnection={jest.fn()}
            onDeleteConnection={jest.fn()}
            onConnectionCreate={mockOnConnectionCreate}
        />
    );
    
    // Try to create duplicate connection
    const source = { nodeId: 'node-1', portId: 'output-1' };
    const target = { nodeId: 'node-2', portId: 'input-1' };
    
    // ConnectionManager should validate and reject duplicate
    expect(mockOnConnectionCreate).not.toHaveBeenCalled();
});
```

---

## Port Component

### Test Suite: Port Rendering

**File**: `src/components/node-editor/connections/Port.test.tsx`

#### Test: Port renders with correct styling for input port
```typescript
test('Port renders with correct styling for input port', () => {
    const mockPort: PortDefinition = {
        id: 'input-1',
        label: 'Value',
        dataType: 'number',
        required: true
    };
    
    render(
        <Port
            nodeId='node-1'
            port={mockPort}
            type='input'
            position={{ x: 0, y: 20 }}
            onConnectStart={jest.fn()}
            onConnectEnd={jest.fn()}
        />
    );
    
    const portElement = screen.getByLabelText('Value input port');
    expect(portElement).toHaveClass('port-input');
});
```

#### Test: Port renders with correct styling for output port
```typescript
test('Port renders with correct styling for output port', () => {
    const mockPort: PortDefinition = {
        id: 'output-1',
        label: 'Progress',
        dataType: 'progressData',
        required: true
    };
    
    render(
        <Port
            nodeId='node-1'
            port={mockPort}
            type='output'
            position={{ x: 200, y: 20 }}
            onConnectStart={jest.fn()}
            onConnectEnd={jest.fn()}
        />
    );
    
    const portElement = screen.getByLabelText('Progress output port');
    expect(portElement).toHaveClass('port-output');
});
```

#### Test: Port shows required indicator for required ports
```typescript
test('Port shows required indicator for required ports', () => {
    const mockPort: PortDefinition = {
        id: 'input-1',
        label: 'Value',
        dataType: 'number',
        required: true
    };
    
    render(
        <Port
            nodeId='node-1'
            port={mockPort}
            type='input'
            position={{ x: 0, y: 20 }}
            onConnectStart={jest.fn()}
            onConnectEnd={jest.fn()}
        />
    );
    
    expect(screen.getByLabelText('Required port')).toBeInTheDocument();
});
```

#### Test: Port does not show required indicator for optional ports
```typescript
test('Port does not show required indicator for optional ports', () => {
    const mockPort: PortDefinition = {
        id: 'input-1',
        label: 'Value',
        dataType: 'number',
        required: false
    };
    
    render(
        <Port
            nodeId='node-1'
            port={mockPort}
            type='input'
            position={{ x: 0, y: 20 }}
            onConnectStart={jest.fn()}
            onConnectEnd={jest.fn()}
        />
    );
    
    expect(screen.queryByLabelText('Required port')).not.toBeInTheDocument();
});
```

### Test Suite: Port Interaction

#### Test: Port calls onConnectStart when clicked
```typescript
test('Port calls onConnectStart when clicked', () => {
    const mockOnConnectStart = jest.fn();
    const mockPort: PortDefinition = {
        id: 'input-1',
        label: 'Value',
        dataType: 'number',
        required: true
    };
    
    render(
        <Port
            nodeId='node-1'
            port={mockPort}
            type='input'
            position={{ x: 0, y: 20 }}
            onConnectStart={mockOnConnectStart}
            onConnectEnd={jest.fn()}
        />
    );
    
    const portElement = screen.getByLabelText('Value input port');
    fireEvent.mouseDown(portElement);
    
    expect(mockOnConnectStart).toHaveBeenCalledWith('input-1');
});
```

#### Test: Port shows tooltip on hover
```typescript
test('Port shows tooltip on hover', () => {
    const mockPort: PortDefinition = {
        id: 'input-1',
        label: 'Value',
        dataType: 'number',
        required: true
    };
    
    render(
        <Port
            nodeId='node-1'
            port={mockPort}
            type='input'
            position={{ x: 0, y: 20 }}
            onConnectStart={jest.fn()}
            onConnectEnd={jest.fn()}
        />
    );
    
    const portElement = screen.getByLabelText('Value input port');
    fireEvent.mouseEnter(portElement);
    
    expect(screen.getByText('Value (number)')).toBeInTheDocument();
});
```

---

## NodeCanvas Component

### Test Suite: Canvas Rendering

**File**: `src/components/node-editor/NodeCanvas.test.tsx`

#### Test: NodeCanvas renders all nodes
```typescript
test('NodeCanvas renders all nodes', () => {
    const mockNodes: NodeDefinition[] = [
        createMockNode('node-1', 'progress', { x: 100, y: 100 }),
        createMockNode('node-2', 'dataInput', { x: 300, y: 200 })
    ];
    
    render(
        <NodeCanvas
            nodes={mockNodes}
            connections={[]}
            selectedNode={null}
            onSelectNode={jest.fn()}
            onUpdateNode={jest.fn()}
            onDeleteNode={jest.fn()}
            onAddConnection={jest.fn()}
            onDeleteConnection={jest.fn()}
        />
    );
    
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Data Input')).toBeInTheDocument();
});
```

#### Test: NodeCanvas applies selected styling to selected node
```typescript
test('NodeCanvas applies selected styling to selected node', () => {
    const mockNodes = [createMockNode('node-1', 'progress', { x: 100, y: 100 })];
    
    const { container } = render(
        <NodeCanvas
            nodes={mockNodes}
            connections={[]}
            selectedNode='node-1'
            onSelectNode={jest.fn()}
            onUpdateNode={jest.fn()}
            onDeleteNode={jest.fn()}
            onAddConnection={jest.fn()}
            onDeleteConnection={jest.fn()}
        />
    );
    
    const nodeElement = container.querySelector('[data-node-id="node-1"]');
    expect(nodeElement).toHaveClass('nodeSelected');
});
```

#### Test: NodeCanvas renders connections
```typescript
test('NodeCanvas renders connections', () => {
    const mockNodes = createMockNodes(['node-1', 'node-2']);
    const mockConnections: ConnectionDefinition[] = [
        {
            id: 'conn-1',
            sourceNodeId: 'node-1',
            sourcePortId: 'output-1',
            targetNodeId: 'node-2',
            targetPortId: 'input-1'
        }
    ];
    
    render(
        <NodeCanvas
            nodes={mockNodes}
            connections={mockConnections}
            selectedNode={null}
            onSelectNode={jest.fn()}
            onUpdateNode={jest.fn()}
            onDeleteNode={jest.fn()}
            onAddConnection={jest.fn()}
            onDeleteConnection={jest.fn()}
        />
    );
    
    expect(screen.getByTestId('connection-line')).toBeInTheDocument();
});
```

### Test Suite: Canvas Interaction

#### Test: NodeCanvas deselects node when clicking empty space
```typescript
test('NodeCanvas deselects node when clicking empty space', () => {
    const mockOnSelectNode = jest.fn();
    const mockNodes = [createMockNode('node-1', 'progress', { x: 100, y: 100 })];
    
    render(
        <NodeCanvas
            nodes={mockNodes}
            connections={[]}
            selectedNode='node-1'
            onSelectNode={mockOnSelectNode}
            onUpdateNode={jest.fn()}
            onDeleteNode={jest.fn()}
            onAddConnection={jest.fn()}
            onDeleteConnection={jest.fn()}
        />
    );
    
    const canvas = screen.getByTestId('node-canvas');
    fireEvent.click(canvas);
    
    expect(mockOnSelectNode).toHaveBeenCalledWith(null);
});
```

#### Test: NodeCanvas handles keyboard shortcuts
```typescript
test('NodeCanvas handles keyboard shortcuts', () => {
    const mockOnDeleteNode = jest.fn();
    const mockNodes = [createMockNode('node-1', 'progress', { x: 100, y: 100 })];
    
    render(
        <NodeCanvas
            nodes={mockNodes}
            connections={[]}
            selectedNode='node-1'
            onSelectNode={jest.fn()}
            onUpdateNode={jest.fn()}
            onDeleteNode={mockOnDeleteNode}
            onAddConnection={jest.fn()}
            onDeleteConnection={jest.fn()}
        />
    );
    
    // Press Delete key
    fireEvent.keyDown(document, { key: 'Delete' });
    
    expect(mockOnDeleteNode).toHaveBeenCalledWith('node-1');
});
```

---

## ConnectionLine Component

### Test Suite: Path Calculation

**File**: `src/components/node-editor/connections/ConnectionLine.test.tsx`

#### Test: ConnectionLine calculates bezier curve path correctly
```typescript
test('ConnectionLine calculates bezier curve path correctly', () => {
    const sourcePos = { x: 200, y: 100 };
    const targetPos = { x: 400, y: 200 };
    
    const { container } = render(
        <ConnectionLine
            sourcePosition={sourcePos}
            targetPosition={targetPos}
            type='bezier'
            color='#6366f1'
            width={2}
        />
    );
    
    const path = container.querySelector('path');
    const dAttribute = path?.getAttribute('d');
    
    expect(dAttribute).toContain('M'); // Move command
    expect(dAttribute).toContain('C'); // Bezier curve command
});
```

#### Test: ConnectionLine calculates straight line path correctly
```typescript
test('ConnectionLine calculates straight line path correctly', () => {
    const sourcePos = { x: 200, y: 100 };
    const targetPos = { x: 400, y: 200 };
    
    const { container } = render(
        <ConnectionLine
            sourcePosition={sourcePos}
            targetPosition={targetPos}
            type='straight'
            color='#6366f1'
            width={2}
        />
    );
    
    const path = container.querySelector('path');
    const dAttribute = path?.getAttribute('d');
    
    expect(dAttribute).toContain('M'); // Move command
    expect(dAttribute).toContain('L'); // Line command
    expect(dAttribute).not.toContain('C'); // No bezier curve
});
```

#### Test: ConnectionLine applies custom color
```typescript
test('ConnectionLine applies custom color', () => {
    const { container } = render(
        <ConnectionLine
            sourcePosition={{ x: 200, y: 100 }}
            targetPosition={{ x: 400, y: 200 }}
            type='bezier'
            color='#ef4444'
            width={2}
        />
    );
    
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('stroke', '#ef4444');
});
```

#### Test: ConnectionLine applies custom width
```typescript
test('ConnectionLine applies custom width', () => {
    const { container } = render(
        <ConnectionLine
            sourcePosition={{ x: 200, y: 100 }}
            targetPosition={{ x: 400, y: 200 }}
            type='bezier'
            color='#6366f1'
            width={4}
        />
    );
    
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('stroke-width', '4');
});
```

---

## Helper Functions

```typescript
// Test helper functions
function createMockNodes(ids: string[]): NodeDefinition[] {
    return ids.map((id, index) => ({
        id,
        type: 'progress',
        position: { x: 100 + index * 200, y: 100 + index * 100 },
        data: { label: `Node ${id}` },
        inputs: [{ id: 'input-1', label: 'Input', dataType: 'any', required: true }],
        outputs: [{ id: 'output-1', label: 'Output', dataType: 'any', required: true }],
        config: NODE_REGISTRY.progress
    }));
}

function createMockNode(id: string, type: NodeType, position: { x: number; y: number }): NodeDefinition {
    return {
        id,
        type,
        position,
        data: { label: `Node ${id}` },
        inputs: [],
        outputs: [],
        config: NODE_REGISTRY[type]
    };
}

function createMockConnection(id: string, sourceId: string, targetId: string): ConnectionDefinition {
    return {
        id,
        sourceNodeId: sourceId,
        sourcePortId: 'output-1',
        targetNodeId: targetId,
        targetPortId: 'input-1',
        style: { type: 'bezier', color: '#6366f1', width: 2, animated: false }
    };
}
```
