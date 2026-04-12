/**
 * Node Executor
 * Handles execution logic for individual nodes
 */

import {
    NodeDefinition,
    // NodeData, // Unused
    PortId,
    LogicNodeData,
    TransformNodeData,
    FilterNodeData,
    ProgressNodeData,
    SegmentNodeData,
    StyleNodeData,
    TableNodeData,
    NodeExecutionResult
} from "@/types/nodeEditor.types";

export class NodeExecutor {

    /**
     * Execute a single node
     * @param node The node definition
     * @param inputs Map of PortId -> value for all connected inputs
     * @returns The calculated output value
     */
    async executeNode(node: NodeDefinition, inputs: Map<PortId, any>): Promise<NodeExecutionResult> {
        try {
            let output: any;
            switch (node.type) {
                case 'dataInput':
                    output = this.executeDataInput(node);
                    break;
                case 'progress':
                    output = this.executeProgress(node, inputs);
                    break;
                case 'segment':
                    output = this.executeSegment(node, inputs);
                    break;
                case 'logic':
                    output = this.executeLogic(node, inputs);
                    break;
                case 'transform':
                    output = this.executeTransform(node, inputs);
                    break;
                case 'aggregate':
                    output = this.executeAggregate(node, inputs);
                    break;
                case 'filter':
                    output = this.executeFilter(node, inputs);
                    break;
                case 'style':
                    output = this.executeStyle(node);
                    break;
                case 'table':
                    output = this.executeTable(node);
                    break;

                // Interactive Nodes - Check for input values or suspend
                case 'diceRoll':
                    return this.executeDiceRoll(node);
                case 'form':
                    return this.executeForm(node);
                case 'choice':
                    return this.executeChoice(node);

                // Workflow Nodes
                case 'step':
                    output = this.executeStep(node);
                    break;
                case 'eraGate':
                    output = this.executeEraGate(node);
                    break;

                // Element Nodes
                case 'resource':
                case 'deity':
                case 'location':
                case 'faction':
                    output = node.data;
                    break;

                default:
                    console.warn(`No execution logic for node type: ${node.type}`);
                    output = null;
            }

            return { status: 'completed', output };

        } catch (error: any) {
            return { status: 'failed', output: null, error: error.message };
        }
    }

    // ... existing helper methods ...

    // --- Interactive Node Executors ---

    private executeDiceRoll(node: NodeDefinition): NodeExecutionResult {
        // Check if we have a "forced result" or simulation context?
        // For now, simulate suspension
        // In a real Play Mode, the engine would pass in an inputs map that might contain the user's action.

        // Simulating immediate success for now to keep existing tests happy?
        // No, current tests just check UI rendering, not execution logic.
        // But ExecutionEngine tests might fail.

        // Let's implement pseudo-suspension logic:
        // If this is a "dry run", return data.
        return {
            status: 'suspended',
            output: null,
            suspension: {
                nodeId: node.id,
                reason: 'input_required',
                requiredInput: { type: 'action', label: 'Roll Dice' }
            }
        };
    }

    private executeForm(node: NodeDefinition): NodeExecutionResult {
        return {
            status: 'suspended',
            output: null,
            suspension: {
                nodeId: node.id,
                reason: 'input_required',
                requiredInput: (node.data as any).fields
            }
        };
    }

    private executeChoice(node: NodeDefinition): NodeExecutionResult {
        return {
            status: 'suspended',
            output: null,
            suspension: {
                nodeId: node.id,
                reason: 'input_required',
                requiredInput: (node.data as any).options
            }
        };
    }

    // --- Workflow Node Executors ---

    private executeStep(node: NodeDefinition): NodeExecutionResult {
        const data = node.data as any; // StepNodeData
        return {
            status: 'completed',
            output: {
                stepId: data.stepId,
                status: 'pending', // Default state
                label: data.label
            }
        };
    }

    private executeEraGate(node: NodeDefinition): NodeExecutionResult {
        const data = node.data as any; // EraGateNodeData
        return {
            status: 'completed',
            output: {
                targetEra: data.targetEra,
                locked: true, // Default to locked until criteria met
                message: data.criteriaDescription || "Requirements not met"
            }
        };
    }

    // ... executeStep and executeEraGate (can remain synchronous "completed" for now)


    private executeDataInput(node: NodeDefinition): any {
        return (node.data as any).value;
    }

    private executeProgress(node: NodeDefinition, inputs: Map<PortId, any>): any {
        const data = node.data as ProgressNodeData;

        // If inputs provide value, override config
        // NOTE: This assumes specific port IDs for overriding. 
        // In a real implementation, we'd map input ports to data fields.

        return {
            ...data,
            // Dynamic value override if input exists
            value: this.getInputValue(inputs, 'value') ?? data.value,
            max: this.getInputValue(inputs, 'max') ?? data.max
        };
    }

    private executeSegment(node: NodeDefinition, inputs: Map<PortId, any>): any {
        const data = node.data as SegmentNodeData;
        return {
            ...data,
            value: this.getInputValue(inputs, 'value') ?? data.value
        };
    }

    private executeLogic(node: NodeDefinition, inputs: Map<PortId, any>): any {
        const data = node.data as LogicNodeData;
        const a = this.getInputValue(inputs, 'a');
        const b = this.getInputValue(inputs, 'b');

        switch (data.operation) {
            case 'AND': return a && b;
            case 'OR': return a || b;
            case 'NOT': return !a;
            case 'XOR': return !!(a ? !b : b);
            case 'IF': return a ? b : null; // Simple ternary if A then B
            default: return null;
        }
    }

    private executeTransform(node: NodeDefinition, inputs: Map<PortId, any>): any {
        const data = node.data as TransformNodeData;
        const input = this.getInputValue(inputs, 'input');

        if (!input || typeof input !== 'object') return input;

        switch (data.transformationType) {
            case 'pick':
                // Pick specific fields
                if (!data.fields) return input;
                const picked: any = {};
                data.fields.forEach(field => {
                    if (field in input) picked[field] = input[field];
                });
                return picked;

            case 'omit':
                // Omit specific fields
                if (!data.fields) return input;
                const omitted = { ...input };
                data.fields.forEach(field => {
                    delete omitted[field];
                });
                return omitted;

            case 'map':
                // Complex map unimplemented for MVP
                return input;

            default:
                return input;
        }
    }

    private executeAggregate(_node: NodeDefinition, inputs: Map<PortId, any>): any {
        // Collect all inputs into an array
        // Inputs map values are essentially the array
        return Array.from(inputs.values());
    }

    private executeStyle(node: NodeDefinition): any {
        const data = node.data as StyleNodeData;
        // Return style configuration object
        return {
            height: data.height ?? 32,
            borderRadius: data.borderRadius ?? 4,
            backgroundColor: data.backgroundColor ?? '#3b82f6',
            fillColor: data.fillColor ?? '#3b82f6',
            textColor: data.textColor ?? '#ffffff',
            fontSize: data.fontSize ?? 14,
            fontWeight: data.fontWeight ?? 'normal',
            cssClasses: data.cssClasses || '',
            styleObject: data.styleObject || {}
        };
    }

    private executeTable(node: NodeDefinition): any {
        const data = node.data as TableNodeData;
        // Return table structure with columns and rows
        return {
            columns: data.columns || [],
            headers: data.headers || [],
            rowHeight: data.rowHeight ?? 40,
            rowsPerPage: data.rowsPerPage || 10,
            showBorders: data.showBorders ?? true,
            stripeRows: data.stripeRows ?? false,
            rows: [] // Empty rows by default, populated by data flow
        };
    }

    private executeFilter(node: NodeDefinition, inputs: Map<PortId, any>): any {
        const data = node.data as FilterNodeData;
        const collection = this.getInputValue(inputs, 'collection');

        if (!Array.isArray(collection)) return collection;

        return collection.filter(item => {
            const itemValue = item[data.field];
            switch (data.operator) {
                case 'equals': return itemValue == data.value;
                case 'gt': return itemValue > data.value;
                case 'lt': return itemValue < data.value;
                case 'contains':
                    return String(itemValue).toLowerCase().includes(String(data.value).toLowerCase());
                default: return true;
            }
        });
    }

    /**
     * Helper to get the first value for a key that *might* be a port ID or label
     * Real implementation needs robust port mapping
     */
    private getInputValue(inputs: Map<PortId, any>, keySnippet: string): any {
        // This is a naive lookup for MVP. Real engine maps Connection -> Input Port ID
        // The inputs map is keyed by PortId.

        // Find input port that ends with the key snippet (e.g., 'input-value')
        for (const [portId, value] of inputs.entries()) {
            if (portId.toLowerCase().includes(keySnippet.toLowerCase())) {
                return value;
            }
        }
        return undefined;
    }

    // End of NodeExecutor

}
