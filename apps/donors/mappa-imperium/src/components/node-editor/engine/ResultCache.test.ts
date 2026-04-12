import { ResultCache } from './ResultCache';

describe('ResultCache', () => {
    let cache: ResultCache;

    beforeEach(() => {
        cache = new ResultCache();
    });

    describe('Cache Operations - Basic', () => {
        it('stores and retrieves results', () => {
            const nodeResult = { nodeId: 'node-1', data: { value: 50 } };
            cache.set('node-1', nodeResult);
            const retrieved = cache.get('node-1');
            expect(retrieved).toEqual(nodeResult);
        });

        it('returns undefined for non-existent key', () => {
            const retrieved = cache.get('non-existent');
            expect(retrieved).toBeUndefined();
        });

        it('checks if result exists with has method', () => {
            expect(cache.has('node-1')).toBe(false);
            cache.set('node-1', { nodeId: 'node-1', data: { value: 50 } });
            expect(cache.has('node-1')).toBe(true);
        });
    });

    describe('Cache Operations - Invalidation', () => {
        it('invalidates cached result', () => {
            const nodeResult = { nodeId: 'node-1', data: { value: 50 } };
            cache.set('node-1', nodeResult);
            expect(cache.has('node-1')).toBe(true);
            cache.invalidate('node-1');
            expect(cache.get('node-1')).toBeUndefined();
            expect(cache.has('node-1')).toBe(false);
        });

        it('clears all cached results', () => {
            cache.set('node-1', { nodeId: 'node-1', data: { value: 50 } });
            cache.set('node-2', { nodeId: 'node-2', data: { value: 75 } });
            cache.set('node-3', { nodeId: 'node-3', data: { value: 100 } });
            expect(cache.has('node-1')).toBe(true);
            expect(cache.has('node-2')).toBe(true);
            expect(cache.has('node-3')).toBe(true);
            cache.clear();
            expect(cache.get('node-1')).toBeUndefined();
            expect(cache.get('node-2')).toBeUndefined();
            expect(cache.get('node-3')).toBeUndefined();
        });
    });

    describe('Cache Hit/Miss Scenarios', () => {
        it('handles cache hit scenario', () => {
            const nodeResult = { nodeId: 'node-1', data: { value: 50 } };
            cache.set('node-1', nodeResult);
            expect(cache.has('node-1')).toBe(true);
            const retrieved = cache.get('node-1');
            expect(retrieved).toEqual(nodeResult);
        });

        it('handles cache miss scenario', () => {
            expect(cache.has('missing-node')).toBe(false);
            const retrieved = cache.get('missing-node');
            expect(retrieved).toBeUndefined();
        });

        it('handles overwriting existing cached value', () => {
            const firstResult = { nodeId: 'node-1', data: { value: 50 } };
            const secondResult = { nodeId: 'node-1', data: { value: 100 } };
            cache.set('node-1', firstResult);
            expect(cache.get('node-1')).toEqual(firstResult);
            cache.set('node-1', secondResult);
            expect(cache.get('node-1')).toEqual(secondResult);
            expect(cache.get('node-1')).not.toEqual(firstResult);
        });
    });

    describe('Cache Invalidation Strategies', () => {
        it('invalidates single node without affecting others', () => {
            cache.set('node-1', { nodeId: 'node-1', data: { value: 50 } });
            cache.set('node-2', { nodeId: 'node-2', data: { value: 75 } });
            cache.set('node-3', { nodeId: 'node-3', data: { value: 100 } });
            cache.invalidate('node-2');
            expect(cache.get('node-1')).toEqual({ nodeId: 'node-1', data: { value: 50 } });
            expect(cache.get('node-2')).toBeUndefined();
            expect(cache.get('node-3')).toEqual({ nodeId: 'node-3', data: { value: 100 } });
        });

        it('handles invalidating non-existent node gracefully', () => {
            cache.set('node-1', { nodeId: 'node-1', data: { value: 50 } });
            cache.invalidate('non-existent');
            expect(cache.get('node-1')).toEqual({ nodeId: 'node-1', data: { value: 50 } });
        });

        it('handles clearing empty cache gracefully', () => {
            expect(() => cache.clear()).not.toThrow();
            expect(cache.get('any-node')).toBeUndefined();
        });
    });

    describe('Edge Cases', () => {
        it('handles null values in cache', () => {
            cache.set('node-1', null);
            expect(cache.has('node-1')).toBe(true);
            expect(cache.get('node-1')).toBeNull();
        });

        it('handles undefined values in cache', () => {
            cache.set('node-1', undefined);
            expect(cache.has('node-1')).toBe(true);
            expect(cache.get('node-1')).toBeUndefined();
        });

        it('handles complex objects in cache', () => {
            const complexObject = {
                nodeId: 'node-1',
                data: {
                    nested: {
                        deeply: {
                            value: 42,
                            array: [1, 2, 3],
                            object: { a: 1, b: 2 }
                        }
                    }
                }
            };
            cache.set('node-1', complexObject);
            const retrieved = cache.get('node-1');
            expect(retrieved).toEqual(complexObject);
            expect(retrieved.data.nested.deeply.value).toBe(42);
        });

        it('handles multiple sequential sets and gets', () => {
            for (let i = 0; i < 100; i++) {
                cache.set(`node-${i}`, { nodeId: `node-${i}`, data: { value: i } });
            }
            for (let i = 0; i < 100; i++) {
                expect(cache.get(`node-${i}`)).toEqual({ nodeId: `node-${i}`, data: { value: i } });
            }
        });
    });
});
