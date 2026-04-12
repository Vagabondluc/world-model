/**
 * Connection Validator
 * Validates individual connections between nodes.
 */

import { NodeDefinition, ConnectionDefinition, PortDataType } from "@/types/nodeEditor.types";

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export class ConnectionValidator {
    /**
     * Validate a connection
     */
    validateConnection(
        connection: ConnectionDefinition,
        nodes: NodeDefinition[]
    ): ValidationResult {
        const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
        const targetNode = nodes.find(n => n.id === connection.targetNodeId);

        // 1. Existence check
        if (!sourceNode) return { isValid: false, error: 'Source node not found' };
        if (!targetNode) return { isValid: false, error: 'Target node not found' };

        // 2. Self-loop check
        if (sourceNode.id === targetNode.id) {
            return { isValid: false, error: 'Cannot connect a node to itself' };
        }

        // 3. Port existence check
        const sourcePort = sourceNode.outputs.find(p => p.id === connection.sourcePortId);
        const targetPort = targetNode.inputs.find(p => p.id === connection.targetPortId);

        if (!sourcePort) return { isValid: false, error: 'Source port not found' };
        if (!targetPort) return { isValid: false, error: 'Target port not found' };

        // 4. Directionality check (Output -> Input)
        // This is implicitly handled by looking in 'outputs' vs 'inputs' arrays above.
        // If we found the IDs in the wrong lists, it means the connection is backwards or invalid.
        // But let's be explicit if we were passed raw IDs.
        // (Assumed valid if found in respective arrays).

        // 5. Data Type Compatibility
        if (!this.areTypesCompatible(sourcePort.dataType, targetPort.dataType)) {
            return {
                isValid: false,
                error: `Type mismatch: Cannot connect ${sourcePort.dataType} to ${targetPort.dataType}`
            };
        }

        return { isValid: true };
    }

    /**
     * Check if two port data types are compatible
     */
    private areTypesCompatible(sourceType: PortDataType, targetType: PortDataType): boolean {
        // Exact match
        if (sourceType === targetType) return true;

        // Any/General type compatibility (if we had an 'any' type)
        // For now, we are strict.

        // Specific compatible pairs
        // e.g., 'number' -> 'progressData' (maybe? depends on node logic)

        return false;
    }
}
