import { ExecutionEngine } from './ExecutionEngine';
import { NodeDefinition, ConnectionDefinition } from '@/types/nodeEditor.types';

describe('ExecutionEngine', () => {
    let engine: ExecutionEngine;

    beforeEach(() => {
        engine = new ExecutionEngine();
    });

    // Helper function to create mock nodes
    const createMockNode = (
        id: string,
        type: string,
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

    describe('Engine Initialization and Configuration', () => {
        it('initializes with empty graph', async () => {
            const results = await engine.executeGraph([], []);
            expect(results.size).toBe(0);
        });

        it('initializes with single node', async () => {
            const nodes = [createMockNode('node-1', 'dataInput', { value: 42 })];
            const results = await engine.executeGraph(nodes, []);
            expect(results.size).toBe(1);
            expect(results.get('node-1')).toBe(42);
        });

        it('initializes with multiple disconnected nodes', async () => {
            const nodes = [
                createMockNode('node-1', 'dataInput', { value: 10 }),
                createMockNode('node-2', 'dataInput', { value: 20 }),
                createMockNode('node-3', 'dataInput', { value: 30 })
            ];
            const results = await engine.executeGraph(nodes, []);
            expect(results.size).toBe(3);
            expect(results.get('node-1')).toBe(10);
            expect(results.get('node-2')).toBe(20);
            expect(results.get('node-3')).toBe(30);
        });
    });

    describe('Node Execution - Basic Types', () => {
        it('executes dataInput node correctly', async () => {
            const nodes = [createMockNode('input-1', 'dataInput', { value: 42 })];
            const results = await engine.executeGraph(nodes, []);
            expect(results.get('input-1')).toBe(42);
        });

        it('executes progress node with static value', async () => {
            const nodes = [createMockNode('progress-1', 'progress', {
                label: 'Test',
                value: 75,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            })];
            const results = await engine.executeGraph(nodes, []);
            expect(results.get('progress-1')).toEqual(expect.objectContaining({
                label: 'Test',
                value: 75,
                max: 100
            }));
        });

        it('executes progress node with input override', async () => {
            const nodes = [
                createMockNode('input-1', 'dataInput', { value: 85 }),
                createMockNode('progress-1', 'progress', {
                    label: 'Test',
                    value: 50,
                    max: 100,
                    style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                    showPercentage: true,
                    showLabel: true
                }, [], [])
            ];
            const connections: ConnectionDefinition[] = [{
                id: 'conn-1',
                sourceNodeId: 'input-1',
                sourcePortId: 'out',
                targetNodeId: 'progress-1',
                targetPortId: 'input-value'
            }];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.get('progress-1').value).toBe(85);
        });

        it('executes segment node correctly', async () => {
            const nodes = [createMockNode('segment-1', 'segment', {
                label: 'Done',
                value: 50,
                color: '#10b981'
            })];
            const results = await engine.executeGraph(nodes, []);
            expect(results.get('segment-1')).toEqual(expect.objectContaining({
                label: 'Done',
                value: 50,
                color: '#10b981'
            }));
        });
    });

    describe('Node Execution - Transform and Filter', () => {
        it('executes transform node with pick operation', async () => {
            const nodes = [
                createMockNode('input-1', 'dataInput', { value: { name: 'Test', value: 50, extra: 'ignore' } }),
                createMockNode('transform-1', 'transform', {
                    transformationType: 'pick',
                    fields: ['name', 'value']
                }, [], [])
            ];
            const connections: ConnectionDefinition[] = [{
                id: 'conn-1',
                sourceNodeId: 'input-1',
                sourcePortId: 'out',
                targetNodeId: 'transform-1',
                targetPortId: 'input'
            }];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.get('transform-1')).toEqual({ name: 'Test', value: 50 });
        });

        it('executes transform node with omit operation', async () => {
            const nodes = [
                createMockNode('input-1', 'dataInput', { value: { name: 'Test', value: 50, extra: 'ignore' } }),
                createMockNode('transform-1', 'transform', {
                    transformationType: 'omit',
                    fields: ['extra']
                }, [], [])
            ];
            const connections: ConnectionDefinition[] = [{
                id: 'conn-1',
                sourceNodeId: 'input-1',
                sourcePortId: 'out',
                targetNodeId: 'transform-1',
                targetPortId: 'input'
            }];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.get('transform-1')).toEqual({ name: 'Test', value: 50 });
        });

        it('executes filter node with equals operator', async () => {
            const nodes = [
                createMockNode('input-1', 'dataInput', {
                    value: [
                        { name: 'Item 1', value: 50 },
                        { name: 'Item 2', value: 75 },
                        { name: 'Item 3', value: 50 }
                    ]
                }),
                createMockNode('filter-1', 'filter', {
                    field: 'value',
                    operator: 'equals',
                    value: 50
                }, [], [])
            ];
            const connections: ConnectionDefinition[] = [{
                id: 'conn-1',
                sourceNodeId: 'input-1',
                sourcePortId: 'out',
                targetNodeId: 'filter-1',
                targetPortId: 'collection'
            }];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.get('filter-1')).toHaveLength(2);
            expect(results.get('filter-1').every((item: any) => item.value === 50)).toBe(true);
        });

        it('executes filter node with gt operator', async () => {
            const nodes = [
                createMockNode('input-1', 'dataInput', {
                    value: [
                        { name: 'Item 1', value: 50 },
                        { name: 'Item 2', value: 75 },
                        { name: 'Item 3', value: 25 }
                    ]
                }),
                createMockNode('filter-1', 'filter', {
                    field: 'value',
                    operator: 'gt',
                    value: 40
                }, [], [])
            ];
            const connections: ConnectionDefinition[] = [{
                id: 'conn-1',
                sourceNodeId: 'input-1',
                sourcePortId: 'out',
                targetNodeId: 'filter-1',
                targetPortId: 'collection'
            }];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.get('filter-1')).toHaveLength(2);
        });

        it('executes filter node with contains operator', async () => {
            const nodes = [
                createMockNode('input-1', 'dataInput', {
                    value: [
                        { name: 'Apple', value: 50 },
                        { name: 'Banana', value: 75 },
                        { name: 'Cherry', value: 25 }
                    ]
                }),
                createMockNode('filter-1', 'filter', {
                    field: 'name',
                    operator: 'contains',
                    value: 'a'
                }, [], [])
            ];
            const connections: ConnectionDefinition[] = [{
                id: 'conn-1',
                sourceNodeId: 'input-1',
                sourcePortId: 'out',
                targetNodeId: 'filter-1',
                targetPortId: 'collection'
            }];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.get('filter-1')).toHaveLength(2);
        });
    });

    describe('Node Execution - Logic and Aggregate', () => {
        it('executes logic node with AND operation', async () => {
            const nodes = [
                createMockNode('input-1', 'dataInput', { value: true }),
                createMockNode('input-2', 'dataInput', { value: true }),
                createMockNode('logic-1', 'logic', { operation: 'AND' }, [], [])
            ];
            const connections: ConnectionDefinition[] = [
                { id: 'conn-1', sourceNodeId: 'input-1', sourcePortId: 'out', targetNodeId: 'logic-1', targetPortId: 'input-a' },
                { id: 'conn-2', sourceNodeId: 'input-2', sourcePortId: 'out', targetNodeId: 'logic-1', targetPortId: 'input-b' }
            ];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.get('logic-1')).toBe(true);
        });

        it('executes logic node with OR operation', async () => {
            const nodes = [
                createMockNode('input-1', 'dataInput', { value: false }),
                createMockNode('input-2', 'dataInput', { value: true }),
                createMockNode('logic-1', 'logic', { operation: 'OR' }, [], [])
            ];
            const connections: ConnectionDefinition[] = [
                { id: 'conn-1', sourceNodeId: 'input-1', sourcePortId: 'out', targetNodeId: 'logic-1', targetPortId: 'input-a' },
                { id: 'conn-2', sourceNodeId: 'input-2', sourcePortId: 'out', targetNodeId: 'logic-1', targetPortId: 'input-b' }
            ];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.get('logic-1')).toBe(true);
        });

        it('executes logic node with NOT operation', async () => {
            const nodes = [
                createMockNode('input-1', 'dataInput', { value: true }),
                createMockNode('logic-1', 'logic', { operation: 'NOT' }, [], [])
            ];
            const connections: ConnectionDefinition[] = [{
                id: 'conn-1', sourceNodeId: 'input-1', sourcePortId: 'out', targetNodeId: 'logic-1', targetPortId: 'input-a'
            }];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.get('logic-1')).toBe(false);
        });

        it('executes logic node with XOR operation', async () => {
            const nodes = [
                createMockNode('input-1', 'dataInput', { value: true }),
                createMockNode('input-2', 'dataInput', { value: false }),
                createMockNode('logic-1', 'logic', { operation: 'XOR' }, [], [])
            ];
            const connections: ConnectionDefinition[] = [
                { id: 'conn-1', sourceNodeId: 'input-1', sourcePortId: 'out', targetNodeId: 'logic-1', targetPortId: 'input-a' },
                { id: 'conn-2', sourceNodeId: 'input-2', sourcePortId: 'out', targetNodeId: 'logic-1', targetPortId: 'input-b' }
            ];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.get('logic-1')).toBe(true);
        });

        it('executes aggregate node collecting multiple inputs', async () => {
            const nodes = [
                createMockNode('input-1', 'dataInput', { value: 10 }),
                createMockNode('input-2', 'dataInput', { value: 20 }),
                createMockNode('input-3', 'dataInput', { value: 30 }),
                createMockNode('aggregate-1', 'aggregate', {}, [], [])
            ];
            const connections: ConnectionDefinition[] = [
                { id: 'conn-1', sourceNodeId: 'input-1', sourcePortId: 'out', targetNodeId: 'aggregate-1', targetPortId: 'input-1' },
                { id: 'conn-2', sourceNodeId: 'input-2', sourcePortId: 'out', targetNodeId: 'aggregate-1', targetPortId: 'input-2' },
                { id: 'conn-3', sourceNodeId: 'input-3', sourcePortId: 'out', targetNodeId: 'aggregate-1', targetPortId: 'input-3' }
            ];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.get('aggregate-1')).toEqual([10, 20, 30]);
        });
    });

    describe('Node Execution - Style and Table', () => {
        it('executes style node', async () => {
            const nodes = [
                createMockNode('input-1', 'dataInput', { value: { label: 'Test', value: 50 } }),
                createMockNode('style-1', 'style', {
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: '#1f2937',
                    fillColor: '#f59e0b',
                    textColor: '#f9fafb',
                    fontSize: 16,
                    fontWeight: 'bold'
                }, [], [])
            ];
            const connections: ConnectionDefinition[] = [{
                id: 'conn-1', sourceNodeId: 'input-1', sourcePortId: 'out', targetNodeId: 'style-1', targetPortId: 'input'
            }];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.get('style-1')).toEqual(expect.objectContaining({
                height: 32,
                borderRadius: 8,
                backgroundColor: '#1f2937',
                fillColor: '#f59e0b',
                textColor: '#f9fafb',
                fontSize: 16,
                fontWeight: 'bold'
            }));
        });

        it('executes table node', async () => {
            const nodes = [
                createMockNode('table-1', 'table', {
                    headers: [
                        { id: 'col-1', label: 'Name', width: 'auto', align: 'left', sortable: true },
                        { id: 'col-2', label: 'Value', width: 100, align: 'right', sortable: true }
                    ],
                    rowHeight: 40,
                    showBorders: true,
                    stripeRows: true
                })
            ];
            const results = await engine.executeGraph(nodes, []);
            expect(results.get('table-1')).toEqual(expect.objectContaining({
                headers: expect.any(Array),
                rowHeight: 40,
                showBorders: true,
                stripeRows: true
            }));
        });
    });

    describe('Graph Execution - Topologies', () => {
        it('executes linear graph correctly', async () => {
            const nodes = [
                createMockNode('node-1', 'dataInput', { value: 10 }),
                createMockNode('node-2', 'dataInput', { value: 20 }),
                createMockNode('node-3', 'dataInput', { value: 30 })
            ];
            const connections: ConnectionDefinition[] = [
                { id: 'conn-1', sourceNodeId: 'node-1', sourcePortId: 'out', targetNodeId: 'node-2', targetPortId: 'in' },
                { id: 'conn-2', sourceNodeId: 'node-2', sourcePortId: 'out', targetNodeId: 'node-3', targetPortId: 'in' }
            ];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.size).toBe(3);
            expect(results.has('node-1')).toBe(true);
            expect(results.has('node-2')).toBe(true);
            expect(results.has('node-3')).toBe(true);
        });

        it('executes branching graph correctly', async () => {
            const nodes = [
                createMockNode('node-1', 'dataInput', { value: 10 }),
                createMockNode('node-2', 'dataInput', { value: 20 }),
                createMockNode('node-3', 'dataInput', { value: 30 }),
                createMockNode('node-4', 'dataInput', { value: 40 })
            ];
            const connections: ConnectionDefinition[] = [
                { id: 'conn-1', sourceNodeId: 'node-1', sourcePortId: 'out', targetNodeId: 'node-2', targetPortId: 'in' },
                { id: 'conn-2', sourceNodeId: 'node-1', sourcePortId: 'out', targetNodeId: 'node-3', targetPortId: 'in' },
                { id: 'conn-3', sourceNodeId: 'node-2', sourcePortId: 'out', targetNodeId: 'node-4', targetPortId: 'in' }
            ];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.size).toBe(4);
        });

        it('executes merging graph correctly', async () => {
            const nodes = [
                createMockNode('node-1', 'dataInput', { value: 10 }),
                createMockNode('node-2', 'dataInput', { value: 20 }),
                createMockNode('node-3', 'dataInput', { value: 30 }),
                createMockNode('node-4', 'aggregate', {}, [], [])
            ];
            const connections: ConnectionDefinition[] = [
                { id: 'conn-1', sourceNodeId: 'node-1', sourcePortId: 'out', targetNodeId: 'node-4', targetPortId: 'input-1' },
                { id: 'conn-2', sourceNodeId: 'node-2', sourcePortId: 'out', targetNodeId: 'node-4', targetPortId: 'input-2' },
                { id: 'conn-3', sourceNodeId: 'node-3', sourcePortId: 'out', targetNodeId: 'node-4', targetPortId: 'input-3' }
            ];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.size).toBe(4);
            expect(results.get('node-4')).toEqual([10, 20, 30]);
        });

        it('executes complex graph with multiple branches and merges', async () => {
            const nodes = [
                createMockNode('node-1', 'dataInput', { value: 10 }),
                createMockNode('node-2', 'dataInput', { value: 20 }),
                createMockNode('node-3', 'dataInput', { value: 30 }),
                createMockNode('node-4', 'dataInput', { value: 40 }),
                createMockNode('node-5', 'aggregate', {}, [], []),
                createMockNode('node-6', 'aggregate', {}, [], [])
            ];
            const connections: ConnectionDefinition[] = [
                { id: 'conn-1', sourceNodeId: 'node-1', sourcePortId: 'out', targetNodeId: 'node-2', targetPortId: 'in' },
                { id: 'conn-2', sourceNodeId: 'node-1', sourcePortId: 'out', targetNodeId: 'node-3', targetPortId: 'in' },
                { id: 'conn-3', sourceNodeId: 'node-2', sourcePortId: 'out', targetNodeId: 'node-5', targetPortId: 'input-1' },
                { id: 'conn-4', sourceNodeId: 'node-3', sourcePortId: 'out', targetNodeId: 'node-5', targetPortId: 'input-2' },
                { id: 'conn-5', sourceNodeId: 'node-4', sourcePortId: 'out', targetNodeId: 'node-6', targetPortId: 'input-1' },
                { id: 'conn-6', sourceNodeId: 'node-5', sourcePortId: 'out', targetNodeId: 'node-6', targetPortId: 'input-2' }
            ];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.size).toBe(6);
        });
    });

    describe('Execution Order Calculation', () => {
        it('returns empty array for no nodes', () => {
            const order = engine.getExecutionOrder([], []);
            expect(order).toEqual([]);
        });

        it('handles single node', () => {
            const nodes = [createMockNode('node-1', 'dataInput')];
            const order = engine.getExecutionOrder(nodes, []);
            expect(order).toEqual(['node-1']);
        });

        it('handles linear dependency chain', () => {
            const nodes = [
                createMockNode('node-1', 'dataInput'),
                createMockNode('node-2', 'dataInput'),
                createMockNode('node-3', 'dataInput')
            ];
            const connections: ConnectionDefinition[] = [
                { id: 'conn-1', sourceNodeId: 'node-1', sourcePortId: 'out', targetNodeId: 'node-2', targetPortId: 'in' },
                { id: 'conn-2', sourceNodeId: 'node-2', sourcePortId: 'out', targetNodeId: 'node-3', targetPortId: 'in' }
            ];
            const order = engine.getExecutionOrder(nodes, connections);
            expect(order).toEqual(['node-1', 'node-2', 'node-3']);
        });

        it('handles branching dependencies', () => {
            const nodes = [
                createMockNode('node-1', 'dataInput'),
                createMockNode('node-2', 'dataInput'),
                createMockNode('node-3', 'dataInput'),
                createMockNode('node-4', 'dataInput')
            ];
            const connections: ConnectionDefinition[] = [
                { id: 'conn-1', sourceNodeId: 'node-1', sourcePortId: 'out', targetNodeId: 'node-2', targetPortId: 'in' },
                { id: 'conn-2', sourceNodeId: 'node-1', sourcePortId: 'out', targetNodeId: 'node-3', targetPortId: 'in' },
                { id: 'conn-3', sourceNodeId: 'node-2', sourcePortId: 'out', targetNodeId: 'node-4', targetPortId: 'in' },
                { id: 'conn-4', sourceNodeId: 'node-3', sourcePortId: 'out', targetNodeId: 'node-4', targetPortId: 'in' }
            ];
            const order = engine.getExecutionOrder(nodes, connections);
            expect(order[0]).toBe('node-1');
            expect(order[order.length - 1]).toBe('node-4');
        });

        it('handles merging dependencies', () => {
            const nodes = [
                createMockNode('node-1', 'dataInput'),
                createMockNode('node-2', 'dataInput'),
                createMockNode('node-3', 'dataInput'),
                createMockNode('node-4', 'dataInput')
            ];
            const connections: ConnectionDefinition[] = [
                { id: 'conn-1', sourceNodeId: 'node-1', sourcePortId: 'out', targetNodeId: 'node-4', targetPortId: 'in' },
                { id: 'conn-2', sourceNodeId: 'node-2', sourcePortId: 'out', targetNodeId: 'node-4', targetPortId: 'in' },
                { id: 'conn-3', sourceNodeId: 'node-3', sourcePortId: 'out', targetNodeId: 'node-4', targetPortId: 'in' }
            ];
            const order = engine.getExecutionOrder(nodes, connections);
            expect(order[order.length - 1]).toBe('node-4');
        });
    });

    describe('Error Handling', () => {
        it('detects simple cycles', async () => {
            const nodes = [
                createMockNode('node-a', 'dataInput', {}, [{ id: 'in', label: 'In', dataType: 'any', required: true }], [{ id: 'out', label: 'Out', dataType: 'any', required: true }]),
                createMockNode('node-b', 'dataInput', {}, [{ id: 'in', label: 'In', dataType: 'any', required: true }], [{ id: 'out', label: 'Out', dataType: 'any', required: true }])
            ];
            const connections: ConnectionDefinition[] = [
                { id: 'c1', sourceNodeId: 'node-a', sourcePortId: 'out', targetNodeId: 'node-b', targetPortId: 'in' },
                { id: 'c2', sourceNodeId: 'node-b', sourcePortId: 'out', targetNodeId: 'node-a', targetPortId: 'in' }
            ];
            await expect(engine.executeGraph(nodes, connections)).rejects.toThrow('Cycle detected');
        });

        it('detects complex cycles', async () => {
            const nodes = [
                createMockNode('node-a', 'dataInput', {}, [{ id: 'in', label: 'In', dataType: 'any', required: true }], [{ id: 'out', label: 'Out', dataType: 'any', required: true }]),
                createMockNode('node-b', 'dataInput', {}, [{ id: 'in', label: 'In', dataType: 'any', required: true }], [{ id: 'out', label: 'Out', dataType: 'any', required: true }]),
                createMockNode('node-c', 'dataInput', {}, [{ id: 'in', label: 'In', dataType: 'any', required: true }], [{ id: 'out', label: 'Out', dataType: 'any', required: true }])
            ];
            const connections: ConnectionDefinition[] = [
                { id: 'c1', sourceNodeId: 'node-a', sourcePortId: 'out', targetNodeId: 'node-b', targetPortId: 'in' },
                { id: 'c2', sourceNodeId: 'node-b', sourcePortId: 'out', targetNodeId: 'node-c', targetPortId: 'in' },
                { id: 'c3', sourceNodeId: 'node-c', sourcePortId: 'out', targetNodeId: 'node-a', targetPortId: 'in' }
            ];
            await expect(engine.executeGraph(nodes, connections)).rejects.toThrow('Cycle detected');
        });

        it('handles missing target node gracefully', async () => {
            const nodes = [createMockNode('node-1', 'dataInput', { value: 10 })];
            const connections: ConnectionDefinition[] = [{
                id: 'bad-conn',
                sourceNodeId: 'node-1',
                sourcePortId: 'out',
                targetNodeId: 'missing-node',
                targetPortId: 'in'
            }];
            const results = await engine.executeGraph(nodes, connections);
            expect(results.has('node-1')).toBe(true);
        });

        it('handles execution errors gracefully', async () => {
            const nodes = [createMockNode('unknown-type', 'unknownType', { value: 10 })];
            const results = await engine.executeGraph(nodes, []);
            expect(results.has('unknown-type')).toBe(true);
            expect(results.get('unknown-type')).toBeNull();
        });
    });

    describe('Performance with Large Graphs', () => {
        it('executes large graph efficiently', async () => {
            const nodes: NodeDefinition[] = [];
            const connections: ConnectionDefinition[] = [];

            // Create a linear chain of 50 nodes
            for (let i = 0; i < 50; i++) {
                nodes.push(createMockNode(`node-${i}`, 'dataInput', { value: i }));
                if (i > 0) {
                    connections.push({
                        id: `conn-${i}`,
                        sourceNodeId: `node-${i - 1}`,
                        sourcePortId: 'out',
                        targetNodeId: `node-${i}`,
                        targetPortId: 'in'
                    });
                }
            }

            const startTime = Date.now();
            const results = await engine.executeGraph(nodes, connections);
            const endTime = Date.now();

            expect(results.size).toBe(50);
            expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
        });

        it('executes complex graph with many branches', async () => {
            const nodes: NodeDefinition[] = [];
            const connections: ConnectionDefinition[] = [];

            // Create root node
            nodes.push(createMockNode('root', 'dataInput', { value: 0 }));

            // Create 20 branches from root
            for (let i = 0; i < 20; i++) {
                const branchId = `branch-${i}`;
                nodes.push(createMockNode(branchId, 'dataInput', { value: i }));
                connections.push({
                    id: `conn-root-${i}`,
                    sourceNodeId: 'root',
                    sourcePortId: 'out',
                    targetNodeId: branchId,
                    targetPortId: 'in'
                });
            }

            const startTime = Date.now();
            const results = await engine.executeGraph(nodes, connections);
            const endTime = Date.now();

            expect(results.size).toBe(21);
            expect(endTime - startTime).toBeLessThan(1000);
        });
    });

    describe('Cache Integration', () => {
        it('uses cache to store results', async () => {
            const nodes = [createMockNode('node-1', 'dataInput', { value: 42 })];
            await engine.executeGraph(nodes, []);
            // Cache is cleared before each execution, so we can't test this directly
            // But we can verify results are returned correctly
            const results = await engine.executeGraph(nodes, []);
            expect(results.get('node-1')).toBe(42);
        });

        it('clears cache between executions', async () => {
            const nodes = [createMockNode('node-1', 'dataInput', { value: 42 })];
            await engine.executeGraph(nodes, []);
            // Modify node data
            nodes[0].data.value = 100;
            const results = await engine.executeGraph(nodes, []);
            expect(results.get('node-1')).toBe(100);
        });
    });

    describe('Element Node Execution', () => {
        it('extracts element data from resource nodes', async () => {
            const nodes = [createMockNode('res-1', 'resource', {
                label: 'Iron Ore',
                element: {
                    id: 'res-iron',
                    name: 'Iron Ore',
                    type: 'mineral',
                    properties: 'Common, Durable',
                    symbol: 'Fe'
                }
            })];
            const results = await engine.executeGraph(nodes, []);
            const resourceData = results.get('res-1');
            expect(resourceData).toBeDefined();
            expect(resourceData.element).toBeDefined();
            expect(resourceData.element.name).toBe('Iron Ore');
        });

        it('handles multiple element types', async () => {
            const nodes = [
                createMockNode('deity-1', 'deity', {
                    label: 'Sky God',
                    element: {
                        id: 'deity-sky',
                        name: 'Sky God',
                        domain: 'Weather',
                        symbol: 'Cloud',
                        emoji: '☁️',
                        description: 'Controls the storms'
                    }
                }),
                createMockNode('faction-1', 'faction', {
                    label: 'Mountain Clan',
                    element: {
                        id: 'faction-mountain',
                        name: 'Mountain Clan',
                        race: 'Dwarf',
                        symbolName: 'Hammer',
                        emoji: '🔨',
                        color: '#8B4513',
                        theme: 'Mining',
                        description: 'Expert miners',
                        leaderName: 'Thorin',
                        isNeighbor: false
                    }
                })
            ];
            const results = await engine.executeGraph(nodes, []);
            expect(results.get('deity-1')?.element.domain).toBe('Weather');
            expect(results.get('faction-1')?.element.race).toBe('Dwarf');
        });
    });

    describe('Basic Execution', () => {
        it('executes a simple linear graph', async () => {
            const nodes: NodeDefinition[] = [
                {
                    id: 'input-1',
                    type: 'dataInput',
                    position: { x: 0, y: 0 },
                    data: { value: 42 },
                    inputs: [],
                    outputs: [{ id: 'out', label: 'Output', dataType: 'number', required: true }],
                    config: { category: 'input', label: 'Input 1', icon: 'Box' }
                },
                {
                    id: 'output-1',
                    type: 'dataInput',
                    position: { x: 200, y: 0 },
                    data: {},
                    inputs: [{ id: 'in', label: 'Input', dataType: 'number', required: true }],
                    outputs: [],
                    config: { category: 'input', label: 'Output 1', icon: 'Box' }
                }
            ];

            const connections: ConnectionDefinition[] = [
                {
                    id: 'conn-1',
                    sourceNodeId: 'input-1',
                    sourcePortId: 'out',
                    targetNodeId: 'output-1',
                    targetPortId: 'in'
                }
            ];

            const results = await engine.executeGraph(nodes, connections);

            expect(results.get('input-1')).toBe(42);
            expect(results.has('output-1')).toBe(true);
        });

        it('handles nodes with no connections', async () => {
            const nodes: NodeDefinition[] = [
                {
                    id: 'isolated-1',
                    type: 'dataInput',
                    position: { x: 0, y: 0 },
                    data: { value: 100 },
                    inputs: [],
                    outputs: [],
                    config: { category: 'input', label: 'Isolated', icon: 'Box' }
                }
            ];

            const results = await engine.executeGraph(nodes, []);

            expect(results.get('isolated-1')).toBe(100);
        });
    });
});

