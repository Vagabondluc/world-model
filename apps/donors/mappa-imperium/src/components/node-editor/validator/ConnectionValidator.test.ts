import { ConnectionValidator } from './ConnectionValidator';
import { NodeDefinition, ConnectionDefinition, NodeType, PortDataType } from '@/types/nodeEditor.types';

describe('ConnectionValidator', () => {
    let validator: ConnectionValidator;

    beforeEach(() => {
        validator = new ConnectionValidator();
    });

    // Helper function to create mock nodes
    const createMockNode = (
        id: string,
        type: NodeType,
        inputs: any[] = [],
        outputs: any[] = []
    ): NodeDefinition => ({
        id,
        type,
        position: { x: 0, y: 0 },
        data: {},
        inputs,
        outputs,
        config: { category: 'input', label: id, icon: 'Box' }
    });

    // Helper function to create mock connection
    const createMockConnection = (
        id: string,
        sourceNodeId: string,
        sourcePortId: string,
        targetNodeId: string,
        targetPortId: string
    ): ConnectionDefinition => ({
        id,
        sourceNodeId,
        sourcePortId,
        targetNodeId,
        targetPortId
    });

    describe('Connection Validation - Node Existence', () => {
        it('validates connection with existing source and target nodes', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('target-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('detects missing source node', () => {
            const nodes = [
                createMockNode('target-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Source node not found');
        });

        it('detects missing target node', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Target node not found');
        });

        it('detects both source and target nodes missing', () => {
            const nodes: NodeDefinition[] = [];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Source node not found');
        });
    });

    describe('Connection Validation - Port Existence', () => {
        it('validates connection with existing source and target ports', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('target-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('detects missing source port', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('target-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'wrong-port', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Source port not found');
        });

        it('detects missing target port', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('target-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'wrong-port');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Target port not found');
        });

        it('detects both source and target ports missing', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('target-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'wrong-out', 'target-1', 'wrong-in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Source port not found');
        });
    });

    describe('Connection Validation - Data Type Compatibility', () => {
        it('validates matching data types', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('target-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('detects data type mismatch', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('target-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'string', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Type mismatch');
            expect(result.error).toContain('number');
            expect(result.error).toContain('string');
        });

        it('validates elementData type compatibility', () => {
            const nodes = [
                createMockNode('source-1', 'resource', [], [{ id: 'out', label: 'Output', dataType: 'elementData', required: false }]),
                createMockNode('target-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'elementData', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates progressData type compatibility', () => {
            const nodes = [
                createMockNode('source-1', 'progress', [], [{ id: 'out', label: 'Output', dataType: 'progressData', required: false }]),
                createMockNode('target-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'progressData', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates boolean type compatibility', () => {
            const nodes = [
                createMockNode('source-1', 'logic', [], [{ id: 'out', label: 'Output', dataType: 'boolean', required: false }]),
                createMockNode('target-1', 'conditional', [{ id: 'in', label: 'Input', dataType: 'boolean', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates array type compatibility', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'array', required: false }]),
                createMockNode('target-1', 'filter', [{ id: 'in', label: 'Input', dataType: 'array', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates object type compatibility', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'object', required: false }]),
                createMockNode('target-1', 'transform', [{ id: 'in', label: 'Input', dataType: 'object', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('validates tableRow type compatibility', () => {
            const nodes = [
                createMockNode('source-1', 'table', [], [{ id: 'out', label: 'Output', dataType: 'tableRow', required: false }]),
                createMockNode('target-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'tableRow', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });
    });

    describe('Connection Validation - Directionality', () => {
        it('prevents output-to-output connections', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('target-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'out');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Target port not found');
        });

        it('prevents input-to-input connections', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], []),
                createMockNode('target-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'in', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Source port not found');
        });

        it('allows output-to-input connections', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('target-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });
    });

    describe('Connection Validation - Self-Connection Prevention', () => {
        it('prevents self-connections', () => {
            const nodes = [
                createMockNode('node-1', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], [{ id: 'out', label: 'Output', dataType: 'number', required: false }])
            ];

            const connection = createMockConnection('conn-1', 'node-1', 'out', 'node-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Cannot connect a node to itself');
        });

        it('allows connections between different nodes', () => {
            const nodes = [
                createMockNode('node-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('node-2', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'node-1', 'out', 'node-2', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });
    });

    describe('Connection Validation - Multiple Connections', () => {
        it('validates multiple connections between different nodes', () => {
            const nodes = [
                createMockNode('node-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('node-2', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], []),
                createMockNode('node-3', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], [])
            ];

            const connections = [
                createMockConnection('conn-1', 'node-1', 'out', 'node-2', 'in'),
                createMockConnection('conn-2', 'node-1', 'out', 'node-3', 'in')
            ];

            connections.forEach(conn => {
                const result = validator.validateConnection(conn, nodes);
                expect(result.isValid).toBe(true);
                expect(result.error).toBeUndefined();
            });
        });

        it('validates chain of connections', () => {
            const nodes = [
                createMockNode('node-1', 'dataInput', [], [{ id: 'out', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('node-2', 'transform', [{ id: 'in', label: 'Input', dataType: 'number', required: false }], [{ id: 'out', label: 'Output', dataType: 'object', required: false }]),
                createMockNode('node-3', 'dataInput', [{ id: 'in', label: 'Input', dataType: 'object', required: false }], [])
            ];

            const connections = [
                createMockConnection('conn-1', 'node-1', 'out', 'node-2', 'in'),
                createMockConnection('conn-2', 'node-2', 'out', 'node-3', 'in')
            ];

            connections.forEach(conn => {
                const result = validator.validateConnection(conn, nodes);
                expect(result.isValid).toBe(true);
                expect(result.error).toBeUndefined();
            });
        });
    });

    describe('Connection Validation - Edge Cases', () => {
        it('handles empty nodes array', () => {
            const nodes: NodeDefinition[] = [];
            const connection = createMockConnection('conn-1', 'source-1', 'out', 'target-1', 'in');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Source node not found');
        });

        it('handles connection with empty port IDs', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: '', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('target-1', 'dataInput', [{ id: '', label: 'Input', dataType: 'number', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', '', 'target-1', '');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('handles connection with special characters in IDs', () => {
            const nodes = [
                createMockNode('source-1', 'dataInput', [], [{ id: 'out-1', label: 'Output', dataType: 'number', required: false }]),
                createMockNode('target-1', 'dataInput', [{ id: 'in-1', label: 'Input', dataType: 'number', required: false }], [])
            ];

            const connection = createMockConnection('conn-1', 'source-1', 'out-1', 'target-1', 'in-1');

            const result = validator.validateConnection(connection, nodes);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });
    });
});
