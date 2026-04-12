/**
 * Result Cache
 * Memoizes node execution results to avoid re-calculation.
 */

import { NodeId } from "@mi/types/nodeEditor.types";

export class ResultCache {
    private cache: Map<NodeId, any> = new Map();

    /**
     * Get cached result for a node
     */
    get(nodeId: NodeId): any | undefined {
        return this.cache.get(nodeId);
    }

    /**
     * Set cached result for a node
     */
    set(nodeId: NodeId, value: any): void {
        this.cache.set(nodeId, value);
    }

    /**
     * Check if a result exists for a node
     */
    has(nodeId: NodeId): boolean {
        return this.cache.has(nodeId);
    }

    /**
     * Invalidate cache for a specific node
     */
    invalidate(nodeId: NodeId): void {
        this.cache.delete(nodeId);
    }

    /**
     * Set multiple cached results at once
     */
    setAll(results: Map<NodeId, any>): void {
        results.forEach((value, key) => {
            this.cache.set(key, value);
        });
    }

    /**
     * Clear entire cache
     */
    clear(): void {
        this.cache.clear();
    }
}
