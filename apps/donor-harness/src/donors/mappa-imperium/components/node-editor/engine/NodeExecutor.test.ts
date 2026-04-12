import { NodeExecutor } from './NodeExecutor';
import { NodeDefinition } from '@mi/types/nodeEditor.types';

describe('NodeExecutor', () => {
    let executor: NodeExecutor;

    beforeEach(() => {
        executor = new NodeExecutor();
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

    describe('DataInput Node Execution', () => {
        it('executes dataInput node with number value', async () => {
            const node = createMockNode('data-1', 'dataInput', { value: 42 });
            const inputs = new Map();
            const result = await executor.executeNode(node, inputs);
            expect(result).toBe(42);
        });

        it('executes dataInput node with string value', async () => {
            const node = createMockNode('data-1', 'dataInput', { value: 'Hello World' });
            const inputs = new Map();
            const result = await executor.executeNode(node, inputs);
            expect(result).toBe('Hello World');
        });

        it('executes dataInput node with object value', async () => {
            const node = createMockNode('data-1', 'dataInput', { value: { name: 'Test', value: 50 } });
            const inputs = new Map();
            const result = await executor.executeNode(node, inputs);
            expect(result).toEqual({ name: 'Test', value: 50 });
        });
    });

    describe('Progress Node Execution', () => {
        it('executes progress node with static value', async () => {
            const node = createMockNode('progress-1', 'progress', {
                label: 'Test',
                value: 75,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            });
            const inputs = new Map();
            const result = await executor.executeNode(node, inputs);
            expect(result).toEqual(expect.objectContaining({
                label: 'Test',
                value: 75,
                max: 100
            }));
        });

        it('executes progress node with input value override', async () => {
            const node = createMockNode('progress-1', 'progress', {
                label: 'Test',
                value: 50,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            });
            const inputs = new Map([['input-value', 85]]);
            const result = await executor.executeNode(node, inputs);
            expect(result.value).toBe(85);
        });

        it('executes progress node with input max override', async () => {
            const node = createMockNode('progress-1', 'progress', {
                label: 'Test',
                value: 50,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            });
            const inputs = new Map([['input-max', 150]]);
            const result = await executor.executeNode(node, inputs);
            expect(result.max).toBe(150);
        });
    });

    describe('Segment Node Execution', () => {
        it('executes segment node with static value', async () => {
            const node = createMockNode('segment-1', 'segment', {
                label: 'Done',
                value: 50,
                color: '#10b981'
            });
            const inputs = new Map();
            const result = await executor.executeNode(node, inputs);
            expect(result).toEqual(expect.objectContaining({
                label: 'Done',
                value: 50,
                color: '#10b981'
            }));
        });

        it('executes segment node with input value override', async () => {
            const node = createMockNode('segment-1', 'segment', {
                label: 'Done',
                value: 50,
                color: '#10b981'
            });
            const inputs = new Map([['input-value', 75]]);
            const result = await executor.executeNode(node, inputs);
            expect(result.value).toBe(75);
        });
    });

    describe('Logic Node Execution', () => {
        it('executes logic node with AND operation', async () => {
            const node = createMockNode('logic-1', 'logic', { operation: 'AND' });
            const inputs = new Map([['input-a', true], ['input-b', true]]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toBe(true);
        });

        it('executes logic node with OR operation', async () => {
            const node = createMockNode('logic-1', 'logic', { operation: 'OR' });
            const inputs = new Map([['input-a', false], ['input-b', true]]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toBe(true);
        });

        it('executes logic node with NOT operation', async () => {
            const node = createMockNode('logic-1', 'logic', { operation: 'NOT' });
            const inputs = new Map([['input-a', true]]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toBe(false);
        });

        it('executes logic node with XOR operation', async () => {
            const node = createMockNode('logic-1', 'logic', { operation: 'XOR' });
            const inputs = new Map([['input-a', true], ['input-b', false]]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toBe(true);
        });

        it('executes logic node with IF operation', async () => {
            const node = createMockNode('logic-1', 'logic', { operation: 'IF' });
            const inputs = new Map([['input-a', true], ['input-b', 'Yes']]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toBe('Yes');
        });
    });

    describe('Transform Node Execution', () => {
        it('executes transform node with pick operation', async () => {
            const node = createMockNode('transform-1', 'transform', {
                transformationType: 'pick',
                fields: ['name', 'value']
            });
            const inputs = new Map([['input', { name: 'Test', value: 50, extra: 'ignore' }]]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toEqual({ name: 'Test', value: 50 });
        });

        it('executes transform node with omit operation', async () => {
            const node = createMockNode('transform-1', 'transform', {
                transformationType: 'omit',
                fields: ['extra']
            });
            const inputs = new Map([['input', { name: 'Test', value: 50, extra: 'ignore' }]]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toEqual({ name: 'Test', value: 50 });
        });

        it('executes transform node with map operation (returns input unchanged)', async () => {
            const node = createMockNode('transform-1', 'transform', {
                transformationType: 'map'
            });
            const inputs = new Map([['input', { name: 'Test', value: 50 }]]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toEqual({ name: 'Test', value: 50 });
        });
    });

    describe('Filter Node Execution', () => {
        it('executes filter node with equals operator', async () => {
            const node = createMockNode('filter-1', 'filter', {
                field: 'value',
                operator: 'equals',
                value: 50
            });
            const inputs = new Map([['collection', [
                { name: 'Item 1', value: 50 },
                { name: 'Item 2', value: 75 },
                { name: 'Item 3', value: 50 }
            ]]]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toHaveLength(2);
            expect(result.every((item: any) => item.value === 50)).toBe(true);
        });

        it('executes filter node with gt operator', async () => {
            const node = createMockNode('filter-1', 'filter', {
                field: 'value',
                operator: 'gt',
                value: 40
            });
            const inputs = new Map([['collection', [
                { name: 'Item 1', value: 50 },
                { name: 'Item 2', value: 75 },
                { name: 'Item 3', value: 25 }
            ]]]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toHaveLength(2);
        });

        it('executes filter node with lt operator', async () => {
            const node = createMockNode('filter-1', 'filter', {
                field: 'value',
                operator: 'lt',
                value: 60
            });
            const inputs = new Map([['collection', [
                { name: 'Item 1', value: 50 },
                { name: 'Item 2', value: 75 },
                { name: 'Item 3', value: 25 }
            ]]]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toHaveLength(2);
        });

        it('executes filter node with contains operator', async () => {
            const node = createMockNode('filter-1', 'filter', {
                field: 'name',
                operator: 'contains',
                value: 'a'
            });
            const inputs = new Map([['collection', [
                { name: 'Apple', value: 50 },
                { name: 'Banana', value: 75 },
                { name: 'Cherry', value: 25 }
            ]]]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toHaveLength(2);
        });
    });

    describe('Aggregate Node Execution', () => {
        it('executes aggregate node collecting multiple inputs', async () => {
            const node = createMockNode('aggregate-1', 'aggregate', {});
            const inputs = new Map([
                ['input-1', 10],
                ['input-2', 20],
                ['input-3', 30]
            ]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toEqual([10, 20, 30]);
        });

        it('executes aggregate node with empty inputs', async () => {
            const node = createMockNode('aggregate-1', 'aggregate', {});
            const inputs = new Map();
            const result = await executor.executeNode(node, inputs);
            expect(result).toEqual([]);
        });
    });

    describe('Element Node Execution', () => {
        it('executes resource node', async () => {
            const node = createMockNode('res-1', 'resource', {
                label: 'Iron Ore',
                element: {
                    id: 'res-iron',
                    name: 'Iron Ore',
                    type: 'mineral',
                    properties: 'Common, Durable',
                    symbol: 'Fe'
                }
            });
            const inputs = new Map();
            const result = await executor.executeNode(node, inputs);
            expect(result).toEqual(expect.objectContaining({
                label: 'Iron Ore',
                element: expect.objectContaining({
                    name: 'Iron Ore',
                    type: 'mineral'
                })
            }));
        });

        it('executes deity node', async () => {
            const node = createMockNode('deity-1', 'deity', {
                label: 'Sky God',
                element: {
                    id: 'deity-sky',
                    name: 'Sky God',
                    domain: 'Weather',
                    symbol: 'Cloud',
                    emoji: '☁️',
                    description: 'Controls storms'
                }
            });
            const inputs = new Map();
            const result = await executor.executeNode(node, inputs);
            expect(result).toEqual(expect.objectContaining({
                label: 'Sky God',
                element: expect.objectContaining({
                    name: 'Sky God',
                    domain: 'Weather'
                })
            }));
        });

        it('executes faction node', async () => {
            const node = createMockNode('faction-1', 'faction', {
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
            });
            const inputs = new Map();
            const result = await executor.executeNode(node, inputs);
            expect(result).toEqual(expect.objectContaining({
                label: 'Mountain Clan',
                element: expect.objectContaining({
                    name: 'Mountain Clan',
                    race: 'Dwarf'
                })
            }));
        });
    });

    describe('Edge Cases', () => {
        it('handles null inputs gracefully', async () => {
            const node = createMockNode('data-1', 'dataInput', { value: null });
            const inputs = new Map();
            const result = await executor.executeNode(node, inputs);
            expect(result).toBeNull();
        });

        it('handles empty array inputs', async () => {
            const node = createMockNode('filter-1', 'filter', {
                field: 'value',
                operator: 'equals',
                value: 50
            });
            const inputs = new Map([['collection', []]]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toEqual([]);
        });

        it('handles invalid types gracefully', async () => {
            const node = createMockNode('unknown-type', 'unknownType', { value: 10 });
            const inputs = new Map();
            const result = await executor.executeNode(node, inputs);
            expect(result).toBeNull();
        });

        it('handles missing input values', async () => {
            const node = createMockNode('progress-1', 'progress', {
                label: 'Test',
                value: 50,
                max: 100,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            });
            const inputs = new Map(); // No input-value provided
            const result = await executor.executeNode(node, inputs);
            expect(result.value).toBe(50); // Falls back to static value
        });

        it('handles transform node with non-object input', async () => {
            const node = createMockNode('transform-1', 'transform', {
                transformationType: 'pick',
                fields: ['name', 'value']
            });
            const inputs = new Map([['input', 'not an object']]);
            const result = await executor.executeNode(node, inputs);
            expect(result).toBe('not an object');
        });
    });
});
