/**
 * Node Export Service
 * Handles serialization, validation, and file I/O for Node Editor schemas.
 */

import { NodeEditorSchema } from '@/types/nodeEditor.types';

export const NodeExportService = {
    /**
     * Download a schema object as a JSON file.
     */
    downloadSchema: (schema: NodeEditorSchema, filename: string = 'node-graph.json') => {
        const json = JSON.stringify(schema, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Load and parse a schema from a File object.
     */
    loadSchemaFromFile: (file: File): Promise<NodeEditorSchema> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const parsed = JSON.parse(content);

                    if (NodeExportService.validateSchema(parsed)) {
                        resolve(parsed as NodeEditorSchema);
                    } else {
                        reject(new Error('Invalid schema structure'));
                    }
                } catch (err) {
                    reject(new Error('Failed to parse JSON file'));
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsText(file);
        });
    },

    /**
     * Validate the structure of a loaded schema.
     */
    validateSchema: (data: any): boolean => {
        if (!data || typeof data !== 'object') return false;

        // Basic Structural Check
        const hasNodes = Array.isArray(data.nodes);
        const hasConnections = Array.isArray(data.connections);

        // Version check could represent compatibility logic in future
        // const hasVersion = typeof data.version === 'string';

        return hasNodes && hasConnections;
    }
};
