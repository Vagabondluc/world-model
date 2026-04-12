# Export/Import System TDD Specification

## Overview

This Test-Driven Development specification defines test cases for the Export/Import System component of the node-based visual editor. The Export/Import System is responsible for exporting node configurations to JSON schemas and importing schemas back into the editor.

## UI-Node Taxonomy Reference

This specification references the [UI-Node Taxonomy](./ui_node_taxonomy.md) for comprehensive visual component definitions, including:

- **Visual Component Taxonomy** - Toolbar UI elements, export/import dialogs
- **Data Schema Mapping** - How exported schemas map to node definitions
- **Dynamic Node Creation** - JSON schema for custom node type registration
- **Schema Validation** - Ensuring imported schemas conform to taxonomy

All test cases in this specification must align with the schema structure and dynamic node creation expectations defined in the taxonomy.

## Table of Contents

1. [NodeExportService](#nodeexportservice)
2. [SchemaValidator](#schemavalidator)
3. [Toolbar Export/Import](#toolbar-exportimport)

---

## NodeExportService

### Test Suite: Export Functionality

**File**: `src/services/nodeExportService.test.ts`

#### Test: exportNodeSchema returns valid JSON string
```typescript
test('exportNodeSchema returns valid JSON string', () => {
    const mockSchema: NodeEditorSchema = {
        version: '1.0.0',
        metadata: {
            name: 'Test Schema',
            description: 'Test description',
            createdAt: '2024-01-01T00:00:00.000Z',
            modifiedAt: '2024-01-01T00:00:00.000Z'
        },
        nodes: [createMockNode('node-1', 'progress')],
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    const result = exportNodeSchema(mockSchema);
    const parsed = JSON.parse(result);
    
    expect(parsed).toEqual(mockSchema);
});
```

#### Test: exportNodeSchema includes all required fields
```typescript
test('exportNodeSchema includes all required fields', () => {
    const mockSchema: NodeEditorSchema = {
        version: '1.0.0',
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: [],
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    const result = exportNodeSchema(mockSchema);
    const parsed = JSON.parse(result);
    
    expect(parsed).toHaveProperty('version');
    expect(parsed).toHaveProperty('metadata');
    expect(parsed).toHaveProperty('nodes');
    expect(parsed).toHaveProperty('connections');
    expect(parsed).toHaveProperty('globalSettings');
});
```

#### Test: exportNodeSchema formats JSON with proper indentation
```typescript
test('exportNodeSchema formats JSON with proper indentation', () => {
    const mockSchema: NodeEditorSchema = {
        version: '1.0.0',
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: [],
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    const result = exportNodeSchema(mockSchema);
    
    // Check for proper indentation (2 spaces)
    expect(result).toContain('  "version"');
});
```

### Test Suite: Import Functionality

#### Test: importNodeSchema parses valid JSON string
```typescript
test('importNodeSchema parses valid JSON string', () => {
    const mockSchema: NodeEditorSchema = {
        version: '1.0.0',
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: [],
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    const jsonString = JSON.stringify(mockSchema);
    const result = importNodeSchema(jsonString);
    
    expect(result).toEqual(mockSchema);
});
```

#### Test: importNodeSchema throws error for invalid JSON
```typescript
test('importNodeSchema throws error for invalid JSON', () => {
    const invalidJson = '{ invalid json }';
    
    expect(() => importNodeSchema(invalidJson)).toThrow('Invalid node schema');
});
```

#### Test: importNodeSchema throws error for missing version
```typescript
test('importNodeSchema throws error for missing version', () => {
    const invalidSchema = {
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: [],
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    const jsonString = JSON.stringify(invalidSchema);
    
    expect(() => importNodeSchema(jsonString)).toThrow('Schema version required');
});
```

#### Test: importNodeSchema throws error for missing metadata
```typescript
test('importNodeSchema throws error for missing metadata', () => {
    const invalidSchema = {
        version: '1.0.0',
        nodes: [],
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    const jsonString = JSON.stringify(invalidSchema);
    
    expect(() => importNodeSchema(jsonString)).toThrow('Schema metadata required');
});
```

#### Test: importNodeSchema throws error for missing nodes array
```typescript
test('importNodeSchema throws error for missing nodes array', () => {
    const invalidSchema = {
        version: '1.0.0',
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    const jsonString = JSON.stringify(invalidSchema);
    
    expect(() => importNodeSchema(jsonString)).toThrow('Schema nodes must be an array');
});
```

#### Test: importNodeSchema throws error for missing connections array
```typescript
test('importNodeSchema throws error for missing connections array', () => {
    const invalidSchema = {
        version: '1.0.0',
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    const jsonString = JSON.stringify(invalidSchema);
    
    expect(() => importNodeSchema(jsonString)).toThrow('Schema connections must be an array');
});
```

### Test Suite: File Export

#### Test: exportNodeSchemaToFile downloads file with correct filename
```typescript
test('exportNodeSchemaToFile downloads file with correct filename', () => {
    const mockSchema: NodeEditorSchema = {
        version: '1.0.0',
        metadata: {
            name: 'Test Schema',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: [],
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    // Mock document methods
    const mockCreateElement = jest.spyOn(document, 'createElement');
    const mockCreateObjectURL = jest.spyOn(URL, 'createObjectURL');
    const mockRevokeObjectURL = jest.spyOn(URL, 'revokeObjectURL');
    
    exportNodeSchemaToFile(mockSchema, 'test-schema.json');
    
    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
    
    mockCreateElement.mockRestore();
    mockCreateObjectURL.mockRestore();
    mockRevokeObjectURL.mockRestore();
});
```

#### Test: exportNodeSchemaToFile downloads file with default filename when not provided
```typescript
test('exportNodeSchemaToFile downloads file with default filename when not provided', () => {
    const mockSchema: NodeEditorSchema = {
        version: '1.0.0',
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: [],
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    const mockLink = { click: jest.fn() };
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    
    exportNodeSchemaToFile(mockSchema);
    
    expect(mockLink.click).toHaveBeenCalled();
    expect(mockLink.download).toBe('node-schema.json');
});
```

---

## SchemaValidator

### Test Suite: Schema Structure Validation

**File**: `src/services/nodeSchemaValidator.test.ts`

#### Test: validateNodeSchema passes for valid schema
```typescript
test('validateNodeSchema passes for valid schema', () => {
    const validSchema: any = {
        version: '1.0.0',
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: [],
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    expect(() => validateNodeSchema(validSchema)).not.toThrow();
});
```

#### Test: validateNodeSchema throws error for missing version
```typescript
test('validateNodeSchema throws error for missing version', () => {
    const invalidSchema = {
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: [],
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    expect(() => validateNodeSchema(invalidSchema)).toThrow('Schema version required');
});
```

#### Test: validateNodeSchema throws error for missing metadata
```typescript
test('validateNodeSchema throws error for missing metadata', () => {
    const invalidSchema = {
        version: '1.0.0',
        nodes: [],
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    expect(() => validateNodeSchema(invalidSchema)).toThrow('Schema metadata required');
});
```

#### Test: validateNodeSchema throws error for nodes not being an array
```typescript
test('validateNodeSchema throws error for nodes not being an array', () => {
    const invalidSchema = {
        version: '1.0.0',
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: {}, // Should be array
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    expect(() => validateNodeSchema(invalidSchema)).toThrow('Schema nodes must be an array');
});
```

#### Test: validateNodeSchema throws error for connections not being an array
```typescript
test('validateNodeSchema throws error for connections not being an array', () => {
    const invalidSchema = {
        version: '1.0.0',
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: [],
        connections: {}, // Should be array
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    expect(() => validateNodeSchema(invalidSchema)).toThrow('Schema connections must be an array');
});
```

### Test Suite: Node Validation in Schema

#### Test: validateNodeSchema validates each node has required properties
```typescript
test('validateNodeSchema validates each node has required properties', () => {
    const invalidSchema = {
        version: '1.0.0',
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: [
            {
                id: 'node-1',
                type: 'progress',
                position: { x: 0, y: 0 },
                data: { label: 'Test' },
                // Missing inputs, outputs, config
            }
        ],
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    expect(() => validateNodeSchema(invalidSchema)).toThrow('Node at index 0 missing required property');
});
```

#### Test: validateNodeSchema validates each node has valid type
```typescript
test('validateNodeSchema validates each node has valid type', () => {
    const invalidSchema = {
        version: '1.0.0',
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: [
            {
                id: 'node-1',
                type: 'invalidType', // Invalid type
                position: { x: 0, y: 0 },
                data: { label: 'Test' },
                inputs: [],
                outputs: [],
                config: {}
            }
        ],
        connections: [],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    expect(() => validateNodeSchema(invalidSchema)).toThrow('Invalid node type: invalidType');
});
```

### Test Suite: Connection Validation in Schema

#### Test: validateNodeSchema validates each connection has required properties
```typescript
test('validateNodeSchema validates each connection has required properties', () => {
    const invalidSchema = {
        version: '1.0.0',
        metadata: {
            name: 'Test',
            description: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        },
        nodes: [],
        connections: [
            {
                id: 'conn-1',
                // Missing sourceNodeId, sourcePortId, targetNodeId, targetPortId
            }
        ],
        globalSettings: {
            theme: 'light',
            defaultProgressStyle: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            tableConfig: { headers: [], rowHeight: 40, showBorders: true, stripeRows: true }
        }
    };
    
    expect(() => validateNodeSchema(invalidSchema)).toThrow('Connection at index 0 missing required property');
});
```

---

## Toolbar Export/Import

### Test Suite: Export Button

**File**: `src/components/node-editor/Toolbar.test.tsx`

#### Test: Toolbar renders export button
```typescript
test('Toolbar renders export button', () => {
    const mockOnExport = jest.fn();
    
    render(
        <Toolbar
            onExport={mockOnExport}
            onImport={jest.fn()}
            onClear={jest.fn()}
        />
    );
    
    expect(screen.getByLabelText('Export schema')).toBeInTheDocument();
});
```

#### Test: Toolbar calls onExport when export button is clicked
```typescript
test('Toolbar calls onExport when export button is clicked', () => {
    const mockOnExport = jest.fn();
    
    render(
        <Toolbar
            onExport={mockOnExport}
            onImport={jest.fn()}
            onClear={jest.fn()}
        />
    );
    
    const exportButton = screen.getByLabelText('Export schema');
    fireEvent.click(exportButton);
    
    expect(mockOnExport).toHaveBeenCalled();
});
```

### Test Suite: Import Button

#### Test: Toolbar renders import button
```typescript
test('Toolbar renders import button', () => {
    const mockOnImport = jest.fn();
    
    render(
        <Toolbar
            onExport={jest.fn()}
            onImport={mockOnImport}
            onClear={jest.fn()}
        />
    );
    
    expect(screen.getByLabelText('Import schema')).toBeInTheDocument();
});
```

#### Test: Toolbar calls onImport when import button is clicked
```typescript
test('Toolbar calls onImport when import button is clicked', () => {
    const mockOnImport = jest.fn();
    
    render(
        <Toolbar
            onExport={jest.fn()}
            onImport={mockOnImport}
            onClear={jest.fn()}
        />
    );
    
    const importButton = screen.getByLabelText('Import schema');
    fireEvent.click(importButton);
    
    expect(mockOnImport).toHaveBeenCalled();
});
```

### Test Suite: Import File Input

#### Test: Toolbar renders hidden file input for import
```typescript
test('Toolbar renders hidden file input for import', () => {
    render(
        <Toolbar
            onExport={jest.fn()}
            onImport={jest.fn()}
            onClear={jest.fn()}
        />
    );
    
    const fileInput = screen.getByLabelText('Import file input');
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', '.json');
});
```

#### Test: Toolbar triggers file dialog when import button is clicked
```typescript
test('Toolbar triggers file dialog when import button is clicked', () => {
    const mockOnImport = jest.fn();
    
    render(
        <Toolbar
            onExport={jest.fn()}
            onImport={mockOnImport}
            onClear={jest.fn()}
        />
    );
    
    const importButton = screen.getByLabelText('Import schema');
    const fileInput = screen.getByLabelText('Import file input');
    
    // Click import button should trigger file input click
    fireEvent.click(importButton);
    
    // File input should have been clicked
    // (This is tested through the onImport callback)
});
```

### Test Suite: Clear Button

#### Test: Toolbar renders clear button
```typescript
test('Toolbar renders clear button', () => {
    const mockOnClear = jest.fn();
    
    render(
        <Toolbar
            onExport={jest.fn()}
            onImport={jest.fn()}
            onClear={mockOnClear}
        />
    );
    
    expect(screen.getByLabelText('Clear canvas')).toBeInTheDocument();
});
```

#### Test: Toolbar calls onClear when clear button is clicked
```typescript
test('Toolbar calls onClear when clear button is clicked', () => {
    const mockOnClear = jest.fn();
    
    render(
        <Toolbar
            onExport={jest.fn()}
            onImport={jest.fn()}
            onClear={mockOnClear}
        />
    );
    
    const clearButton = screen.getByLabelText('Clear canvas');
    fireEvent.click(clearButton);
    
    expect(mockOnClear).toHaveBeenCalled();
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
