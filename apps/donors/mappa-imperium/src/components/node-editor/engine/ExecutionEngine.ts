/**
 * Execution Engine
 * Orchestrates the execution of the node graph.
 */

import { NodeDefinition, ConnectionDefinition, NodeId, PortId, NodeExecutionResult } from "@/types/nodeEditor.types";
import { NodeExecutor } from "./NodeExecutor";
import { ResultCache } from "./ResultCache";

export class ExecutionEngine {
    private executor: NodeExecutor;
    private cache: ResultCache;

    constructor() {
        this.executor = new NodeExecutor();
        this.cache = new ResultCache();
    }

    /**
     * Execute the entire graph and return results for all nodes.
     * @param nodes Array of node definitions
     * @param connections Array of connection definitions
     * @returns Map of NodeId to calculated result value
     */
    async executeGraph(
        nodes: NodeDefinition[],
        connections: ConnectionDefinition[],
        existingResults?: Map<NodeId, NodeExecutionResult>
    ): Promise<Map<NodeId, NodeExecutionResult>> {
        // 1. Determine execution order (Topological Sort)
        const executionOrder = this.getExecutionOrder(nodes, connections);

        // 2. Initialize results with existing ones if provided
        if (existingResults) {
            this.cache.setAll(existingResults);
        } else {
            this.cache.clear();
        }

        const results = new Map<NodeId, NodeExecutionResult>(existingResults || []);

        // 3. Execute nodes in order
        for (const nodeId of executionOrder) {
            const node = nodes.find(n => n.id === nodeId);
            if (!node) continue;

            // Skip if already completed (and not invalid? For now simple skip)
            if (results.has(nodeId)) {
                const prev = results.get(nodeId);
                console.warn(`[Exec] Checking node ${nodeId}. Prev status: ${prev?.status}`);
                if (prev?.status === 'completed') {
                    console.warn(`[Exec] Skipping completed node ${nodeId}`);
                    continue;
                }
            } else {
                console.warn(`[Exec] Node ${nodeId} not in existing results.`);
            }

            // Gather inputs for this node
            const inputs = this.gatherInputs(nodeId, connections, results);

            // Execute node logic
            try {
                const result = await this.executor.executeNode(node, inputs);
                this.cache.set(nodeId, result);
                results.set(nodeId, result);

                // STOP if suspended or failed
                if (result.status === 'suspended' || result.status === 'failed') {
                    // We stop processing further nodes because they might depend on this one.
                    // This creates a "Step-by-Step" or "Stop-on-Interaction" flow.
                    break;
                }

            } catch (error: any) {
                console.error(`Error executing node ${nodeId}:`, error);
                const errorResult: NodeExecutionResult = { status: 'failed', output: null, error: error.message };
                results.set(nodeId, errorResult);
                break; // Stop on error too
            }
        }

        return results;
    }

    /**
     * Topological Sort (Kahn's Algorithm simplified)
     * Returns an array of NodeIds in execution order.
     */
    getExecutionOrder(
        nodes: NodeDefinition[],
        connections: ConnectionDefinition[] // Edges
    ): NodeId[] {
        const sorted: NodeId[] = [];
        const visited = new Set<NodeId>();
        // Adjacency list: NodeId -> Set<NodeId> (nodes that depend on key)
        const adj = new Map<NodeId, Set<NodeId>>();
        // In-degree: NodeId -> number (count of incoming edges)
        const inDegree = new Map<NodeId, number>();

        // Initialize
        nodes.forEach(node => {
            adj.set(node.id, new Set());
            inDegree.set(node.id, 0);
        });

        // Build Graph
        connections.forEach(conn => {
            const from = conn.sourceNodeId; // Dependency
            const to = conn.targetNodeId;   // Dependent

            // Valid connection check
            if (adj.has(from) && inDegree.has(to)) {
                adj.get(from)?.add(to);
                inDegree.set(to, (inDegree.get(to) || 0) + 1);
            }
        });

        // Khan's Algorithm
        // 1. Find all nodes with in-degree 0 (no dependencies)
        const queue: NodeId[] = [];
        inDegree.forEach((degree, id) => {
            if (degree === 0) queue.push(id);
        });

        while (queue.length > 0) {
            const current = queue.shift()!;
            sorted.push(current);
            visited.add(current);

            // For each neighbor
            const neighbors = adj.get(current) || new Set();
            neighbors.forEach(neighbor => {
                inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
                if (inDegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            });
        }

        // Cycle detection check (if graph has unvisited nodes, cycles exist)
        if (sorted.length !== nodes.length) {
            const unvisited = nodes.filter(n => !visited.has(n.id)).map(n => n.id);
            throw new Error(`Cycle detected in graph. Unprocessed nodes: ${unvisited.join(', ')}`);
        }

        return sorted;
    }

    /**
     * Gather input values for a node based on its incoming connections
     */
    private gatherInputs(
        nodeId: NodeId,
        connections: ConnectionDefinition[],
        previousResults: Map<NodeId, NodeExecutionResult>
    ): Map<PortId, any> {
        const inputs = new Map<PortId, any>();

        // Find connections targeting this node
        const incoming = connections.filter(c => c.targetNodeId === nodeId);

        for (const conn of incoming) {
            // Get value from source node result
            const sourceResult = previousResults.get(conn.sourceNodeId);

            // Map to target Port ID
            // NOTE: This assumes simplified value passing. Real ports might extract specific sub-values.
            if (sourceResult?.status === 'completed' && sourceResult.output !== undefined) {
                inputs.set(conn.targetPortId, sourceResult.output);
            }
        }

        return inputs;
    }
}
