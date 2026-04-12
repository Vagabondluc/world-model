/**
 * Graph Validator
 * Validates the entire graph structure.
 */

import { NodeDefinition, ConnectionDefinition } from "@/types/nodeEditor.types";
import { NodeValidator } from "./NodeValidator";
import { ConnectionValidator } from "./ConnectionValidator";

export interface GraphError {
    type: 'node' | 'connection' | 'graph' | 'warning' | 'error';
    id?: string;
    message: string;
    severity?: 'error' | 'warning' | 'info';
}

export class GraphValidator {
    private nodeValidator: NodeValidator;
    private connectionValidator: ConnectionValidator;

    constructor() {
        this.nodeValidator = new NodeValidator();
        this.connectionValidator = new ConnectionValidator();
    }

    validateGraph(
        nodes: NodeDefinition[],
        connections: ConnectionDefinition[]
    ): GraphError[] {
        const errors: GraphError[] = [];

        // 1. Validate All Nodes
        nodes.forEach(node => {
            const result = this.nodeValidator.validateNode(node, connections);
            if (!result.isValid) {
                errors.push({
                    type: 'node',
                    id: node.id,
                    message: result.error || 'Invalid node configuration'
                });
            }
        });

        // 2. Validate All Connections
        connections.forEach(conn => {
            const result = this.connectionValidator.validateConnection(conn, nodes);
            if (!result.isValid) {
                errors.push({
                    type: 'connection',
                    id: conn.id,
                    message: result.error || 'Invalid connection'
                });
            }
        });

        // 3. Check for disconnected nodes (warning, not error)
        nodes.forEach(node => {
            // Element nodes can be standalone
            const isElementNode = ['resource', 'deity', 'location', 'faction', 'settlement',
                'event', 'character', 'war', 'monument',
                'resourceInput', 'deityInput', 'locationInput', 'factionInput',
                'settlementInput', 'eventInput', 'characterInput', 'warInput', 'monumentInput']
                .includes(node.type);

            if (!isElementNode) {
                const hasConnections = connections.some(c => c.sourceNodeId === node.id || c.targetNodeId === node.id);
                if (!hasConnections && node.inputs && node.inputs.length > 0) {
                    errors.push({
                        type: 'warning',
                        id: node.id,
                        message: `Node "${(node.data as any)?.label || node.id}" has no connections`,
                        severity: 'warning'
                    });
                }
            }
        });

        // 4. Type compatibility check
        connections.forEach(conn => {
            const sourceNode = nodes.find(n => n.id === conn.sourceNodeId);
            const targetNode = nodes.find(n => n.id === conn.targetNodeId);

            if (sourceNode && targetNode) {
                const sourcePort = sourceNode.outputs?.find(p => p.id === conn.sourcePortId);
                const targetPort = targetNode.inputs?.find(p => p.id === conn.targetPortId);

                if (sourcePort && targetPort) {
                    // Check type compatibility
                    const sourceType = (sourcePort as any).type;
                    const targetType = (targetPort as any).type;

                    if (sourceType && targetType && sourceType !== 'any' && targetType !== 'any' && sourceType !== targetType) {
                        errors.push({
                            type: 'warning',
                            id: conn.id,
                            message: `Type mismatch: ${sourceType} → ${targetType}`,
                            severity: 'warning'
                        });
                    }
                }
            }
        });

        // 5. Cycle Detection
        if (this.hasCycle(nodes, connections)) {
            errors.push({
                type: 'graph',
                message: 'Cycle detected in graph (circular dependency)',
                severity: 'error'
            });
        }

        return errors;
    }

    private hasCycle(nodes: NodeDefinition[], connections: ConnectionDefinition[]): boolean {
        // Build adjacency list
        const adj = new Map<string, string[]>();
        nodes.forEach(n => adj.set(n.id, []));
        connections.forEach(c => {
            adj.get(c.sourceNodeId)?.push(c.targetNodeId);
        });

        const visited = new Set<string>();
        const recursionStack = new Set<string>();

        for (const node of nodes) {
            if (this.detectCycleDFS(node.id, adj, visited, recursionStack)) {
                return true;
            }
        }
        return false;
    }

    private detectCycleDFS(
        nodeId: string,
        adj: Map<string, string[]>,
        visited: Set<string>,
        recursionStack: Set<string>
    ): boolean {
        if (recursionStack.has(nodeId)) return true;
        if (visited.has(nodeId)) return false;

        visited.add(nodeId);
        recursionStack.add(nodeId);

        const neighbors = adj.get(nodeId);
        if (neighbors) {
            for (const neighbor of neighbors) {
                if (this.detectCycleDFS(neighbor, adj, visited, recursionStack)) {
                    return true;
                }
            }
        }

        recursionStack.delete(nodeId);
        return false;
    }
}
