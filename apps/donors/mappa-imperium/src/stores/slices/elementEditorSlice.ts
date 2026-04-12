import type { GameSliceCreator, ElementEditorSlice } from '../storeTypes';
import { EraStorageService } from '@/services/eraStorageService';
import { ERA_TEMPLATES } from '@/data/era-templates';
import type {
    NodeDefinition,
    ConnectionDefinition,
    NodeEditorSchema,
    NodeId,
    ConnectionId,
    GraphError
} from '@/types/nodeEditor.types';

/**
 * Element Editor Slice
 * 
 * Manages state for the node-based visual editor that allows creating
 * variations on game workflows through a visual node graph interface.
 * 
 * This editor serves as a static benchmark to the dynamic main game app,
 * enabling test data recreation and workflow configuration.
 * 
 * @see docs/roadmap/spec-element-node-system.md
 * @see docs/roadmap/analysis_node_editor_changes.md
 */
export const createElementEditorSlice: GameSliceCreator<ElementEditorSlice> = (set, get) => ({
    // Graph State
    nodes: [],
    connections: [],
    selectedNodeId: null,
    selectedConnectionId: null,
    validationErrors: [],

    // Era State
    currentEraId: null,
    savedEras: [],

    // Actions
    addNode: (node: NodeDefinition) => set((state) => ({
        nodes: [...state.nodes, node],
    })),

    updateNode: (nodeId: NodeId, updates: Partial<NodeDefinition>) => set((state) => ({
        nodes: state.nodes.map((node) =>
            node.id === nodeId
                ? { ...node, ...updates }
                : node
        ),
    })),

    deleteNode: (nodeId: NodeId) => set((state) => ({
        nodes: state.nodes.filter((node) => node.id !== nodeId),
        connections: state.connections.filter((conn) =>
            conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
        ),
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    })),

    addConnection: (connection: ConnectionDefinition) => set((state) => {
        // Prevent duplicate connections (same source/target ports)
        const exists = state.connections.some(c =>
            c.sourceNodeId === connection.sourceNodeId &&
            c.sourcePortId === connection.sourcePortId &&
            c.targetNodeId === connection.targetNodeId &&
            c.targetPortId === connection.targetPortId
        );

        if (exists) return state; // No change

        return {
            connections: [...state.connections, connection],
        };
    }),

    deleteConnection: (connectionId: ConnectionId) => set((state) => ({
        connections: state.connections.filter((conn) => conn.id !== connectionId),
        selectedConnectionId: state.selectedConnectionId === connectionId ? null : state.selectedConnectionId,
    })),

    selectNode: (nodeId: NodeId | null) => set(() => ({
        selectedNodeId: nodeId,
    })),

    selectConnection: (connectionId: ConnectionId | null) => set(() => ({
        selectedConnectionId: connectionId,
    })),

    clearGraph: () => set(() => ({
        nodes: [],
        connections: [],
        selectedNodeId: null,
        selectedConnectionId: null,
    })),

    importSchema: (schema: NodeEditorSchema) => set(() => ({
        nodes: schema.nodes || [],
        connections: schema.connections || [],
        validationErrors: [],
    })),

    setValidationErrors: (errors: GraphError[]) => set(() => ({
        validationErrors: errors
    })),

    /**
     * Export the current node graph to a JSON schema string
     * 
     * Returns a serialized NodeEditorSchema following the spec.
     * 
     * @returns {string} JSON string of the complete schema
     */
    exportSchema: () => {
        const state = get();
        const schema: NodeEditorSchema = {
            version: '1.0.0',
            metadata: {
                name: 'Element Node Editor Schema',
                description: 'Node-based element editor configuration',
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString(),
            },
            nodes: state.nodes,
            connections: state.connections,
            globalSettings: {
                theme: 'light',
                snapToGrid: true,
                gridSize: 20
            }
        };
        return JSON.stringify(schema);
    },

    // --- Era Management Actions ---

    setCurrentEra: (eraId: number) => {
        set({ currentEraId: eraId });
        // Auto-refresh saved list for this era
        get().refreshSavedEras();
    },

    saveCurrentEra: async (name: string) => {
        const state = get();
        const { currentEraId, nodes, connections } = state;

        if (currentEraId === null) {
            console.error("Cannot save: No era selected");
            return;
        }

        const schema: NodeEditorSchema = {
            version: '1.0.0',
            metadata: {
                name,
                description: `Saved graph for Era ${currentEraId}`,
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString(),
            },
            nodes,
            connections,
            globalSettings: {
                theme: 'light',
                snapToGrid: true,
                gridSize: 20
            }
        };

        try {
            await EraStorageService.saveEraGraph(currentEraId, name, schema);
            await get().refreshSavedEras();
        } catch (error) {
            console.error("Failed to save era graph:", error);
            // Optionally set an error state here
        }
    },

    loadSavedEra: async (savedId: string) => {
        try {
            const saved = await EraStorageService.loadEraGraph(savedId);
            if (saved && saved.schema) {
                // Import the schema
                get().importSchema(saved.schema);
                // Ensure we stay on the correct era (though likely already there)
                // set({ currentEraId: saved.eraId }); 
            }
        } catch (error) {
            console.error("Failed to load era graph:", error);
        }
    },

    deleteSavedEra: async (savedId: string) => {
        try {
            await EraStorageService.deleteEraGraph(savedId);
            await get().refreshSavedEras();
        } catch (error) {
            console.error("Failed to delete era graph:", error);
        }
    },

    refreshSavedEras: async () => {
        const { currentEraId } = get();
        try {
            const saves = await EraStorageService.listSavedEras(currentEraId || undefined);
            set({ savedEras: saves });
        } catch (error) {
            console.error("Failed to list saved eras:", error);
        }
    },

    loadReferenceTemplate: () => {
        const { currentEraId } = get();
        if (currentEraId && ERA_TEMPLATES[currentEraId]) {
            get().importSchema(ERA_TEMPLATES[currentEraId]);
        } else {
            console.warn(`No reference template found for era ${currentEraId}`);
        }
    },

    exportProject: async () => {
        try {
            const allSaves = await EraStorageService.exportAllEras();
            const projectData = {
                version: '1.0.0',
                metadata: {
                    exportedAt: new Date().toISOString(),
                    totalSaves: allSaves.length
                },
                saves: allSaves
            };

            const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mappa-imperium-project-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export project:", error);
        }
    },

    importProject: async (file: File) => {
        try {
            const text = await file.text();
            const projectData = JSON.parse(text);

            if (!projectData.saves || !Array.isArray(projectData.saves)) {
                throw new Error("Invalid project file format");
            }

            await EraStorageService.importAllEras(projectData.saves);
            await get().refreshSavedEras();
            alert(`Project imported successfully! Loaded ${projectData.saves.length} era graphs.`);
        } catch (error) {
            console.error("Failed to import project:", error);
            alert("Failed to import project. Please check the file format.");
        }
    },

    loadSampleProject: async () => {
        try {
            const { SAMPLE_PROJECT_DATA } = await import('@/data/sampleProject');
            await EraStorageService.importAllEras(SAMPLE_PROJECT_DATA.saves);
            await get().refreshSavedEras();

            // Auto-load the graph for the current era if available
            const state = get();
            const currentEraId = state.currentEraId || 1;
            const sampleParams = SAMPLE_PROJECT_DATA.saves.find(s => s.eraId === currentEraId);

            if (sampleParams) {
                get().importSchema(sampleParams.schema);
                alert(`Sample project loaded! Applied graph for ${sampleParams.name}.`);
            } else {
                alert("Sample project loaded! Check the Load menu for other eras.");
            }
        } catch (error) {
            console.error("Failed to load sample project:", error);
            alert("Failed to load sample project.");
        }
    }
});
