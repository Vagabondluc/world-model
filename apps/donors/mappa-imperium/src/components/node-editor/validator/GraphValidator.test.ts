import { GraphValidator } from './GraphValidator';
import { NodeDefinition, ConnectionDefinition } from '@/types/nodeEditor.types';

describe('GraphValidator', () => {
    let validator: GraphValidator;

    beforeEach(() => {
        validator = new GraphValidator();
    });

    describe('Disconnected Nodes', () => {
        it('detects nodes with no connections', () => {
            const nodes: NodeDefinition[] = [
                {
                    id: 'node-1',
                    type: 'dataInput',
                    position: { x: 0, y: 0 },
                    data: {},
                    inputs: [{ id: 'in', label: 'Input', type: 'any' }],
                    outputs: [{ id: 'out', label: 'Output', type: 'any' }]
                },
                {
                    id: 'node-2',
                    type: 'dataInput',
                    position: { x: 200, y: 0 },
                    data: {},
                    inputs: [],
                    outputs: []
                }
            ];

            const errors = validator.validateGraph(nodes, []);

            expect(errors.length).toBeGreaterThan(0);
            expect(errors.some(e => e.type === 'warning')).toBe(true);
        });

        it('allows element nodes to be disconnected', () => {
            const nodes: NodeDefinition[] = [
                {
                    id: 'res-1',
                    type: 'resource',
                    position: { x: 0, y: 0 },
                    data: { label: 'Gold', element: {} },
                    inputs: [],
                    outputs: []
                }
            ];

            const errors = validator.validateGraph(nodes, []);

            // Element nodes can be standalone
            const criticalErrors = errors.filter(e => e.type === 'error');
            expect(criticalErrors.length).toBe(0);
        });
    });

    describe('Cycle Detection', () => {
        it('detects simple cycles', () => {
            const nodes: NodeDefinition[] = [
                {
                    id: 'a',
                    type: 'dataInput',
                    position: { x: 0, y: 0 },
                    data: {},
                    inputs: [{ id: 'in', label: 'In', type: 'any' }],
                    outputs: [{ id: 'out', label: 'Out', type: 'any' }]
                },
                {
                    id: 'b',
                    type: 'dataInput',
                    position: { x: 100, y: 0 },
                    data: {},
                    inputs: [{ id: 'in', label: 'In', type: 'any' }],
                    outputs: [{ id: 'out', label: 'Out', type: 'any' }]
                }
            ];

            const connections: ConnectionDefinition[] = [
                { id: 'c1', sourceNodeId: 'a', sourcePortId: 'out', targetNodeId: 'b', targetPortId: 'in' },
                { id: 'c2', sourceNodeId: 'b', sourcePortId: 'out', targetNodeId: 'a', targetPortId: 'in' }
            ];

            const errors = validator.validateGraph(nodes, connections);

            expect(errors.some(e => e.message.toLowerCase().includes('cycle'))).toBe(true);
        });

        it('detects complex cycles', () => {
            const nodes: NodeDefinition[] = [
                { id: 'a', type: 'dataInput', position: { x: 0, y: 0 }, data: {}, inputs: [{ id: 'in', label: 'In', type: 'any' }], outputs: [{ id: 'out', label: 'Out', type: 'any' }] },
                { id: 'b', type: 'dataInput', position: { x: 100, y: 0 }, data: {}, inputs: [{ id: 'in', label: 'In', type: 'any' }], outputs: [{ id: 'out', label: 'Out', type: 'any' }] },
                { id: 'c', type: 'dataInput', position: { x: 200, y: 0 }, data: {}, inputs: [{ id: 'in', label: 'In', type: 'any' }], outputs: [{ id: 'out', label: 'Out', type: 'any' }] }
            ];

            const connections: ConnectionDefinition[] = [
                { id: 'c1', sourceNodeId: 'a', sourcePortId: 'out', targetNodeId: 'b', targetPortId: 'in' },
                { id: 'c2', sourceNodeId: 'b', sourcePortId: 'out', targetNodeId: 'c', targetPortId: 'in' },
                { id: 'c3', sourceNodeId: 'c', sourcePortId: 'out', targetNodeId: 'a', targetPortId: 'in' }
            ];

            const errors = validator.validateGraph(nodes, connections);

            expect(errors.some(e => e.message.toLowerCase().includes('cycle'))).toBe(true);
        });
    });

    describe('Port Compatibility', () => {
        it('validates type compatibility', () => {
            const nodes: NodeDefinition[] = [
                {
                    id: 'num-source',
                    type: 'dataInput',
                    position: { x: 0, y: 0 },
                    data: {},
                    inputs: [],
                    outputs: [{ id: 'out', label: 'Number', type: 'number' }]
                },
                {
                    id: 'str-target',
                    type: 'dataInput',
                    position: { x: 200, y: 0 },
                    data: {},
                    inputs: [{ id: 'in', label: 'String', type: 'string' }],
                    outputs: []
                }
            ];

            const connections: ConnectionDefinition[] = [
                {
                    id: 'mismatch',
                    sourceNodeId: 'num-source',
                    sourcePortId: 'out',
                    targetNodeId: 'str-target',
                    targetPortId: 'in'
                }
            ];

            const errors = validator.validateGraph(nodes, connections);

            // Should warn about type mismatch
            expect(errors.some(e => e.message.toLowerCase().includes('type'))).toBe(true);
        });

        it('allows any type to connect to any', () => {
            const nodes: NodeDefinition[] = [
                {
                    id: 'source',
                    type: 'dataInput',
                    position: { x: 0, y: 0 },
                    data: {},
                    inputs: [],
                    outputs: [{ id: 'out', label: 'Data', type: 'number' }]
                },
                {
                    id: 'target',
                    type: 'dataInput',
                    position: { x: 200, y: 0 },
                    data: {},
                    inputs: [{ id: 'in', label: 'Any', type: 'any' }],
                    outputs: []
                }
            ];

            const connections: ConnectionDefinition[] = [
                {
                    id: 'valid',
                    sourceNodeId: 'source',
                    sourcePortId: 'out',
                    targetNodeId: 'target',
                    targetPortId: 'in'
                }
            ];

            const errors = validator.validateGraph(nodes, connections);

            // Should not error on any type
            const typeErrors = errors.filter(e => e.message.toLowerCase().includes('type'));
            expect(typeErrors.length).toBe(0);
        });
    });

    describe('Empty Graph', () => {
        it('handles empty graph without errors', () => {
            const errors = validator.validateGraph([], []);
            expect(errors.length).toBe(0);
        });
    });

    describe('Full Graph Validation', () => {
        it('validates complete graph with all nodes connected', () => {
            const nodes = [
                {
                    id: 'source-1',
                    type: 'dataInput',
                    position: { x: 0, y: 0 },
                    data: { value: 42 },
                    inputs: [],
                    outputs: [{ id: 'out', label: 'Output', type: 'number' }]
                },
                {
                    id: 'target-1',
                    type: 'progress',
                    position: { x: 200, y: 0 },
                    data: { label: 'Test', value: 75, max: 100, style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' }, showPercentage: true, showLabel: true },
                    inputs: [{ id: 'value', label: 'Value', type: 'number', required: false }],
                    outputs: []
                }
            ];

            const connections = [
                { id: 'conn-1', sourceNodeId: 'source-1', sourcePortId: 'out', targetNodeId: 'target-1', targetPortId: 'value' }
            ];

            const errors = validator.validateGraph(nodes, connections);

            const criticalErrors = errors.filter(e => e.type === 'error' || e.severity === 'error');
            expect(criticalErrors.length).toBe(0);
        });

        it('validates graph with multiple disconnected components', () => {
            const nodes = [
                {
                    id: 'comp1-1',
                    type: 'dataInput',
                    position: { x: 0, y: 0 },
                    data: { value: 10 },
                    inputs: [],
                    outputs: [{ id: 'out', label: 'Output', type: 'number' }]
                },
                {
                    id: 'comp1-2',
                    type: 'dataInput',
                    position: { x: 100, y: 0 },
                    data: { value: 20 },
                    inputs: [{ id: 'in', label: 'Input', type: 'number', required: false }],
                    outputs: []
                },
                {
                    id: 'comp2-1',
                    type: 'dataInput',
                    position: { x: 300, y: 0 },
                    data: { value: 30 },
                    inputs: [],
                    outputs: [{ id: 'out', label: 'Output', type: 'number' }]
                },
                {
                    id: 'comp2-2',
                    type: 'dataInput',
                    position: { x: 400, y: 0 },
                    data: { value: 40 },
                    inputs: [{ id: 'in', label: 'Input', type: 'number', required: false }],
                    outputs: []
                }
            ];

            const connections = [
                { id: 'conn-1', sourceNodeId: 'comp1-1', sourcePortId: 'out', targetNodeId: 'comp1-2', targetPortId: 'in' },
                { id: 'conn-2', sourceNodeId: 'comp2-1', sourcePortId: 'out', targetNodeId: 'comp2-2', targetPortId: 'in' }
            ];

            const errors = validator.validateGraph(nodes, connections);

            const criticalErrors = errors.filter(e => e.type === 'error' || e.severity === 'error');
            expect(criticalErrors.length).toBe(0);
        });
    });

    describe('Orphaned Node Detection', () => {
        it('detects orphaned nodes with inputs but no connections', () => {
            const nodes = [
                {
                    id: 'orphan',
                    type: 'dataInput',
                    position: { x: 0, y: 0 },
                    data: { value: 42 },
                    inputs: [{ id: 'in', label: 'Input', type: 'number', required: false }],
                    outputs: []
                }
            ];

            const errors = validator.validateGraph(nodes, []);

            expect(errors.some(e => e.type === 'warning')).toBe(true);
            expect(errors.some(e => e.message.includes('no connections'))).toBe(true);
        });

        it('does not warn about orphaned element nodes', () => {
            const nodes = [
                {
                    id: 'res-1',
                    type: 'resource',
                    position: { x: 0, y: 0 },
                    data: { label: 'Gold', element: {} },
                    inputs: [],
                    outputs: []
                }
            ];

            const errors = validator.validateGraph(nodes, []);

            const criticalErrors = errors.filter(e => e.type === 'error' || e.severity === 'error');
            expect(criticalErrors.length).toBe(0);
        });

        it('detects multiple orphaned nodes', () => {
            const nodes = [
                {
                    id: 'orphan-1',
                    type: 'dataInput',
                    position: { x: 0, y: 0 },
                    data: { value: 10 },
                    inputs: [{ id: 'in', label: 'Input', type: 'number', required: false }],
                    outputs: []
                },
                {
                    id: 'orphan-2',
                    type: 'dataInput',
                    position: { x: 100, y: 0 },
                    data: { value: 20 },
                    inputs: [{ id: 'in', label: 'Input', type: 'number', required: false }],
                    outputs: []
                }
            ];

            const errors = validator.validateGraph(nodes, []);

            const orphanWarnings = errors.filter(e => e.message.includes('no connections'));
            expect(orphanWarnings.length).toBe(2);
        });
    });

    describe('Complex Cycle Detection', () => {
        it('detects cycle with intermediate nodes', () => {
            const nodes = [
                { id: 'a', type: 'dataInput', position: { x: 0, y: 0 }, data: {}, inputs: [{ id: 'in', label: 'In', type: 'any' }], outputs: [{ id: 'out', label: 'Out', type: 'any' }] },
                { id: 'b', type: 'dataInput', position: { x: 100, y: 0 }, data: {}, inputs: [{ id: 'in', label: 'In', type: 'any' }], outputs: [{ id: 'out', label: 'Out', type: 'any' }] },
                { id: 'c', type: 'dataInput', position: { x: 200, y: 0 }, data: {}, inputs: [{ id: 'in', label: 'In', type: 'any' }], outputs: [{ id: 'out', label: 'Out', type: 'any' }] },
                { id: 'd', type: 'dataInput', position: { x: 300, y: 0 }, data: {}, inputs: [{ id: 'in', label: 'In', type: 'any' }], outputs: [{ id: 'out', label: 'Out', type: 'any' }] }
            ];

            const connections = [
                { id: 'c1', sourceNodeId: 'a', sourcePortId: 'out', targetNodeId: 'b', targetPortId: 'in' },
                { id: 'c2', sourceNodeId: 'b', sourcePortId: 'out', targetNodeId: 'c', targetPortId: 'in' },
                { id: 'c3', sourceNodeId: 'c', sourcePortId: 'out', targetNodeId: 'd', targetPortId: 'in' },
                { id: 'c4', sourceNodeId: 'd', sourcePortId: 'out', targetNodeId: 'a', targetPortId: 'in' }
            ];

            const errors = validator.validateGraph(nodes, connections);

            expect(errors.some(e => e.message.toLowerCase().includes('cycle'))).toBe(true);
        });

        it('detects cycle with branching paths', () => {
            const nodes = [
                { id: 'a', type: 'dataInput', position: { x: 0, y: 0 }, data: {}, inputs: [{ id: 'in', label: 'In', type: 'any' }], outputs: [{ id: 'out', label: 'Out', type: 'any' }] },
                { id: 'b', type: 'dataInput', position: { x: 100, y: 0 }, data: {}, inputs: [{ id: 'in', label: 'In', type: 'any' }], outputs: [{ id: 'out', label: 'Out', type: 'any' }] },
                { id: 'c', type: 'dataInput', position: { x: 200, y: 0 }, data: {}, inputs: [{ id: 'in', label: 'In', type: 'any' }], outputs: [{ id: 'out', label: 'Out', type: 'any' }] },
                { id: 'd', type: 'dataInput', position: { x: 300, y: 0 }, data: {}, inputs: [{ id: 'in', label: 'In', type: 'any' }], outputs: [{ id: 'out', label: 'Out', type: 'any' }] }
            ];

            const connections = [
                { id: 'c1', sourceNodeId: 'a', sourcePortId: 'out', targetNodeId: 'b', targetPortId: 'in' },
                { id: 'c2', sourceNodeId: 'a', sourcePortId: 'out', targetNodeId: 'c', targetPortId: 'in' },
                { id: 'c3', sourceNodeId: 'b', sourcePortId: 'out', targetNodeId: 'd', targetPortId: 'in' },
                { id: 'c4', sourceNodeId: 'c', sourcePortId: 'out', targetNodeId: 'd', targetPortId: 'in' },
                { id: 'c5', sourceNodeId: 'd', sourcePortId: 'out', targetNodeId: 'a', targetPortId: 'in' }
            ];

            const errors = validator.validateGraph(nodes, connections);

            expect(errors.some(e => e.message.toLowerCase().includes('cycle'))).toBe(true);
        });
    });

    describe('Invalid Node Configuration in Graph Context', () => {
        it('detects invalid node configuration in graph', () => {
            const nodes = [
                {
                    id: 'invalid-progress',
                    type: 'progress',
                    position: { x: 0, y: 0 },
                    data: { label: 'Test', value: -10, max: 100, style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' }, showPercentage: true, showLabel: true },
                    inputs: [],
                    outputs: []
                }
            ];

            const errors = validator.validateGraph(nodes, []);

            expect(errors.some(e => e.type === 'node')).toBe(true);
            expect(errors.some(e => e.id === 'invalid-progress')).toBe(true);
        });

        it('detects multiple invalid nodes in graph', () => {
            const nodes = [
                {
                    id: 'invalid-1',
                    type: 'progress',
                    position: { x: 0, y: 0 },
                    data: { label: 'Test', value: -10, max: 100, style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' }, showPercentage: true, showLabel: true },
                    inputs: [],
                    outputs: []
                },
                {
                    id: 'invalid-2',
                    type: 'progress',
                    position: { x: 100, y: 0 },
                    data: { label: 'Test', value: 150, max: 100, style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' }, showPercentage: true, showLabel: true },
                    inputs: [],
                    outputs: []
                }
            ];

            const errors = validator.validateGraph(nodes, []);

            const nodeErrors = errors.filter(e => e.type === 'node');
            expect(nodeErrors.length).toBe(2);
        });
    });
});
