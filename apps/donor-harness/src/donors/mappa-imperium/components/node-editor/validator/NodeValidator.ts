/**
 * Node Validator
 * Validates internal state and configuration of nodes.
 */

import { NodeDefinition, NodeData, ProgressNodeData, ConnectionDefinition } from "@mi/types/nodeEditor.types";
import { ValidationResult } from "./ConnectionValidator";

export class NodeValidator {
    /**
     * Validate a single node's configuration
     */
    validateNode(
        node: NodeDefinition,
        incomingConnections: ConnectionDefinition[] = []
    ): ValidationResult {

        // 1. Required Inputs Check
        const missingInputs: string[] = [];
        node.inputs.forEach(input => {
            if (input.required) {
                // Check if this input port has a connection
                const hasConnection = incomingConnections.some(
                    c => c.targetNodeId === node.id && c.targetPortId === input.id
                );
                if (!hasConnection) {
                    missingInputs.push(input.label);
                }
            }
        });

        if (missingInputs.length > 0) {
            return {
                isValid: false,
                error: `Missing required inputs: ${missingInputs.join(', ')}`
            };
        }

        // 2. Data Integrity Check (Type-specific)
        switch (node.type) {
            case 'progress':
                return this.validateProgressNode(node.data as ProgressNodeData);
            // Add other type validations here
            default:
                return { isValid: true };
        }
    }

    private validateProgressNode(data: ProgressNodeData): ValidationResult {
        // Example check: Value <= Max (if both resemble numbers)
        if (typeof data.value === 'number' && typeof data.max === 'number') {
            if (data.value < 0) {
                return { isValid: false, error: 'Progress value cannot be negative' };
            }
            if (data.max <= 0) {
                return { isValid: false, error: 'Max value must be positive' };
            }
            if (data.value > data.max) {
                return { isValid: false, error: 'Value exceeds maximum' };
            }
        }
        return { isValid: true };
    }
}
