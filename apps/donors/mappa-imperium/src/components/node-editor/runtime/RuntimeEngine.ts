
import { ExecutionEngine } from "../engine/ExecutionEngine";
import { NodeDefinition, ConnectionDefinition, NodeId, NodeExecutionResult, ExecutionStatus } from "@/types/nodeEditor.types";

export interface ThreadState {
    status: ExecutionStatus;
    currentNodeId?: NodeId; // The node we are currently suspended at
    results: Map<NodeId, NodeExecutionResult>;
    error?: string;
}

export class RuntimeEngine {
    private engine: ExecutionEngine;
    private state: ThreadState;
    private nodes: NodeDefinition[] = [];
    private connections: ConnectionDefinition[] = [];

    // Callback for when state changes (to update UI)
    private onStateChange?: (state: ThreadState) => void;

    constructor() {
        this.engine = new ExecutionEngine();
        this.state = {
            status: 'completed', // Idle initially
            results: new Map()
        };
    }

    public subscribe(callback: (state: ThreadState) => void) {
        this.onStateChange = callback;
    }

    public getStatus(): ThreadState {
        return this.state;
    }

    /**
     * Start specific graph execution
     */
    public async start(nodes: NodeDefinition[], connections: ConnectionDefinition[]): Promise<void> {
        this.nodes = nodes;
        this.connections = connections;

        // Reset state
        this.state = {
            status: 'completed', // Will switch to whatever start returns
            results: new Map()
        };

        await this.run();
    }

    /**
     * Provide input to the currently suspended node and resume execution
     */
    public async resume(nodeId: NodeId, input: any): Promise<void> {
        if (this.state.status !== 'suspended' || this.state.currentNodeId !== nodeId) {
            console.warn("Cannot resume: Runtime is not suspended at the specified node.");
            return;
        }

        // Update the result for the suspended node with the provided input
        // This effectively "mocks" the node execution with the user provided value
        const resumedResult: NodeExecutionResult = {
            status: 'completed',
            output: input
        };

        console.warn(`[Runtime] Resuming node ${nodeId} with input`, input);
        this.state.results.set(nodeId, resumedResult);

        // Resume execution logic
        await this.run();
    }

    private async run(): Promise<void> {
        try {
            console.warn(`[Runtime] Running with ${this.state.results.size} existing results.`);
            // Run the engine, passing in our existing results
            // The engine will skip already completed nodes and pick up where we left off
            const newResults: Map<NodeId, NodeExecutionResult> = await this.engine.executeGraph(
                this.nodes,
                this.connections,
                this.state.results
            );

            // Determine new state based on results
            // Find if any node is suspended
            let suspendedNodeId: NodeId | undefined;
            let failure: string | undefined;

            // Check the last executed node / or search for suspension
            // Since executeGraph stops ON suspension, the last entry in newResults might be it,
            // OR we iterate to find the first non-completed one.

            // We can check the entries. The engine guarantees to stop if it hits a suspension.
            for (const [id, result] of newResults.entries()) {
                if (result.status === 'suspended') {
                    suspendedNodeId = id;
                    break;
                }
                if (result.status === 'failed') {
                    failure = result.error;
                    break;
                }
            }

            this.state = {
                status: suspendedNodeId ? 'suspended' : failure ? 'failed' : 'completed',
                currentNodeId: suspendedNodeId,
                results: newResults,
                error: failure
            };

            this.notify();

        } catch (error: any) {
            console.error("Runtime Fail:", error);
            this.state = {
                status: 'failed',
                currentNodeId: this.state.currentNodeId,
                results: this.state.results,
                error: error.message
            };
            this.notify();
        }
    }

    private notify(): void {
        if (this.onStateChange) {
            this.onStateChange(this.state);
        }
    }
}
