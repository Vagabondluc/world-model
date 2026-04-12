/**
 * Era Storage Service
 * Handles persistence of node editor graphs for specific eras using IndexedDB.
 */

import { NodeEditorSchema, SavedEraGraph } from '@mi/types/nodeEditor.types';

export type { SavedEraGraph }; // Re-export for convenience/compatibility

const DB_NAME = 'MappaImperiumEraDB';
const STORE_NAME = 'era_graphs';
const DB_VERSION = 1;

export const EraStorageService = {
    /**
     * Initialize the IndexedDB database
     */
    async openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error("IndexedDB error:", event);
                reject("Failed to open database");
            };

            request.onsuccess = (event) => {
                resolve((event.target as IDBOpenDBRequest).result);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('eraId', 'eraId', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    },

    /**
     * Save a graph for a specific era
     */
    async saveEraGraph(eraId: number, name: string, schema: NodeEditorSchema): Promise<SavedEraGraph> {
        const db = await this.openDB();

        const graph: SavedEraGraph = {
            id: crypto.randomUUID(),
            eraId,
            name,
            schema,
            timestamp: new Date().toISOString(),
            version: schema.version || '1.0.0'
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(graph);

            request.onsuccess = () => resolve(graph);
            request.onerror = () => reject("Failed to save graph");
        });
    },

    /**
     * Load a specific saved graph by ID
     */
    async loadEraGraph(id: string): Promise<SavedEraGraph | null> {
        const db = await this.openDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject("Failed to load graph");
        });
    },

    /**
     * List all saved graphs, optionally filtered by eraId
     */
    async listSavedEras(eraId?: number): Promise<SavedEraGraph[]> {
        const db = await this.openDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            let request: IDBRequest;

            if (eraId !== undefined) {
                const index = store.index('eraId');
                request = index.getAll(eraId);
            } else {
                request = store.getAll();
            }

            request.onsuccess = () => {
                const results = request.result as SavedEraGraph[];
                // Sort by timestamp descending (newest first)
                results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                resolve(results);
            };
            request.onerror = () => reject("Failed to list graphs");
        });
    },

    /**
     * Delete a saved graph by ID
     */
    async deleteEraGraph(id: string): Promise<void> {
        const db = await this.openDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject("Failed to delete graph");
        });
    },

    async exportAllEras(): Promise<SavedEraGraph[]> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result as SavedEraGraph[]);
            request.onerror = () => reject("Failed to export all eras");
        });
    },

    async importAllEras(graphs: SavedEraGraph[]): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            // Import sequentially or parallel, transaction handles it
            let count = 0;
            let errorOccurred = false;

            if (graphs.length === 0) {
                resolve();
                return;
            }

            graphs.forEach(graph => {
                const request = store.put(graph); // Use put to overwrite duplicates by ID
                request.onsuccess = () => {
                    count++;
                    if (count === graphs.length) resolve();
                };
                request.onerror = () => {
                    if (!errorOccurred) {
                        errorOccurred = true;
                        reject("Failed to import one or more graphs");
                    }
                };
            });
        });
    },

    /**
     * Export a saved graph to a JSON file (wrapper around NodeExportService logic or distinct)
     * Note: Implementation mimics NodeExportService but specific to SavedEraGraph structure if needed,
     * or we can just return the object for the component to handle the download.
     */
    async getGraphForExport(id: string): Promise<SavedEraGraph | null> {
        return this.loadEraGraph(id);
    }
};
