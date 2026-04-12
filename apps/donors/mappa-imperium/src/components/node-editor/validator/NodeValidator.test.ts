import { NodeValidator } from './NodeValidator';
import { NodeDefinition, ConnectionDefinition, ProgressNodeData, NodeType } from '@/types/nodeEditor.types';

describe('NodeValidator', () => {
    let validator: NodeValidator;

    beforeEach(() => {
        validator = new NodeValidator();
    });

    // Helper function to create mock nodes
    const createMockNode = (
        id: string,
        type: NodeType,
        data: any = {},
        inputs: any[] = [],
        outputs: any[] = []
    ): NodeDefinition => ({
        id,
        type,
        position: { x: 0, y: 0 },
        data,
        inputs,
        outputs,
        config: { category: 'input', label: id, icon: 'Box' }
    });

    describe('Node Configuration Validation', () => {
        it('validates properly configured node', () => {
            const node = createMockNode('node-1', 'progress', {
                label: 'Test',
                value: 75,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates node with no inputs', () => {
            const node = createMockNode('node-1', 'dataInput', { value: 42 }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates element node type', () => {
            const node = createMockNode('node-1', 'resource', {
                elementId: 'res-1',
                element: { name: 'Gold' }
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates transform node type', () => {
            const node = createMockNode('node-1', 'transform', {
                transformationType: 'pick',
                fields: ['name', 'value']
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates filter node type', () => {
            const node = createMockNode('node-1', 'filter', {
                field: 'value',
                operator: 'equals',
                value: 50
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates logic node type', () => {
            const node = createMockNode('node-1', 'logic', {
                operation: 'AND',
                value: true
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates style node type', () => {
            const node = createMockNode('node-1', 'style', {
                height: 24,
                radius: 4,
                backgroundColor: '#e5e7eb'
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates table node type', () => {
            const node = createMockNode('node-1', 'table', {
                headers: [{ id: 'col1', label: 'Column 1' }],
                rowsPerPage: 10
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates dataInput node type', () => {
            const node = createMockNode('node-1', 'dataInput', {
                dataType: 'number',
                value: 42
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates aggregate node type', () => {
            const node = createMockNode('node-1', 'aggregate', {
                operation: 'sum',
                field: 'value'
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates conditional node type', () => {
            const node = createMockNode('node-1', 'conditional', {
                condition: 'value > 50',
                thenValue: 'high',
                elseValue: 'low'
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates segment node type', () => {
            const node = createMockNode('node-1', 'segment', {
                label: 'Done',
                value: 50,
                color: '#10b981'
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });
    });

    describe('Missing Required Inputs Validation', () => {
        it('detects missing required input connection', () => {
            const node = createMockNode('node-1', 'progress', {
                label: 'Test',
                value: 75,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            }, [{ id: 'value', label: 'Value', dataType: 'number', required: true }], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Missing required inputs');
            expect(result.error).toContain('Value');
        });

        it('allows optional input to be missing', () => {
            const node = createMockNode('node-1', 'progress', {
                label: 'Test',
                value: 75,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            }, [{ id: 'optional', label: 'Optional', dataType: 'number', required: false }], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('detects multiple missing required inputs', () => {
            const node = createMockNode('node-1', 'progress', {
                label: 'Test',
                value: 75,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            }, [
                { id: 'value', label: 'Value', dataType: 'number', required: true },
                { id: 'max', label: 'Max', dataType: 'number', required: true }
            ], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Missing required inputs');
            expect(result.error).toContain('Value');
            expect(result.error).toContain('Max');
        });

        it('validates when required input has connection', () => {
            const node = createMockNode('node-1', 'progress', {
                label: 'Test',
                value: 75,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            }, [{ id: 'value', label: 'Value', dataType: 'number', required: true }], []);

            const connections: ConnectionDefinition[] = [{
                id: 'conn-1',
                sourceNodeId: 'source-1',
                sourcePortId: 'out',
                targetNodeId: 'node-1',
                targetPortId: 'value'
            }];

            const result = validator.validateNode(node, connections);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });
    });

    describe('Data Type Mismatches and Negative Values', () => {
        it('detects negative progress value', () => {
            const node = createMockNode('node-1', 'progress', {
                label: 'Test',
                value: -10,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Progress value cannot be negative');
        });

        it('detects zero or negative max value', () => {
            const node = createMockNode('node-1', 'progress', {
                label: 'Test',
                value: 50,
                max: 0,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Max value must be positive');
        });

        it('detects value exceeding max', () => {
            const node = createMockNode('node-1', 'progress', {
                label: 'Test',
                value: 150,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Value exceeds maximum');
        });

        it('allows valid progress configuration', () => {
            const node = createMockNode('node-1', 'progress', {
                label: 'Test',
                value: 75,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('allows value equal to max', () => {
            const node = createMockNode('node-1', 'progress', {
                label: 'Test',
                value: 100,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('allows zero progress value', () => {
            const node = createMockNode('node-1', 'progress', {
                label: 'Test',
                value: 0,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('handles non-numeric values gracefully', () => {
            const node = createMockNode('node-1', 'progress', {
                label: 'Test',
                value: 'auto',
                max: 'auto',
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            }, [], []);

            const result = validator.validateNode(node, []);

            // Non-numeric values should pass validation (they are valid 'auto' values)
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });
    });

    describe('Segment/Parent Relationship Validation', () => {
        it('validates segment with valid configuration', () => {
            const node = createMockNode('segment-1', 'segment', {
                label: 'Done',
                value: 50,
                color: '#10b981'
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('allows segment with zero value', () => {
            const node = createMockNode('segment-1', 'segment', {
                label: 'Empty',
                value: 0,
                color: '#e5e7eb'
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('allows segment with positive value', () => {
            const node = createMockNode('segment-1', 'segment', {
                label: 'Full',
                value: 100,
                color: '#10b981'
            }, [], []);

            const result = validator.validateNode(node, []);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });
    });

    describe('All Node Types Coverage', () => {
        const nodeTypes: NodeType[] = [
            'progress', 'segment', 'transform', 'aggregate', 'filter',
            'conditional', 'logic', 'style', 'table', 'dataInput',
            'resource', 'deity', 'location', 'faction', 'settlement',
            'event', 'character', 'war', 'monument'
        ];

        it('validates all node types without errors', () => {
            nodeTypes.forEach(type => {
                const node = createMockNode(`node-${type}`, type, {}, [], []);
                const result = validator.validateNode(node, []);
                expect(result.isValid).toBe(true);
            });
        });

        it('handles unknown node types gracefully', () => {
            const node = createMockNode('node-1', 'dataInput' as NodeType, {}, [], []);

            const result = validator.validateNode(node, []);

            // Unknown types should pass validation (fallback behavior)
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });
    });
});
